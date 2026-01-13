# 트러블슈팅 리포트: 정적 리소스(JS, CSS) 로딩 시 500 에러 및 MIME 타입 오류 해결

## 1. 문제 상황 (Symptoms)
웹 애플리케이션을 새로고침하거나 초기 로딩 시, 다수의 정적 리소스(Javascript, CSS, 이미지 파일 등)에서 간헐적 또는 지속적으로 **500 Internal Server Error**가 발생함.
브라우저 콘솔에는 다음과 같은 에러 메시지가 출력됨.

```text
GET http://localhost:8080/common/css/common/FormUtility.css [HTTP/1.1 500 Internal Server Error]
GET http://localhost:8080/common/js/jquery/jquery3.6.0.js NS_ERROR_CORRUPTED_CONTENT
The resource from “...” was blocked due to MIME type (“text/plain”) mismatch (X-Content-Type-Options: nosniff).
Loading failed for the <script> with source “...”.
```

## 2. 원인 분석 (Root Cause Analysis)

### 2.1. JWT 필터의 동작 방식
스프링 시큐리티 설정에서 `JwtAuthenticationFilter`는 `OncePerRequestFilter`를 상속받아 구현되어 있으며, **모든 HTTP 요청**에 대해 동작하도록 설정되어 있었습니다.

```java
// 기존 동작 흐름
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(...) {
        // 1. 쿠키에서 JWT 추출
        // 2. JWT 유효성 검증
        // 3. *DB에서 사용자 정보 조회 (loadUserByUsername)* <-- 문제 지점
        // ...
    }
}
```

### 2.2. 과도한 DB 커넥션 사용
브라우저가 페이지를 렌더링할 때 수십 개의 정적 파일(JS, CSS 등)을 동시에 비동기로 요청합니다.
이때 **모든 정적 리소스 요청마다** 필터가 실행되어 DB 조회를 시도했습니다.
1.  브라우저가 30개의 JS/CSS 파일을 동시에 요청.
2.  서버는 30개의 스레드에서 동시에 `JwtAuthenticationFilter` 실행.
3.  30개의 DB 커넥션을 획득하려고 시도(HikariCP Pool).
4.  **커넥션 풀 고갈(Connection Pool Exhaustion)** 또는 DB 부하 발생.
5.  커넥션을 획득하지 못한 요청들이 예외를 발생시키며 **500 에러** 반환.

### 2.3. MIME 타입 오류 발생 이유
서버가 500 에러를 반환할 때, 일반적인 에러 페이지(HTML 또는 Text)를 응답으로 보냅니다.
브라우저는 `<script src="...">` 태그를 통해 자바스크립트 파일을 기대했으나, 서버가 에러 메시지(Text/HTML)를 보내자 **MIME Type 불일치(text/css 또는 text/javascript가 아님)** 로 판단하여 리소스 로딩을 차단했습니다.

## 3. 해결 방법 (Solution)

`JwtAuthenticationFilter`가 정적 리소스 요청에 대해서는 동작하지 않도록 예외 처리를 추가했습니다.
`OncePerRequestFilter`의 `shouldNotFilter` 메서드를 오버라이드하여, 특정 경로 패턴에 대해 필터 실행을 건너뛰도록 설정했습니다.

### 3.1. 수정된 코드 (`Core-lib/src/.../JwtAuthenticationFilter.java`)

```java
@Override
protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
    String path = request.getRequestURI();
    // 정적 리소스 경로 및 에러 페이지 경로를 필터 대상에서 제외
    return path.startsWith("/common/") || 
           path.startsWith("/assets/") || 
           path.startsWith("/favicon.ico") || 
           path.startsWith("/error");
}
```

## 4. 결과 (Result)
*   **성능 향상:** 정적 리소스 요청 시 불필요한 인증 로직과 DB 조회를 건너뛰어 로딩 속도가 대폭 개선되었습니다.
*   **안정성 확보:** DB 커넥션 풀이 정적 파일 요청으로 인해 고갈되는 현상을 막아, 실제 비즈니스 로직 처리에 커넥션을 안정적으로 사용할 수 있게 되었습니다.
*   **에러 해결:** 500 에러 및 MIME 타입 오류가 더 이상 발생하지 않으며, 페이지가 정상적으로 로드됩니다.
