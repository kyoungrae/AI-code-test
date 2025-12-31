# Message 파싱 시스템 분석 및 최적화 방안

## 현재 시스템 구조

### 1. 프로젝트 구성
- **Core-lib**: MessageService.java, PageRedirectService.java
- **vims-login**: Message.js, messageConfig.js, 각종 *Message.js 파일들
- **vims-management-system**: core-lib dependency 사용, 자체 Message.js 없음
- **vims-gateway**, **FMS**: core-lib dependency 사용

### 2. 파싱 규칙
- **HTML**: `[Page.Message].Message.Label.Array["COMMON_MENU.MENU_NAME"]`
- **JavaScript Object Definition**: `{ HEADER: '[Page.Message].Message.Label.Array["COMMON_MENU.MENU_NAME"]', ... }`
- **JavaScript Code**: `Message.Label.Array["COMMON_MENU.MENU_NAME"]`

## 문제점

### 1. 프로젝트 간 Message 파일 공유 문제
**증상**: vims-management-system에서 메뉴를 호출할 때 메시지가 제대로 치환되지 않음

**원인**:
- vims-management-system 프로젝트에 Message.js 파일이 없음
- PageRedirectService는 각 프로젝트의 static 리소스에서 message 파일을 찾음
- MessageService의 `getResourcePaths()` (라인 105-127)는 다음 경로에서만 파일을 찾음:
  ```
  static/common/js/common/
  static/common/js/message/
  static/common/js/message/login/
  static/common/js/message/management/
  static/common/js/message/fms/
  static/common/js/message/gateway/
  ```

### 2. 서버/클라이언트 파싱 불일치
**증상**: JavaScript 객체 정의부에서 [Page.Message] 패턴이 치환되지 않음

**원인**:
- PageRedirectService.messageMatcher() (라인 29-43)는 HTML 텍스트만 치환
- JavaScript 코드 블록 내의 문자열은 브라우저로 전달 후 실행되므로 서버 side 치환 불가
- GridHelper의 HEADER 정의 시점에는 이미 HTML이 로드된 상태

**예시**:
```javascript
// menuSettings.html 라인 550-552
let menuGrid = {
    title: '[Page.Message].Message.Label.Array["COMMON_MENU.TITLE"]', // ✗ 치환 안됨
    list: [
        { HEADER: '[Page.Message].Message.Label.Array["COMMON_MENU.MENU_NAME"]', ... } // ✗ 치환 안됨
    ]
}
```

### 3. Core-lib 라이브러리 패키징 제약
**증상**: Core-lib을 수정해도 각 프로젝트에서 새로 빌드/배포 필요

**원인**:
- systemPath로 로컬 jar 파일을 참조하는 구조
- 버전 관리 및 동기화가 수동적

## 최적화 방안

### 방안 1: Gateway 패턴 (추천 ★★★★★)

#### 개념
vims-gateway를 통해 모든 정적 리소스를 프록시하여, 단일 소스에서 Message.js를 제공

#### 구현 방법

**1) vims-gateway에 Message 리소스 엔드포인트 추가**
```java
@Controller
@RequestMapping("/common/js")
public class MessageResourceController {
    
    @GetMapping("/common/Message.js")
    public ResponseEntity<Resource> getCommonMessage() {
        // vims-login의 Message.js를 프록시
        String loginServerUrl = "http://localhost:8081/common/js/common/Message.js";
        // RestTemplate 또는 WebClient로 가져오기
        return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType("application/javascript"))
            .body(resource);
    }
    
    @GetMapping("/message/{module}/**")
    public ResponseEntity<Resource> getModuleMessage(
        @PathVariable String module,
        HttpServletRequest request
    ) {
        String path = request.getRequestURI();
        String loginServerUrl = "http://localhost:8081" + path;
        // 동적으로 프록시
        return proxyResource(loginServerUrl);
    }
}
```

**2) messageConfig.js 중앙화**
vims-login에서 messageConfig.js를 유지하고, 다른 프로젝트들은 gateway를 통해 로드

#### 장점
- ✅ 단일 진실 공급원 (Single Source of Truth)
- ✅ 버전 관리 용이
- ✅ 실시간 반영 (재배포 불필요)
- ✅ 기존 코드 최소한의 수정

