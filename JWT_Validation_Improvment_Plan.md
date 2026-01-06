# JWT 인증 보안 강화 작업 계획

## 1. 현황 및 문제점
현재 `Core-lib`의 `JwtAuthenticationFilter`는 JWT 토큰의 **서명(Signature)**과 **유효기간(Expiration Claim)**만을 검증하고 있습니다.
로그아웃 시 DB의 `TOKEN` 테이블에서 해당 토큰을 `expired = true`, `revoked = true`로 업데이트하고 있으나, 필터단에서 이를 확인하지 않아 **로그아웃된(폐기된) 토큰으로도 유효기간만 남아있다면 API 접근이 가능한 보안 취약점**이 존재합니다.

## 2. 작업 목표
- `JwtAuthenticationFilter`에 DB 검증 로직을 추가합니다.
- 토큰이 유효한 서명을 가졌더라도, DB 상에서 `expired` 또는 `revoked` 상태라면 요청을 차단하도록 수정합니다.

## 3. 구현 상세 계획 (내일 진행)

### 대상 파일
- `Core-lib/core-lib/src/main/java/com/system/auth/jwt/JwtAuthenticationFilter.java`

### 수정 가이드

**1. 의존성 주입**
`TokenService` (또는 `TokenRepository`)를 필터에 주입합니다.

```java
// JwtAuthenticationFilter.java

@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final TokenService tokenService; // [추가] DB 조회를 위해 주입
    // ...
}
```

**2. `doFilterInternal` 메서드 로직 보완**
`Authentication` 객체를 설정하기 전, DB 상태를 확인하는 조건을 추가합니다.

```java
// ... 기존 코드 ...
jwt = optionalCookie.get().getValue();
userEmail = jwtService.extractUsername(jwt);

if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
    UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
    
    // [추가] DB에서 토큰 상태 조회
    // TokenService에 findByToken 메서드 활용
    var isTokenValid = tokenService.findByToken(jwt)
            .map(t -> !t.isExpired() && !t.isRevoked())
            .orElse(false);

    // [수정] JWT 유효성 검사 AND DB 토큰 상태 검사
    if (jwtService.isTokenValid(jwt, userDetails) && isTokenValid) {
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                userDetails, null, userDetails.getAuthorities());
        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authToken);
    } else {
        // ... 인증 실패(쿠키 삭제) 로직 ...
    }
}
// ...
```

## 4. 관련 파일
- `Core-lib/.../token/TokenService.java`: `findByToken` 메소드 존재 여부 확인 (기존재함)
- `Core-lib/.../auth/service/LogoutService.java`: 로그아웃 시 플래그 업데이트 로직 (기존재함)

---
*작성일: 2026-01-06*
