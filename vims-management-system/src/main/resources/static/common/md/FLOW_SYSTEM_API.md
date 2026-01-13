# VIMS 전체 시스템 흐름 및 구현 가이드 (System Implementation Guide)

이 문서는 VIMS 시스템의 **전체 아키텍처**, **사용자 인증(Login & Core Lib)**, 그리고 **마이크로서비스 간 통신(FMS)**을 구현하기 위한 상세 설정과 코드를 포함합니다. 개념적 흐름뿐만 아니라 실제 `pom.xml`, `application.yml`, Java 구현 코드까지 망라합니다.

---

## 1. 🏗️ 전체 시스템 아키텍처 (Overview)

VIMS는 **MSA(Microservices Architecture)**를 따르며, 모든 외부 요청은 **API Gateway**를 통과합니다.

```mermaid
graph TD
    User[사용자] --> Gateway[API Gateway (8080)]
    
    subgraph "External Zone"
        Gateway --"/login/**"--> Login[Login Service (8081)]
        Gateway --"/cms/**"--> Mgmt[Management Service (8083)]
    end
    
    subgraph "Internal Zone"
        Mgmt --"Internal API"--> FMS[FMS Service (8082)]
    end
```

### 1.1. API Gateway 역할 및 설정 (`vims-gateway`)

Gateway는 단일 진입점으로서 **라우팅(Routing)**, **부하 분산**, **공통 보안(CORS)** 등을 담당합니다. 모든 요청에 대해 `AuthorizationHeaderFilter`를 적용하여 1차적인 토큰 유효성 검사를 수행합니다.

#### 1) 라우팅 설정 (`application.yml`)
요청 경로(Path)에 따라 적절한 마이크로서비스로 트래픽을 전달합니다. 정적 리소스(`/common`, `/assets`)도 Gateway가 처리합니다.

```yaml
server:
  port: 8080

spring:
  cloud:
    gateway:
      default-filters :
        - AuthorizationHeaderFilter # 모든 요청에 대해 1차 토큰 검증 수행
      routes:
        # 1. 로그인 서비스 (API + 정적 리소스)
        - id: vims-login
          uri: http://localhost:8081
          predicates:
            - Path=/login/**, /common/**, /assets/**

        # 2. 관리자 시스템(CMS)
        - id: vims-management
          uri: http://localhost:8083 # 실제 포트 8083 확인
          predicates:
            - Path=/cms/**

        # 3. 파일 관리 시스템 (FMS) - 필요 시 직접 접근용
        - id: vims-fms
          uri: http://localhost:8082
          predicates:
            - Path=/fms/**

token:
  secret: "YeyKgN7Oa0dfKJCR0Xr3Sp45WdU8BCv2Zd0X6KxRTfFgfPZ3MH3xccjC3WCt90Az" # Login 서비스와 동일한 키 필수
```

---

## 2. 🔐 사용자 인증 시스템 (Login & Core Auth)

### 2.1. 프로젝트 설정 (`pom.xml`)

JWT 기반 인증을 위해 `jjwt` 라이브러리를 사용합니다. 이 설정은 `core-lib`에 포함되거나 각 서비스에 공통으로 들어갑니다.

```xml
<!-- JWT 의존성 (vims-login, core-lib) -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.11.5</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.11.5</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.11.5</version>
    <scope>runtime</scope>
</dependency>
```

### 2.2. 인증 설정 (`application.properties`)

VIMS 시스템은 `application.yml` 대신 `application.properties`에 JWT 비밀키 설정을 관리합니다.

```properties
# vims-login, vims-management-system (공통)
# JWT Secret Key
secret-key = YeyKgN7Oa0dfKJCR0Xr3Sp45WdU8BCv2Zd0X6KxRTfFgfPZ3MH3xccjC3WCt90Az

# Token Expiration (Milliseconds)
expiration-milliseconds = 36000000 # 10시간
```

### 2.3. 토큰 생명주기 및 저장 매커니즘 (Lifecycle)

VIMS 시스템의 JWT 토큰은 다음과 같은 정책으로 생성되고 관리됩니다.

#### 1) 토큰 발급 및 저장 (Storage)
- **발급 시점**: 사용자가 로그인(ID/PW)에 성공하면 `Login Service`가 JWT를 생성합니다.
- **저장 위치**:
  - 보안을 위해 `HttpOnly Cookie`에 저장하거나,
  - 클라이언트(JS)가 사용하기 위해 `Authorization Header (Bearer)`로 전달되어 `LocalStorage`에 저장될 수 있습니다.
  - *(현재 시스템은 프로젝트 구현에 따라 Header 방식을 사용 중)*
