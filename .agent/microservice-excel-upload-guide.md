# 마이크로서비스 간 엑셀 업로드 통신 가이드

## 📌 아키텍처 개요

```
[VIMS Management (8083)] --Feign Client--> [FMS (8082)]
         ↓                                        ↓
  ComUserService                          ExcelUploadController
         ↓                                        ↓
   FmsExcelClient --------HTTP POST-------> uploadFile()
   (+ API Key Header)                       (엑셀 파싱)
```

## 🔐 보안 설계

### 1. **내부 API 키 인증**
- FMS Controller에서 `X-Internal-API-Key` 헤더 검증
- Management 서비스는 요청 시 필수로 API 키 전송
- API 키는 `application.yml`에서 관리 (운영 환경: 환경변수)

### 2. **서비스 간 통신 보안**
- **내부 네트워크**: VPC/사설 네트워크 내에서만 통신
- **HTTPS**: 운영 환경에서는 HTTPS 필수
- **API Gateway**: 외부 노출 차단, 내부 서비스만 접근 가능

### 3. **데이터 검증**
- FMS: 파일 형식, 크기, 확장자 검증
- Management: 받은 데이터의 유효성 재검증

## 🛠️ 구현 상세

### 1. **Feign Client 설정**
- **타임아웃**: 연결 30초, 읽기 60초 (파일 업로드 고려)
- **재시도**: 3회, 1초 간격
- **로깅**: 개발(FULL), 운영(BASIC)
- **에러 핸들링**: 상태 코드별 맞춤 예외

### 2. **application.yml 설정**
```yaml
# VIMS Management - application.yml
fms:
  service:
    url: http://localhost:8082  # 운영: 내부 도메인
  internal:
    api-key: "your-secure-internal-api-key-here"
```

### 3. **사용 방법 (ComUserService)**
```java
@Override
protected int excelUploadImpl(MultipartFile file) throws Exception {
    // FMS 서비스 호출
    ExcelDataResponse excelData = fmsExcelClient.uploadExcel(file, fmsInternalApiKey);
    
    // 데이터 처리
    for (Map<String, Object> row : excelData.getData()) {
        String name = (String) row.get("이름");
        String email = (String) row.get("이메일");
        // 비즈니스 로직...
    }
    
    return excelData.getTotalRows();
}
```

## ⚡ 성능 최적화

1. **비동기 처리 (선택사항)**
   - 대용량 파일: `@Async`로 비동기 처리
   - 진행 상태: WebSocket 또는 SSE로 진행률 전송

2. **배치 처리**
   - 데이터 양이 많은 경우 배치로 나눠서 처리

3. **캐싱**
   - 파싱 결과가 변하지 않는다면 캐싱 고려

## 🔧 대안 방법 (참고)

### 1. **RestTemplate 사용**
```java
RestTemplate restTemplate = new RestTemplate();
HttpHeaders headers = new HttpHeaders();
headers.setContentType(MediaType.MULTIPART_FORM_DATA);
headers.set("X-Internal-API-Key", fmsInternalApiKey);

MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
body.add("file", file.getResource());

HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
ExcelDataResponse response = restTemplate.postForObject(
    "http://localhost:8082/fms/excel/excelUpload/upload",
    requestEntity, 
    ExcelDataResponse.class
);
```

### 2. **WebClient 사용 (비동기, 권장)**
```java
WebClient webClient = WebClient.create("http://localhost:8082");

ExcelDataResponse response = webClient.post()
    .uri("/fms/excel/excelUpload/upload")
    .header("X-Internal-API-Key", fmsInternalApiKey)
    .contentType(MediaType.MULTIPART_FORM_DATA)
    .body(BodyInserters.fromMultipartData("file", file.getResource()))
    .retrieve()
    .bodyToMono(ExcelDataResponse.class)
    .block();  // 동기식으로 대기 (비동기는 subscribe 사용)
```

## 💡 보안 체크리스트

- [ ] FMS Controller에 API 키 검증 추가
- [ ] API 키는 환경변수로 관리 (`.env`, Kubernetes Secret 등)
- [ ] 내부 네트워크에서만 접근 가능하도록 방화벽 설정
- [ ] HTTPS 사용 (운영 환경)
- [ ] 파일 크기 제한 (DoS 공격 방지)
- [ ] 허용된 파일 확장자만 업로드 가능
- [ ] 업로드 로그 기록 (감사 추적)
- [ ] Rate Limiting (과도한 요청 방지)

## 🚀 운영 환경 설정

### 환경변수로 API 키 관리
```bash
# Kubernetes Secret
kubectl create secret generic fms-api-key \
  --from-literal=api-key='your-production-api-key'

# application.yml
fms:
  internal:
    api-key: ${FMS_INTERNAL_API_KEY}
```

### 서비스 디스커버리 (선택사항)
```yaml
# Eureka, Consul 등 사용 시
fms:
  service:
    url: http://fms-service  # 서비스 이름으로 자동 해석
```

## 📝 추가 개선 사항

1. **Circuit Breaker** (Resilience4j)
   - FMS 장애 시 자동 fallback

2. **Request/Response Logging**
   - 디버깅 및 감사를 위한 로그

3. **Metrics & Monitoring**
   - Prometheus, Grafana로 모니터링

4. **API 버전 관리**
   - `/v1/fms/excel/upload` 형식으로 버전 명시