#### 단점
- ⚠️ Gateway

 부하 증가
- ⚠️ Gateway 장애 시 전체 시스템 영향

---

### 방안 2: 빌드 시 리소스 복사 (현실적 ★★★★)

#### 개념
Maven build 단계에서 vims-login의 Message 파일들을 다른 프로젝트로 자동 복사

#### 구현 방법

**1) vims-management-system의 pom.xml 수정**
```xml
<build>
    <plugins>
        <!-- 기존 플러그인들... -->
        
        <!-- Message 파일 복사 플러그인 -->
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-resources-plugin</artifactId>
            <version>3.3.0</version>
            <executions>
                <execution>
                    <id>copy-message-resources</id>
                    <phase>generate-resources</phase>
                    <goals>
                        <goal>copy-resources</goal>
                    </goals>
                    <configuration>
                        <outputDirectory>${project.basedir}/src/main/resources/static/common/js</outputDirectory>
                        <resources>
                            <resource>
                                <directory>../vims-login/src/main/resources/static/common/js</directory>
                                <includes>
                                    <include>common/Message.js</include>
                                    <include>message/**/*.js</include>
                                    <include>messageConfig.js</include>
                                </includes>
                            </resource>
                        </resources>
                    </configuration>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

**2) .gitignore 업데이트**
```gitignore
# 자동 생성되는 Message 파일들 제외
vims-management-system/src/main/resources/static/common/js/common/Message.js
vims-management-system/src/main/resources/static/common/js/message/
vims-management-system/src/main/resources/static/common/js/messageConfig.js
```

#### 장점
- ✅ 완전한 자율성 (각 프로젝트 독립 실행 가능)
- ✅ Gateway 의존성 없음
- ✅ 빌드 자동화로 동기화 보장

#### 단점
- ⚠️ 빌드 시에만 동기화
- ⚠️ 개발 중 실시간 반영 안됨 (개발모드에서는 추가 설정 필요)

---

### 방안 3: Core-lib에 Message 통합 (구조적 개선 ★★★)

#### 개념
Message 파일들을 Core-lib의 리소스로 포함시켜 라이브러리와 함께 배포

#### 구현 방법

**1) Core-lib 구조 변경**
```
Core-lib/
├── src/main/java/
│   └── com/system/common/util/message/
│       ├── MessageService.java
│       └── MessageLoader.java (신규)
└── src/main/resources/
    └── static/common/js/
        ├── common/Message.js
        ├── message/
        │   ├── login/
        │   ├── management/
        │   ├── fms/
        │   └── gateway/
        └── messageConfig.js
```

**2) MessageLoader.java 추가**
```java
@Component
public class MessageLoader {
    