- **전송 방식**: 모든 API 요청 시 HTTP **Header**에 포함하여 전송합니다.
  ```http
  Authorization: Bearer <eyJhbGciOiJIUzI1NiJ9...>
  ```

#### 2) 토큰 만료 및 갱신 (Expiration)
- **유효 기간**: `expiration-milliseconds` 설정에 따릅니다. (예: 36000000ms = 10시간)
- **만료 체크**:
  - Core Lib의 `JwtAuthenticationFilter`에서 요청마다 토큰의 `exp` 클레임을 확인합니다.
  - 만료된 토큰인 경우: `ExpiredJwtException` 발생 → **401 Unauthorized** 응답 반환.
- **사용자 경험**:
  - 401 에러 수신 시 프론트엔드는 사용자를 **로그인 페이지로 리다이렉트**하거나,
  - Refresh Token이 구현된 경우 백그라운드에서 토큰 갱신을 시도합니다.

### 2.4. 로그인 서비스 구현 (Login Service)

사용자가 ID/PW를 입력하면 토큰을 발급합니다.

```java
// LoginService.java
public TokenResponse login(LoginRequest request) {
    // 1. 사용자 검증
    User user = userRepository.findByEmail(request.getEmail())
        .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    
    if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
        throw new BadCredentialsException("Invalid password");
    }

    // 2. JWT 토큰 생성
    String accessToken = Jwts.builder()
        .setSubject(user.getEmail())
        .claim("role", user.getRole())
        .setIssuedAt(new Date())
        .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration * 1000))
        .signWith(userInputKey, SignatureAlgorithm.HS256)
        .compact();

    return new TokenResponse(accessToken);
}
### 2.5. 요청 검증 구현 (Core Lib / Management)

Management 서비스는 `Core Lib`을 통해 들어오는 모든 요청의 JWT를 검증합니다.

```java
// Core Lib - JwtAuthenticationFilter.java
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) {
        String token = resolveToken(request); // "Authorization: Bearer <token>" 추출

        if (token != null && jwtProvider.validateToken(token)) {
            // 토큰이 유효하면 SecurityContext에 인증 정보 설정
            Authentication auth = jwtProvider.getAuthentication(token);
            SecurityContextHolder.getContext().setAuthentication(auth);
        }
        filterChain.doFilter(request, response);
    }
}
```

### 2.6. 로그인 사용자 정보 활용 (Accessing User Info)

JWT 필터를 통과한 요청은 컨트롤러에서 `@AuthenticationPrincipal`을 통해 로그인한 사용자 정보에 접근할 수 있습니다. 이를 위해서는 Core Lib에 `CustomUserDetails`가 구현되어 있어야 합니다.

```java
// Controller 사용 예시
@RestController
public class SampleController {
    
    @GetMapping("/my-info")
    public ResponseEntity<String> getMyInfo(@AuthenticationPrincipal CustomUserDetails userDetails) {
        // userDetails 객체에는 JWT에서 파싱된 user_id, role, email 등의 정보가 담겨 있습니다.
        String userId = userDetails.getUsername();
        // String role = userDetails.getRole();
        
        return ResponseEntity.ok("Hello, " + userId);
    }
}
```

### 2.7. Frontend 호출 예시 (JavaScript)

클라이언트에서 API를 호출할 때 토큰을 헤더에 포함하는 방법입니다.

```javascript
// excelUpload.js : 파일 업로드 함수 예시
async function uploadExcelFile(file) {
    const formData = new FormData();
    formData.append("file", file);

    // LocalStorage 등에서 토큰 가져오기
    const token = localStorage.getItem("accessToken");

    try {
        const response = await fetch("/cms/common/user/excelUpload", {
            method: "POST",
            headers: {
                // Bearer 토큰 주입 (필수)
                "Authorization": `Bearer ${token}`
            },
            body: formData
        });

        if (!response.ok) {
            if (response.status === 401) {
                alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
                window.location.href = "/login.html";
                return;
            }
            throw new Error(`Upload failed: ${response.statusText}`);
        }

        const result = await response.json();
        console.log("Upload Success:", result);
        return result;

    } catch (error) {
        console.error("Error:", error);
        alert("업로드 중 오류가 발생했습니다.");
    }
}
```

---

## 3. 🤝 시스템 간 통신 (Management ↔ FMS)

Management가 내부 파일 서버(FMS)를 호출할 때는 사용자 토큰 대신 **시스템 API Key**를 사용합니다.

### 3.1. 프로젝트 설정 (`pom.xml`)

#### Management Service (`vims-management-system`)
```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
```

#### FMS Service (`FMS`)
```xml
<dependency>
    <groupId>org.apache.poi</groupId>
    <artifactId>poi-ooxml</artifactId>
    <version>5.2.3</version>
