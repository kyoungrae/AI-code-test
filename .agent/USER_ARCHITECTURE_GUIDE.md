---
description: 
---

# 사용자 관리 아키텍처 가이드 (User Management Architecture Guide)

본 문서는 VIMS 시스템에서 `Core-lib`과 `Management System` 양쪽에서 사용자 관련 코드(`AuthUser`, `ComUser`)가 이중으로 관리되는 구조의 배경과 아키텍처적 의의, 그리고 관리지침을 설명합니다.

## 1. 개요 (Overview)

현재 프로젝트 구조 상 사용자 객체가 두 가지 형태로 존재합니다.

1.  **`AuthUser` (`Core-lib`)**: Spring Security와 연동되어 **인증(Authentication)** 및 **인가(Authorization)**를 담당.
2.  **`ComUser` (`Management`)**: 관리자 시스템 비즈니스 로직에서 사용하는 **도메인 엔티티(Entity)**.

얼핏 보면 코드 중복(Duplication)처럼 보일 수 있으나, 이는 **관심사의 분리(Separation of Concerns)** 원칙에 따른 의도된 설계 패턴입니다. 이러한 패턴은 MSA(마이크로서비스 아키텍처)나 모듈형 시스템에서 **Bounded Context(경계가 있는 문맥)** 개념으로 널리 사용됩니다.

---

## 2. 구조 비교 (Structure Comparison)

| 구분 | `AuthUser` (Core-lib) | `ComUser` (Management) |
| :--- | :--- | :--- |
| **위치** | `com.system.auth.authuser` | `com.vims.common.user` |
| **주 목적** | **보안 & 인증** | **데이터 관리 & 비즈니스** |
| **주요 기능** | 로그인, JWT 토큰 생성, 권한(`ROLE`) 확인 | 회원가입, 정보수정, 조회, 삭제, 엑셀 다운로드 |
| **인터페이스** | `UserDetails` 구현 (필수) | JPA `Entity` 또는 DTO |
| **필드 구성** | 인증에 필요한 최소한의 필드 (ID, PW, Email, Role) | 테이블의 모든 컬럼 (주소, 상세주소, 메타데이터 등) |
| **사용 범위** | 모든 마이크로서비스 (Gateway, Login, API 등) | 관리자(Management) 시스템 내부 |

---

## 3. 왜 분리해야 하는가? (Why Separation?)

### 3.1. 의존성 격리 (Decoupling)
*   **Core의 경량화**: `Core-lib`은 시스템의 심장부로, 다른 모든 서비스가 참조합니다. 만약 `Core-lib`의 사용자 객체에 관리자 페이지를 위한 복잡한 로직(예: 엑셀 다운로드 포맷, 마케팅 동의 여부 검증 등)이 포함된다면, 라이브러리가 불필요하게 무거워집니다.
*   **변경 영향도 최소화**: 관리자 페이지의 UI 변경으로 인해 `ComUser`에 필드가 추가되더라도, 로그인을 담당하는 `AuthUser`나 `Core-lib`은 재배포할 필요가 없습니다. 반대로 보안 정책 변경은 `Core-lib`만 수정하면 됩니다.

### 3.2. 역할의 명확성
*   **보안 컨텍스트**: "이 사용자가 시스템에 들어올 자격이 있는가?"에만 집중합니다.
*   **도메인 컨텍스트**: "이 사용자의 집 주소가 어디이며, 마지막 수정일은 언제인가?"에 집중합니다.

---

## 4. 관리 지침 (Best Practices)

### 4.1. 테이블 매핑 (Table Mapping)
*   두 객체 모두 동일한 DB 테이블(`COM_USER`)에 매핑합니다.
*   **`AuthUser`**: 인증에 필요한 컬럼만 매핑하거나, 편의상 전체를 매핑하되 비즈니스 로직은 배제합니다.
*   **`ComUser`**: 모든 컬럼을 매핑하며, JPA Entity(`@Entity`) 등을 사용하여 CRUD 기능을 완벽히 지원합니다.

### 4.2. 비밀번호 처리 (Password Handling)
*   비밀번호 검증(`Core`)과 설정(`Management`)이 서로 다른 곳에서 일어나므로, **암호화 방식(PasswordEncoder)의 일치**가 필수적입니다.
*   두 서비스 모두 동일한 `BCryptPasswordEncoder` 빈(Bean) 설정을 사용해야 합니다.

### 4.3. 코드 중복에 대한 관점
*   단순 필드(변수) 선언이 겹치는 것은 중복이 아니라 **각각의 모델 정의**로 보아야 합니다.
*   단, **핵심 로직**(예: 패스워드 정책 검증 로직)이 양쪽에 똑같이 복사되어 있다면, 이는 유틸리티 클래스 등으로 공통화하여 `Core-lib`에 두는 것이 좋습니다.

---

## 5. 결론 (Conclusion)

현재의 "이중 관리" 구조는 시스템의 **유연성**과 **확장성**을 위한 올바른 아키텍처입니다.

*   `Core`는 보안에 집중하고,
*   `Management`는 비즈니스에 집중합니다.

이를 무리하게 하나로 합치기보다는, 각자의 역할에 충실하도록 현재 구조를 유지하는 것을 권장합니다.

---

## 6. 매퍼(Mapper) XML 분리에 대한 제언 (Regarding Mapper XML Separation)

### 6.1. 분리 필요성
질문하신 `/mybatis/auth/UserMapper.xml`과 `/mybatis/common/ComUserMapper.xml` 역시 **분리하여 관리**하는 것이 바람직합니다.

### 6.2. 이유 (Reasons)
1.  **ResultType 불일치**:
    *   MyBatis XML은 SQL 실행 결과를 담을 자바 객체(`resultType`)를 정확히 명시해야 합니다.
    *   `UserMapper.xml`은 `AuthUser` 객체에 매핑되고, `ComUserMapper.xml`은 `ComUser` 객체에 매핑됩니다.
    *   자바 객체가 분리되어 있으므로, 이를 처리하는 XML 매퍼도 분리되는 것이 자연스럽습니다.

2.  **쿼리 성격의 차이**:
    *   **Auth Mapper**: 인증 처리를 위한 가볍고 빠른 쿼리 (단건 조회, 비밀번호 확인 등) 위주입니다.
    *   **Common Mapper**: 관리자 기능을 위한 무겁고 복잡한 쿼리 (검색 필터, 페이징, 동적 정렬, 대량 데이터 조회 등) 위주입니다.
    *   억지로 합칠 경우 파일이 비대해지고 유지보수가 어려워집니다.

3.  **결론**:
    *   테이블은 하나지만, 이를 바라보는 "관점"이 다르므로 매퍼 파일도 분리하는 것이 시스템의 유연성을 높여줍니다.