    @GetMapping("/api/message/load")
    @ResponseBody
    public ResponseEntity<String> loadAllMessages() {
        // classpath에서 message 파일들을 읽어서 병합
        StringBuilder combined = new StringBuilder();
        combined.append(readResource("static/common/js/common/Message.js"));
        combined.append(readResource("static/common/js/message/**/*.js"));
        
        return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType("application/javascript"))
            .body(combined.toString());
    }
}
```

**3) HTML에서 동적 로드**
```html
<script type="text/javascript" src="/api/message/load"></script>
```

#### 장점
- ✅ 버전 관리 완벽 (라이브러리 버전 == Message 버전)
- ✅ 중앙 집중화
- ✅ 일관성 보장

#### 단점
- ⚠️ Core-lib 수정 필요
- ⚠️ 재배포 필요
- ⚠️ 유연성 감소 (프로젝트별 커스터마이징 어려움)

---

### 방안 4: JavaScript 코드 치환 방식 변경 (즉시 적용 가능 ★★★★★)

#### 개념
JavaScript에서 [Page.Message] 패턴 대신 Message 객체를 직접 참조하도록 코드 수정

#### 구현 방법

**현재 (문제 있음)**:
```javascript
// menuSettings.html
let menuGrid = {
    title: '[Page.Message].Message.Label.Array["COMMON_MENU.TITLE"]', // ✗ 치환 안됨
    list: [
        { HEADER: '[Page.Message].Message.Label.Array["COMMON_MENU.MENU_NAME"]', ... }
    ]
}
```

**수정 후 (정상 작동)**:
```javascript
// menuSettings.html
let menuGrid = {
    title: Message.Label.Array["COMMON_MENU.TITLE"], // ✓ 런타임 참조
    list: [
        { HEADER: Message.Label.Array["COMMON_MENU.MENU_NAME"], ... } // ✓ 런타임 참조
    ]
}
```

#### 장점
- ✅ 즉시 적용 가능
- ✅ 추가 설정 불필요
- ✅ 브라우저 캐싱 활용
- ✅ 디버깅 용이

#### 단점
- ⚠️ 기존 HTML 파일 대량 수정 필요
- ⚠️ 서버 사이드 치환 의미 감소

---

## 권장 종합 솔루션

### 단계별 적용 방안

#### Phase 1: 즉시 적용 (방안 4)
1. **JavaScript 코드 수정**
   - 모든 HTML 파일의 `<script>` 블록에서 `[Page.Message]` 제거
   - Message 객체 직접 참조로 변경
   
2. **HTML 마크업은 유지**
   - HTML 태그 내의 `[Page.Message]` 패턴은 서버 사이드에서 계속 치환
   - 예: `<h1>[Page.Message].Message.Label.Array["COMMON_MENU.TITLE_LIST"]</h1>`

#### Phase 2: 중기 개선 (방안 2)
1. **빌드 자동화 설정**
   - vims-management-system, FMS, vims-gateway에 maven-resources-plugin 추가
   - CI/CD 파이프라인에 빌드 단계 추가

2. **개발 환경 개선**
   - Spring DevTools의 추가 경로 설정으로 개발 중 실시간 반영
   ```yaml
   spring:
     devtools:
       restart:
         additional-paths:
           - ../vims-login/src/main/resources/static/common/js
   ```

#### Phase 3: 장기 아키텍처 (방안 1 또는 3)
1. **선택지 A: Gateway 패턴** (마이크로서비스 지향)
   - vims-gateway에 정적 리소스 프록시 기능 추가
   - 캐싱 전략 수립 (Redis 활용)

2. **선택지 B: Core-lib 통합** (모노레포 지향)
   - Message 관리를 완전히 Core-lib로 이관
   - 각 프로젝트별 확장 메커니즘 제공

---

## 실행 가능한 코드 예시

### 예시 1: JavaScript 코드 수정 (방안 4)

**수정 전 (menuSettings.html 라인 548-577)**:
```javascript
let menuGrid = {
    title: '[Page.Message].Message.Label.Array["COMMON_MENU.TITLE"]',
    list: [
        { HEADER: '[Page.Message].Message.Label.Array["COMMON_MENU.MENU_NAME"]', ID: "menu_name_kr", ... },
        { HEADER: '[Page.Message].Message.Label.Array["COMMON_MENU.MENU_CODE"]', ID: "menu_code", ... },
        // ... 나머지
    ]
}
```

**수정 후**:
```javascript
let menuGrid = {
    title: Message.Label.Array["COMMON_MENU.TITLE"],
    list: [
        { HEADER: Message.Label.Array["COMMON_MENU.MENU_NAME"], ID: "menu_name_kr", ... },
        { HEADER: Message.Label.Array["COMMON_MENU.MENU_CODE"], ID: "menu_code", ... },
        { HEADER: Message.Label.Array["COMMON_MENU.MENU_LEVEL"], ID: "menu_level", ... },
        { HEADER: Message.Label.Array["COMMON_MENU.MENU_NUMBER"], ID: "menu_number", ... },
        { HEADER: Message.Label.Array["COMMON_MENU.TOP_MENU_CODE"], ID: "top_menu_code", ... },
        { HEADER: Message.Label.Array["COMMON_MENU.PRGM_URL"], ID: "prgm_url", ... },
        { HEADER: Message.Label.Array["COMMON_MENU.URL"], ID: "url", ... },
        { HEADER: Message.Label.Array["COMMON_ICON.ICON_VIEW"], ID: 'icon_view', ... },
        { HEADER: Message.Label.Array["COMMON_ICON.ICON_CLASS"], ID: "menu_icon", ... },
        { HEADER: Message.Label.Array["COMMON_MENU.USE_YN"], ID: "use_yn", ... },
        { HEADER: Message.Label.Array["MODIFY_BTN"], ID: "update_menu_btn", ... },
        { HEADER: Message.Label.Array["DELETE_BTN"], ID: "delete_menu_btn", ... },
        { HEADER: Message.Label.Array["COMMON_MENU.REGISTER_MENU_ACCESS_GROUP_BTN"], ID: "access_right_group", ... },
        { HEADER: Message.Label.Array["COMMON_MENU.MENU_SEQUENCE"], ID: "menu_sequence", ... },
        { HEADER: Message.Label.Array["COMMON_MENU.MENU_NAME_EN"], ID: "menu_name_en", ... },
        { HEADER: Message.Label.Array["COMMON_MENU.MENU_NAME_MN"], ID: "menu_name_mn", ... },
        // ... 나머지
    ]
}
```

### 예시 2: Maven Resources Plugin 설정 (방안 2)

**vims-management-system/pom.xml 추가**:
```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-resources-plugin</artifactId>
    <version>3.3.0</version>
    <executions>
        <!-- 기존 execution... -->
        
        <execution>
            <id>copy-login-message-files</id>
            <phase>generate-resources</phase>
            <goals>
                <goal>copy-resources</goal>
            </goals>
            <configuration>
                <outputDirectory>${project.basedir}/src/main/resources/static/common/js</outputDirectory>
                <resources>
                    <resource>
                        <directory>../vims-login/src/main/resources/static/common/js</directory>
                        <includes>
                            <include>common/Message.js</include>
                            <include>message/**/*.js</include>
                            <include>messageConfig.js</include>
                        </includes>
                    </resource>
                </resources>
                <overwrite>true</overwrite>
            </configuration>
        </execution>
    </executions>
