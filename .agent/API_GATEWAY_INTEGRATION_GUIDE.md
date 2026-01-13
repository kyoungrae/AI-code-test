# VIMS API Gateway 연동 및 인증 가이드

본 문서는 **VIMS (Vehicle Information Management System)** 의 API Gateway를 통해 시스템에 접근하고 연동하는 방법을 개발자 대상으로 상세히 설명합니다. 
VIMS 시스템은 **MSA(Microservice Architecture)** 구조를 따르며, 모든 외부 요청은 **Gateway(Port 8080)** 를 통해서만 내부 서비스(Login, Management 등)로 전달됩니다.

---

## 1. 인증 아키텍처 개요

VIMS Gateway는 클라이언트의 유형에 따라 두 가지 인증 방식을 지원합니다.

| 인증 방식 | 주체 (Type) | 사용 목적 | 인증 수단 |
| :-- | :-- | :-- | :-- |
| **JWT (JSON Web Token)** | 일반 사용자 (User) | 웹 브라우저, 모바일 앱을 통한 사용자 로그인 및 세션 유지 | **Authorization Header** (Bearer Token) 또는 **Cookie** |
| **API Key** | 외부 시스템 (System) | 배치(Batch) 프로그램, 외부 데이터 수집기, 타 서버 간 통신 | **X-API-KEY Header** |

```mermaid
graph TD
    Client[User / Browser] -->|JWT (Cookie/Header)| Gateway(Port 8080)
    ExtSystem[External System] -->|X-API-KEY Header| Gateway(Port 8080)
    
    Gateway -->|Auth Check| SecurityFilter{인증 필터}
    SecurityFilter -->|유효| Router[라우터]
    SecurityFilter -->|무효| Error[401 Unauthorized]
    
    Router -->|/login, /api/auth| LoginService(Port 8081)
    Router -->|/cms/**| ManagementService(Port 8083)
```

---

## 2. JWT 인증 (사용자/브라우저)

사용자 기반의 서비스 접근 시 사용되는 방식입니다. 로그인 성공 시 발급되는 JWT Access Token을 이용합니다.

### 2.1 인증 흐름
1.  **로그인 요청**: 클라이언트가 `POST /login` (Gateway 8080)으로 ID/PW 전송
2.  **토큰 발급**: 자격 증명이 유효하면 서버는 `Authorization` 헤더와 `Authorization` 쿠키에 JWT 토큰을 담아 응답
3.  **API 요청**: 이후 모든 요청에 발급받은 JWT를 포함하여 전송

### 2.2 요청 방법 (Dual Support)

Gateway는 개발 편의성과 보안을 위해 두 가지 방식의 토큰 전달을 모두 지원합니다.

#### 방법 A: Authorization Header (권장 - REST Client, Mobile)
토큰을 `Authorization` HTTP 헤더에 담아 전송합니다. 값 앞에 `Bearer ` 접두사를 붙여야 합니다.

```http
GET /cms/common/comUser/find HTTP/1.1
Host: localhost:8080
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ...
```

#### 방법 B: Cookie (브라우저 기본)
웹 브라우저 환경에서는 로그인 시 자동으로 설정된 `Authorization` 쿠키를 이용할 수 있습니다. 별도의 헤더 설정 없이 요청을 보내면 Gateway가 쿠키를 확인합니다.

```http
GET /cms/common/comUser/find HTTP/1.1
Host: localhost:8080
Cookie: Authorization=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ...
```

### 2.3 토큰 검증 로직
1.  **Header 우선 검사**: `Authorization` 헤더가 있는지 확인합니다.
2.  **Cookie 차순 검사**: 헤더가 없다면 `Authorization` 쿠키를 확인합니다.
3.  **검증**: 추출된 토큰의 서명(Signature)을 Gateway에 설정된 Secret Key (`token.secret`)로 검증합니다.
4.  **Forwarding**: 검증이 완료되면 Gateway는 토큰에서 `User ID`를 추출하여 `X-User-Id` 헤더에 담아 내부 서비스로 전달합니다.

---

