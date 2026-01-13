class file {
    constructor() {

    }

    /**
     * @title 파일 업로드
     * @param PATH  upload file path
     * @param ID_TO_RECEIVE_VALUE  id to receive uuid value
     * @param FOLDER_NAME  file upload folder name
     * @text button 태그에 data-file-upload-btn 속성 추가 해야 버튼 활성화 가능
     */
    createFileUpload(PATH, ID_TO_RECEIVE_VALUE, FOLDER_NAME) {
        new createFileUploadHTML(PATH, ID_TO_RECEIVE_VALUE, FOLDER_NAME);
    };
    /**
     * @title : 파일 삭제 기능
     * @text : 파일 업로드 삭제
     */
    deleteFileUpload() {

    };

    /**
     * @title 커스텀 파일 업로드 (서버 업로드 없이 파일 정보만 리턴)
     * @param options {Object} - 옵션 객체 { multiple: true/false, accept: 'image/*', maxSize: 10485760 }
     * @returns {Promise} - 선택된 파일 정보 배열을 반환하는 Promise
     * @description 파일 업로드 팝업을 띄우고 사용자가 선택한 파일 정보를 Promise로 반환합니다.
     * @example 
     * // 단일 파일 선택
     * fileUtil.customCreateFileUpload({ multiple: false }).then(files => console.log(files));
     * // 다중 파일 선택
     * fileUtil.customCreateFileUpload({ multiple: true, accept: 'image/*' }).then(files => console.log(files));
     */
    customCreateFileUpload(options = {}) {
        return new Promise((resolve, reject) => {
            new CustomFileUploadDialog(options, resolve, reject);
        });
    }
}
//CLASS : 파일 업로드 HTML 생성 클래스 파일 업로드 팝업 및 기능 관리 클래스
class createFileUploadHTML {
    constructor(PATH, ID_TO_RECEIVE_VALUE, FOLDER_NAME) {
        this.BTN_ID = $('button[data-file-upload-btn]')
        this.PATH = PATH; //NOTE : COM_FILE 테이블이 아닌 특정 파일 테이블이 있으면 해당 경로 작성
        this.ID_TO_RECEIVE_VALUE = ID_TO_RECEIVE_VALUE;
        this.FOLDER_NAME = FOLDER_NAME;
        this.COMMON_UPLOAD_PATH = "/fms/fileManager/upload";
        this.LIST_CONTAINER_ID = "#attached-file-list"; // 기본 컨테이너 아이디

        this.isCheckParameters();                //NOTE : (1) 파라미터 검증
        this.globalVariable();                   //NOTE : (2) 전역 변수 설정
        this.setUploadHTML();                    //NOTE : (3) 업로드 POPUP UI 설정
        this.fileUploadPopupOpenBtnClickEvent(); //NOTE : (4) 파일 업로드 팝업 OPEN 이벤트
        this.initMainFileListEvent();            //NOTE : (5) 메인 화면 파일 리스트 연동 이벤트
    }
    //CLASS: 파라미터 검증
    isCheckParameters() {
        if (!formUtil.checkEmptyValue(this.BTN_ID)) formUtil.showMessage("please insert BTN_ID value");
        if (!formUtil.checkEmptyValue(this.PATH)) formUtil.showMessage("please insert PATH value");
        if (!formUtil.checkEmptyValue(this.ID_TO_RECEIVE_VALUE)) formUtil.showMessage("please insert ID_TO_RECEIVE_VALUE value");
        if (!formUtil.checkEmptyValue(this.FOLDER_NAME)) formUtil.showMessage("please insert FOLDER_NAME value");
    }
    //CLASS : 전역 변수 설정
    globalVariable() {
        this.ACTIVE_BTN_ID = "";            //NOTE : 파일업로드 버튼 활성화 아이디 (같은 화면에서 두개 이상의 버튼을 생성 할때 사용)
        this.EXISTS_FILE_LIST = [];          //NOTE : 기존 파일 목록
        this.CHANGED_EXISTS_FILE_LIST = [];  //NOTE : 기존 파일 목록 변경 체크
        this.EXISTS_IS_CHANGED = false;
        this.ADDED_FILE_LIST = [];          //NOTE : 신규 추가 파일 목록
        this.TOTAL_FILE_LIST = [];          //NOTE : 기존 + 신규 파일 목록 (화면 목록 처리용)
        this.FINAL_UPLOAD_FILE_LIST = {};   //NOTE : 최종 upload 대상 파일 목록
        this.FILE_TEXT_LIST = [];
        this.CONTENTS = "";
        this.COM_FILE_UPLOAD_ID = "#formUtil_fileUpload"; //NOTE: home.html 내에 있는 파일 업로드용 layout ID
        this.CANCEL_BTN = ".formUtil-fileUpload_cancelBtn";
        this.UPLOAD_BTN = ".formUtil-fileUpload_uploadBtn";
        this.DRAG_N_DROP_INPUT = "#fileElem";
        this.FILE_UPLOAD_LIST_HEADER = ".formUtil-fileUpload_list-contents";
        this.NO_WIDTH = "gi-row-10";
        this.FILE_NAME_WIDTH = "gi-row-50";
        this.FILE_SIZE_WIDTH = "gi-row-15";
        this.FILE_EXTENSION_WIDTH = "gi-row-15";
        this.FILE_DELETE_BTN_WIDTH = "gi-row-10";
    }
    //CLASS :변수 초기화 파일 업로드 취소 버튼 이벤트 할당 및 변수 초기화
    resetVariable() {
        this.EXISTS_FILE_LIST = [];
        this.CHANGED_EXISTS_FILE_LIST = [];
        this.ADDED_FILE_LIST = [];
        this.TOTAL_FILE_LIST = [];
        this.FINAL_UPLOAD_FILE_LIST = {};
    }
    //CLASS : 업로드 팝업 UI 설정
    setUploadHTML() {
        this.CONTENTS =
            '<div class="formUtil-fileUpload_body" data-fileupload-boxopen="on">'
            + '    <div class="gi-row-500px formUtil-fileUpload gi-flex gi-flex-column slide-in-blurred-top gi-upload-popup-card">'
            + '        <div class="gi-flex gi-flex-justify-content-space-between gi-flex-align-items-center" style="margin-bottom: 24px;">'
            + '            <h2 class="gi-upload-popup-title">파일 업로드</h2>'
            + '            <button type="button" class="formUtil-fileUpload_cancelBtn gi-upload-popup-close-btn">&times;</button>'
            + '        </div>'
            + '        <div class="formUtil-fileUploading-section"></div>'
            + '        <article class="formUtil-fileUpload_content" style="margin-bottom: 24px;">'
            + '            <form class="formUtil-fileUpload_form gi-col-100 gi-flex gi-flex-center" style="border: none !important; box-shadow: none !important;">'
            + '                <div class="formUtil-fileUpload_dropArea gi-upload-drop-area">'
            + '                    <input type="file" id="fileElem" style="display: none" multiple enctype="multipart/form-data">'
            + '                    <label for="fileElem" class="gi-cursor-open-folder" style="height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; margin: 0 !important; cursor: pointer;">'
            + '                        <div class="gi-upload-drop-icon">'
            + '                            <span>↑</span>'
            + '                        </div>'
            + '                        <div style="text-align: center;">'
            + '                            <span class="gi-upload-drop-text">파일 클릭 또는 드래그 앤 드롭</span>'
            + '                            <span class="gi-upload-drop-subtext">최대 용량에 유의하여 업로드 해주세요</span>'
            + '                        </div>'
            + '                    </label>'
            + '                </div>'
            + '            </form>'
            + '        </article>'
            + '        <div class="formUtil-fileUpload_list gi-upload-list-wrapper">'
            + '            <div class="formUtil-fileUpload_list-contents gi-file-list-container gi-upload-list-container">'
            + '            </div>'
            + '        </div>'
            + '        <article class="formUtil-fileUpload_footer gi-upload-popup-footer">'
            + '            <button type="button" class="formUtil-fileUpload_cancelBtn gi-upload-btn-cancel">'
            + '                <span>취소</span>'
            + '            </button>'
            + '            <button type="button" class="formUtil-fileUpload_uploadBtn gi-upload-btn-submit">'
            + '                <span>업로드</span>'
            + '            </button>'
            + '        </article>'
            + '    </div>'
            + '</div>';
    }
    //CLASS : 파일 크기 계산 Bytes 단위를 KB, MB 등으로 변환
    formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
    //CLASS : 팝업 오픈 이벤트 바인딩 파일 업로드 POPUP OPEN 시 이벤트 바인딩 목록
    openPopupEventBinding() {
        this.clearFileUploadBody();               //NOTE : 파일 업로드 UI 노출 및 숨김
        this.fileUploadPopupCloseBtnClickEvent(); //NOTE : 파일 업로드 CLOSE 이벤트 (취소)
        this.fileUploadBtnClickEvent();           //NOTE : 파일 업로드
        this.dragAndDropAreaChangeEvent();
    }
    //CLASS : 팝업 UI 노출 및 숨김
    clearFileUploadBody() {
        let isEmpty = $(".fileUpload_body").length === 0;
        let $fileUpload = $(this.COM_FILE_UPLOAD_ID);
        isEmpty ? $fileUpload.append(this.CONTENTS) : $fileUpload.empty();
    }
    //CLASS : 팝업 오픈 버튼 이벤트
    fileUploadPopupOpenBtnClickEvent() {
        let that = this;
        $(this.BTN_ID).off("click").on("click", fileUploadPopupOpenBtnClickEventHandler);

        //NOTE : 팝업 오픈 버튼 이벤트 파일 업로드 POPUP OPEN 시 이벤트 바인딩
        function fileUploadPopupOpenBtnClickEventHandler(e) {
            //NOTE : 파일업로드 버튼 활성화 아이디 (같은 화면에서 두개 이상의 버튼을 생성 할때 사용)
            that.ACTIVE_BTN_ID = "#" + e.currentTarget.id
            that.openPopupEventBinding();
        }
    }
    //CLASS : 닫기 버튼 이벤트 파일 업로드 CLOSE 이벤트 (취소)
    fileUploadPopupCloseBtnClickEvent() {
        let that = this;
        $(this.CANCEL_BTN)
            .off("click.formUtilFileUploadCancelBtnClickEventHandler")
            .on("click.formUtilFileUploadCancelBtnClickEventHandler", formUtilFileUploadCancelBtnClickEventHandler);
        function formUtilFileUploadCancelBtnClickEventHandler() {
            $(that.COM_FILE_UPLOAD_ID).empty();
            that.resetVariable();
        }
    }
    //CLASS : 업로드 버튼 이벤트 파일 최종 업로드 이벤트
    fileUploadBtnClickEvent() {
        let that = this;
        $(that.UPLOAD_BTN)
            .off("click.fileUploadBtnClickEventHandler")
            .on("click.fileUploadBtnClickEventHandler", fileUploadBtnClickEventHandler);
        function fileUploadBtnClickEventHandler() {
            that.comFileUpload();
        }
    }
    //CLASS : 드래그 앤 드롭 영역 이벤트 파일 최종 업로드 이벤트 핸들러 및 리스트 관리
    dragAndDropAreaChangeEvent() {
        let that = this;
        let $dropArea = $(".gi-upload-drop-area");

        // Prevent default drag behaviors
        $dropArea.on('dragenter dragover dragleave drop', function (e) {
            e.preventDefault();
            e.stopPropagation();
        });

        // Add visual feedback
        $dropArea.on('dragenter dragover', function () {
            $(this).addClass('active');
        });

        $dropArea.on('dragleave drop', function () {
            $(this).removeClass('active');
        });

        // Handle dropped files
        $dropArea.on('drop', function (e) {
            let files = e.originalEvent.dataTransfer.files;
            handleFiles(files);
        });

        $(that.DRAG_N_DROP_INPUT)
            .off("change.dragAndDropAreaChangeEventHandler")
            .on("change.dragAndDropAreaChangeEventHandler", function (e) {
                handleFiles(e.target.files);
            });

        // Shared function to handle file adding
        function handleFiles(files) {
            if (!files || files.length === 0) return;

            let fileSettingsList = Array.from(files);

            //NOTE : 기존 파일 목록에 새 파일 추가
            let currentAdded = that.ADDED_FILE_LIST.concat(fileSettingsList);
            //NOTE : 중복된 파일 제거 (이름, 사이즈 기준)
            that.ADDED_FILE_LIST = currentAdded.filter((file, index, self) =>
                index === self.findIndex((f) => f.name === file.name && f.size === file.size)
            );

            //NOTE : 전체 리스트도 업데이트 (ADDED와 동일하게 처리)
            that.TOTAL_FILE_LIST = [...that.ADDED_FILE_LIST];

            //NOTE : 화면에 파일리스트 노출
            showFileList();
        }

        //FUN : 화면에 파일리스트 노출
        function showFileList() {
            let fileSettingsHtml = "";
            if (that.TOTAL_FILE_LIST.length > 0) {
                for (let i = 0; i < that.TOTAL_FILE_LIST.length; i++) {
                    let file = that.TOTAL_FILE_LIST[i];
                    let fileNameWithExt = file.name;
                    let lastDotIndex = fileNameWithExt.lastIndexOf('.');
                    let fileName = lastDotIndex !== -1 ? fileNameWithExt.substring(0, lastDotIndex) : fileNameWithExt;
                    let fileExtension = lastDotIndex !== -1 ? fileNameWithExt.substring(lastDotIndex + 1).toLowerCase() : '';
                    let fileSize = that.formatBytes(file.size);

                    let typeClass = "";
                    if (['pdf', 'hwp', 'doc', 'docx'].includes(fileExtension)) typeClass = "gi-file-type-doc";
                    else if (['xls', 'xlsx', 'csv'].includes(fileExtension)) typeClass = "gi-file-type-xls";
                    else if (['zip', 'rar', '7z'].includes(fileExtension)) typeClass = "gi-file-type-zip";
                    else if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(fileExtension)) typeClass = "gi-file-type-img";

                    fileSettingsHtml += `
                        <div class="gi-file-item-card gi-upload-item-card">
                            <div class="gi-file-badge-no">${i + 1}</div>
                            <div class="gi-file-icon-box ${typeClass}">📄</div>
                            <div class="gi-file-info">
                                <span class="gi-file-name" title="${fileName}">${fileName}</span>
                                <div class="gi-file-meta">
                                    <span class="gi-file-size-tag">${fileSize}</span>
                                    <span class="gi-file-ext-tag ${typeClass}" style="background: none !important;">${fileExtension}</span>
                                </div>
                            </div>
                            <div class="gi-file-delete-container">
                                <button type="button" class="formUtil-file_delete gi-file-delete-btn" data-file-name="${fileNameWithExt}">
                                    <span>&times;</span>
                                </button>
                            </div>
                        </div>
                    `;
                }
            } else {
                fileSettingsHtml = `
                    <div class="gi-file-list-empty">
                        <span class="gi-file-list-empty-icon">📂</span>
                        <p class="gi-file-list-empty-text">선택된 파일이 없습니다.</p>
                    </div>
                `;
            }

            //NOTE : 공통 파일업로드 시 사용할 리스트 생성
            that.FILE_TEXT_LIST = [];
            that.ADDED_FILE_LIST.forEach(file => {
                let fileNameWithExt = file.name;
                let lastDotIndex = fileNameWithExt.lastIndexOf('.');
                let fileName = lastDotIndex !== -1 ? fileNameWithExt.substring(0, lastDotIndex) : fileNameWithExt;
                let fileExtension = lastDotIndex !== -1 ? fileNameWithExt.substring(lastDotIndex + 1).toLowerCase() : '';
                let fileSize = that.formatBytes(file.size);
                let fileDescription = file.file_description || "";
                that.FILE_TEXT_LIST.push({ "file_name": fileName, "file_size": fileSize, "file_extension": fileExtension, "file_description": fileDescription })
            });

            //NOTE : 최종 업로드 파일 리스트
            that.FINAL_UPLOAD_FILE_LIST = that.ADDED_FILE_LIST;

            //NOTE : 파일리스트 화면에 노출
            $(that.FILE_UPLOAD_LIST_HEADER).html(fileSettingsHtml);

            //NOTE : 팝업내에 업로드할 파일 삭제 이벤트
            fileDeleteBtnClickEvent();
        }