</plugin>
```

---

## 결론 및 추천

### 최우선 조치 (즉시 시행)
**방안 4: JavaScript 코드 수정**
- 모든 프로젝트의 HTML 파일에서 `<script>` 블록 내 [Page.Message] 제거
- 예상 작업 시간: 2-3시간
- 위험도: 낮음
- 효과: 즉시 문제 해결

### 중기 개선 (1-2주 내)
**방안 2: 빌드 시 리소스 복사**
- Maven plugin 설정으로 자동 동기화
- 개발 환경에서 DevTools 설정 추가
- 예상 작업 시간: 4-6시간
- 위험도: 중간
- 효과: 자동화된 일관성 보장

### 장기 전략 (분기 단위)
**방안 1 또는 3 선택적 적용**
- 시스템 아키텍처 목표에 따라 결정
  - **마이크로서비스 지향** → Gateway 패턴
  - **모노레포/라이브러리 지향** → Core-lib 통합
- 예상 작업 시간: 2-3일
- 위험도: 높음
- 효과: 근본적인 아키텍처 개선

---

## 체크리스트

### 즉시 조치 항목
- [ ] vims-management-system의 모든 HTML에서 JavaScript [Page.Message] 제거
- [ ] vims-gateway의 모든 HTML에서 JavaScript [Page.Message] 제거
- [ ] FMS의 모든 HTML에서 JavaScript [Page.Message] 제거
- [ ] 변경 후 각 프로젝트 로컬 테스트

### 중기 개선 항목
- [ ] vims-management-system/pom.xml에 maven-resources-plugin 추가
- [ ] vims-gateway/pom.xml에 maven-resources-plugin 추가
- [ ] FMS/pom.xml에 maven-resources-plugin 추가
- [ ] .gitignore 업데이트
- [ ] CI/CD 파이프라인 검증
- [ ] DevTools 설정 추가 및 테스트

### 장기 개선 항목
- [ ] 아키텍처 방향성 논의 (Gateway vs Core-lib)
- [ ] 선택한 방안에 대한 상세 설계
- [ ] 프로토타입 개발 및 검증
- [ ] 전체 시스템 마이그레이션
- [ ] 문서화 및 팀 교육