## 3. 외부 모듈 연동 (API Key)

로그인 과정 없이 시스템 간 통신(Server-to-Server)을 수행해야 할 경우 API Key를 사용합니다. 이 방식은 **시스템 관리자(System Admin)** 권한으로 간주되므로 키 관리에 주의해야 합니다.

### 3.1 사용 시나리오
*   Python 데이터 수집 스크립트가 주기적으로 데이터를 밀어넣을 때
*   외부 레거시 시스템이 VIMS의 API를 호출할 때
*   CI/CD 파이프라인에서 배포 후 헬스 체크를 할 때

### 3.2 요청 방법
HTTP 요청 헤더에 `X-API-KEY`를 포함하여 전송합니다. 이 값은 Gateway의 설정(`application.yml`)에 정의된 값과 일치해야 합니다.

**예시 (cURL):**
```bash
curl -X POST http://localhost:8080/cms/api/data/sync \
  -H "Content-Type: application/json" \
  -H "X-API-KEY: vims-internal-secret-key-1234" \
  -d '{"data": "sample"}'
```

**예시 (Python):**
```python
import requests

url = "http://localhost:8080/cms/common/comUser/find"
headers = {
    "X-API-KEY": "vims-internal-secret-key-1234",
    "Content-Type": "application/json"
}

response = requests.post(url, headers=headers, json={})
print(response.status_code)
```

### 3.3 보안 설정 가이드
*   **환경 변수 분리**: 운영 환경에서는 `application.yml`에 API Key를 하드코딩하지 말고, OS 환경 변수나 Docker Secret을 통해 주입해야 합니다.
    *   예: `java -jar -Dgateway.api-key=REAL_SECURE_KEY_!!! vims-gateway.jar`

---

## 4. API Gateway 라우팅 정보

개발 시 호출해야 할 Endpoints 정보입니다. 모든 요청은 Gateway 포트인 **8080**으로 보내야 합니다.

| 서비스 명 | Gateway 경로 (Prefix) | 실제 서비스 포트 | 용도 |
| :-- | :-- | :-- | :-- |
| **Login Service** | `/login`, `/api/v1/auth/**` | 8081 | 로그인, 로그아웃, 토큰 재발급 |
| **Management Service** | `/cms/**` | 8083 | 회원 관리, 메뉴 관리, 시스템 설정 등 |
| **Static Resources** | `/assets/**`, `/common/**` | 8081 | JS, CSS, 이미지 등 정적 자원 |

> **주의**: 내부 서비스 포트(8081, 8083)로 직접 요청하지 마십시오. 직접 요청 시 인증 필터를 거치지 않아 보안 컨텍스트 설정(`X-User-Id` 등)이 누락되어 **500 에러**가 발생할 수 있습니다.

---

## 5. 트러블슈팅 (FAQ)

### Q1. 401 Unauthorized 에러가 발생합니다.
*   **JWT 사용 시**: 토큰이 만료되었거나, 서명 키(Secret Key)가 Login 서비스와 Gateway 간에 일치하지 않은 경우입니다.
*   **API Key 사용 시**: `X-API-KEY` 헤더 값이 서버 설정과 다르거나 누락되었습니다.

### Q2. 500 Internal Server Error가 발생합니다.
*   **포트 확인**: `localhost:8081`이나 `8083`으로 직접 요청을 보냈는지 확인하세요. 반드시 `8080`을 통해야 합니다.
*   **인증 정보 누락**: Gateway를 통과하지 않은 요청은 User ID 정보가 없어 내부 로직에서 NullPointerException이 발생할 수 있습니다.

### Q3. 로그인 페이지 로딩이 안 됩니다 (JS/CSS 404).
*   Gateway 필터에서 정적 리소스 경로(`/common/**`, `/assets/**`)가 예외 처리(PermitAll) 되어 있는지 확인하세요.
*   HTML 파일 내의 `<script>` 경로가 올바른지 확인하세요 (예: `utils/` 경로 중복 등).

---

*(작성일: 2026-01-08 / 작성자: 이경태)*