        //FUN : 팝업내에 업로드할 파일 삭제 이벤트
        function fileDeleteBtnClickEvent() {
            $(".formUtil-file_delete").off("click.fileDeleteBtnClickEventHandler")
                .on("click.fileDeleteBtnClickEventHandler", fileDeleteBtnClickEventHandler);
        }

        //FUN : 팝업내에 업로드할 파일 삭제 이벤트 핸들러
        function fileDeleteBtnClickEventHandler(e) {
            const $btn = $(e.currentTarget);
            let fileNameWithExt = $btn.data("file-name");

            formUtil.popup("deleteFileBtn", fileNameWithExt + " 파일을 삭제 하시겠습니까?", remove);
            function remove() {
                //NOTE : 최종 파일 리스트에 삭제된 파일 제외하고 업데이트
                that.TOTAL_FILE_LIST = that.TOTAL_FILE_LIST.filter(file => file.name !== fileNameWithExt);
                that.ADDED_FILE_LIST = [...that.TOTAL_FILE_LIST];

                //NOTE : 화면에 파일리스트 노출
                showFileList();
            }
        }
    }
    //CLASS : 공통 파일 업로드 실행
    comFileUpload() {
        let that = this;
        let url = that.COMMON_UPLOAD_PATH;
        let param = new FormData();
        let finalFileEmptyFlag = false;

        //NOTE : 업로드할 파일 존재 하는지 체크
        if (!formUtil.checkObjectEmptyValue(that.FINAL_UPLOAD_FILE_LIST)) {
            formUtil.toast("업로드할 파일이 없습니다.", "error");
            finalFileEmptyFlag = true;
        } else {
            finalFileEmptyFlag = false;
        }
        //NOTE : 공통파일 업로드 수행
        if (!finalFileEmptyFlag) {
            //NOTE : FINAL_UPLOAD_FILE_LIST를 순회하면서 param 객체의 files에 추가
            for (let key in that.FINAL_UPLOAD_FILE_LIST) {
                if (Object.prototype.hasOwnProperty.call(that.FINAL_UPLOAD_FILE_LIST, key)) {
                    //NOTE : 파라미터에 파일 설정
                    param.append('files', that.FINAL_UPLOAD_FILE_LIST[key]);
                }
            }
            //NOTE : 파라미터에 폴더이름 설정
            param.append("folder_name", that.FOLDER_NAME);

            axios.post(url, param, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true  // 쿠키(Authorization)를 포함하여 전송
            }).then(response => {
                if (response.status === 200 && response.data.length > 0) {
                    let fileListData = response.data;
                    let file_uuid = fileListData[0].uuid;

                    //NOTE: 업로드 성공 후 파일 상세 정보 저장 (detail 테이블 insert)
                    let registerUrl = that.PATH + "/register";
                    axios.post(registerUrl, fileListData, {
                        withCredentials: true
                    }).then(regResponse => {
                        //NOTE : 파일을 저장 후 전달 받은 COM_FILE의 FILE_UUID를 설정한 값에 전달
                        $("#" + that.ID_TO_RECEIVE_VALUE).val(file_uuid).trigger('change');

                        // 명시적으로 리스트 갱신 호출 (trigger가 작동하지 않을 경우 대비)
                        that.fetchAndRenderMainFileList(file_uuid);

                        // 추가적인 필드 업데이트 (존재할 경우)
                        if ($("#file_id").length) $("#file_id").val(file_uuid);
                        if ($("#uuid").length) $("#uuid").val(file_uuid);

                        //NOTE : 파일업로드 팝업 초기화 및 변수 초기화
                        $("#formUtil_fileUpload").empty();
                        that.resetVariable();

                        formUtil.toast("File Upload Success", "success");
                    }).catch(error => {
                        console.error("File Detail Registration Error:", error);
                        formUtil.toast("File Upload Error", "error");
                    });
                } else {
                    formUtil.toast("File Upload Error", "error");
                }
            }).catch(error => {
                formUtil.toast("File Upload Error", "error");
            });

        }

    }

    //CLASS : 메인 화면 파일 리스트 연동 이벤트 초기화
    initMainFileListEvent() {
        let that = this;
        let $uuidInput = $("#" + that.ID_TO_RECEIVE_VALUE);

        // UUID 값이 변경될 때마다 리스트 갱신
        $uuidInput.off("change.mainFileList").on("change.mainFileList", function () {
            let uuid = $(this).val();
            if (uuid) {
                that.fetchAndRenderMainFileList(uuid);
            } else {
                let container = '<div class="gi-file-list-empty"> <span class="gi-file-list-empty-icon">📂</span> <p class="gi-file-list-empty-text">첨부된 파일이 없습니다.</p> </div>';
                $(that.LIST_CONTAINER_ID).html(container);
            }
        });

        // 초기 로드시 UUID가 있으면 목록 조회
        if ($uuidInput.val()) {
            $uuidInput.trigger("change");
        }
    }

    //CLASS : 메인 화면 파일 목록 조회 및 렌더링
    fetchAndRenderMainFileList(uuid) {
        let that = this;
        let url = that.PATH + "/find";
        let param = { uuid: uuid };

        axios.post(url, param, { withCredentials: true }).then(response => {
            let files = response.data;
            that.renderMainFileList(files);
        }).catch(error => {
            formUtil.toast("Main file list fetch error:", error);
        });
    }

    //CLASS : 메인 화면 파일 목록 UI 렌더링
    renderMainFileList(files) {
        let that = this;
        let $container = $(that.LIST_CONTAINER_ID);

        if (!files || files.length === 0) {
            $container.html(`
                <div class="gi-file-list-empty">
                    <span class="gi-file-list-empty-icon">📂</span>
                    <p class="gi-file-list-empty-text">첨부된 파일이 없습니다.</p>
                </div>
            `);
            return;
        }

        let html = '<div class="gi-file-list-container">';
        files.forEach((file, index) => {
            const extension = (file.file_extension || '').toLowerCase();
            let typeClass = "";

            if (['pdf', 'hwp', 'doc', 'docx'].includes(extension)) typeClass = "gi-file-type-doc";
            else if (['xls', 'xlsx', 'csv'].includes(extension)) typeClass = "gi-file-type-xls";
            else if (['zip', 'rar', '7z'].includes(extension)) typeClass = "gi-file-type-zip";
            else if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(extension)) typeClass = "gi-file-type-img";

            html += `
                <div class="gi-file-item-card">
                    <div class="gi-file-badge-no">${index + 1}</div>

                    <div class="gi-file-icon-box ${typeClass}">📄</div>

                    <div class="gi-file-info">
                        <span class="gi-file-name" title="${file.file_name}">${file.file_name}</span>
                        <div class="gi-file-meta">
                            <span class="gi-file-size-tag">${that.formatBytes(file.file_size)}</span>
                            <span class="gi-file-ext-tag ${typeClass}" style="background: none;">${extension}</span>
                        </div>
                    </div>

                    <div class="gi-file-delete-container">
                        <button type="button" class="formUtil-file_delete gi-file-delete-btn" 
                            data-file-id="${file.file_id}" data-uuid="${file.uuid}">
                            <span>&times;</span>
                        </button>
                    </div>
                </div>
            `;
        });
        html += '</div>';

        $container.html(html);


        // 삭제 버튼 이벤트 바인딩
        $container.find(".formUtil-file_delete").on("click", function () {
            let fileId = $(this).data("fileId");
            let uuid = $(this).data("uuid");
            that.deleteMainFile(fileId, uuid);
        });
    }

    //CLASS : 메인 화면 개별 파일 삭제
    deleteMainFile(fileId, uuid) {
        let that = this;
        formUtil.popup("delete_file_confirm", "해당 파일을 삭제하시겠습니까?", function () {
            let url = that.PATH + "/removeByFileIdAndUuid";
            let param = { file_id: fileId, uuid: uuid };

            axios.post(url, param, { withCredentials: true }).then(response => {
                if (response.data > 0) {
                    formUtil.toast("파일이 삭제되었습니다.");
                    that.fetchAndRenderMainFileList(uuid);
                }
            }).catch(error => {
                console.error("Main file delete error:", error);
            });
        });
    }
}

