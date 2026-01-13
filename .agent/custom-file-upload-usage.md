---
description: customCreateFileUpload 사용 가이드
---

# customCreateFileUpload 기능 가이드

## 📋 개요

`customCreateFileUpload` 기능은 파일 업로드 팝업을 띄우고, 사용자가 선택한 파일의 정보를 **서버에 업로드하지 않고** Promise로 반환하는 기능입니다.

## ✨ 주요 특징

1. **서버 업로드 없음**: 파일을 서버에 업로드하지 않고 파일 정보만 반환
2. **드래그 앤 드롭 지원**: 파일 선택창 또는 드래그 앤 드롭으로 파일 선택 가능
3. **파일 유효성 검사**: 파일 크기, 개수, 중복 체크 자동 수행
4. **다양한 옵션**: 단일/다중 파일, 파일 타입 제한, 최대 크기 설정 등
5. **Promise 기반**: async/await 또는 .then() 체인으로 사용 가능

## 🎯 사용법

### 기본 사용 (다중 파일 선택)

```javascript
// 기본 사용 - 다중 파일 선택
fileUtil.customCreateFileUpload()
    .then(files => {
        console.log('선택된 파일 정보:', files);
        // files는 배열로 반환됨
        files.forEach(fileInfo => {
            console.log('파일명:', fileInfo.file_name);
            console.log('확장자:', fileInfo.file_extension);
            console.log('크기:', fileInfo.file_size_formatted);
        });
    })
    .catch(error => {
        console.log('파일 선택 취소:', error.message);
    });
```

### 단일 파일 선택

```javascript
// 단일 파일만 선택
fileUtil.customCreateFileUpload({ 
    multiple: false 
})
.then(files => {
    const file = files[0]; // 단일 파일이므로 첫 번째 요소만 사용
    console.log('선택된 파일:', file.file_name_with_ext);
})
.catch(error => {
    console.log('취소됨');
});
```

### 이미지만 선택 (파일 타입 제한)

```javascript
// 이미지 파일만 선택 가능
fileUtil.customCreateFileUpload({ 
    multiple: true,
    accept: 'image/*' // 이미지만 허용
})
.then(files => {
    files.forEach(file => {
        console.log('이미지 파일:', file.file_name_with_ext);
        console.log('MIME 타입:', file.file_type);
    });
});
```

### Excel/PDF 파일만 선택

```javascript
// Excel 또는 PDF 파일만 선택
fileUtil.customCreateFileUpload({ 
    multiple: false,
    accept: '.xlsx,.xls,.pdf'
})
.then(files => {
    const file = files[0];
    console.log('선택된 문서:', file.file_name_with_ext);
});
```

### 최대 크기 제한

```javascript
// 최대 5MB 크기 제한
fileUtil.customCreateFileUpload({ 
    maxSize: 5 * 1024 * 1024, // 5MB (바이트 단위)
    maxFiles: 5 // 최대 5개 파일
})
.then(files => {
    console.log(`${files.length}개 파일 선택됨`);
});
```

### async/await 사용

```javascript
async function uploadFiles() {
    try {
        const files = await fileUtil.customCreateFileUpload({
            multiple: true,
            accept: 'image/*',
            maxSize: 10 * 1024 * 1024 // 10MB
        });
        
        console.log('선택된 파일들:', files);
        
        // 파일 정보를 사용하여 추가 작업 수행
        for (let fileInfo of files) {
            // FormData에 추가하거나 다른 처리 수행
            console.log(fileInfo.file_name_with_ext);
        }
    } catch (error) {
        console.log('파일 선택이 취소되었습니다.');
    }
}

uploadFiles();
```

### FormData로 서버에 직접 업로드

```javascript
// 파일 선택 후 직접 서버에 업로드
fileUtil.customCreateFileUpload({ multiple: true })
    .then(async (files) => {
        const formData = new FormData();
        
        // 선택된 파일들을 FormData에 추가
        files.forEach(fileInfo => {
            formData.append('files', fileInfo.file);
        });
        
        // 추가 정보도 함께 전송 가능
        formData.append('uploadPath', '/custom/path');
        
        // 서버에 업로드
        const response = await axios.post('/api/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        console.log('업로드 성공:', response.data);
    })
    .catch(error => {
        console.log('취소됨');
    });
```

## 📦 옵션 (Options)

| 옵션 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `multiple` | Boolean | `true` | 다중 파일 선택 허용 여부 |
| `accept` | String | `'*/*'` | 허용할 파일 타입 (MIME 타입 또는 확장자) |
| `maxSize` | Number | `10485760` | 파일당 최대 크기 (바이트 단위, 기본 10MB) |
| `maxFiles` | Number | `10` | 최대 선택 가능 파일 개수 |

### accept 옵션 예시

```javascript
// 이미지만
accept: 'image/*'

// 특정 이미지 타입만
accept: 'image/png,image/jpeg'

// 문서 파일 (확장자 기반)
accept: '.pdf,.doc,.docx,.hwp'

// Excel 파일
accept: '.xlsx,.xls,.csv'

// 모든 파일
accept: '*/*'
```

