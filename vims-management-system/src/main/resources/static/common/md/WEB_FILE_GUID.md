## @title : 페이지 내 파일 첨부 카드 (컴포넌트) 가이드
## @date : 2026-01-27
## @author : 이경태
## @extend : "vims-login 시스템 레이아웃 참조"
## @call : fileUtil.loadFileCard(containerId, options) / fileUtil.createFileUpload(...)

**example start**
: 페이지 내에서 파일 첨부 및 목록 표시를 위한 표준화된 카드 UI를 동적으로 로드하고 기능을 연결합니다.
: 공통 레이아웃(`layout/file`)을 사용하여 UI 일관성을 유지하며, 작성/수정 모드와 읽기 전용 모드를 지원합니다.

### 1. HTML 설정 (Placeholder)
파일 카드가 삽입될 위치에 비어있는 `div` 요소를 정의합니다.
```html
<!-- 파일 첨부 영역 -->
<div id="file-attachment-section" class="gi-article-content gi-margin-top-40px"></div>
```

### 2. JavaScript 초기화 (loadFileCard)
- `async/await`를 사용하여 컴포넌트 HTML을 비동기로 로드합니다.
- `options` 객체를 통해 입력 필드의 `id`와 읽기 전용 여부를 설정할 수 있습니다.

```javascript
async function init() {
    new PageInit();
    
    // [선택 사항] 추가 필드 초기화 (예: 셀렉트 박스)
    // input.setSelectOption("#category", ...);

    // 1) 파일 첨부 카드 컴포넌트 로드
    await fileUtil.loadFileCard("file-attachment-section", { 
        inputId: "board_file_uuid", // [선택] UUID가 저장될 input ID (기본값: 'file_uuid')
        isReadOnly: false          // [선택] 읽기 전용 여부 (true/false, 기본값: false)
    });

    // 2) 파일 업로드 기능 및 이벤트 연결 (isReadOnly가 false일 때만 권장)
    if (!isReadOnly) {
        // fileUtil.createFileUpload(fileApiUrl, receiveInputId, folderName)
        fileUtil.createFileUpload("/fms/common/file/sysFileDetail", "board_file_uuid", "bbsFolder");
    }
}
```

### 3. 상세(상세/읽기전용) 모드 활용
- `isReadOnly: true` 옵션을 사용하면 업로드 버튼이 사라지고, 단순히 첨부된 파일 목록을 보여주는 용도로 최적화됩니다.
- 상세 페이지에서는 데이터 로드 후 별도의 렌더링 함수를 통해 목록을 그려줘야 합니다.

```javascript
// 상세 페이지 예시
async function init() {
    new PageInit();
    
    // 읽기 전용 카드로 초기화
    await fileUtil.loadFileCard("detail-file-section", { 
        inputId: "board_file_uuid", 
        isReadOnly: true 
    });
    
    fetchData(); // 데이터 조회 및 파일 렌더링 호출
}

function renderFiles(fileList) {
    // 공통 ID인 #attached-file-list를 타겟으로 HTML 렌더링
    let html = '';
    fileList.forEach(file => {
        html += `<div class="file-item">${file.file_name}</div>`;
    });
    $("#attached-file-list").html(html);
}
```

### 3. 주요 파라미터 및 옵션 설명

#### `loadFileCard(containerId, options)`
| 항목 | 설명 | 기본값 |
| :--- | :--- | :--- |
| `containerId` | HTML 내 Placeholder `div`의 ID | - |
| `options.inputId` | 서버로 전송될 UUID 값을 담는 Hidden Input의 ID | `file_uuid` |
| `options.isReadOnly` | true 시 '파일 업로드' 버튼이 제거되고 안내 문구가 상세용으로 변경됨 | `false` |

#### `createFileUpload(PATH, ID_TO_RECEIVE_VALUE, FOLDER_NAME)`
| 항목 | 설명 |
| :--- | :--- |
| `PATH` | 업로드 상세 정보를 처리할 API 경로 (예: `/fms/common/file/sysFileDetail`) |
| `ID_TO_RECEIVE_VALUE` | 업로드 완료 후 반환된 UUID 값을 저장할 Input 요소의 ID |
| `FOLDER_NAME` | 파일이 저장될 물리적/논리적 폴더 명칭 (FMS 관리 기준) |

### 4. 주의사항
- **순서**: `loadFileCard`는 반드시 `await`로 호출해야 합니다. UI가 완전히 그려진 후에 데이터 바인딩이나 `createFileUpload` 기능이 동작할 수 있습니다.
- **다국어**: 모든 텍스트는 `Message.Label.Array` 시스템을 통해 관리되므로, 새 페이지 적용 시 해당 레이블이 정의되어 있는지 확인하십시오.
- **데이터 바인딩**: 상세 페이지 등에서 기존 데이터(UUID)를 주입할 때는 `loadFileCard` 이후에 수행해야 합니다.

**example end**
