# 외부 모듈(External System) CMS API 연동 가이드

이 문서는 FMS(File Management System) 등 외부 모듈이 VIMS CMS(Management System)의 API 엔드포인트에 접근하기 위한 표준 절차를 기술합니다.

## 1. 기본 원칙
1. **Gateway 경유 필수**: 모든 요청은 **API Gateway (포트 8080)**를 통해서만 전송해야 합니다.
2. **인증 방식 선택**:
   - **사용자 인증 (JWT)**: 일반 사용자의 권한으로 접근할 때 사용 (로그인 필요).
   - **시스템 인증 (API Key)**: 외부 모듈이 로그인 없이 시스템 권한으로 접근할 때 사용.
3. **운영 환경 URL**: 로컬 개발 시 `http://localhost:8080`을 사용하며, 운영 환경 배포 시 해당 게이트웨이 도메인으로 변경해야 합니다.

---

## 2. 인증 절차 (Authentication)

CMS API를 사용하기 위해서는 먼저 로그인을 통해 **JWT 토큰**을 발급받아야 합니다.

### 2.1. 방식 A: 사용자 인증 (Login -> Token)
* **Endpoint**: `POST http://localhost:8080/login`
* **Content-Type**: `application/json`
* **Request Body**: `{"email": "...", "password": "..."}`
* **Response**: `Set-Cookie` 헤더를 통해 `Authorization` 쿠키 발급.

### 2.2. 방식 B: 시스템 인증 (API Key) - 추천
로그인 없이 헤더에 API Key를 포함하여 즉시 접근합니다.
* **Header Name**: `X-API-KEY`
* **Value**: `vims-internal-secret-key-1234` (게이트웨이 설정값)
* **장점**: 별도의 로그인 세션 관리가 필요 없으며, `SYSTEM_ADMIN` 권한으로 동작합니다.

---

## 3. API 요청 (Request API)

인증된 토큰을 사용하여 CMS의 비즈니스 로직(예: 사용자 조회)을 호출합니다.

### 3.1. 요청 형식 (API Key 사용 시)
* **Base URL**: `http://localhost:8080`
* **Path**: `/cms/...`
* **Header**:
  ```http
  X-API-KEY: vims-internal-secret-key-1234
  Content-Type: application/json
  ```

---

## 4. 예제 코드 (cURL)

**1. API Key를 이용한 사용자 조회 (추천)**
```bash
curl -X POST http://localhost:8080/cms/common/comUser/find \
  -H "X-API-KEY: vims-internal-secret-key-1234" \
  -H "Content-Type: application/json" \
  -d '{"user_name": "홍길동"}'
```

**2. 로그인 쿠키를 이용한 조회**
```bash
# 로그인 및 쿠키 저장
curl -c cookies.txt -X POST http://localhost:8080/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com", "password":"1234"}'

# 쿠키를 사용하여 API 호출
curl -b cookies.txt -X POST http://localhost:8080/cms/common/comUser/find \
  -H "Content-Type: application/json" \
  -d '{}'
```

---

## 5. 예제 코드 

### 5.1. API Key 방식
```javascript
const axios = require('axios');

async function getCmsData() {
    try {
        const response = await axios.post('http://localhost:8080/cms/common/comUser/find', 
        {
            user_name: "홍길동" // 검색 조건
        }, 
        {
            headers: {
                'X-API-KEY': 'vims-internal-secret-key-1234',
                'Content-Type': 'application/json'
            }
        });
        
        console.log('결과:', response.data);
    } catch (error) {
        console.error('API 호출 실패:', error.response ? error.response.data : error.message);
    }
}
```

### 5.2. 로그인 쿠키 방식
브라우저가 아닌 서버 간 통신 시 `Set-Cookie`를 직접 관리해야 하는 경우의 예시입니다.
```javascript
const axios = require('axios');

async function loginAndAccess() {
    try {
        // 1. 로그인
        const loginRes = await axios.post('http://localhost:8080/login', {
            email: 'admin@example.com',
            password: '1234'
        });

        // 2. 응답 헤더에서 Authorization 쿠키 추출
        const setCookie = loginRes.headers['set-cookie'];
        const authCookie = setCookie.find(c => c.startsWith('Authorization'));

        // 3. 추출한 쿠키를 사용하여 API 요청
        const apiRes = await axios.post('http://localhost:8080/cms/common/comUser/find', {}, {
            headers: {
                'Cookie': authCookie,
                'Content-Type': 'application/json'
            }
        });

        console.log('데이터:', apiRes.data);
    } catch (error) {
        console.error('오류:', error.message);
    }
}
```

---

## 6. 트러블슈팅 (Troubleshooting)

### Q1. 500 에러 혹은 리다이렉트 발생
* **원인**: 개별 서비스 포트(8081, 8083)로 직접 접속했거나, Gateway 주소가 잘못된 경우입니다.
* **해결**: 반드시 **8080 포트**를 사용하고, API Key 혹은 Cookie가 정상적으로 전달되었는지 확인하세요.

### Q2. 403 Forbidden 에러
* **원인**: API Key 값이 틀렸거나, 쿠키가 누락된 경우입니다.
* **해결**: `X-API-KEY: vims-internal-secret-key-1234` 헤더가 정확히 포함되었는지 확인하세요.
