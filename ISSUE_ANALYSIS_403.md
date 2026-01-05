# 최초 사이트 접근 시 403 Forbidden 에러 분석 보고서

## 1. 문제 상황 (Issue)
- **증상**: 브라우저에서 `http://localhost:8080/` 접속 시 "Looks like there’s a problem with this site... Error code: 403 Forbidden" 에러 페이지가 발생합니다.
- **환경**: 
  - macOS
  - Spring Boot MSA 구조 (`vims-gateway`, `vims-login`, `vims-management-system`)
  - Gateway Port: **8080**
  - Login Service Port: **8081**

## 2. 아키텍처 및 요청 흐름 (Architecture & Flow)
1. **Request**: 사용자가 `http://localhost:8080/` (Gateway)으로 접근합니다.
2. **Gateway Routing**: 
   - `vims-gateway/src/main/resources/application.yml` 설정에 따라 `Path=/` 요청은 `vims-login` 서비스(`http://localhost:8081`)로 포워딩됩니다.
   ```yaml
   - id: vims-login_route
     uri: http://localhost:8081
     predicates:
       - Path=/
   ```
3. **Login Service Dispatch**: `vims-login` 서비스가 `GET /` 요청을 수신합니다.
4. **Security Filter Chain**: Spring Security 설정(`Core-lib` 내 `SecurityConfiguration`)이 요청을 가로채 인증 여부를 확인합니다.

## 3. 원인 분석 (Root Cause Analysis)

### 3.1. 403 Forbidden의 직접적 원인
403 Forbidden 에러는 **"서버에 도달했으나, 권한 부족으로 거부됨"**을 의미합니다. 
`vims-gateway` 자체는 보안 설정이 비활성화되어 있으므로(주석 처리된 security dependency), **`vims-login` 서비스가 403을 반환하고 있는 것**입니다.

### 3.2. Security 설정 분석
`vims-login` 서비스는 `Core-lib`라는 외부 라이브러리(Jar)를 의존성으로 사용하며, 이 라이브러리 안에 보안 설정이 포함되어 있습니다.

- **소스 코드 상의 설정** (`Core-lib/.../SecurityConfiguration.java`):
  ```java
  private static final String[] WHITE_LIST_URL = {
          "/",
          "/login",
          "/common/**",
          "/assets/**",
          "/api/v1/auth/**"
  };
  // ...
  .requestMatchers(WHITE_LIST_URL).permitAll()
  ```
  소스 코드 상으로는 루트 경로(`/`)에 대해 **`permitAll()`(누구나 접근 가능)** 설정이 되어 있어 에러가 발생하지 않아야 정상입니다.

### 3.3. **핵심 원인: 라이브러리 불일치 (Jar Version Mismatch)**
`vims-login`의 `pom.xml`을 살펴보면 `core-lib`를 로컬 시스템 경로의 Jar 파일로 참조하고 있습니다.

```xml
<dependency>
    <groupId>com.yourcompany</groupId>
    <artifactId>core-lib</artifactId>
    <version>1.0</version>
    <scope>system</scope>
    <systemPath>${project.basedir}/src/lib/core-lib-1.0.jar</systemPath>
</dependency>
```

**문제점**: 
현재 `Core-lib` 프로젝트의 **소스 코드(`SecurityConfiguration.java`)는 수정되어 `WHITE_LIST_URL`에 `/`가 포함되어 있을 수 있으나**, `vims-login`이 참조하고 있는 **실제 Jar 파일(`src/lib/core-lib-1.0.jar`)은 과거에 빌드된 구버전**일 가능성이 매우 높습니다. 
구버전 Jar에는 `/` 경로에 대한 허용 설정이 누락되어 있어, Spring Security 기본 정책(모든 요청 인증 필요)에 의해 403 에러가 발생하는 것입니다.

## 4. 해결 방안 (Solution)

이 문제를 해결하기 위해서는 `Core-lib`를 다시 빌드하여 최신 Jar 파일을 `vims-login` 프로젝트에 반영해야 합니다.

### 단계 1: Core-lib 빌드
터미널에서 `Core-lib/core-lib` 디렉토리로 이동하여 Maven 빌드를 실행합니다.
```bash
cd /Users/ikyoungtae/Documents/coding/AI-code-test/Core-lib/core-lib
mvn clean install
```
*(또는 `mvn clean package` 사용)*

### 단계 2: Jar 파일 교체
빌드된 최신 Jar 파일을 `vims-login`의 라이브러리 폴더로 복사합니다.
```bash
# 예시 (경로는 실제 빌드 결과에 따라 다를 수 있음)
cp target/core-lib-1.0.jar /Users/ikyoungtae/Documents/coding/AI-code-test/vims-login/src/lib/core-lib-1.0.jar
```

### 단계 3: 서비스 재시작
`vims-login` 서비스를 재시작하여 새로운 Jar 파일의 설정을 로드하게 합니다.

---
**요약**: 소스 코드 상으로는 권한이 허용되어 있으나, 실행되는 애플리케이션이 참조하는 라이브러리 파일(Jar)이 최신 소스 코드를 반영하지 못해 발생하는 문제입니다. 라이브러리를 재빌드하고 교체하면 해결될 것입니다.
