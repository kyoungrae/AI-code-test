# CommonTag UI 시스템 개요 (CommonTag UI System Overview)

## 1. 개요 (Overview)
`CommonTag`는 웹 어플리케이션의 UI 입력 폼(Input, Select, Datepicker 등)의 동작, 스타일링(Focus/Blur), 유효성 검증(Validation), 그리고 커스텀 컴포넌트를 총괄하는 공통 모듈입니다.
기존의 단일 파일(`CommonTag.js`) 구조에서 유지보수성과 확장성을 위해 기능별로 세분화된 모듈 파일로 분리(Refactoring)되었습니다.

## 2. 파일 구성 및 역할 (File Structure & Roles)

모든 파일은 `/common/js/common/utils/` 경로(기본 `CommonTag.js` 제외)에 위치하며, `CommonTag` 프로토타입을 확장하거나 독립적인 클래스를 제공합니다.

| 파일명 (File Name) | 역할 (Role) | 주요 클래스/메서드 |
| :--- | :--- | :--- |
| **CommonTag.js** | **베이스 클래스 정의** | `CommonTag` (기본 생성자) |
| **InputTagUtils.js** | **입력 필드 기본 동작** | `inputTagFocus`, `tagDisabled`, `inputTagReset` <br> Focus/Blur 시 스타일 변경 및 Disabled 처리 |
| **InputMaskUtils.js** | **입력 값 마스킹** | `checkPriceType` (금액 콤마), `checkInputOnlyType` (숫자만) <br> 사용자 입력 시 실시간 포맷팅 |
| **SelectTagUtils.js** | **커스텀 SelectBox** | `GiSelectBox` (공통코드 연동), `GiSelectBoxCustom`, `GiSelectBoxYear` <br> `input[gi-selectbox]`를 커스텀 드롭다운으로 변환 |
| **DateTagUtils.js** | **날짜 선택기** | `GiDatePicker`, `defaultToday` <br> `input[data-datepicker]`에 달력 팝업 연결 |
| **AddressTagUtils.js** | **주소 검색** | `GiAddress` <br> Daum Postcode API 연동 주소 검색 팝업 |
| **TagValidationUtils.js** | **유효성 검증** | `GiFormatCheck`, `GiResidentNumber`, `GiCorporateNumber` <br> 주민/법인번호, 이메일, 전화번호 등 형식 검증 |
| **SliderUtils.js** | **슬라이더 컴포넌트** | `GiSlider` <br> 이미지/컨텐츠 슬라이드 기능 제공 |

## 3. 구동 및 실행 흐름 (Execution Flow)

### 3.1. 스크립트 로드 (Script Loading)
`home.html` 및 `login.html`에서 다음과 같은 순서로 스크립트가 로드됩니다. 의존성에 따라 **Base Class -> Utils Modules** 순서를 준수합니다.

1.  `CommonTag.js` (Base Class 선언)
2.  `InputTagUtils.js`, `SelectTagUtils.js` 등 모듈 파일 (Prototype 확장 및 클래스 정의)
3.  `Common.js` (인스턴스 생성 및 초기화)

### 3.2. 초기화 (Initialization)
페이지 로딩 완료(`$(document).ready` 등) 시점에 `Common.js` 또는 `PageInit` 함수 내에서 다음과 같이 초기화됩니다.

1.  **인스턴스 생성**: `var commonTag = new CommonTag();`
2.  **컴포넌트 바인딩**: 각 Utility 클래스의 생성자가 호출되며 HTML 속성(`gi-*`)을 가진 요소를 찾아 기능을 주입합니다.
    *   `new GiSelectBox()`: `input[gi-selectbox]` 요소를 찾아 드롭다운으로 변환.
    *   `new GiDatePicker()`: 날짜 입력 필드에 이벤트 리스너 등록.
    *   `new GiFormatCheck()`: 입력 포맷 검증 로직 연결.

### 3.3. 이벤트 처리 흐름 (Event Handling Flow)

*   **Input Focus/Blur**:
    *   사용자가 `input`에 포커스 -> `InputTagUtils.js`의 `giInputFocusHandlerEvent` 발생 -> 부모 컨테이너(`gi-input-container`) 스타일 변경 (Highlight).
*   **Validation Check**:
    *   사용자가 키 입력(Keyup/Blur) -> `TagValidationUtils.js`의 `giFormatCheckKeyupHandlerEvent` 발생 -> 정규식 검증 -> 성공/실패 여부에 따라 우측 아이콘(Check/Fail) 토글.
*   **SelectBox Interaction**:
    *   사용자가 SelectBox 클릭 -> `SelectTagUtils.js`의 `toggleSelectBox` 실행 -> 드롭다운 리스트 표시 -> 항목 선택 시 해당 값 바인딩 및 UI 업데이트.

## 4. 주요 속성 가이드 (Key Attributes Guide)

HTML 태그에 아래 속성을 추가하여 기능을 활성화합니다.

*   `gi-selectbox`: 공통코드 그룹 ID와 연동하여 SelectBox 생성.
*   `data-datepicker`: 클릭 시 달력 팝업 활성화.
*   `gi-format-check="{type}"`: 입력 값 형식 검증 (예: `number`, `email`, `phone_number`).
*   `gi-residentnumber`: 주민등록번호 포맷팅 및 유효성 검증.
*   `gi-address`: 주소 검색 팝업 버튼 연결.
*   `inputPriceWithComma`: 입력 시 자동으로 천단위 콤마(,) 추가.

---
**작성일**: 2026-01-02
**작성자**: 이경태