//CLASS : 커스텀 파일 업로드 다이얼로그 (서버 업로드 없이 파일 정보만 반환)
class CustomFileUploadDialog {
    constructor(options, resolve, reject) {
        this.options = {
            multiple: options.multiple !== false, // 기본값: true
            accept: options.accept || '*/*',
            maxSize: options.maxSize || 10485760, // 기본값: 10MB
            maxFiles: options.maxFiles || 10
        };
        this.resolve = resolve;
        this.reject = reject;
        this.selectedFiles = [];
        this.COM_FILE_UPLOAD_ID = "#formUtil_fileUpload";

        this.init();
    }

    init() {
        this.renderPopup();
        this.bindEvents();
    }

    renderPopup() {
        const multipleAttr = this.options.multiple ? 'multiple' : '';
        const acceptAttr = this.options.accept;

        const html = `
            <div class="formUtil-fileUpload_body" data-fileupload-boxopen="on">
                <div class="gi-row-500px formUtil-fileUpload gi-flex gi-flex-column slide-in-blurred-top gi-upload-popup-card">
                    <div class="gi-flex gi-flex-justify-content-space-between gi-flex-align-items-center" style="margin-bottom: 24px;">
                        <h2 class="gi-upload-popup-title">파일 선택</h2>
                        <button type="button" class="custom-fileUpload_cancelBtn gi-upload-popup-close-btn">&times;</button>
                    </div>
                    
                    <article class="formUtil-fileUpload_content" style="margin-bottom: 24px;">
                        <form class="formUtil-fileUpload_form gi-col-100 gi-flex gi-flex-center" style="border: none !important; box-shadow: none !important;">
                            <div class="custom-fileUpload_dropArea gi-upload-drop-area">
                                <input type="file" id="customFileElem" ${multipleAttr} accept="${acceptAttr}" style="display: none" enctype="multipart/form-data">
                                <label for="customFileElem" class="gi-cursor-open-folder" style="height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; margin: 0 !important; cursor: pointer;">
                                    <div class="gi-upload-drop-icon">
                                        <span>↑</span>
                                    </div>
                                    <div style="text-align: center;">
                                        <span class="gi-upload-drop-text">파일 클릭 또는 드래그 앤 드롭</span>
                                        <span class="gi-upload-drop-subtext">최대 용량: ${this.formatBytes(this.options.maxSize)}</span>
                                    </div>
                                </label>
                            </div>
                        </form>
                    </article>
                    
                    <div class="custom-fileUpload_list gi-upload-list-wrapper">
                        <div class="custom-fileUpload_list-contents gi-file-list-container gi-upload-list-container">
                            <div class="gi-file-list-empty">
                                <span class="gi-file-list-empty-icon">📂</span>
                                <p class="gi-file-list-empty-text">선택된 파일이 없습니다.</p>
                            </div>
                        </div>
                    </div>
                    
                    <article class="formUtil-fileUpload_footer gi-upload-popup-footer">
                        <button type="button" class="custom-fileUpload_cancelBtn gi-upload-btn-cancel">
                            <span>취소</span>
                        </button>
                        <button type="button" class="custom-fileUpload_confirmBtn gi-upload-btn-submit">
                            <span>확인</span>
                        </button>
                    </article>
                </div>
            </div>
        `;

        $(this.COM_FILE_UPLOAD_ID).html(html);
    }

