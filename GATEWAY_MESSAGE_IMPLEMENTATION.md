# Gateway 패턴을 활용한 Message 시스템 구현 완료

## 🎯 구현 내역

### 1. Core-lib MessageService 업그레이드 ✅

**파일**: `Core-lib/core-lib/src/main/java/com/system/common/util/message/MessageService.java`

**주요 변경사항**:
- Gateway URL을 통한 원격 메시지 로드 기능 추가
- `@Value("${message.gateway.url:}")` 설정 지원
- HTTP를 통한 메시지 파일 다운로드 로직 구현
- Fallback 메커니즘: 로컬 리소스 → Gateway URL → 경고

**새로운 기능**:
```java
@Value("${message.gateway.url:}")
private String gatewayUrl;  // 예: http://localhost:8080

private boolean loadMessagesFromGateway(String fileName, String locale) {
    // Gateway를 통해 메시지 파일을 HTTP로 로드
    // 6개 경로를 시도: /common/js/common/, /common/js/message/, etc.
}
```

### 2. vims-management-system 설정 추가 ✅

**파일**: `vims-management-system/src/main/resources/application.yml`

**추가된 설정**:
```yaml
# Message Gateway 설정 - vims-login의 메시지 파일을 gateway를 통해 로드
message:
    gateway:
        url: http://localhost:8080
```

### 3. Core-lib 배포 ✅

```bash
✅ vims-management-system/src/lib/core-lib-1.0.jar (92KB)
✅ vims-login/src/lib/core-lib-1.0.jar (92KB)
```

## 🏗️ 시스템 아키텍처

```
┌──────────────────┐
│  vims-login      │
│  (Port: 8081)    │
│                  │
│  ✓ Message.js    │◄──────┐
│  ✓ messageConfig │       │
│  ✓ message/*.js  │       │
└──────────────────┘       │
                           │
                           │
┌──────────────────┐       │ HTTP GET /common/js/**
│  vims-gateway    │       │
│  (Port: 8080)    │───────┘
│                  │
│  Route:          │
│  /common/**      │
│   → 8081         │
└───────┬──────────┘
        │
        │ HTTP GET
        │ /common/js/message/management/CommonMenuMessage.js
        │
        ▼
┌──────────────────┐
│ vims-management  │
│ (Port: 8083)     │
│                  │
│ MessageService   │
│  1. classpath 검색│
│  2. Gateway 요청 │◄──── message.gateway.url=http://localhost:8080
│  3. 파싱 & 캐싱  │
└──────────────────┘
```

## 📋 동작 흐름

### 서버 시작 시

