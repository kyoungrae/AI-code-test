# 엑셀 처리 아키텍처 비교 분석

## 📊 두 가지 방법 비교

### 방법 1: Feign Client로 FMS 호출 (현재 구현)
```
Management → Feign Client → FMS → Excel 파싱 → Response
```

### 방법 2: Management에 직접 구현
```
Management → Excel 파싱 (Apache POI) → 직접 처리
```

---

## 🔍 상세 비교표

| 항목 | Feign Client (FMS 호출) | Management 직접 구현 |
|------|------------------------|----------------------|
| **코드 중복** | ❌ 없음 (FMS에 한 번만 구현) | ⚠️ 높음 (각 서비스마다 구현 필요) |
| **의존성** | ⚠️ 네트워크 의존 (FMS 장애 시 영향) | ✅ 독립적 (네트워크 불필요) |
| **성능** | ⚠️ 느림 (네트워크 오버헤드) | ✅ 빠름 (네트워크 X) |
| **유지보수** | ✅ 한 곳만 수정 | ❌ 여러 곳 수정 필요 |
| **확장성** | ✅ 쉬움 (중앙 집중화) | ❌ 어려움 (분산) |
| **복잡도** | ⚠️ 높음 (Feign 설정 필요) | ✅ 낮음 (단순) |
| **테스트** | ⚠️ 어려움 (Mock 필요) | ✅ 쉬움 (단위 테스트) |
| **배포** | ⚠️ 복잡 (FMS도 배포 필요) | ✅ 단순 (자체 배포만) |
| **보안** | ✅ 중앙 제어 가능 | ⚠️ 각 서비스마다 관리 |
| **모니터링** | ✅ 중앙 모니터링 | ❌ 분산 모니터링 |

---

## 💰 비용 분석

### Feign Client 방식
```
장점:
- 장기적으로 유지보수 비용 ↓
- Excel 로직 변경 시 FMS만 배포
- 코드 중복 제거 → 버그 감소

단점:
- 초기 설정 복잡도 ↑
- 네트워크 비용 발생
- FMS 장애가 전체에 영향
- 레이턴시 증가 (약 50-200ms)
```

### Management 직접 구현
```
장점:
- 초기 구현 빠름 (복붙만 하면 됨)
- 네트워크 오버헤드 없음
- 각 서비스 독립적

단점:
- 장기적으로 유지보수 비용 ↑↑
- Excel 로직 변경 시 모든 서비스 배포
- 코드 중복 → 버그 위험 증가
- Apache POI 의존성 중복 (jar 크기 증가)
```

---

## 🎯 상황별 권장 방안

### ✅ Feign Client (FMS 호출) 권장 상황

1. **여러 서비스에서 Excel 기능 사용**
   - Management, Login, Gateway 등 다수 서비스
   - **반복 사용 예상: 3개 이상 서비스**

2. **Excel 로직이 복잡하고 자주 변경**
   - 파싱 규칙이 복잡
   - 요구사항이 자주 바뀜
   - 버전별 Excel 형식 지원 필요

3. **보안/감사가 중요**
   - 중앙 집중식 로깅
   - 누가, 언제, 어떤 파일을 업로드했는지 추적
   - 악성 파일 검증 로직 일괄 적용

4. **마이크로서비스 아키텍처 지향**
   - 이미 서비스 분리 중
   - Service Mesh, API Gateway 사용

### ✅ Management 직접 구현 권장 상황

1. **Excel 기능을 Management에서만 사용**
   - 다른 서비스에서 사용 계획 없음
   - **1~2개 서비스에서만 사용**

2. **성능이 최우선**
   - 실시간 처리가 중요
   - 네트워크 레이턴시가 치명적
   - 대용량 파일 처리 빈번

3. **독립성이 중요**
   - FMS 장애가 Management에 영향 주면 안 됨
   - 각 서비스 완전 독립 운영

4. **간단한 Excel 처리**
   - 단순 CRUD (읽기/쓰기만)
   - 복잡한 로직 없음
   - 변경 빈도 낮음

---

## 🏗️ 프로젝트 상황 분석

### 현재 구조 파악
```java
// 이미 FMS가 분리된 상태
FMS (8082) - 파일 관리 전담
Management (8083) - 비즈니스 로직
Login (8080) - 인증
Gateway (8081) - API 게이트웨이
```

### 질문으로 판단하기

**Q1. Excel 업로드를 사용할 서비스가 몇 개인가?**
- **1개**: 직접 구현
- **2개**: 상황에 따라
- **3개 이상**: Feign Client ✅

**Q2. FMS에 이미 파일 관련 기능이 있나?**
- **있음**: Feign Client ✅ (일관성)
- **없음**: 직접 구현 고려

**Q3. Excel 로직이 얼마나 복잡한가?**
- **단순 읽기/쓰기**: 직접 구현
- **복잡한 파싱, 검증**: Feign Client ✅

**Q4. Excel 기능이 자주 바뀌나?**
- **자주 바뀜**: Feign Client ✅
- **거의 안 바뀜**: 직접 구현

