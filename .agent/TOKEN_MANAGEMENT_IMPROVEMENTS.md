# 토큰 관리 시스템 개선 보고서

## 1. 개요
본 문서는 VIMS 시스템의 인증 및 토큰 관리 로직에서 발견된 문제점들과 이를 해결하기 위해 적용한 개선 사항들을 기술합니다. 주요 변경 사항은 **로그아웃 시의 안정성 확보**, **로그인 시 토큰 저장 누락 수정**, 그리고 **단일 유효 토큰 정책 도입(보안 강화)**입니다.

## 2. 발견된 문제점

### 2.1. 로그아웃 시 NoSuchElementException 발생
- **현상**: 로그아웃 시도 시 `NoSuchElementException: No value present` 에러가 발생하며 로그아웃이 실패함.
- **원인**: `LogoutService`에서 `Authorization` 쿠키를 찾지 못한 경우(쿠키가 없거나 만료된 경우), `Optional.get()`을 안전한 확인 없이 호출하여 발생.

### 2.2. 로그인 시 토큰 DB 미저장
- **현상**: 로그인(`authenticate`)은 성공하나, 이후 요청들이 인증 실패(403/401) 처리됨. 로그상 `SELECT * FROM TOKEN ... Total: 0` 확인됨.
- **원인**: 회원가입(`register`) 시에는 토큰을 DB에 저장했으나, 로그인 메서드에서는 JWT를 생성만 하고 **DB에 저장하는 로직이 누락**되어 있었음.

### 2.3. 토큰 생명주기 관리 부재
- **현상**: 로그인할 때마다 새로운 토큰이 DB에 계속 쌓임. 기존 토큰들은 `EXPIRED`, `REVOKED` 상태로 변경되지 않고 유효한 상태로 방치됨.
- **원인**: 로그인 시 기존 토큰을 무효화하는 로직이 없어서, 한 사용자가 무한히 많은 유효 토큰을 가질 수 있는 구조였음.

---

## 3. 개선된 내용

### 3.1. LogoutService 안정성 강화
- 쿠키가 존재하지 않거나 `Authorization` 쿠키가 없는 경우, 예외를 발생시키지 않고 안전하게 함수를 종료하도록 수정.
- `Optional.isEmpty()` 체크 로직 추가.

### 3.2. 로그인 프로세스 정상화 (Token 저장)
- `AuthenticationService.authenticate()` 메서드에 **토큰 저장 로직** 추가.
- JWT 생성 후 `Token` 엔티티를 빌드하여 `tokenService.save(token)` 호출.
- 데이터 무결성을 위해 `@Transactional` 어노테이션 적용.

### 3.3. 단일 유효 토큰 정책 도입 (보안 강화)
로그인 시 해당 사용자의 **이전 모든 토큰을 즉시 무효화**하도록 로직을 변경했습니다.

**변경 전 흐름:**
1. 아이디/비번 검증
2. 새 토큰 생성
3. (저장 안 함 - 버그)

**변경 후 흐름:**
1. 아이디/비번 검증
2. **기존 토큰 무효화**: `REVOKE_ALL_USER_TOKENS` 쿼리 실행 (해당 유저의 모든 토큰을 `expired=1`, `revoked=1`로 업데이트)
3. 새 토큰 생성
4. **새 토큰 저장**: `expired=0`, `revoked=0` 상태로 DB 저장

### 3.4. Query & Mapper 추가
- **Interface**: `TokenMapper.REVOKE_ALL_USER_TOKENS(userId)` 추가.
- **XML (Query)**:
  ```xml
  <update id="REVOKE_ALL_USER_TOKENS" parameterType="int">
      UPDATE TOKEN
      SET expired = 1, revoked = 1
      WHERE user_id = #{userId} AND expired = 0 AND revoked = 0
  </update>
  ```
- `vims-login`과 `vims-management-system` 양쪽의 Mapper XML에 동일하게 적용하여 정합성 유지.

---

## 4. 기대 효과
1. **시스템 안정성**: 쿠키가 없는 상태에서의 로그아웃 요청 등이 서버 에러를 유발하지 않음.
2. **기능 정상화**: 로그인이 정상적으로 수행되고, 이후 API 요청 시 인증이 통과됨.
3. **보안 강화**:
   - 사용자가 재로그인하면 탈취되었을 수도 있는 이전 토큰은 즉시 사용 불가능해짐.
   - DB에 불필요한 유효 토큰이 쌓이는 것을 방지.

## 5. 적용 방법
이 변경 사항은 `Core-lib` 라이브러리에 포함되어 있습니다.
1. `./deploy-core-lib.sh` 실행 (이미 완료됨)
2. 각 서비스(`vims-login`, `vims-management-system`, `vims-gateway`) **재시작 필수**.
