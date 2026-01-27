## @title : 페이지 내 파일 첨부 카드 (Data Attribute 컴포넌트) 가이드
## @date : 2026-01-27
## @author : 이경태
## @extend : "vims-login 시스템 레이아웃 참조"
## @call : (Automatic Auto-Init)

**example start**
: 페이지 내에서 파일 첨부 및 목록 표시를 위한 표준화된 카드 UI를 **HTML 선언만으로** 자동으로 로드합니다.
: 별도의 컴포넌트 로드 함수(`loadFileCard`) 호출 없이, `data-` 속성만 정의하면 모든 기능(UI 로드, 업로드 초기화, 파일 조회)이 자동으로 동작합니다.

### 1. 기본 사용법 (작성/수정 페이지)
HTML 파일 내 원하는 위치에 `div` 태그를 추가하고 `data-file-card` 속성과 필요한 설정을 입력합니다.

```html
<!-- 파일 첨부 영역 -->
<div id="file-section"
     data-file-card
     data-input-id="board_file_uuid"       <!-- UUID가 저장될 Input의 ID -->
     data-folder-name="bbsFolder"          <!-- 파일이 저장될 FMS 폴더명 -->
     data-api-path="/fms/common/file/sysFileDetail" <!-- 파일 API 경로 -->
     data-read-only="false">               <!-- 업로드 가능 모드 -->
</div>
```
- **초기화**: 페이지 로드 시 `PageInit`이 자동으로 이 요소를 감지하여 UI와 업로드 기능을 활성화합니다.
- **데이터 저장**: 업로드 완료 시 `data-input-id`로 지정한 Input 필드에 UUID가 자동으로 입력됩니다.

---

### 2. 읽기 전용 / 상세 페이지 (파일 뷰어)
상세 페이지에서 이미 저장된 파일 목록을 보여줄 때 사용합니다. API로 데이터를 조회한 후 **JS에서 UUID를 바인딩**해줘야 합니다.

**HTML:**
```html
<div id="detail-file-section"
     data-file-card
     data-input-id="board_file_uuid"
     data-read-only="true"> <!-- 읽기 전용 (업로드 버튼 미노출) -->
</div>
```

**JavaScript:**
```javascript
// 데이터 조회 후 UUID 바인딩
axios.post("/api/board/find", { ... }).then(response => {
    let data = response.data;
    
    if (data.file_uuid) {
        // [중요] 동적으로 UUID를 연결하여 파일 목록 자동 렌더링
        fileUtil.bindFileUuid("detail-file-section", data.file_uuid);
    }
});
```

---

### 3. 조건부 활성화 (숨김 처리 후 나중에 표시)
특정 조건(예: 설정값)에 따라 나중에 파일 첨부 영역을 보여줘야 할 경우 사용합니다.

**HTML:**
```html
<!-- 초기 상태: hidden (gi-hidden 클래스 추가) -->
<div id="conditional-file-section" class="gi-hidden"
     data-file-card
     data-input-id="board_file_uuid"
     data-folder-name="bbsFolder"
     data-read-only="false">
</div>
```

**JavaScript:**
```javascript
// 조건 충족 시 수동 활성화
if (config.file_yn === 'Y') {
    fileUtil.activateFileCard("conditional-file-section");
}
```

---

### 4. 속성(Attribute) 참조

| 속성명 | 설명 | 기본값 | 필수 여부 |
| :--- | :--- | :--- | :--- |
| `data-file-card` | 이 요소가 파일 컴포넌트임을 명시 | - | **필수** |
| `id` | 컴포넌트 컨테이너의 고유 ID | - | **필수** (JS 제어용) |
| `data-input-id` | 업로드된 UUID를 저장할 `<input>`의 ID | `file_uuid` | 선택 |
| `data-folder-name` | 파일이 저장될 물리적/논리적 폴더명 | `commonFolder` | 선택 |
| `data-api-path` | 파일 상세 정보를 처리할 API URL | `/fms/common/file/sysFileDetail` | 선택 |
| `data-read-only` | `true`: 업로드 불가(뷰어 모드), `false`: 업로드 가능 | `false` | 선택 |

**example end**