---

## 💡 절충안: 하이브리드 방식

```java
// Management에 경량 Excel 유틸 추가
public class SimpleExcelUtil {
    /**
     * 단순 읽기 - 네트워크 없이 직접 처리
     */
    public List<Map<String, Object>> readSimple(MultipartFile file) {
        // Apache POI로 직접 파싱
        // 단순 케이스만 처리
    }
    
    /**
     * 복잡한 처리 - FMS로 위임
     */
    public ExcelDataResponse readComplex(MultipartFile file) {
        // Feign Client로 FMS 호출
        return fmsExcelClient.uploadExcel(file, apiKey);
    }
}

// 사용
if (isSimpleCase(file)) {
    data = simpleExcelUtil.readSimple(file);  // 빠름
} else {
    data = simpleExcelUtil.readComplex(file); // 정확
}
```

---

## 📈 의사결정 플로우차트

```
시작
  │
  ↓
Excel 기능을 3개 이상 서비스에서 사용?
  ├─ YES → Feign Client (FMS) ✅
  └─ NO
      │
      ↓
    FMS에 이미 파일 기능 있음?
      ├─ YES → Feign Client (일관성) ✅
      └─ NO
          │
          ↓
        Excel 로직이 복잡?
          ├─ YES → Feign Client ✅
          └─ NO
              │
              ↓
            성능이 최우선?
              ├─ YES → 직접 구현 ✅
              └─ NO → Feign Client (확장성) ✅
```

---

## 🎓 **최종 권장사항 (당신의 경우)**

### 현재 상황 분석:
1. ✅ **이미 FMS가 분리되어 있음** → 일관성 유지가 중요
2. ✅ **마이크로서비스 아키텍처** → 중앙 집중화가 유리
3. ✅ **파일 관련 기능은 FMS가 전담** → 일관성
4. ⚠️ **Management에서만 사용 중** → 직접 구현도 가능

### **권장: Feign Client (현재 구현) 유지** ✅

**이유:**
1. **아키텍처 일관성**
   - FMS가 이미 파일 전담 → Excel도 FMS가 처리하는 게 자연스러움
   - 향후 다른 서비스(Login, Gateway)에서도 사용 가능성 높음

2. **장기적 이점**
   - Excel 로직 변경 시 FMS만 배포
   - 보안/감사 로그 중앙 관리
   - Apache POI 버전 업그레이드 한 곳만 수정

3. **확장성**
   - PDF, Word 등 다른 문서 처리도 FMS로 추가 가능
   - 문서 변환, 썸네일 생성 등 고급 기능 추가 용이

### **단, 다음 경우는 직접 구현 고려:**
- Excel을 **Management에서만** 영구적으로 사용
- **성능이 절대적으로 중요** (밀리초 단위 최적화)
- FMS 장애가 **치명적** (SLA 99.99% 이상)

---

## 📊 성능 비교 (실측 예상)

| 항목 | Feign Client | 직접 구현 |
|------|--------------|-----------|
| 소규모 파일 (100 rows) | ~200ms | ~50ms |
| 중규모 파일 (1,000 rows) | ~500ms | ~200ms |
| 대규모 파일 (10,000 rows) | ~2s | ~1s |

**결론**: 차이는 있지만 실사용자 체감은 거의 없음 (2초 이내)

---

## 🔧 개선 방안 (Feign Client 성능 향상)

현재 구현을 유지하면서 성능을 개선하려면:

1. **HTTP/2 사용**
   ```yaml
   feign:
     httpclient:
       enabled: true
       http2:
         enabled: true
   ```

2. **압축 전송**
   ```yaml
   feign:
     compression:
       request:
         enabled: true
   ```

3. **Connection Pool 최적화**
   ```java
   @Bean
   public Client feignClient() {
       return new ApacheHttpClient(
           HttpClients.custom()
               .setMaxConnTotal(200)
               .setMaxConnPerRoute(50)
               .build()
       );
   }
   ```

4. **비동기 처리** (대용량 파일)
   ```java
   @Async
   public CompletableFuture<ExcelDataResponse> uploadExcelAsync(MultipartFile file) {
       return CompletableFuture.supplyAsync(() -> 
           fmsExcelClient.uploadExcel(file, apiKey)
       );
   }
   ```

---

## 💼 결론

**현재 구조에서는 Feign Client 방식이 더 나은 선택입니다.**

**이유:**
1. ✅ 아키텍처 일관성 (FMS = 파일 전담)
2. ✅ 장기적 유지보수 비용 절감
3. ✅ 확장성 (다른 서비스에서도 사용 가능)
4. ✅ 보안/로깅 중앙 관리
5. ⚠️ 성능 차이는 미미 (UX에 큰 영향 없음)

**단, 다음을 개선하세요:**
1. FMS Controller에 API 키 검증 추가
2. Circuit Breaker 적용 (FMS 장애 대비)
3. 캐싱 전략 수립 (동일 파일 재업로드 시)
4. 압축 전송으로 네트워크 비용 절감
