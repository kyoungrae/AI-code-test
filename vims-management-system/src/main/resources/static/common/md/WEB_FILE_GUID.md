## @title : 스마트 파일 첨부 컴포넌트 (Zero-Code) 가이드
## @date : 2026-01-27
## @author : Antigravity (AI)
## @description : HTML 속성 정의만으로 모든 파일 기능(업로드, 리스트, 다운로드, 삭제)을 자동화합니다.
**example start**
---

### [ 핵심 로직 ]
- **HTML:** `data-file-card` 속성을 가진 `div`를 선언하면 페이지 로드 시 자동으로 초기화됩니다.
- **JS 연동:** UUID가 저장된 Input의 값이 변하면 파일 목록도 자동으로 갱신됩니다.

---

### 1. 📝 게시글 등록 (Registration)
등록 페이지에서는 별도의 JavaScript 코드 없이 **HTML만 선언**하세요. 업로드 버튼과 업로드 팝업이 자동으로 활성화됩니다.

```html
<!-- 작성 페이지 파일 첨부 영역 -->
<div id="registration-file-section" 
     data-file-card 
     data-input-id="board_file_uuid" 
     data-folder-name="bbs_attachments">
</div>

<!-- UUID가 자동 저장될 hidden input (PageInit에 의해 필드 바인딩됨) -->
<input type="hidden" id="board_file_uuid" name="file_uuid" data-field="file_uuid">
```

---

### 2. 🔍 게시글 상세 (Detail)
상세 페이지에서는 `data-read-only="true"`를 설정하고, 서버에서 데이터를 받아온 후 **UUID를 바인딩**해줍니다.

**HTML:**
```html
<div id="detail-file-section" 
     data-file-card 
     data-input-id="board_file_uuid" 
     data-read-only="true">
</div>
```

**JavaScript:**
```javascript
async function dataSetting() {
    // 1. 서버에서 게시글 데이터 조회
    const response = await axios.post("/api/find", { board_id: id });
    const data = response.data[0];

    // 2. 파일 UUID 바인딩 (컴포넌트가 자동으로 목록을 호출합니다)
    if (data.file_uuid) {
        await fileUtil.bindFileUuid("detail-file-section", data.file_uuid);
    }
}
```

---

### 3. 🛠️ 게시글 수정 (Modification)
수정 페이지에서는 기존 파일을 보여주고 새로운 파일을 추가할 수 있습니다. UUID 입력 필드에 값을 넣고 **`change` 이벤트만 발생**시키면 됩니다.

**HTML:**
```html
<div id="modify-file-section" 
     data-file-card 
     data-input-id="board_file_uuid" 
     data-folder-name="bbs_attachments">
</div>
```

**JavaScript:**
```javascript
// 기존 데이터 로드 후
$("#board_file_uuid").val(data.file_uuid).trigger('change');
```
> **Tip:** `trigger('change')` 호출 시 내부적으로 서버 API를 호출하여 기존 파일 목록을 그려줍니다.

---

### 4. ⚙️ 데이터 속성(Data Attributes) 가이드

| 속성명 | 설명 | 비고 |
| :--- | :--- | :--- |
| `data-file-card` | **(필수)** 이 요소가 파일 컴포넌트임을 명시 | - |
| `data-input-id` | UUID를 저장/참조할 `<input>`의 ID | 기본값: `file_uuid` |
| `data-folder-name`| 파일이 업로드될 서버 상의 폴더명 | 기본값: `commonFolder` |
| `data-read-only` | `true`: 상세용 (업로드 버튼 미노출) / `false`: 등록/수정용 | 기본값: `false` |
| `data-api-path` | 파일 정보를 조회할 상세 API 경로 | 기본값: `/fms/common/file/sysFileDetail` |

---

### 5. ✨ 주요 UI/UX 기능
- **통합 다운로드:** 상세 및 수정 페이지에서 파일 오른쪽 끝의 **`↓` (파란색 버튼)**을 클릭하여 즉시 다운로드 가능.
- **스마트 삭제:** 수정 모드에서 **`×` (빨간색 버튼)** 클릭 시 FMS 서버와 연동하여 실시간 삭제 처리.
- **모던 애니메이션:** 각 버튼에 마우스를 올릴 때만 입체감 있는 호버 효과(`translateY`, `box-shadow`) 적용.
- **파일 타입 아이콘:** 확장자별(PDF, Excel, 이미지 등) 자동 아이콘 배지 제공.
**example end**