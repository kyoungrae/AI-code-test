class file {
    constructor() {

    }

    /**
     * created by ikyoungtae 2025.9
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
}

/**
 * @title : 파일 업로드 HTML 생성 클래스
 * @text : 파일 업로드 팝업 및 기능 관리 클래스
 */
class createFileUploadHTML {
    constructor(PATH, ID_TO_RECEIVE_VALUE, FOLDER_NAME) {
        this.BTN_ID = $('button[data-file-upload-btn]')
        this.PATH = PATH; //NOTE : COMMON_FILE 테이블이 아닌 특정 파일 테이블이 있으면 해당 경로 작성
        this.ID_TO_RECEIVE_VALUE = ID_TO_RECEIVE_VALUE;
        this.FOLDER_NAME = FOLDER_NAME;
        this.COMMON_UPLOAD_PATH = "/fms/fileManager/upload";

        this.isCheckParameters();                //NOTE : (1) 파라미터 검증
        this.globalVariable();                   //NOTE : (2) 전역 변수 설정
        this.setUploadHTML();                    //NOTE : (3) 업로드 POPUP UI 설정
        this.fileUploadPopupOpenBtnClickEvent(); //NOTE : (4) 파일 업로드 팝업 OPEN 이벤트
    }
    /**
     * @title : 파라미터 검증
     */
    isCheckParameters() {
        if (!formUtil.checkEmptyValue(this.BTN_ID)) formUtil.showMessage("please insert BTN_ID value");
        if (!formUtil.checkEmptyValue(this.PATH)) formUtil.showMessage("please insert PATH value");
        if (!formUtil.checkEmptyValue(this.ID_TO_RECEIVE_VALUE)) formUtil.showMessage("please insert ID_TO_RECEIVE_VALUE value");
        if (!formUtil.checkEmptyValue(this.FOLDER_NAME)) formUtil.showMessage("please insert FOLDER_NAME value");
    }
    /**
     * @title : 전역 변수 설정
     */
    globalVariable() {
        this.ACTIVE_BTN_ID = "";            //NOTE : 파일업로드 버튼 활성화 아이디 (같은 화면에서 두개 이상의 버튼을 생성 할때 사용)
        this.EXISTS_FILE_LIST = [];          //NOTE : 기존 파일 목록
        this.CHANGED_EXISTS_FILE_LIST = [];  //NOTE : 기존 파일 목록 변경 체크
        this.EXISTS_IS_CHANGED = false;
        this.ADDED_FILE_LIST = [];          //NOTE : 신규 추가 파일 목록
        this.TOTAL_FILE_LIST = [];          //NOTE : 기존 + 신규 파일 목록 (화면 목록 처리용)
        this.FINAL_UPLOAD_FILE_LIST = {};   //NOTE : 최종 upload 대상 파일 목록
        this.FILE_TEXT_LIST = [];
        this.CONTENTS = null;
        this.COMMON_FILE_UPLOAD_ID = "#formUtil_fileUpload"; //NOTE: home.html 내에 있는 파일 업로드용 layout ID
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
    /**
     * @title : 변수 초기화
     * @text : 파일 업로드 취소 버튼 이벤트 할당 및 변수 초기화
     */
    resetVariable() {
        this.EXISTS_FILE_LIST = [];
        this.CHANGED_EXISTS_FILE_LIST = [];
        this.ADDED_FILE_LIST = [];
        this.TOTAL_FILE_LIST = [];
        this.FINAL_UPLOAD_FILE_LIST = {};
    }
    /**
     * @title : 업로드 팝업 UI 설정
     */
    setUploadHTML() {
        this.CONTENTS +=
            '<div class="formUtil-fileUpload_body" data-fileupload-boxopen="on">'
            + '    <div class="gi-row-450px formUtil-fileUpload gi-flex gi-flex-column slide-in-blurred-top">'
            + '        <div class="formUtil-fileUploading-section"></div>'
            + '        <article class="gi-col-100px formUtil-fileUpload_content">'
            + '            <form class="formUtil-fileUpload_form gi-col-100 gi-flex gi-flex-center">'
            + '                <div class="formUtil-fileUpload_dropArea">'
            + '                    <input type="file" id="fileElem" style="display: none" multiple enctype="multipart/form-data">'
            + '                    <label for="fileElem" class="gi-cursor-open-folder">'
            + '                        <div class="formUtil-fileUpload_span-body">'
            + '                            <div class="formUtil-fileUpload_img formUtil-fileUpload_span"></div>'
            + '                            <span class="formUtil-fileUpload_span">FILE UPLOAD CLICK</span>'
            + '                            <span class="formUtil-fileUpload_span">[Drag And Drop]</span>'
            + '                        </div>'
            + '                    </label>'
            + '                </div>'
            + '            </form>'
            + '        </article>'
            + '        <div class="formUtil-fileUpload_list">'
            + '            <div class="formUtil-fileUpload_list-contents">'
            + '            </div>'
            + '        </div>'
            + '        <article class="formUtil-fileUpload_footer">'
            + '            <button class="formUtil-fileUpload_uploadBtn">'
            + '                <span>업로드</span>'
            + '                <span></span>'
            + '            </button>'
            + '            <button class="formUtil-fileUpload_cancelBtn">'
            + '                <span>취소</span>'
            + '                <span></span>'
            + '            </button>'
            + '        </article>'
            + '    </div>'
            + '</div>';
    }
    /**
     * @title : 파일 크기 계산
     * @text : Bytes 단위를 KB, MB 등으로 변환
     */
    formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
    /**
     * @title : 팝업 오픈 이벤트 바인딩
     * @text : 파일 업로드 POPUP OPEN 시 이벤트 바인딩 목록
     */
    openPopupEventBinding() {
        this.clearFileUploadBody();               //NOTE : 파일 업로드 UI 노출 및 숨김
        this.fileUploadPopupCloseBtnClickEvent(); //NOTE : 파일 업로드 CLOSE 이벤트 (취소)
        this.fileUploadBtnClickEvent();           //NOTE : 파일 업로드
        this.dragAndDropAreaChangeEvent();
    }
    /**
     * @title : 팝업 UI 노출 및 숨김
     */
    clearFileUploadBody() {
        let isEmpty = $(".fileUpload_body").length === 0;
        let $fileUpload = $(this.COMMON_FILE_UPLOAD_ID);
        isEmpty ? $fileUpload.append(this.CONTENTS) : $fileUpload.empty();
    }
    /**
     * @title : 팝업 오픈 버튼 이벤트
     */
    fileUploadPopupOpenBtnClickEvent() {
        let that = this;
        $(this.BTN_ID).off("click").on("click", fileUploadPopupOpenBtnClickEventHandler);

        /**
         * @title : 팝업 오픈 버튼 이벤트
         * @text : 파일 업로드 POPUP OPEN 시 이벤트 바인딩
         */
        function fileUploadPopupOpenBtnClickEventHandler(e) {
            //NOTE : 파일업로드 버튼 활성화 아이디 (같은 화면에서 두개 이상의 버튼을 생성 할때 사용)
            that.ACTIVE_BTN_ID = "#" + e.currentTarget.id
            that.openPopupEventBinding();
        }
    }
    /**
     * @title : 닫기 버튼 이벤트
     * @text : 파일 업로드 CLOSE 이벤트 (취소)
     */
    fileUploadPopupCloseBtnClickEvent() {
        let that = this;
        $(this.CANCEL_BTN)
            .off("click.formUtilFileUploadCancelBtnClickEventHandler")
            .on("click.formUtilFileUploadCancelBtnClickEventHandler", formUtilFileUploadCancelBtnClickEventHandler);
        function formUtilFileUploadCancelBtnClickEventHandler() {
            $(that.COMMON_FILE_UPLOAD_ID).empty();
            that.resetVariable();
        }
    }
    /**
     * @title : 업로드 버튼 이벤트
     * @text : 파일 최종 업로드 이벤트
     */
    fileUploadBtnClickEvent() {
        let that = this;
        $(that.UPLOAD_BTN)
            .off("click.fileUploadBtnClickEventHandler")
            .on("click.fileUploadBtnClickEventHandler", fileUploadBtnClickEventHandler);
        function fileUploadBtnClickEventHandler() {
            that.commonFileUpload();
        }
    }
    /**
     * @title : 드래그 앤 드롭 영역 이벤트
     * @text : 파일 최종 업로드 이벤트 핸들러 및 리스트 관리
     */
    dragAndDropAreaChangeEvent() {
        let that = this;
        $(that.DRAG_N_DROP_INPUT)
            .off("change.dragAndDropAreaChangeEventHandler")
            .on("change.dragAndDropAreaChangeEventHandler", function (e) {
                dragAndDropAreaChangeEventHandler(e);
            })
        //NOTE : 화면에 파일리스트 노출
        function showFileList() {
            let fileSettingsHtml = "";
            if (that.TOTAL_FILE_LIST.length > 0) {
                for (let i = 0; i < that.TOTAL_FILE_LIST.length; i++) {
                    let file = that.TOTAL_FILE_LIST[i];
                    let fileName = file.name.substring(0, file.name.lastIndexOf('.'));
                    let fileSize = that.formatBytes(file.size);
                    let fileExtension = file.name.substring(file.name.lastIndexOf('.') + 1);
                    fileSettingsHtml +=
                        '<ul class="gi-row-100">'
                        + '   <li class="' + that.NO_WIDTH + '"><span class="formUtil-file_no">' + (i + 1) + '</span></li>'
                        + '   <li class="' + that.FILE_NAME_WIDTH + ' formUtil-file_name ">' + fileName + '</li>'
                        + '   <li class="' + that.FILE_SIZE_WIDTH + ' formUtil-file_size">' + fileSize + '</li>'
                        + '   <li class="' + that.FILE_EXTENSION_WIDTH + ' formUtil-file_extension">' + fileExtension + '</li>'
                        + '   <li class="' + that.FILE_DELETE_BTN_WIDTH + ' "><button type="button" class="formUtil-file_delete"></button></li>'
                        + '</ul>';
                }
            }
            //NOTE : 공통 파일업로드 시 사용할 리스트 생성
            that.ADDED_FILE_LIST.forEach(file => {
                let fileName = file.name.substring(0, file.name.lastIndexOf('.'));
                let fileSize = that.formatBytes(file.size);
                let fileExtension = file.name.substring(file.name.lastIndexOf('.') + 1);
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
        //FUN : 파일 업로드 영역 변경 이벤트
        function dragAndDropAreaChangeEventHandler(e) {
            let fileSettingsList = Array.from(e.target.files);

            //NOTE : 기존 파일 목록에 새 파일 추가
            that.ADDED_FILE_LIST = that.ADDED_FILE_LIST.concat(fileSettingsList);
            //NOTE : 중복된 파일 제거 (이름, 사이즈 기준)
            that.ADDED_FILE_LIST = that.ADDED_FILE_LIST.filter((file, index, self) =>
                index === self.findIndex((f) => f.name === file.name && f.size === file.size)
            );
            //NOTE : 총 파일리스트 기존 파일 목록에 새 파일 추가
            that.TOTAL_FILE_LIST = that.TOTAL_FILE_LIST.concat(that.ADDED_FILE_LIST);
            //NOTE : 총 파일리스트 중복된 파일 제거 (이름, 사이즈 기준)
            that.TOTAL_FILE_LIST = that.TOTAL_FILE_LIST.filter((file, index, self) =>
                index === self.findIndex((f) => f.name === file.name && f.size === file.size)
            );

            //NOTE : 화면에 파일리스트 노출
            showFileList();
        }
        //FUN : 팝업내에 업로드할 파일 삭제 이벤트
        function fileDeleteBtnClickEvent() {
            $(".formUtil-file_delete").off("click.fileDeleteBtnClickEventHandler")
                .on("click.fileDeleteBtnClickEventHandler", fileDeleteBtnClickEventHandler);
        }
        //FUN : 팝업내에 업로드할 파일 삭제 이벤트 핸들러
        function fileDeleteBtnClickEventHandler(e) {
            const target = $(e.currentTarget).parent().parent();
            let fileName = $(e.currentTarget).parent().siblings(".formUtil-file_name").text();
            let fileExtension = $(e.currentTarget).parent().siblings(".formUtil-file_extension").text();
            formUtil.popup("deleteFileBtn", fileName + " 파일을 삭제 하시겠습니까?", remove);
            function remove() {
                //NOTE : 해당 파일 삭제
                $(target).remove();
                //NOTE : 최종 파일 리스트에 삭제된 파일 제외하고 업데이트 (파일 삭제)
                that.TOTAL_FILE_LIST = that.TOTAL_FILE_LIST.filter(file => file.name !== fileName + "." + fileExtension);

                //NOTE: 업로드 후 파일 삭제 시 최종적으로 남은 파일을 병합하기 위함
                that.ADDED_FILE_LIST = that.TOTAL_FILE_LIST;

                //NOTE : 화면에 파일리스트 노출
                showFileList();
            }
        }
    }
    /**
     * @title : 공통 파일 업로드 실행
     */
    commonFileUpload() {
        let that = this;
        let url = that.COMMON_UPLOAD_PATH;
        let param = new FormData();
        let finalFileEmptyFlag = false;

        //NOTE : 업로드할 파일 존재 하는지 체크
        if (!formUtil.checkObjectEmptyValue(that.FINAL_UPLOAD_FILE_LIST)) {
            formUtil.showMessage("업로드할 파일이 없습니다.");
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
                }
            }).then(response => {
                let status = response.status;
                if (status === 200 && response.data.length > 0) {
                    let data = response.data;
                    let file_uuid = data[0].file_uuid;

                    //NOTE : 파일을 저장 후 전달 받은 COMMON_FILE의 FILE_UUID를 설정한 값에 전달
                    $("#" + that.ID_TO_RECEIVE_VALUE).val(file_uuid);
                    //NOTE : 파일업로드 팝업 초기화
                    $("#formUtil_fileUpload").empty();
                }
            })

        }

    }

}