    bindEvents() {
        const that = this;

        // 취소 버튼
        $(".custom-fileUpload_cancelBtn").on("click", function () {
            that.close();
            that.reject(new Error("User cancelled file upload"));
        });

        // 확인 버튼
        $(".custom-fileUpload_confirmBtn").on("click", function () {
            if (that.selectedFiles.length === 0) {
                formUtil.toast("파일을 선택해주세요.", "warning");
                return;
            }
            that.resolve(that.getFileInfo());
            that.close();
        });

        // 파일 입력 변경 이벤트
        $("#customFileElem").on("change", function (e) {
            that.handleFiles(e.target.files);
        });

        // 드래그 앤 드롭 이벤트
        const $dropArea = $(".custom-fileUpload_dropArea");

        $dropArea.on('dragenter dragover dragleave drop', function (e) {
            e.preventDefault();
            e.stopPropagation();
        });

        $dropArea.on('dragenter dragover', function () {
            $(this).addClass('active');
        });

        $dropArea.on('dragleave drop', function () {
            $(this).removeClass('active');
        });

        $dropArea.on('drop', function (e) {
            const files = e.originalEvent.dataTransfer.files;
            that.handleFiles(files);
        });
    }

    handleFiles(files) {
        if (!files || files.length === 0) return;

        const fileArray = Array.from(files);

        // 파일 개수 체크
        if (!this.options.multiple && fileArray.length > 1) {
            formUtil.toast("단일 파일만 선택 가능합니다.", "warning");
            return;
        }

        if (this.selectedFiles.length + fileArray.length > this.options.maxFiles) {
            formUtil.toast(`최대 ${this.options.maxFiles}개의 파일만 선택 가능합니다.`, "warning");
            return;
        }

        // 파일 유효성 검사
        for (let file of fileArray) {
            // 파일 크기 체크
            if (file.size > this.options.maxSize) {
                formUtil.toast(`${file.name}의 용량이 너무 큽니다. (최대: ${this.formatBytes(this.options.maxSize)})`, "warning");
                continue;
            }

            // 중복 체크
            const isDuplicate = this.selectedFiles.some(f => f.name === file.name && f.size === file.size);
            if (isDuplicate) {
                formUtil.toast(`${file.name}은(는) 이미 선택되었습니다.`, "warning");
                continue;
            }

            this.selectedFiles.push(file);
        }

        this.renderFileList();
    }

