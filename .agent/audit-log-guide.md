# MyBatis 기반 감사 로그(Audit Log) 시스템 상세 가이드

본 문서는 `Core-lib` 모듈에 구현된 `EventLogInterceptor`를 중심으로, 감사 로그 시스템의 동작 원리와 데이터 흐름, 성능 최적화 기법을 기술합니다.

---

## 1. 시스템 아키텍처 및 목표

감사 로그 시스템은 사용자의 모든 데이터 변경 작업(C, U, D)을 추적하여 관리자에게 투명성을 제공하는 것을 목표로 합니다.

*   **핵심 원칙**: 
    1.  **비침습성**: 기존 비즈니스 로직(Service, Mapper)을 수정하지 않고 로그를 남겨야 함.
    2.  **완결성**: 변경 전(`before`)과 변경 후(`after`) 데이터를 모두 기록해야 함.
    3.  **고성능**: 로그 저장 작업이 사용자의 응답 속도에 영향을 주지 않아야 함.

---

## 2. 데이터베이스 스키마 설계

로그가 절단되거나 저장에 실패하지 않도록 충분한 크기의 컬럼을 확보해야 합니다.

```sql
CREATE TABLE COM_EVENT_LOG (
    id                 VARCHAR(32)  NOT NULL COMMENT '로그 고유 ID (UUID 하이픈 제거)',
    user_id            VARCHAR(100) NOT NULL COMMENT '행위 수행자 ID (이메일 등)',
    email              VARCHAR(100)          COMMENT '행위 수행자 이메일',
    role               VARCHAR(50)           COMMENT '수행 당시 권한',
    action_type        VARCHAR(20)  NOT NULL COMMENT '작업 유형 (INSERT, UPDATE, DELETE)',
    target_table       VARCHAR(100) NOT NULL COMMENT '대상 테이블명',
    target_id          VARCHAR(100)          COMMENT '대상 데이터의 PK 값',
    before_data        LONGTEXT              COMMENT '변경 전 데이터 (JSON)',
    after_data         LONGTEXT              COMMENT '변경 후 데이터 (JSON)',
    ip_address         VARCHAR(50)           COMMENT '수행자 IP 주소',
    system_create_date DATETIME     DEFAULT CURRENT_TIMESTAMP COMMENT '로그 발생 일시',
    PRIMARY KEY (id)
);
```

---

## 3. 핵심 코드 분석: `EventLogInterceptor.java`

MyBatis의 `Interceptor`는 SQL 실행의 생명주기에 개입합니다.

### 3-1. 인터셉터 선언부
```java
@Intercepts({
    // MyBatis의 Executor.update()는 INSERT, UPDATE, DELETE를 모두 포함합니다.
    @Signature(type = Executor.class, method = "update", args = { MappedStatement.class, Object.class })
})
public class EventLogInterceptor implements Interceptor { ... }
```
*   **중요**: `@Signature`에 `insert`, `delete`를 적지 않는 이유는 MyBatis 내부 interfaces에 해당 메서드가 없고 모두 `update`로 통일되어 있기 때문입니다.

### 3-2. Before Data 캡처 로직 (동기)
원본 쿼리가 실행되기 전, 현재 DB 값을 백업합니다.
```java
private String captureBeforeData(Invocation invocation, MappedStatement ms, Object parameter) {
    // 1. 해당 매퍼의 SELECT 아이디를 추측 (예: ComUserMapper.UPDATE -> ComUserMapper.SELECT)
    String selectMapperId = ms.getId().substring(0, ms.getId().lastIndexOf(".") + 1) + "SELECT";
    
    // 2. 파라미터에서 ID 추출 후 직접 쿼리 실행
    Map<String, Object> queryParam = new HashMap<>();
    queryParam.put("id", extractIdFromParameter(parameter));
    
    List<Object> list = executor.query(selectMs, queryParam, ...);
    return objectMapper.writeValueAsString(list.get(0));
}
```

### 3-3. 로그 저장 로직 (비동기)
성능을 위해 실제 `INSERT` 작업은 별도 스레드 풀에서 수행합니다.
```java
private final ExecutorService logExecutor = Executors.newFixedThreadPool(5);

private void saveEventLog(...) {
    // 사용자 정보 및 IP를 미리 캡처 (스레드가 바뀌면 RequestContext를 잃어버림)
    final String userEmail = UserInfo.getUserEmail();
    final String ipAddress = extractedIp;

    // 비동기 실행
    logExecutor.execute(() -> {
        // 실제 COM_EVENT_LOG 테이블에 INSERT 수행
        executor.update(insertMs, logData);
    });
}
```

---

## 4. 데이터 흐름 (Sequence Diagram)

성공적인 감사 로그 기록을 위한 전체 프로세스는 다음과 같습니다.

1.  **사용자 요청**: `Service` 레이어에서 `Mapper.update()` 호출.
2.  **인터셉터 전처리 (Before Data)**:
    *   `action_type` 확인 (UPDATE/DELETE 인 경우).
    *   DB에서 현재 row를 `SELECT`하여 `before_data` 변수에 저장.
3.  **원본 쿼리 실행**: 원래 수행하려던 `UPDATE` 또는 `DELETE`/`INSERT` 쿼리 실행.
4.  **인터셉터 후처리 (After Data & Async Save)**:
    *   `parameter` 객체를 JSON으로 변환하여 `after_data` 생성.
    *   **백그라운드 스레드**에 로그 정보 전달.
5.  **응답 반환**: 웹 사용자는 즉시 결과를 받음 (로그 저장을 기다리지 않음).
6.  **로그 영속화**: 백그라운드 스레드가 `COM_EVENT_LOG` 테이블에 최종 기록.

---

## 5. 주요 기술적 디테일 및 주의사항

### 5-1. UUID 처리
*   **이슈**: `UUID.randomUUID().toString()`은 36자(하이픈 포함)입니다.
*   **해결**: `replace("-", "")`를 통해 **32자**로 줄여 DB 컬럼 크기 문제(Truncation)를 방지하고 인덱스 효율을 높였습니다.

### 5-2. Effectively Final 변수
*   **이슈**: 람다 내부에서 외부 변수를 쓸 때는 값이 바뀌면 안 됩니다.
*   **해결**: `final String ipAddress = ...`와 같이 로컬 변수로 확정지어 스레드 안전성을 확보했습니다.

### 5-3. 무한 루프 방지
```java
if (ms.getId().contains("ComEventLog")) {
    return invocation.proceed();
}
```
*   로그를 저장하는 행위 자체가 다시 인터셉터에 걸려 무한히 로그를 남기려 하는 상황을 방지하는 필수 체크 로직입니다.

---

## 6. 성능 고려사항

*   **동기적 조회**: 수정 전 데이터를 가져오는 `SELECT`는 동기적으로 이루어지지만, **PK 기반 조회**이므로 매우 빠릅니다.
*   **비동기적 저장**: 실제 로그 쓰기가 가장 느린 작업이므로 이를 비동기로 처리함으로써 서비스 품질(QoS)을 유지했습니다.
*   **스레드 풀**: `FixedThreadPool(5)`를 사용하여 시스템 자원을 무분별하게 소모하지 않도록 제한했습니다.
