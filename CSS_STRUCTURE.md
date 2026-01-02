# CSS 파일 구조 정리 - GI Common CSS

## 📂 파일 구조

기존의 거대한 `Common.css` (21,805줄)를 다음과 같이 **17개의 모듈형 파일**로 분리했습니다:

### 🎨 Base Styles
- **Variables.css** (77줄) - CSS 변수 및 기본 설정
  - 폰트 설정
  - 스크롤바 스타일
  - CSS 변수 (색상, 크기, border-radius 등)

- **animation.css** (기존 파일 유지) - 애니메이션 정의

### 🔧 Utility Classes
- **Position.css** (3,209줄) - Position 유틸리티
  - `.gi-position-absolute`, `.gi-position-relative`
  - `.gi-position-top-*`, `.gi-position-bottom-*`
  - `.gi-position-left-*`, `.gi-position-right-*`

- **Spacing.css** (6,843줄) - Padding & Margin 유틸리티
  - `.gi-padding-*`, `.gi-padding-top-*` 등
  - `.gi-margin-*`, `.gi-margin-top-*` 등

- **Typography.css** (121줄) - 폰트 관련 스타일
  - 폰트 크기, 굵기, 정렬 등

### 📐 Layout
- **Grid.css** (3,821줄) - Grid 레이아웃
  - Display Grid 유틸리티
  - CustomGrid 컴포넌트 스타일

- **Flex.css** (97줄) - Flexbox 유틸리티
  - Flex 관련 클래스

- **Layout.css** (4,923줄) - Row & Column 레이아웃
  - 그리드 시스템 (12 column)
  - Row/Col 클래스

### 🎯 Components
- **Button.css** (362줄) - 버튼 스타일
  - 기본 버튼, 아이콘 버튼
  - 다양한 색상 테마 (red, blue, green, yellow 등)

- **Input.css** (404줄) - 입력 폼 스타일
  - Input, Textarea, Select
  - 폼 관련 컴포넌트

- **Tag.css** (98줄) - 태그 스타일

- **CommonComponents.css** (563줄) - 공통 컴포넌트
  - 공통으로 사용되는 UI 요소

- **FormUtility.css** (기존 파일 유지) - 폼 유틸리티

### 📄 Pages & Features
- **Menubar.css** (108줄) - 메뉴바 스타일
- **Login.css** (98줄) - 로그인 페이지
- **Calendar.css** (228줄) - 달력 컴포넌트
- **Chart.css** (6줄) - 차트 스타일
- **Detail.css** (53줄) - 상세 페이지 레이아웃
- **Popup.css** (814줄) - 팝업/모달

## 📦 사용 방법

### HTML에서 import
기존:
```html
<link rel="stylesheet" href="/common/css/common/Common.css">
```

변경 후:
```html
<link rel="stylesheet" href="/common/css/common/index.css">
```

### index.css 구조
`index.css`는 모든 CSS 파일을 import하는 메인 파일입니다:

```css
/* Base Styles */
@import "Variables.css";
@import "animation.css";

/* Utility Classes */
@import "Position.css";
@import "Spacing.css";
@import "Typography.css";

/* Layout */
@import "Grid.css";
@import "Flex.css";
@import "Layout.css";

/* Components */
@import "Button.css";
@import "Input.css";
@import "Tag.css";
@import "CommonComponents.css";

/* Pages & Features */
@import "Menubar.css";
@import "Login.css";
@import "Calendar.css";
@import "Chart.css";
@import "Detail.css";
@import "Popup.css";
```

## ✨ 장점

1. **가독성 향상** - 각 파일이 명확한 목적을 가짐
2. **유지보수 용이** - 수정이 필요한 부분을 쉽게 찾을 수 있음
3. **성능 최적화 가능** - 필요한 파일만 선택적으로 로드 가능
4. **협업 효율성** - 팀원 간 충돌 최소화
5. **모듈화** - 재사용성 향상

## 🔄 기존 파일

- `Common.css` → `Common.css.backup`으로 백업됨
- 언제든지 복원 가능

## 📝 수정된 파일

### vims-login
- `/templates/login/login.html`
- `/templates/layout/home.html`

### vims-management-system
- CSS 파일 없음 (Gateway를 통해 공유)

## 🎯 다음 단계 (선택사항)

필요에 따라 특정 페이지에서는 필요한 CSS만 선택적으로 로드할 수 있습니다:

```html
<!-- 최소한의 스타일만 필요한 경우 -->
<link rel="stylesheet" href="/common/css/common/Variables.css">
<link rel="stylesheet" href="/common/css/common/Button.css">
<link rel="stylesheet" href="/common/css/common/Input.css">
```

이렇게 하면 페이지 로딩 속도를 더 최적화할 수 있습니다.