    renderFileList() {
        const $container = $(".custom-fileUpload_list-contents");

        if (this.selectedFiles.length === 0) {
            $container.html(`
                <div class="gi-file-list-empty">
                    <span class="gi-file-list-empty-icon">📂</span>
                    <p class="gi-file-list-empty-text">선택된 파일이 없습니다.</p>
                </div>
            `);
            return;
        }

        let html = '';
        this.selectedFiles.forEach((file, index) => {
            const fileName = file.name.substring(0, file.name.lastIndexOf('.'));
            const extension = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
            const fileSize = this.formatBytes(file.size);

            let typeClass = "";
            if (['pdf', 'hwp', 'doc', 'docx'].includes(extension)) typeClass = "gi-file-type-doc";
            else if (['xls', 'xlsx', 'csv'].includes(extension)) typeClass = "gi-file-type-xls";
            else if (['zip', 'rar', '7z'].includes(extension)) typeClass = "gi-file-type-zip";
            else if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(extension)) typeClass = "gi-file-type-img";

            html += `
                <div class="gi-file-item-card gi-upload-item-card">
                    <div class="gi-file-badge-no">${index + 1}</div>
                    <div class="gi-file-icon-box ${typeClass}">📄</div>
                    <div class="gi-file-info">
                        <span class="gi-file-name" title="${fileName}">${fileName}</span>
                        <div class="gi-file-meta">
                            <span class="gi-file-size-tag">${fileSize}</span>
                            <span class="gi-file-ext-tag ${typeClass}" style="background: none !important;">${extension}</span>
                        </div>
                    </div>
                    <div class="gi-file-delete-container">
                        <button type="button" class="custom-file_delete gi-file-delete-btn" data-index="${index}">
                            <span>&times;</span>
                        </button>
                    </div>
                </div>
            `;
        });

        $container.html(html);

        // 삭제 버튼 이벤트
        const that = this;
        $(".custom-file_delete").on("click", function () {
            const index = $(this).data("index");
            that.selectedFiles.splice(index, 1);
            that.renderFileList();
        });
    }

    getFileInfo() {
        return this.selectedFiles.map(file => {
            const fileName = file.name.substring(0, file.name.lastIndexOf('.'));
            const extension = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();

            return {
                file: file,                    // File 객체
                file_name: fileName,           // 파일명 (확장자 제외)
                file_name_with_ext: file.name, // 파일명 (확장자 포함)
                file_size: file.size,          // 바이트 단위
                file_size_formatted: this.formatBytes(file.size), // 포맷된 크기
                file_extension: extension,     // 확장자
                file_type: file.type,          // MIME 타입
                last_modified: file.lastModified // 마지막 수정 시간
            };
        });
    }

    formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    close() {
        $(this.COM_FILE_UPLOAD_ID).empty();
        this.selectedFiles = [];
    }
}