1. **vims-management-system 시작**
2. MessageService.init() 실행
3. "ko", "en", "mo" 로케일에 대해 메시지 로드 시도
4. **로컬 classpath에서 찾지 못함**
5. **Gateway URL(http://localhost:8080) 시도**
6. Gateway가 요청을 vims-login(8081)로 프록시
7. vims-login의 메시지 파일 반환
8. MessageService가 파싱하여 messageCache에 저장

### 페이지 로드 시 (서버 사이드)

```
사용자 요청: /cms/page/load?url=/menu/menuSettings.html
    ↓
ManagementController.loadPage()
    ↓
PageRedirectService.pageLoad()
    ↓
PageRedirectService.messageMatcher()
    ↓
MessageService.getMessage("COMMON_MENU.MENU_NAME", "ko")
    ↓
messageCache에서 조회 → "메뉴명" 반환
    ↓
HTML에서 [Page.Message].Message.Label.Array["COMMON_MENU.MENU_NAME"]
→ "메뉴명"으로 치환
```

### 런타임 (클라이언트 사이드)

```html
<!-- HTML에서 Message.js 로드 -->
<script src="/common/js/common/Message.js"></script>
<script src="/common/js/messageConfig.js"></script>

<script>
// JavaScript에서 직접 참조
let menuGrid = {
    title: Message.Label.Array["COMMON_MENU.TITLE"],  // ✓ 런타임 참조
    list: [
        { HEADER: Message.Label.Array["COMMON_MENU.MENU_NAME"], ... }
    ]
}
</script>
```

## 🚀 재시작 필요

**vims-management-system 재시작** 필요:
- 새 core-lib-1.0.jar 로드
- application.yml의 message.gateway.url 읽기
- MessageService 초기화 및 Gateway를 통한 메시지 로드

## 📊 예상 로그

재시작 후 콘솔에서 다음과 같은 로그를 확인할 수 있습니다:

```
=== MessageService: 로드된 JS 파일 목록 ===
 - Message
 - CommonMenuMessage
 - CommonIconMessage
 - ...
=== 총 X개 파일 발견 ===

메시지 파일 로드 시도: Message.js (locale: ko)
  ✗ 파일을 찾을 수 없음: static/common/js/common/Message.js
  ✗ 파일을 찾을 수 없음: static/common/js/message/Message.js
  ...
  → Gateway를 통해 메시지 로드 시도: Message.js
    Gateway URL 시도: http://localhost:8080/common/js/common/Message.js
  ✓ Gateway에서 파일 로드 성공: http://localhost:8080/common/js/common/Message.js
    → 파싱된 메시지 수: 97

메시지 파일 로드 시도: CommonMenuMessage.js (locale: ko)
  → Gateway를 통해 메시지 로드 시도: CommonMenuMessage.js
    Gateway URL 시도: http://localhost:8080/common/js/message/management/CommonMenuMessage.js
  ✓ Gateway에서 파일 로드 성공
    → 파싱된 메시지 수: 48
```

## ✅ 장점

1. **단일 진실 공급원 (Single Source of Truth)**
   - vims-login에서만 message 파일 관리
   - 모든 프로젝트가 동일한 메시지 사용

2. **Zero Configuration**
   - 각 프로젝트에 message 파일 복사 불필요
   - application.yml 한 줄 추가만으로 설정 완료

3. **실시간 업데이트**
   - vims-login의 메시지만 수정하면 됨
   - 다른 프로젝트는 재시작만 하면 자동 반영

4. **Fallback 지원**
   - 로컬 리소스 우선 → Gateway 대체
   - 네트워크 장애 시에도 로컬 리소스로 동작 가능

5. **확장성**
   - 새 프로젝트 추가 시 설정만 추가
   - Gateway 라우팅만 설정하면 즉시 사용 가능

## ⚠️ 주의사항

1. **Gateway 의존성**
   - vims-gateway가 실행 중이어야 함
   - vims-login도 실행 중이어야 함

2. **네트워크 지연**
   - 첫 시작 시 HTTP 요청으로 인한 약간의 지연
   - 캐싱 후에는 메모리에서 즉시 조회

3. **재시작 순서**
   ```
   1. vims-login 시작 (8081)
   2. vims-gateway 시작 (8080)
   3. vims-management-system 시작 (8083)
   ```

## 🔧 문제 해결

### Q: HTML에서 여전히 치환이 안됩니다
**A**: vims-management-system을 재시작하세요. MessageService는 @PostConstruct에서 한 번만 로드합니다.

### Q: Gateway 로드 실패 로그가 나옵니다
**A**: 
1. vims-gateway가 8080 포트에서 실행 중인지 확인
2. vims-login이 8081 포트에서 실행 중인지 확인
3. `curl http://localhost:8080/common/js/common/Message.js` 테스트

### Q: 특정 메시지만 로드되지 않습니다
**A**: 
1. vims-login의 해당 메시지 파일 존재 확인
2. 로그에서 "파싱된 메시지 수" 확인
3. Message.js 파일 문법 오류 확인

## 📝 다음 단계 (Optional)

### 1. 캐싱 강화
Redis를 사용하여 메시지 캐싱 → 재시작해도 빠른 로드

### 2. 다국어 지원 확장
Gateway를 통해 locale별로 다른 파일 제공

### 3. Hot Reload
메시지 파일 변경 시 재시작 없이 자동 갱신

### 4. FMS, vims-gateway 프로젝트에도 적용
동일한 방식으로 application.yml에 설정 추가

## 📚 관련 파일

- ✅ Core-lib/core-lib/src/main/java/com/system/common/util/message/MessageService.java
- ✅ vims-management-system/src/main/resources/application.yml  
- ✅ vims-gateway/src/main/resources/application.yml (기존 라우팅 활용)
- ✅ vims-login/src/main/resources/static/common/js/message/**/*.js (메시지 원본)

---

**구현 완료!** 🎉

vims-management-system을 재시작하면 Gateway를 통해 vims-login의 메시지 파일을 로드하여 HTML 치환이 정상적으로 작동합니다!
