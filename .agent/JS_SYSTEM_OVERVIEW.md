# JS 시스템 구조 및 흐름

## 1. 시스템 개요
본 시스템은 **Facade 패턴**을 적용하여 `FormUtility` 클래스를 통해 다양한 서브 시스템(그리드, 파일, 포맷, 유효성 검사 등)을 통합 관리합니다.  
모든 유틸리티 기능은 전역 객체인 `formUtil`을 통해 접근 가능하며, 기능별로 파일이 모듈화되어 유지보수성을 높였습니다.

---

## 2. 파일 구성 및 역할

### 2.1 Core (Facade)
- **`FormUtility.js`**
    - 시스템의 핵심 클래스(`FormUtility`) 정의.
    - 초기화 로직 및 공통적으로 사용되는 기본 유틸리티 기능 포함.
    - 다른 유틸리티 모듈들이 이 클래스의 `prototype`을 확장하여 기능을 추가함.

### 2.2 Modules (`utils/*.js`)
`FormUtility.js` 로드 후 로드되며, `FormUtility.prototype`에 기능을 주입합니다.
- **`GridUtils.js`**: 그리드 생성(`giGrid`), 계층형 그리드(`giGridHierarchy`), 데이터 바인딩 처리.
- **`FileUtils.js`**: 파일 업로드(`file` 클래스), 다운로드, 드래그 앤 드롭, 이미지 프리뷰 기능.
- **`PageUtils.js`**: 페이지 이동(`apiLoadContent`), 애니메이션, 타이틀 설정 등.
- **`FormatUtils.js`**: 날짜, 숫자, 전화번호 등 데이터 포맷팅.
- **`ValidationUtils.js`**: 필수값 체크, 데이터 정합성 검사.
- **`CommonUtils.js`**: 공통 코드 조회(`findComCode`), 전역 변수 설정 등.
- **`PopupUtils.js`**: 팝업 생성 및 관리.
- **`CalendarUtils.js`, `ChartUtils.js`, `TabUtils.js`, `KeyPadUtils.js`**: 각 기능별 전용 유틸리티.
- **`GridSortManager.js`**: 그리드 정렬 상태 관리 (LocalStorage 활용).

### 2.3 Global & UI handlers
- **`Common.js`**
    - `PageInit`: 페이지 로드 시 최초 실행되어야 할 이벤트 및 설정(UI 초기화) 담당.
    - `session`: `sessionStorage` 래퍼 클래스.
    - `dataBinding`: 데이터 조회 및 폼 필드 자동 매핑.
    - `popup`: 공통 팝업 로직.
- **`CommonTag.js`**
    - 커스텀 태그(`gi-input`, `gi-select` 등)의 동작 정의.
    - 포커스 이벤트, 유효성 검사, UI 인터랙션 처리.
    - `GiDatePicker`, `GiAddress`, `GiSelectBox` 등 UI 컴포넌트 클래스 포함.
- **`Api.js`**
    - 카카오 지도(`kakaoMap`) 등 외부 API 연동 스크립트.
- **`DocumentsForm.js`**
    - 특정 폼(예: 휴가신청서)의 Canvas 드로잉 및 동적 처리 로직.

---

## 3. 실행 흐름 (Execution Flow)

### 3.1 초기 로딩 (Home/Login)
1.  **Library Load**: `jQuery`, `Axios` 등 라이브러리 로드.
2.  **Core Load**: `FormUtility.js` 로드 (클래스 정의).
3.  **Module Extension**: `utils/*.js` 파일들이 순차 로드되며 `FormUtility.prototype`에 메서드 추가.
4.  **Global Objects Load**: `Common.js`, `CommonTag.js` 등 로드.
5.  **Instance Creation** (`home.html` 하단 스크립트):
    ```javascript
    let formUtil = new FormUtility(); // Facade 인스턴스
    var commonTag = new CommonTag();  // UI 태그 핸들러
    let fileUtil = new file();        // 파일 처리 인스턴스
    ```
6.  **Layout Init**: 사이드 메뉴, 사용자 정보 조회 등 레이아웃 초기화.

### 3.2 페이지 전환 및 로드
1.  **Menu Click**: 사이드 바 메뉴 클릭.
2.  **API Call**: `formUtil.apiLoadContent(prgmUrl, url, title)` 호출.
3.  **Content Injection**: 서버로부터 HTML 조각(Fragment)을 받아 메인 영역(`#gi-road-content`)에 주입(`innerHTML` / `html()`).
4.  **Injected Script Execution**: 주입된 HTML 내의 `<script>` 태그 실행.
    - 보통 `init()` 함수 내에서 `new PageInit()` 호출.
5.  **Page Initialization**:
    - `PageInit` 생성자 실행 -> `commonTag` 설정(DatePicker, SelectBox 등 초기화).
    - 그리드 초기화 (`formUtil.giGrid`).
    - 이벤트 바인딩.
    - 데이터 조회 (`axios` -> `dataBinding`).

---

## 4. 주요 데이터 흐름
- **공통 코드**: `CommonUtils.js`의 `findComCode`를 통해 서버에서 조회 후 그리드나 셀렉트 박스에 바인딩.
- **파일 업로드**: `fileUtil` 인스턴스(혹은 `createFileUploadHTML` 클래스) 사용 -> Drag & Drop 이벤트 -> `formData` 생성 -> `Axios` 전송.
- **그리드 데이터**: `GridUtils.js`의 `DataSet` 메서드 호출 -> 데이터 렌더링 -> 페이징 및 정렬 처리.