</dependency>
```

### 3.2. 통신 설정 (`application.yml`)

두 서비스가 동일한 **API Key**를 공유해야 합니다.

```yaml
# Management Service (application.prod.yml)
fms:
  service:
    url: http://localhost:8082
  internal:
    api-key: "internal-secret-key-1234"

# FMS Service (application.prod.yml)
server:
  port: 8082
fms:
  internal:
    api-key: "internal-secret-key-1234" # Management와 일치 필수!
```

### 3.3. Feign Client 구현 (Management)

```java
// FmsExcelClient.java
@FeignClient(name = "fms-service", url = "${fms.service.url}", configuration = FmsClientConfiguration.class)
public interface FmsExcelClient {
    @PostMapping(value = "/fms/excel/excelUpload/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    ExcelDataResponse uploadExcel(
        @RequestPart("file") MultipartFile file,
        @RequestHeader("X-Internal-API-Key") String apiKey // 헤더로 Key 전송
    );
}

// Service 사용 예시
@Service
public class ComUserService {
    @Value("${fms.internal.api-key}")
    private String apiKey;

    public void upload(MultipartFile file) {
        fmsExcelClient.uploadExcel(file, apiKey);
    }
}
```

### 3.4. 데이터 모델 (DTO)

시스템 간 주고받는 데이터의 구조입니다.

```java
// ExcelDataResponse.java (Management & FMS 공통 구조)
@Getter
@Setter
public class ExcelDataResponse {
    // 원본 파일명
    private String fileName;
    
    // 엑셀 헤더 리스트 (예: ["이름", "이메일", "전화번호"])
    private List<String> headers;
    
    // 실제 데이터 행 (Map List)
    // 예: [{"이름": "홍길동", "이메일": "hong@test.com"}, ...]
    private List<Map<String, Object>> dataRows;
    
    // 총 데이터 건수
    private int totalRows;
}
```

### 3.5. FMS 보안 및 처리 구현 (FMS)

FMS는 해당 경로를 Security 필터에서 제외하고, Controller에서 직접 Key를 검증합니다.

```java
// SecurityConfig.java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) {
    http.csrf(AbstractHttpConfigurer::disable)
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/fms/excel/**").permitAll() // Security 통과
            .anyRequest().authenticated()
        );
    return http.build();
}

// ExcelUploadController.java
@RestController
public class ExcelUploadController {
    @Value("${fms.internal.api-key}")
    private String expectedKey;

    @PostMapping("/upload")
    public ExcelData upload(@RequestHeader("X-Internal-API-Key") String apiKey, @RequestParam("file") MultipartFile file) {
        // API Key 직접 검증
        if (!expectedKey.equals(apiKey)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "FMS 서비스 접근 권한이 없습니다.");
        }
        return excelService.parseExcel(file);
    }
}
```

---

## 4. 🚨 에러 처리 및 응답 흐름 (Error Handling)

시스템 전반에서 발생하는 예외는 `GlobalExceptionHandler`를 통해 표준 JSON 포맷으로 변환되어 클라이언트에 전달됩니다.

### 4.1. 에러 응답 구조 (JSON)
```json
{
  "timestamp": "2026-01-13T16:00:00.123",
  "status": 403,
  "error": "Forbidden",
  "message": "FMS 서비스 접근 권한이 없습니다",
  "path": "/cms/common/user/excelUpload"
}
```

### 4.2. 주요 에러 코드
- **401 Unauthorized**: JWT 토큰 만료 또는 없음 (재로그인 필요)
- **403 Forbidden**: API Key 불일치 또는 권한 부족
- **400 Bad Request**: 엑셀 파일 형식 오류 (.exe 등)
- **500 Internal Server Error**: 서버 내부 로직 오류

---

## 5. ✅ 로직 흐름 요약

1. **로그인**: User → Login Service (ID/PW) ⇒ **JWT 발급** (Cookie/Header 저장)
2. **서비스 이용**: User(JS) → API Gateway → Management (Bearer JWT) ⇒ **Core Lib이 JWT 검증**
3. **파일 처리**: Management → FMS (Header: X-Internal-API-Key) ⇒ **FMS Controller가 Key 검증 & 엑셀 파싱**
4. **결과 반환**: FMS(ExcelData) → Management(DTO 매핑) → User(JSON 응답)

이 가이드는 실제 소스 코드(`src/main/java/...`)와 설정 파일(`application.properties`)에 적용된 내용을 기반으로 작성되었습니다.