## 📤 반환되는 파일 정보

각 파일에 대해 다음 정보가 포함된 객체 배열로 반환됩니다:

```javascript
{
    file: File,                    // 원본 File 객체 (FormData에 추가 시 사용)
    file_name: "document",         // 파일명 (확장자 제외)
    file_name_with_ext: "document.pdf", // 파일명 (확장자 포함)
    file_size: 1048576,           // 파일 크기 (바이트)
    file_size_formatted: "1 MB",  // 포맷된 파일 크기
    file_extension: "pdf",        // 파일 확장자
    file_type: "application/pdf", // MIME 타입
    last_modified: 1641234567890  // 마지막 수정 시간 (타임스탬프)
}
```

## 🔍 실전 예제

### 예제 1: 프로필 이미지 등록

```javascript
$("#profile-upload-btn").click(async function() {
    try {
        const files = await fileUtil.customCreateFileUpload({
            multiple: false,
            accept: 'image/*',
            maxSize: 5 * 1024 * 1024 // 5MB
        });
        
        const imageFile = files[0];
        
        // 미리보기 표시
        const reader = new FileReader();
        reader.onload = function(e) {
            $("#profile-preview").attr('src', e.target.result);
        };
        reader.readAsDataURL(imageFile.file);
        
        // 서버에 업로드
        const formData = new FormData();
        formData.append('profile_image', imageFile.file);
        
        await axios.post('/api/profile/upload', formData);
        formUtil.toast("프로필 이미지가 업데이트되었습니다.", "success");
        
    } catch (error) {
        console.log("이미지 선택 취소");
    }
});
```

### 예제 2: 다중 문서 업로드

```javascript
$("#document-upload-btn").click(async function() {
    try {
        const files = await fileUtil.customCreateFileUpload({
            multiple: true,
            accept: '.pdf,.doc,.docx,.hwp',
            maxSize: 20 * 1024 * 1024, // 20MB
            maxFiles: 5
        });
        
        console.log(`${files.length}개의 문서가 선택되었습니다.`);
        
        // 파일 목록 화면에 표시
        let fileListHtml = '';
        files.forEach(file => {
            fileListHtml += `
                <div class="file-item">
                    <span>${file.file_name_with_ext}</span>
                    <span>${file.file_size_formatted}</span>
                </div>
            `;
        });
        $("#file-list").html(fileListHtml);
        
        // 서버에 업로드
        const formData = new FormData();
        files.forEach(file => {
            formData.append('documents', file.file);
        });
        
        await axios.post('/api/documents/upload', formData);
        formUtil.toast("문서가 업로드되었습니다.", "success");
        
    } catch (error) {
        console.log("문서 선택 취소");
    }
});
```

### 예제 3: Excel 파일 읽기 (업로드 없이)

```javascript
$("#excel-import-btn").click(async function() {
    try {
        const files = await fileUtil.customCreateFileUpload({
            multiple: false,
            accept: '.xlsx,.xls'
        });
        
        const excelFile = files[0];
        
        // FileReader로 Excel 파일 읽기
        const reader = new FileReader();
        reader.onload = function(e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, {type: 'array'});
            
            // 첫 번째 시트 데이터 읽기
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet);
            
            console.log('Excel 데이터:', jsonData);
            // 읽은 데이터로 작업 수행
        };
        reader.readAsArrayBuffer(excelFile.file);
        
    } catch (error) {
        console.log("Excel 파일 선택 취소");
    }
});
```

## ⚠️ 주의사항

1. **파일 객체 사용**: 실제 서버 업로드 시에는 `fileInfo.file` (원본 File 객체)를 사용해야 합니다.
2. **취소 처리**: 사용자가 취소 버튼을 클릭하면 Promise가 reject되므로 catch로 처리해야 합니다.
3. **브라우저 호환성**: File API를 지원하는 모던 브라우저에서만 동작합니다.
4. **메모리 관리**: 큰 파일을 다룰 때는 메모리 사용에 주의하세요.

## 🆚 기존 createFileUpload와의 차이점

| 특징 | createFileUpload | customCreateFileUpload |
|------|------------------|------------------------|
| 서버 업로드 | 자동 업로드 | 업로드 없음 |
| 반환 값 | 없음 (UUID를 input에 설정) | Promise로 파일 정보 반환 |
| 사용 방식 | 콜백 기반 | Promise 기반 |
| 유연성 | 고정된 플로우 | 자유로운 처리 가능 |
| 적합한 상황 | 표준 파일 업로드 | 커스텀 처리가 필요한 경우 |

## 📚 더 알아보기

- 기존 파일 업로드: `fileUtil.createFileUpload(PATH, ID, FOLDER_NAME)`
- FormData API: [MDN FormData](https://developer.mozilla.org/ko/docs/Web/API/FormData)
- File API: [MDN File](https://developer.mozilla.org/ko/docs/Web/API/File)
