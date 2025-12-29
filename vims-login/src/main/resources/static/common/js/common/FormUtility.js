function FormUtility() {
    this.resetFormUtilityValue();
}

/**
 * @title : GridSortManager
 * @text : 현재 Grid 정렬 상태를 관리해주는 클래스
 * @writer : 진은영
 * */
class GridSortManager {
    constructor() {
        this.sortColumn = null;
        this.sortOrder = null;
    }

    setSort(column, order) {
        this.sortColumn = column;
        this.sortOrder = order;

        localStorage.setItem('sortColumn', this.sortColumn);
        localStorage.setItem('sortOrder', this.sortOrder);
    }

    getSort() {
        return {
            column: this.sortColumn,
            order: this.sortOrder
        };
    }

    resetSort() {
        this.sortColumn = null;
        this.sortOrder = null;

        // 로컬 스토리지에서 정렬 상태 삭제
        localStorage.removeItem('sortColumn');
        localStorage.removeItem('sortOrder');
    }

    loadSortState() {
        this.sortColumn = localStorage.getItem('sortColumn');
        this.sortOrder = localStorage.getItem('sortOrder');
    }
}

/**
 * @title : 공통코드그룹 조회
 * @text : group_id로 공통코드그룹 조회
 * @writer : 이경태
 */
function findByCommonCodeGroup(param){
    let url = '/common/common/commonCodeGroup/findByGroupId';
    axios.post(url, param).then(response =>{
        let data = response.data;
    }).catch(error =>{
        formUtil.alertPopup(error+"");
    })
}

/**
 * @title : 공통코드 조회
 * @text : group_id로 공통코드 조회
 * @writer : 이경태
 */
async function findCommonCode(param) {
    let result = {};
    let url = '/cms/common/commonCode/findCommonCode';
    try {
        return new Promise((resolve, reject) => {
            axios.post(url, param).then(response =>{
                result = response.data;
                resolve(result);
            }).catch(error =>{
                formUtil.alertPopup(error + "");
            });
        });
    } catch (error) {
        formUtil.alertPopup(error + "");
    }
}
/**
 * @title : 전역변수 설정
 * @text : 전역변수 설정 후 resetFormUtilityValue에 추가
 * @writer : 이경태
 */
let giCalendarSeletedDateList = [];

const gridSortManager = new GridSortManager();

FormUtility.prototype.resetFormUtilityValue = function(){
    giCalendarSeletedDateList = [];
    gridSortManager.resetSort();
}

/**
 * @title : Value 값이 null,공백,undefined 인지 검사
 * @value :  값
 * @return : 값이 없으면 false, 값이 존재하면 true [Boolean]
 * @writer : 이경태
 */
FormUtility.prototype.checkEmptyValue = function(value) {
    let data = $.trim(value);
    let flag = true;
    if (data === "NaN" || data === "null" || data === null || data === "" || typeof data === "undefined" || data === "undefined" || data === [] || data.length === 0) flag = false;

    return flag;
};
/**
 * @title : Value 값이 null,공백,undefined 인지 검사
 * @value :  값
 * @return : 값이 없으면 false, 값이 존재하면 true [Boolean]
 * @text : checkEmptyValue 와 분리, checkEmptyValue 를 object 형식으로 사용하는 코드가 존재 하기때문에 이 함수는 오직 object 값이 존재하는지만 검사
 * @writer : 이경태
 */
FormUtility.prototype.checkObjectEmptyValue = function(value) {
    let flag = true;
    if(typeof value === "object"){
        if(value != null){
            if(Object.keys(value).length === 0) flag = false;
        }else if(value == null){
            flag = false;
        }
    }
    return flag;
};

/**
 * @title : validation Check
 * @e : [formId=""{id:"",message:""}]
 * @formId : validationCheck하려는 id가 속해있는 상위 div 혹은 form tag의 ID[String]
 * @id : validationCheck하려는 id[String]
 * @message : vaildationCheck시 나올 문구[String]
 * @text : 선행작업 requiredParamClassSetting() ,alertPopup()
 * @writer: 이경태
*/
FormUtility.prototype.validationCheck = function(e) {
    let result = true;
    let formId = e.formId;
    let requiredFields = $("#" + formId + " [data-required='true'][data-field]").not('label').not('span');
    requiredFields.each(function(index, field) {
        let $field = $(field);
        let volume = $field.val();
        if (!volume) {
            $field.parent().attr('data-focus-line',true);
            $field.parent().children("label").attr('data-focus-label',true);
        } else {
            $field.parent().attr('data-focus-line',false);
            $field.parent().children("label").attr('data-focus-label',true);
        }
    });

    // 필수 입력 필드가 비어있을 때 경고 팝업 표시
    requiredFields.each(function(index, field) {
        let $field = $(field);
        let volume = "";

        field.type === "radio" || field.type === "checkbox" ? volume = $field.is(":checked"): volume = $field.val();
        if (!volume) {
            for (let config of e) {
                if (field.id === config.id) {
                    result = false;
                    formUtil.alertPopup(config.message);
                    return false; // 각 필수 입력 필드에 대한 경고 팝업 한 번만 표시
                }
            }
        }
        else {
            // value가 있고, gi-format-check 태그를 붙인 경우, 형식 체크
            if ($field.is('input[gi-format-check]')) {
                let formatCheck = new GiFormatCheck();
                let formatType = $field.attr("gi-format-check");
                let formatTypes = GiFormatCheck.getFormatTypes();

                if (formatTypes.includes(formatType)) {
                    let isValid = formatCheck.validateInputFormat(field);
                    let config = e.find(c => c.id === field.id);

                    if (!isValid && config) {
                        result = false;
                        formUtil.alertPopup(config.message.replace('를', '를 형식에 맞게<br/>'));  //todo 하드코딩
                        //밑줄 처리
                        $field.parent().attr('data-focus-line',true);
                        $field.parent().children("label").attr('data-focus-label',true);
                        return false;
                    }
                }
            }
        }
    });
        return result;
};
/**
 * @title : validation Check alertPopup
 * @message : validation check message parameter (String)
 * @writer: 이경태
*/
FormUtility.prototype.alertPopup = function(message){
    if(this.checkEmptyValue(message)){
        message = message+"";
        if (message.includes('\n')) {
            message = message.replaceAll('\n', '</br>');
        }
    }else{
        message = "메시지가 없습니다.";
    }
    let initAlertPopupDiv = '<div id="alertPopup">'
                                     +'<div class="alertPopup_content">'
                                         +'<div class="alertPopup_text">'
                                             +'<span>'+message+'</span>'
                                         +'</div>'
                                         +'<div class="gi-padding-10px">'
                                             +'<button type="button" class="gi-btn gi-col-30px subbtn alertPopup_success_btn">확인</button>'
                                         +'</div>'
                                     +'</div>'
                                   +'</div>';
    $(".alertPopupBody").html(initAlertPopupDiv);
    $(".alertPopup_success_btn").click(function(){
        $(this).closest("#alertPopup").remove();
    })
}

/**
 * JS 에서 사용하는 confirm과 기능은 같으나 비동기적으로 동작.
 * @async
 * @function confirm
 * @param {string} message 출력할 메시지
 * @returns {Promise<Boolean>} 확인을 누른 경우에는 true / 취소를 누른 경우에는 false
 * @writer: 이진주
 */
FormUtility.prototype.confirm = async function(message){
    return new Promise((resolve, reject) => {
        const key = Date.now();
        const popupHtml = `
            <div id="confirm_${key}" class="prompt">
                <div class="popup_content">
                    <div class="popup_text">
                        <span> ${message} </span>
                    </div>
                    <div class="gi-btn-section gi-row-30 gi-col-40px gi-padding-left-right-20px gi-flex gi-flex-justify-content-center gi-flex-align-items-center">
                        <button type="button" class="gi-btn-blue popup_success_btn">확인</button>
                        <button type="button" class="gi-btn popup_cancel_btn">취소</button>
                    </div>
                </div>
            </div>
        `;

        $(".PopupBody").empty();
        $(".PopupBody").append(popupHtml);

        $(`#confirm_${key} .popup_success_btn`).click(function(){
            $(`#confirm_${key}`).remove();
            resolve(true);
        });

        $(`#confirm_${key} .popup_cancel_btn`).click(function(){
            $(`#confirm_${key}`).remove();
            resolve(false);
        });
    });
}

/**
 * @title : popup
 * @message : 팝업에 출력될 메세지 [String]
 * @btnId : 확인 버튼 click event를 위한 아이디 부여 [String]
 * @func : 확인 버튼 click event function [function]
 * @funcParam : func 함수에 전달될 Parameters ex)func(funcParam)
 * @text : 팝업창
 * @writer: 이경태
 */
FormUtility.prototype.popup = function(btnId,message,func,funcParam){
    let Popup =   '<div id="popup">'
                            +'<div class="popup_content">'
                                +'<div class="popup_text">'
                                    +'<span>'+message+'</span>'
                                +'</div>'
                                +'<div class="gi-btn-section gi-row-30 gi-col-30px gi-padding-left-right-20px gi-flex gi-flex-justify-content-center gi-flex-align-items-center">'
                                    +'<button type="button" id="'+btnId+'"'+' class="gi-btn-blue popup_success_btn">확인</button>'
                                    +'<button type="button" class="gi-btn  popup_cancel_btn">취소</button>'
                                +'</div>'
                            +'</div>'
                         +'</div>';
    if(!(this.checkEmptyValue(btnId) && this.checkEmptyValue(func))){
        this.alertPopup(Message.Label.Array["FAIL.FUNCTION.POPUP"]);
    }else{
        $(".PopupBody").append(Popup);
        $(".popup_cancel_btn").click(function(){
            $(this).closest("#popup").remove();
        })
        $("#"+btnId).click(function(){
            if (funcParam !== undefined) {
                if (Array.isArray(funcParam)) {
                    // funcParam가 배열인 경우 apply()를 사용하여 함수 호출
                    func.call(null, funcParam);
                } else {
                    // funcParam가 배열이 아닌 경우 call()을 사용하여 함수 호출
                    func.call(null, funcParam);
                }
                $(this).closest("#popup").remove();
            } else {
                func(); // funcParam이 없는 경우 함수 그대로 호출
                $(this).closest("#popup").remove();
            }
        });
    }
}
/**
 * @title : popup
 * @message : 팝업에 출력될 메세지 [String]
 * @btnId : 확인 버튼 click event를 위한 아이디 부여 [String]
 * @popupTitle : popup의 title [String]
 * @func : 확인 버튼 click event function [function]
 * @funcParam : func 함수에 전달될 Parameters ex)func(funcParam)
 * @text : 팝업창
 * @writer: 이경태
 */
FormUtility.prototype.popupInput = function(btnId,popupInputId,message,inputLabel,func,funcParam){
    let Popup = '<div id="popup">'
                        +'<div class="popup_content">'
                           +'<div class="popup_text">'
                               +'<span>' + message + '</span>'
                           +'</div>'
                           +'<div class="gi-row-100 gi-col-50">'
                               +'<div class="gi-row-100 gi-input-container gi-flex gi-flex-center ">'
                                +'<label for="popup_input" class="gi-input-label" data-focus-label="false" data-focus-label-text-align="center" data-required="true">'+inputLabel+'</label>'
                                +'<input data-field="popup_input" id="popup_input" name="popup_input" class="gi-input" data-focus-input-text-align="center" data-required="true" autoComplete="off"/>'
                               +'</div>'
                           +'</div>'
                           +'<div class="gi-btn-section gi-row-30 gi-col-40px gi-padding-left-right-20px gi-flex gi-flex-justify-content-center gi-flex-align-items-center">'
                               +'<button type="button" id="' + btnId + '"' + ' class="gi-btn-blue popup_success_btn">확인</button>'
                               +'<button type="button" class="gi-btn  popup_cancel_btn">취소</button>'
                           +'</div>'
                        +'</div>'
                     +'</div>';
    if (!(this.checkEmptyValue(btnId) && this.checkEmptyValue(func))) {
        this.alertPopup(Message.Label.Array["FAIL.FUNCTION.POPUP"]);
    } else {
        $(".PopupBody").append(Popup);
        commonTag.inputTagFocus($("#popup_input"));
        $(".popup_cancel_btn").click(function () {
            $(this).closest("#popup").remove();
        })
        $("#"+btnId).click(function(){
            if (funcParam !== undefined) {
                funcParam[popupInputId] = $("#popup_input").val();
                let MESSAGE = message;
                let validation =[];
                validation.formId = "popup";
                validation[0]={id:"popup_input",message:MESSAGE};

                if(formUtil.validationCheck(validation)){
                    if (Array.isArray(funcParam)) {
                        // funcParam가 배열인 경우 apply()를 사용하여 함수 호출
                        func.apply(null, funcParam);
                    } else {
                        // funcParam가 배열이 아닌 경우 call()을 사용하여 함수 호출
                        func.call(null, funcParam);
                    }
                    $(this).closest("#popup").remove();
                }else{
                    return false;
                }
            } else {
                func(); // funcParam이 없는 경우 함수 그대로 호출
                $(this).closest("#popup").remove();
            }
        })
    }
}

/**
 * @title : popup - radio 선택
 * @btnId : 확인 버튼 click event를 위한 아이디 부여 [String]
 * @popupInputId : radio data-field값 [String]
 * @message : 팝업에 출력될 메세지 [String]
 * @radioOptions : 라디오버튼 밸류와 라벨 [value, label]
 * @func : 확인 버튼 click event function [function]
 * @funcParam : func 함수에 전달될 Parameters ex)func(funcParam)
 * @writer: 배수연
 */
FormUtility.prototype.popupRadio = function(btnId, popupInputId, message, radioOptions, func, funcParam) {
    let Popup = '<div id="popup">'
        + '<div class="popup_content">'
        + '<div class="popup_text">'
        + '<span>' + message + '</span>'
        + '</div>'
        + '<div class="gi-row-100 gi-col-50">';

    // Popup - radio가 가로로 나란히 배치 (세로배치시 코드 수정 필요)
    Popup += '<div class="gi-row-100 gi-col-100 gi-flex">';
    radioOptions.forEach(function(option, index) {
        Popup += '<div class="gi-row-100 gi-input-container gi-flex gi-flex-center">'
            + '<input data-field="' + popupInputId + '" type="radio" id="' + popupInputId + index + '" name="' + popupInputId + '" class="gi-input" data-focus-span-text-align="center" data-required="true" value="' + option.value + '">'
            + '<label for="' + popupInputId + index + '" class="gi-input-radio-label" data-focus-label="true" data-focus-label-text-align="default">' + option.label + '</label>'
            + '</div>';
    });
    Popup += '</div>';

    Popup += '</div>'
        + '<div class="gi-btn-section gi-row-30 gi-col-40px gi-padding-left-right-20px gi-flex gi-flex-justify-content-center gi-flex-align-items-center">'
        + '<button type="button" id="' + btnId + '" class="gi-btn-blue popup_success_btn">확인</button>'
        + '<button type="button" class="gi-btn popup_cancel_btn">취소</button>'
        + '</div>'
        + '</div>'
        + '</div>';

    if (!(this.checkEmptyValue(btnId) && this.checkEmptyValue(func))) {
        this.alertPopup(Message.Label.Array["FAIL.FUNCTION.POPUP"]);
    } else {
        $(".PopupBody").append(Popup);

        // 취소 버튼 클릭 시 팝업 제거
        $(".popup_cancel_btn").click(function () {
            $(this).closest("#popup").remove();
        });

        // 확인 버튼 클릭 시 동작
        $("#" + btnId).click(function() {
            // 선택된 radio 버튼의 값을 가져오기
            let selectedValue = $("input[name='" + popupInputId + "']:checked").val();

            if (!selectedValue) {
                formUtil.alertPopup('입력 값이 없습니다.');
                return false;
            }

            if (funcParam !== undefined) {
                funcParam[popupInputId] = selectedValue; // 선택된 radio value를 funcParam에 저장

                let messageId = popupInputId.toUpperCase();
                let message = Message.Label.Array["COMPLETE.INSERT"];
                let validation = [];
                validation.formId = "popup";
                validation[0] = { id: "popup_radio", message: message };

                // validation 체크 후 처리
                if (formUtil.validationCheck(validation)) {
                    if (Array.isArray(funcParam)) {
                        func.apply(null, funcParam);  // 배열인 경우 apply 사용
                    } else {
                        func.call(null, funcParam);  // 배열이 아닌 경우 call 사용
                    }
                    $(this).closest("#popup").remove();
                } else {
                    return false;
                }
            } else {
                func();  // funcParam이 없는 경우 함수만 실행
                $(this).closest("#popup").remove();
            }
        });
    }
};

/**
 * JS 에서 사용하는 prompt와 기능은 같으나 비동기적으로 동작.
 * @async
 * @function prompt
 * @param {string} message 출력할 메시지
 * @returns {Promise<Object>} 사용자가 입력한 문자열. 사용자가 취소를 누른 경우에는 null
 * @writer: 이진주
 */
FormUtility.prototype.prompt = async function (message, maxlength) {
    return new Promise((resolve, reject) => {
        const key = Date.now();
        const popupHtml = `
            <div id="prompt_${key}" class="prompt">
                <div class="popup_content">
                    <div class="popup_text">
                        <span>${message}</span>
                    </div>
                    <div class="gi-row-100 gi-col-50">
                        <div class="gi-row-100 gi-input-container gi-flex gi-flex-center ">
                            <label for="popup_input" class="gi-input-label" data-focus-label="false" data-focus-label-text-align="center" data-required="true">입력 값</label>
                            <input data-field="popup_input" id="popup_input" name="popup_input" class="gi-input popup_input" data-focus-input-text-align="center" data-required="true" autoComplete="off" 
                                ${maxlength ? `gi-maxlength="${maxlength}"` : ""}  
                            />
                        </div>
                    </div>
                    <div class="gi-btn-section gi-row-30 gi-col-40px gi-padding-left-right-20px gi-flex gi-flex-justify-content-center gi-flex-align-items-center">
                        <button type="button" class="gi-btn-blue popup_success_btn">확인</button>
                        <button type="button" class="gi-btn popup_cancel_btn">취소</button>
                    </div>
                </div>
            </div>
        `;

        $(".PopupBody").append(popupHtml);
        commonTag.inputTagFocus($("#popup_input"));
        if (maxlength) new GiMaxLengthCheck();

        $(`#prompt_${key} .popup_success_btn`).click(function () {
            const inputValue = $(`#prompt_${key} .popup_input`).val();
            if (!inputValue) {
                formUtil.alertPopup('입력 값이 없습니다.');
                return;
            }

            $(`#prompt_${key}`).remove();
            return resolve(inputValue);
        });

        $(`#prompt_${key} .popup_cancel_btn`).click(function () {
            $(`#prompt_${key}`).remove();
            resolve(null);
        });
    });
}

/**
 * @title : setHyphenStringDate
 * @id : target id [String]
 * @v : 값 [String]
 * @f : 기호(-) [String]
 * @return : 1999+f+01+f+01
 * @writer: 이경태
 */
FormUtility.prototype.setHyphenStringDate = function(id,v,f) {
    let yyyy = "";
    let mm = "";
    let dd = "";
    let result = "";
    if(typeof v === "string" && v.length === 8){
        yyyy = v.substring(0,4);
        mm = v.substring(4,6);
        dd = v.substring(6,8);
        result = yyyy+f+mm+f+dd;
    }
    $("#"+id).val(result);
    return result;
}
/**
 * @title : setHyphenToDates
 * @ids : target ids [String[]]
 * @separator : separator of strings [string] (optional, default : '-')
 * @writer: 이진주
 */
FormUtility.prototype.setHyphenToDates = function (ids, separator) {
    let sep = separator ? separator : '-';

    ids.forEach(id => {
        let value = $('#' + id).val();
        if (!value || value.length !== 8) return false;

        $('#' + id).val(value.substring(0, 4) + sep + value.substring(4, 6) + sep + value.substring(6, 8));
    });
}
/**
 * @title : setHyphenToReginos
 * @ids : target ids [String[]]
 * @writer: 이진주
 */
FormUtility.prototype.setHyphenToReginos = function(ids) {
    ids.forEach(id => {
        let value = $('#' + id).val();
        if (!value || (value.length !== 10 && value.length !== 13)) return false;

        let addedText = '';
        if (value.length === 10) {
            addedText = `${value.substring(0, 3)}-${value.substring(3, 5)}-${value.substring(5)}`;
        } else {
            addedText = `${value.substring(0, 6)}-${value.substring(6)}`;
        }

        $('#' + id).val(addedText);
    });
}
/**
 * @title : setHyphenToTels
 * @ids : target ids [String[]]
 * @writer: 이진주
 */
FormUtility.prototype.setHyphenToTels = function(ids) {
    ids.forEach(id => {
        let value = $('#' + id).val();
        if (!value) return false;

        let addedText = this.formatPhoneNumber(value)

        $('#' + id).val(addedText);
    });
}
/**
 * @title : setCommaToMoney
 * @ids : target ids [String[]]
 * @writer: 이진주
 */
FormUtility.prototype.setCommaToMoney = function(ids) {
    ids.forEach(id => {
        let value = $('#' + id).val();

        if (!value) return false;
        value = value.replace(/[^0-9]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        $('#' + id).val(value);
    });
}
/**
 * @title : replaceAll
 * @v : 값 [String]
 * @f : format(-) [String]
 * @cf : change format [String]
 * @writer: 이경태
 */
FormUtility.prototype.replaceAll = function(v,f,cf){
    let result = "";
    if(this.checkEmptyValue(v)){
        result = v.replaceAll(new RegExp(f, "gi"),cf);
    }
    return result;
}

/**
 * @title : search address
 * @id : 주소 검색 후 선택한 주소를 입력할 인풋의 아이디 [String]
 * @writer: 이진주
 */
FormUtility.prototype.searchAddress = function(id){
    new daum.Postcode({
        oncomplete: function (data) {
            $('#' + id).val(data.address);
        }
    }).open();
}

/**
 * @title : 날짜 계산
 * @valueOfDate : 계산기준 날짜 [String]
 * @type : + , - 연산자 [Stiring]
 * @dayNumber : 연산하고자 하는 날짜 [String]
 * @writer : 이경태
* */
FormUtility.prototype.calcDate = function(valueOfDate, type, dayNumber){
    let pattern = /^\d{4}-\d{2}-\d{2}$/;
    let flag = pattern.test(valueOfDate);
    if(!flag){
        this.alertPopup("calcDate 함수의 날짜 형식이 맞지 않습니다 [ex:yyyy-MM-dd]");
    }

    dayNumber = parseInt(dayNumber);
    let date = new Date(valueOfDate);
    let yyyy = date.getFullYear();
    let MM = date.getMonth();
    let dd = date.getDate();
    let result = "";

    if("+" === type){
        dd = dd + dayNumber;
    } else if("-" === type){
        dd = dd - dayNumber;
    }

    let resultDate = new Date(yyyy, MM, dd);
    let result_yyyy = resultDate.getFullYear();
    let result_MM = (resultDate.getMonth() + 1).toString().padStart(2, '0');
    let result_dd = resultDate.getDate().toString().padStart(2, '0');

    result = result_yyyy + "-" + result_MM + "-" + result_dd;
    return result;
}
/**
 * @title : 핸드폰, 전화번호 "-" 하이픈 삽입
 * @phoneNumber : 핸드폰, 전화번호 [String]
 * @writer : 이경태
 * */
FormUtility.prototype.formatPhoneNumber = function(phoneNumber){
    let cleaned = ('' + phoneNumber).replace(/\D/g, '');

    let match = cleaned.match(/^(\d{2,3})(\d{3,4})(\d{4})$/);
    if(cleaned.length === 8){
        match = cleaned.match(/^(\d{4})(\d{4})$/);
        if (match) {
                return match[1] + '-' + match[2];
        }
    }else{
        match = cleaned.match(/^(\d{2,3})(\d{3,4})(\d{4})$/);
        if (match) {
            if (match[1].length === 2 || match[1].length === 3) {
                return match[1] + '-' + match[2] + '-' + match[3];
            }
        }
    }
    return phoneNumber;
}
/**
 * @title : 3자리 마다 콤마 찍기(,)
 * @v : vlaue 값 [String,Number]
 * @writer : 이경태
 * */
FormUtility.prototype.addComma = function(v){
    return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
/**
 * @title : 공통 파일 업로드
 * @id : 파일업로드 팝업을 띄울 버튼 click event ID 설정 (이벤트를 걸어줄 아이디) [String]
 * @path : controller URL 입력
 * @returnId : UUID를 리턴 받을 class, id 태그 지정해 주기(ex: #returnId , .returnId) [String]
 * @cont : 파일업로드시 넘겨줄 parameters [JSON]
 * @text : 파일업로드시 공통 파일업로드 COMM_FILE테이블에 INSERT되고 path 경로에 파일 경로, UUID , 작성자 등의 내용과 cont를 INSERT 해준다.
 * @writer : 이경태
 * */
FormUtility.prototype.createFileUpload = function(id,path,returnId,cont){
    if(!formUtil.checkEmptyValue(cont)){
        cont = {"FOLDER_NAME":""};
    }
    if(!formUtil.checkEmptyValue(returnId)){
        formUtil.alertPopup("formUtil.createFileUpload : returnId를 입력해주세요.");
        return false;
    }
    if(formUtil.checkEmptyValue($("#uuid").val())){
        $("#file_id").val($("#uuid").val());
        findByFilesAndInsertOuterFileList($("#uuid").val());
    }
    let existsFiles = [];           // 기존 파일 목록
    let changedExistsFiles = [];    // 기존 파일 목록 변경 체크
    let existsIsChanged = false;
    let addedFiles = [];            // 신규 추가 파일 목록
    let totalFiles = [];            // 기존 + 신규 파일 목록(화면 목록 처리용)
    let finalCommFileList = {};     // 최종 upload 대상 파일 목록
    let fileListText = [];          // file_detail insert 용 파일 데이터
    let contents =
                            '<div class="formUtil-fileUpload_body" data-fileupload-boxopen="on">'
                            +'    <div class="formUtil-fileUpload gi-flex gi-flex-column slide-in-blurred-top">'
                            +'        <article class="formUtil-fileUpload_content">'
                            +'            <form class="formUtil-fileUpload_form gi-col-100">'
                            +'                <div class="formUtil-fileUpload_dropArea">'
                            +'                    <input type="file" id="fileElem" style="display: none" multiple enctype="multipart/form-data">'
                            +'                    <label for="fileElem" >'
                            +'                        <i class="bi bi-upload" style="color: #999 !important;margin-right: 1.3rem !important;font-size: 3rem;"></i>'
                            +'                        <div class="formUtil-fileUpload_span-body">'
                            +'                            <span class="formUtil-fileUpload_span" style="display:block">FILE UPLOAD CLICK</span>'
                            +'                            <span class="formUtil-fileUpload_span">[Drag And Drop]</span>'
                            +'                        </div>'
                            +'                    </label>'
                            +'                </div>'
                            +'            </form>'
                            +'            <div class="formUtil-fileUpload_memoArea">'
                            +'            </div>'
                            +'        </article>'
                            +'        <div class="formUtil-file_description-box gi-input-container">'
                            +'          <label for="formUtil-file_description" class="gi-input-label" data-focus-label="false" data-focus-label-text-align="default" data-required="false">전체 메모</label>'
                            +'          <input type="text" class="formUtil-file_description gi-input" data-focus-span-text-align="center" data-required="true" autocomplete="off"/>'
                            +'        </div>'
                            +'        <div class="formUtil-fileUpload_list">'
                            +'            <div class="formUtil-fileUpload_list-header">'
                            +'                <ul class="gi-row-100 sub-card-2">'
                            +'                    <li class="gi-row-10">NO</li>'
                            +'                    <li class="gi-row-40">파일명</li>'
                            +'                    <li class="gi-row-30">파일크기</li>'
                            +'                    <li class="gi-row-20">확장자</li>'
                            +'                    <li class="gi-row-20">설명</li>'
                            +'                </ul>'
                            +'            </div>'
                            +'            <div class="formUtil-fileUpload_list-contents">'
                            +'            </div>'
                            +'        </div>'
                            +'        <article class="formUtil-fileUpload_footer">'
                            +'            <button class="formUtil-fileUpload_uploadBtn">'
                            +'                <span>업로드</span>'
                            +'                <span></span>'
                            +'            </button>'
                            +'            <button class="formUtil-fileUpload_cancelBtn">'
                            +'                <span>취소</span>'
                            +'                <span></span>'
                            +'            </button>'
                            +'        </article>'
                            +'    </div>'
                            +'</div>';


    let fileUploadArea = $("#" + id);
    //파일 업로드 영역 클릭 이벤트
    fileUploadArea.on("click", function(){
        initEvent();
        fileClickEvent();
        filePopupUploadBtnClickEvent();
        if(formUtil.checkEmptyValue($("#file_id").val())){
            findByFileList($("#file_id").val());
        }
        let fileInput = $("#fileElem");
        commonTag.inputTagFocus($(".gi-input"));

        fileInput.on("change",function(e){
            // console.log("check");
            // console.log(e);
            // console.log(e.target);
            // console.log(e.target.files);
            // console.log(Array.from(e.target.files));
            let innerHtml = "";
            let listHeader = $(".formUtil-fileUpload_list-contents");
            let fileList = Array.from(e.target.files);

            // 기존 파일 목록에 새 파일 추가
            addedFiles = addedFiles.concat(fileList);

            // 중복된 파일 제거 (이름, 사이즈 기준)
            addedFiles = addedFiles.filter((file, index, self) =>
                index === self.findIndex((f) => f.name === file.name && f.size === file.size)
            );

            totalFiles = totalFiles.concat(fileList);
            totalFiles = totalFiles.filter((file, index, self) =>
                index === self.findIndex((f) => f.name === file.name && f.size === file.size)
            );

            if(totalFiles.length>0){
                for(let i = 0 ; i< totalFiles.length; i++){
                    let file = totalFiles[i];
                    let fileName = file.name.substring(0, file.name.lastIndexOf('.'));
                    let fileSize = formatBytes(file.size);
                    let fileExtension = file.name.substring(file.name.lastIndexOf('.') + 1);
                    let fileDescription = file.file_description || "";
                    //
                    innerHtml  += '<ul class="gi-row-100">'
                                            +'<li class="gi-row-10">'+(i+1)+'</li>'
                                            +'<li class="gi-row-40 formUtil-file_name ">'+fileName+'</li>'
                                            +'<li class="gi-row-30 formUtil-file_size">'+fileSize+'</li>'
                                            +'<li class="gi-row-20 formUtil-file_extension">'+fileExtension+'</li>'
                                            +'<li class="gi-row-20 "><textarea data-file-description'+i+' class="formUtil-file_description">'+fileDescription+'</textarea></li>'
                                        +'</ul>';
                }
            }

            fileListText = [];
            addedFiles.forEach(file => {
                let fileName = file.name.substring(0, file.name.lastIndexOf('.'));
                let fileSize = formatBytes(file.size);
                let fileExtension = file.name.substring(file.name.lastIndexOf('.') + 1);
                let fileDescription = file.file_description || "";
                fileListText.push({"file_name":fileName , "file_size":fileSize, "file_extension":fileExtension, "file_description":fileDescription})
            });

            finalCommFileList = addedFiles;
            listHeader.html(innerHtml);
        })
        let dropArea = document.querySelector(".formUtil-fileUpload_body");

        // 드래그 앤 드롭 이벤트를 처리하는 함수 추가
        dropArea.addEventListener('dragover', handleDragOver, false);
        dropArea.addEventListener('dragleave', handleDragLeave, false);
        dropArea.addEventListener('drop', handleDrop, false);

        function handleDragOver(evt) {
            evt.stopPropagation();
            evt.preventDefault();
            evt.dataTransfer.dropEffect = 'copy';
        }

        function handleDragLeave(evt) {
            evt.stopPropagation();
            evt.preventDefault();
        }

        function handleDrop(evt) {
            evt.stopPropagation();
            evt.preventDefault();
            let files = Array.from(evt.dataTransfer.files); // 드래그 앤 드롭으로 선택한 파일 목록을 배열 형태로 변환

            // 기존에 선택한 파일 내역에 합친 후 중복검사
            addedFiles = addedFiles.concat(files);

            // 중복된 파일 제거 (이름 기준)
            addedFiles = addedFiles.filter((file, index, self) =>
                index === self.findIndex((f) => f.name === file.name && f.size === file.size)
            );

            totalFiles = totalFiles.concat(files);
            totalFiles = totalFiles.filter((file, index, self) =>
                index === self.findIndex((f) => f.name === file.name && f.size === file.size)
            );

            handleFiles(totalFiles); // 선택한 파일 목록을 처리하는 함수 호출
        }

        function handleFiles(files) {
            let innerHtml = "";
            let listHeader = $(".formUtil-fileUpload_list-contents");

            if(files.length>0){
                for(let i = 0 ; i< files.length; i++){
                    let file = files[i];
                    let fileName = file.name.substring(0, file.name.lastIndexOf('.'));
                    let fileSize = formatBytes(file.size);
                    let fileExtension = file.name.substring(file.name.lastIndexOf('.') + 1);
                    let fileDescription = file.file_description || "";

                    innerHtml  += '<ul class="gi-row-100">'
                                        +'<li class="gi-row-10">'+(i+1)+'</li>'
                                        +'<li class="gi-row-40 formUtil-file_name ">'+fileName+'</li>'
                                        +'<li class="gi-row-30 formUtil-file_size">'+fileSize+'</li>'
                                        +'<li class="gi-row-20 formUtil-file_extension">'+fileExtension+'</li>'
                                        +'<li class="gi-row-20 "><textarea data-file-description'+i+' class="formUtil-file_description">'+fileDescription+'</textarea></li>'
                                    +'</ul>';
                }
            }

            fileListText = [];
            addedFiles.forEach(file => {
                let fileName = file.name.substring(0, file.name.lastIndexOf('.'));
                let fileSize = formatBytes(file.size);
                let fileExtension = file.name.substring(file.name.lastIndexOf('.') + 1);
                let fileDescription = file.file_description || "";
                fileListText.push({"file_name":fileName , "file_size":fileSize, "file_extension":fileExtension, "file_description":fileDescription})
            });

            finalCommFileList = addedFiles;
            listHeader.html(innerHtml);
        }
    });

    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    function parseToBytes(sizeWithUnit) {
        if (!sizeWithUnit || typeof sizeWithUnit !== "string") {
            throw new Error("Invalid input. Expected a non-empty string.");
        }

        const units = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
        const regex = /^([\d.]+)\s*(\w+)$/; // 숫자와 단위로 분리하는 정규식
        const match = sizeWithUnit.match(regex);

        if (!match) {
            throw new Error("Input format is invalid. Expected format: '<number> <unit>' (e.g., '10.22 MB').");
        }

        const value = parseFloat(match[1]); // 숫자 부분
        const unit = match[2];             // 단위 부분

        const unitIndex = units.findIndex(u => u.toLowerCase() === unit.toLowerCase());
        if (unitIndex === -1) {
            throw new Error(`Unknown unit: ${unit}. Expected one of: ${units.join(", ")}.`);
        }

        // 1024의 제곱승을 이용하여 Byte 값으로 변환
        return Math.round(value * Math.pow(1024, unitIndex));
    }

    function handleFileUpload(uploadUrl){
        let param = new FormData();
        let url = uploadUrl;

        param.append("folder_name",cont.FOLDER_NAME)
        if(formUtil.checkEmptyValue($(".formUtil-file_description").val())){
            param.append("file_description",$(".formUtil-file_description").val());
        }else{
            param.append("file_description","");
        }

        /**
         * 현재 업로드 파일 uuid 값을 담는 태그가 화면마다 상이하기에 아래와 같이 구분
         */
        if(formUtil.checkEmptyValue($("#uuid").val())){
            param.append("uuid", $("#uuid").val());
        }else if(formUtil.checkEmptyValue($("#file_id").val())){
            param.append("uuid", $("#file_id").val());
        }

        for (let key in finalCommFileList) {
            if (Object.prototype.hasOwnProperty.call(finalCommFileList, key)) {
                param.append('files', finalCommFileList[key]);
            }
        }

        let MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

        for (let key in finalCommFileList) {
            if (Object.prototype.hasOwnProperty.call(finalCommFileList, key)) {
                if (finalCommFileList[key].size > MAX_FILE_SIZE) {
                    formUtil.alertPopup(Message.Label.Array["MAXIMUM.UPLOAD.SIZE.100MB"]);
                    return;
                }
            }
        }

        // 공통파일 테이블에 inset 후 uuid return
        axios.post(url, param, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(response => {
            let comFileData = response.data;
            let url = path + '/register';
            let param = fileListText;

            for(let i = 0; i< fileListText.length; i++){
                let dataId = "data-file-description"+i;
                fileListText[i]["file_id"] = comFileData[i].file_id;
                fileListText[i]["file_path"] = comFileData[i].file_path;
                fileListText[i]["system_create_userid"] = comFileData[i].system_create_userid;
                fileListText[i]["uuid"] = comFileData[i].file_uuid;
                fileListText[i]["file_description"] = $(".formUtil-file_description[data-file-description" + (i + existsFiles.length) + "]").val();
                fileListText[i]["row_seq"] = i+"";
                if(formUtil.checkEmptyValue(cont)){
                    for(let key in cont){
                        if (Object.prototype.hasOwnProperty.call(cont, key)) {
                            fileListText[i][key] = cont[key];
                        }
                    }
                }
            }

            //설정한 파일테이블에 insert
            axios.post(url , param).then(response => {
                let data = response.data;
                if(data === 1){
                    $(returnId).val(comFileData[0].file_uuid);
                    $("#formUtil_fileUpload").empty();

                    $("#file_id").val(comFileData[0].file_uuid);
                    $("#uuid").val(comFileData[0].file_uuid);

                    findByFilesAndInsertOuterFileList(comFileData[0].file_uuid);
                    finalCommFileList = addedFiles = [];
                    totalFiles = [];
                    fileListText = [];
                    existsFiles = [];
                    changedExistsFiles = [];
                    formUtil.showMessage("File Upload Success!!");
                }else{
                    $("#formUtil_fileUpload").empty();
                    formUtil.alertPopup("File Upload Fail!!");
                }
            }).catch(error =>{
                $("#formUtil_fileUpload").empty();
                formUtil.alertPopup(error.response.data);
            })
        }).catch(error => {
            $("#formUtil_fileUpload").empty();
            // formUtil.alertPopup(error.response.data +"</br>"+Message.Label.Array["MAXIMUM.UPLOAD.SIZE.100MB"]);
            // formUtil.alertPopup(Message.Label.Array["MAXIMUM.UPLOAD.SIZE.100MB"]);
            // formUtil.alertPopup(error.response);
            formUtil.alertPopup(error+"");
        });
    }

    async function handleFileChanged(){
        let updateUrl = path + "/updateList";
        let isSucceed = false;

        changedExistsFiles = [];
        for(let i = 0; i < existsFiles.length; i++){
            let description = $(".formUtil-file_description[data-file-description" + i + "]").val();
            if(existsFiles[i].file_description !== description){
                let changedObj = {
                    file_id : existsFiles[i].file_id,
                    uuid : $("#file_id").val(),
                    file_description : description,
                };
                changedExistsFiles.push(changedObj);
            }
        }

        await axios.post(updateUrl , changedExistsFiles).then(async response => {
            let data = response.data;
            if(data === 1){
                changedExistsFiles = [];
                existsIsChanged = false;
                $("#formUtil_fileUpload").empty();
                totalFiles = [];
                existsFiles = [];
                isSucceed = true;
                findByFilesAndInsertOuterFileList($("#file_id").val());
                formUtil.showMessage("File Update Success!!");
            }else{
                changedExistsFiles = [];
                totalFiles = [];
                existsFiles = [];
                isSucceed = false;
                existsIsChanged = false;
                $("#formUtil_fileUpload").empty();
                formUtil.alertPopup("File Update Fail!!");
            }
        }).catch(error =>{
            $("#formUtil_fileUpload").empty();
            formUtil.alertPopup(error.response.data);
        });

        return isSucceed;
    }

    function filePopupUploadBtnClickEvent(){
        //파일업로드 팝업 업로드 버튼 클릭 이벤트
        $(".formUtil-fileUpload_uploadBtn").on("click",function(){
            let uploadUrl = "/fileManager/upload";

            if(formUtil.checkEmptyValue(existsFiles)){
                for(let i = 0; i < existsFiles.length; i++){
                    let description = $(".formUtil-file_description[data-file-description" + i + "]").val();
                    if(description !== "undefined" && description !== "null" && description !== null && existsFiles[i].file_description !== description){
                        existsIsChanged = true;
                        break;
                    }
                }
            }

            let hasAddedFiles = addedFiles.length > 0;
            let hasExistsFiles = existsFiles.length !== 0;

            // 1. 신규 등록과 수정을 구분
            if (hasExistsFiles) { // 수정
                if (addedFiles.length === 0 && !existsIsChanged) {
                    // 수정 시 신규 파일도 없고, 기존 파일 수정 내역도 없을 때
                    formUtil.alertPopup(Message.Label.Array["ALERT.NO.CHANGED.FILE"]);
                    return false;
                }
            }

            // 신규
            if (!hasExistsFiles && addedFiles.length === 0) {
                // 선택한 파일 없는 경우
                formUtil.alertPopup(Message.Label.Array["ALERT.NO.FILE"]);
                return false;
            }

            if(existsIsChanged && hasAddedFiles){           // 기존 파일 description 변경 + 신규 파일 추가
                // 기존 파일 description 변경 처리 함수 호출
                let changedCheck = handleFileChanged();
                if(changedCheck){
                    // 신규 파일 upload 처리 함수 호출
                    handleFileUpload(uploadUrl);
                }
            }else if(hasAddedFiles){                        // 신규 파일만 추가
                // 신규 파일 upload 처리 함수 호출
                handleFileUpload(uploadUrl);
            }else if(existsIsChanged){                      // 기존 파일 description 변경
                // 기존 파일 description 변경 처리 함수 호출
                handleFileChanged();
            }
        });
    }
    function initEvent(){
        let length  = $(".fileUpload_body").length;
        if(0 ===  length){
            $("#formUtil_fileUpload").append(contents);
        }else if(1 === length){
            $("#formUtil_fileUpload").empty();
        }
    }
    function fileClickEvent(){
        //파일팝업 취소 버튼 클릭 이벤트\]
        $(".formUtil-fileUpload_cancelBtn").on("click",function(){
            $("#formUtil_fileUpload").empty();
            totalFiles = [];
            finalCommFileList = addedFiles = [];
            fileListText = [];
            existsFiles = [];
            changedExistsFiles = [];
        })
    }
    function fileListClickEvent(){
        $(".formUtil-btn-delete").off("click").on("click",function(e){
            let target = e.target;
            let fileId = $(target).siblings(".formUtil-file_name").data("fileId");
            let fileName = $(target).siblings(".formUtil-file_name").text();
            let fileUuid = $(target).siblings(".formUtil-file_name").data("fileUuid");
            let fileExtension = $(target).siblings(".formUtil-file_name").data("fileExtension");
            let filePath = $(target).siblings(".formUtil-file_name").data("filePath");
            let cont = {
                file_id : fileId,
                uuid : fileUuid,
                file_name : fileName,
                file_extension : fileExtension,
                file_path : filePath,
            }
            formUtil.popup("fileRemoveBtn", fileName+"<br> (를)을 삭제 하시겠습니까?", removeByFileId, cont);
        })
    }
    function findByFileList(UUID){
        let url = path + '/find';
        let param = {
            uuid : UUID
        }
        axios.post(url , param).then(response => {
            let data = response.data;
            data.forEach(file => {
                let loadFileData = {
                    name : file.file_name + "." + file.file_extension,
                    size : parseToBytes(file.file_size),
                    file_id : file.file_id,
                    file_description : file.file_description || "",
                }
                totalFiles.push(loadFileData);
                existsFiles.push(loadFileData);
            });

            if(200 === response.status){
                let innerHtml = "";
                let listHeader = $(".formUtil-fileUpload_list-contents");
                data.map((item,i)=>{
                    innerHtml  += '<ul class="gi-row-100">'
                                    +'<li class="gi-row-10">'+(i+1)+'</li>'
                                    +'<li class="gi-row-40 formUtil-file_name ">'+item.file_name+'</li>'
                                    +'<li class="gi-row-30 formUtil-file_size">'+item.file_size+'</li>'
                                    +'<li class="gi-row-20 formUtil-file_extension">'+item.file_extension+'</li>'
                                    +'<li class="gi-row-20 "><textarea data-file-description'+i+' class="formUtil-file_description">'+(item.file_description || "")+'</textarea></li>'
                                +'</ul>';
                })
                listHeader.html(innerHtml);
            }
            fileListClickEvent();
        }).catch(error => {
            formUtil.alertPopup(error+"");
        })
    }

    //파일 업로드후 파일리스트 삽입
    function findByFilesAndInsertOuterFileList(UUID){
        let url = path + "/find";
        let param = {
            uuid : UUID
        }
        axios.post(url , param).then(response => {
            let data = response.data;

            if(200 === response.status){
                let outerHtml = "";
                let formUtilFileList = $(".formUtil-file-list");
                data.map((item,i)=>{
                    outerHtml += '<ul class="gi-row-100">'
                                    +'<li class="gi-row-10 formUtil-file_image"></li>'
                                    +'<li class="gi-row-75 gi-margin-left-10px formUtil-file_name" data-file-uuid="'+item.uuid+'" data-file-id="'+item.file_id+'" data-file-extension="'+item.file_extension+'" data-file-path="'+item.file_path+'">'+item.file_name+'.'+item.file_extension+'</li>'
                                    +'<li class="gi-row-10 formUtil-file_close_image formUtil-btn-delete"></li>'
                                +'</ul>';
                })
                formUtilFileList.html(outerHtml);
            }
            fileListClickEvent();
        }).catch(error => {
            formUtil.alertPopup(error+"");
        })
    }
    function removeByFileId(cont){
        let url = path + "/removeByFileIdAndUuid";
        let param = {
            file_id : cont.file_id,
            uuid : cont.uuid,
            file_path : cont.file_path + "/" + cont.file_id + "." + cont.file_extension,
        }

        axios.post(url , param).then(async response =>{
            if(200 === response.status){
                let deleteKey = ["file_id", "file_path"];
                deleteKey.forEach(key => delete param[key]);

                let findUrl = path + "/find";
                await axios.post(findUrl, param).then(response => {
                    if(response.data.length === 0){
                        $(".formUtil-file-list").html("");
                        finalCommFileList = addedFiles = [];
                        totalFiles = [];
                        fileListText = [];
                        existsFiles = [];
                        changedExistsFiles = [];
                    }else{
                        findByFilesAndInsertOuterFileList(cont.uuid);
                        finalCommFileList = addedFiles = addedFiles.filter(file => file.name !== cont.file_name);
                        totalFiles = totalFiles.filter(file => file.name !== cont.file_name);
                        fileListText = fileListText.filter(file => file.file_name + "." + file.file_extension !== cont.file_name);
                        existsFiles = existsFiles.filter(file => file.name !== cont.file_name);
                        changedExistsFiles = [];
                    }
                    formUtil.showMessage("delete file success!!");
                });
            }
        }).catch(error =>{
            formUtil.alertPopup(error + "");
        })
    }
}
/**
 * @title : 공통 파일 다운로드
 * @id : 파일업로드 팝업을 띄울 버튼 click event ID 설정 (이벤트를 걸어줄 아이디) [String]
 * @path : 저장된 파일의 정보가 담긴 테이블 api 주소
 * @uuid : 공통파일 테이블에서 조회할 키 값 UUID [String]
 * @writer : 이경태
 * */
FormUtility.prototype.createFileDownload = function(id,path,uuid){
    setCreateFileDownloadButton(id,path,uuid);
    //호출시 fileList 삽입 이벤트
    setFileList(path,uuid);
    async function setFileList(path,uuid){

        if(!formUtil.checkEmptyValue(path)){
            formUtil.showMessage("path is not exist");
            return false;
        }
        if(!formUtil.checkEmptyValue(uuid)){
            formUtil.showMessage("uuid is not exist");
            return false;
        }
        try{
            let data = await searchLogsFileList(path,uuid);
            let outerHtml = "";
            let formUtilFileList = $(".formUtil-file-list");
            data.map((item,i)=>{
                outerHtml += '<ul class="gi-row-100">'
                    +'<li class="gi-row-10 formUtil-file_image"></li>'
                    +'<li class="gi-row-90 formUtil-file_name" data-file-uuid="'+item.uuid+'" data-file-id="'+item.file_id+'" data-file-extension="'+item.file_extension+'" data-file-path="'+item.file_path+'">'+item.file_name+'.'+item.file_extension+'</li>'
                    +'</ul>';
            });
            formUtilFileList.html(outerHtml);
         }catch(error){
             formUtil.showMessage(error.toString());
         }
    }
    function setCreateFileDownloadButton(id,path,uuid){
        let contents = '<div class="formUtil-fileDownload_body" data-fileDownload-boxopen="on">'
                                + '<div class="formUtil-fileDownload gi-grid gi-grid-template-rows-1fr slide-in-blurred-top">'
                                    + '<div class="formUtil-file_description-box">'
                                        + '<span>전체 메모</span>'
                                        + '<span id="formUtil-file_description">-</span>'
                                    + '</div>'
                                        + '<div class="formUtil-fileDownload_list">'
                                            + '<div class="formUtil-fileDownload_list-header">'
                                                 + '<ul class="gi-row-100">'
                                                   +' <li class="gi-row-10">NO</li>'
                                                   +' <li class="gi-row-40">파일명</li>'
                                                   +' <li class="gi-row-20">파일크기</li>'
                                                   +' <li class="gi-row-10">확장자</li>'
                                                   +' <li class="gi-row-25">설명</li>'
                                                   +' <li class="gi-row-15">다운로드</li>'
                                               +'</ul>'
                                           +'</div>'
                                            +'<div class="formUtil-fileDownload_list-contents gi-overflow-scroll">'
                                           +'</div>'
                                        +'</div>'
                                        +'<div>'
                                            +'<div class="gi-flex gi-flex-justify-content-flex-end">'
                                                +'<article class="formUtil-fileUpload_zip-body">'
                                                    +'<div>'
                                                        +'<div class="formUtil-fileDownload_zip-button gi-input-container gi-col-30px gi-flex gi-flex-justify-content-flex-end">'
                                                            +'<label for="formUtil-fileDownload_zip" class="gi-input-label" data-focus-label="false" data-focus-label-text-align="default" data-required="false">zip으로 압축하기</label>'
                                                            +'<input type="checkbox" id="formUtil-fileDownload_zip" name="formUtil-fileDownload_zip" data-focus-span-text-align="center" data-field="formUtil-fileDownload_zip" class="gi-input" />'
                                                        +'</div>'
                                                    +'</div>'
                                                +'</article>'
                                                +'<article class="gi-margin-left-5px formUtil-fileUpload_zip-body zipFileName gi-hidden">'
                                                    +'<div>'
                                                        +'<div class="formUtil-fileDownload_zip_name-body gi-input-container gi-col-30px">'
                                                            +'<label for="formUtil-fileDownload_zip_name" class="gi-input-label" data-focus-label="false" data-focus-label-text-align="default" data-required="false">zip파일명</label>'
                                                            +'<input id="formUtil-fileDownload_zip_name" name="formUtil-fileDownload_zip_name" data-focus-span-text-align="center" data-field="formUtil-fileDownload_zip_name" class="gi-input gi-col-50px" autocomplete="off"/>'
                                                        +'</div>'
                                                    +'</div>'
                                                +'</article>'
                                            +'</div>'
                                        +'<article class="formUtil-fileDownload_footer">'
                                            +'<button class="formUtil-fileDownload_uploadBtn">'
                                                +'<span>다운로드</span>'
                                                +'<span></span>'
                                            +'</button>'
                                            +'<button class="formUtil-fileDownload_cancelBtn">'
                                                +'<span>취소</span>'
                                                +'<span></span>'
                                            +'</button>'
                                        +'</article>'
                                    +'</div>'
                                +'</div>';
        let downloadButton = $("#"+id);
        //input 요소 이벤트 재 할당
        commonTag.inputTagReset($(".gi-input"));
        //첨부파일 버튼 클릭 이벤트
        downloadButton.off("click").on("click", async function () {
            let length = $(".fileUpload_body").length;
            if (0 === length) {
                $("#formUtil_fileUpload").append(contents);

                //파일 다운로드 로직 수행 이벤트
                downLoadClickEvent();

                //해당 테이블의 저장한 파일 정보를 search하는 이벤트
                addContents(await searchLogsFileList(path, uuid));
                addCommFileDescription(uuid);
                downLoadClickEvent();


            } else if (1 === length) {
                $("#formUtil_fileUpload").empty();
            }
        });
    }
    
    
    function downLoadClickEvent(){
        $(".formUtil-select-row").off("click").on("click",function(){
            let currentStatus = $(this).data("fileDownload");
            let newStatus = !currentStatus;
            $(this).data("fileDownload",newStatus);
            $(this).attr("data-file-download",newStatus);
        })
        
        //rows 를 multiy  select 하고 다운로드 버튼 클릭 이벤트
        $(".formUtil-fileDownload_uploadBtn").off().on("click",function(){
            let zipFileisChecked = $("#formUtil-fileDownload_zip").is(":checked");
            let selectRow = $(".formUtil-select-row[data-file-download]");

            let result = selectRow.map(function(i, e) {
                if ($(e).data("fileDownload")) {
                    return e;
                }
            }).get();
            if(formUtil.checkEmptyValue(result)){
                if(zipFileisChecked){
                    let fileZipFileName = $("#formUtil-fileDownload_zip_name").val();
                    if(!formUtil.checkEmptyValue(fileZipFileName)){
                        formUtil.alertPopup("zip 파일명을 입력해주세요");
                        return false;
                    }
                    let fileArray = result.map(function(e){
                        let cont = [];
                        cont = ({
                            "file_name":$(e).find(".file_id").text() +"."+ $(e).find(".file_extension").text(),
                            "file_path":$(e).find(".file_path").text(),
                            "file_zip_file_name":fileZipFileName,
                            "file_original_name":$(e).find(".file_name").text() +"."+ $(e).find(".file_extension").text()
                        });
                        return cont;
                    });
                    downloadZipFile(fileArray);
                }else{
                    let fileArray = result.map(function(e){
                        let cont = [];
                        cont = ({
                            "file_name":$(e).find(".file_id").text() +"."+ $(e).find(".file_extension").text(),
                            "file_path":$(e).find(".file_path").text(),
                            "file_original_name":$(e).find(".file_name").text() +"."+ $(e).find(".file_extension").text()
                        });
                        return cont;
                    });
                    downloadFile(fileArray);
                }
            }else{
                formUtil.alertPopup("파일을 선택해주세요");
            }
        })

        //개별 파일 다운로드 클릭 이벤트
        $(".formUtil-file_download").off().on("click",function(){
            let cont = [];
            let volume = $(this).closest(".formUtil-select-row");
            let fileName = volume.find(".file_id").text() +"."+ volume.find(".file_extension").text();
            let filePath = volume.find(".file_path").text();
            let originalFileName = volume.find(".file_name").text()+"."+ volume.find(".file_extension").text();

            cont.push({"file_name":fileName,"file_path":filePath,"file_original_name":originalFileName});
            downloadFile(cont);
        })

        //파일 다운로드 팝업창 닫기 이벤트
        $(".formUtil-fileDownload_cancelBtn").off().on("click",function(){
            $(".formUtil-fileDownload_body").remove();
        })

        //파일 다운로드 zip으로 묶는 옵션 선택 여부 확인 이벤트
        $("#formUtil-fileDownload_zip").on("change",function(){
            if($(this).is(":checked")){
                let selectRow = $(".formUtil-select-row[data-file-download]");

                let result = selectRow.map(function(i, e) {
                    if ($(e).data("fileDownload")) {
                        return e;
                    }
                }).get();
                if(!formUtil.checkEmptyValue(result)){
                    $(this).prop("checked",false);
                    formUtil.alertPopup("압축할 파일을 선택해주세요");
                }else{
                    $(".zipFileName").removeClass("gi-hidden");
                }
            }else{
                $(".zipFileName").addClass("gi-hidden");
                $("#formUtil-fileDownload_zip_name").val("");
            }
        })
    }

    async function searchLogsFileList(path,uuid){
        return new Promise((resolve, reject) => {
            let url = path;
            let param = {"uuid":uuid};
            axios.post(url , param).then(response => {
                resolve(response.data);
                // addContents(data);
                // addCommFileDescription(uuid);
                // downLoadClickEvent();
            }).catch(error =>{
                formUtil.alertPopup(error+"");
            })
        });
    }
    function addCommFileDescription(uuid){
        let url = "/fileManager/search";
        let data = {"file_id": uuid};
        axios.post(url ,data).then(response => {
            let data = response.data;
            $("#formUtil-file_description").text(data[0].file_description);
        }).catch(error =>{
            formUtil.alertPopup(error+"");
        })
    }
    function addContents(data){
        let contents = "";
        for(let i = 0; i<data.length; i++){
            let file_description = "-";
            if(formUtil.checkEmptyValue(data[i].file_description)){
                file_description = data[i].file_description;
            }
            contents += '<ul class="gi-ul gi-row-100 formUtil-select-row" data-file-download="false">'
                +'<li class="gi-row-10"><span>'+data[i].no+'</span></li>'
                +'<li class="gi-row-40 formUtil-file_name gi-overflow-scroll"><span class="file_name gi-row-100 gi-col-100">'+data[i].file_name+'</span></span></li>'
                +'<li class="gi-row-20 formUtil-file_size gi-overflow-scroll"><span class="file_size gi-row-100 gi-col-100">'+data[i].file_size+'</span></li>'
                +'<li class="gi-row-10 formUtil-file_extension gi-overflow-scroll"><span class="file_extension gi-row-100 gi-col-100">'+data[i].file_extension+'</span></li>'
                +'<li class="gi-row-25 formUtil-file_description gi-overflow-scroll"><span class="file_description gi-row-100 gi-col-100">'+file_description+'</span></li>'
                +'<li class="gi-row-15 formUtil-file_download gi-overflow-scroll"><span><i class="fa fa-download gi-row-100 gi-col-100"></i></span></li>'
                +'<li class="gi-row-10 formUtil-file_path gi-hidden gi-overflow-scroll"><span class="file_path gi-row-100 gi-col-100">'+data[i].file_path+'</span></li>'
                +'<li class="gi-row-10 formUtil-file_id gi-hidden gi-overflow-scroll"><span class="file_id gi-row-100 gi-col-100">'+data[i].file_id+'</span></li>'
                +'</ul>';
        }
        $(".formUtil-fileDownload_list-contents").html(contents);
    }

    //파일다운로드 로직 이벤트 
    function downloadFile(cont){
        let url = "/fileManager/download";
        let params = cont;
        let responseType = "blob";

        axios.post(url , params, { responseType: responseType }).then(response =>{
            let data = response.data;
            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');
            link.href = url;
            cont.map(function(e){
                link.setAttribute('download', e.file_original_name);
                document.body.appendChild(link);
                link.click();
            })

        }).catch(error =>{
            formUtil.alertPopup(error+" : 파일이 서버에 존재 하지 않습니다");
        })
    }
    function downloadZipFile(cont){
        let url = "/fileManager/downloadZipFile";
        let params = cont;
        let responseType = "blob";

        axios.post(url , params, { responseType: responseType }).then(response =>{
            let data = response.data;
            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', cont[0].file_zip_file_name+".zip");
            document.body.appendChild(link);
            link.click();

        }).catch(error =>{
            formUtil.alertPopup(error+"");
        })
    }
}
/**
 * @title : showMessage
 * @mgs : 출력 메세지 [String]
 * @text : 메세지가 나타났다가 자동으로 사라지는 기능
 * @writer : 이경태
 * */
FormUtility.prototype.showMessage = function(msg){
    let thisData = $(".showMessage");
    let message = msg;
    let html ="<div class='formUtil-showMessageBox'>"
                        +"<div class='showMessageText'>"+message+"</div>"
                    +"</div>";
    if(thisData.children().length  === 0 ){
        let sec = 2000;
        let millsec = sec/1000;

        thisData.append(html);
        thisData.children().css("animation","fadeout "+millsec+"s");

        setTimeout(function(){
            thisData.children().remove();
        },sec);
    }
}

/**
 * @title : axios response data hypen 생성
 * @value : Hypen 적용시킬 대상 값
 * @id    : Hypen 적용 유형(주민등록번호/사업자등록번호(REGINO), 제원관리번호(FORM_OKNO), 전화번호(TEL_NO), 날짜(YMD))
 * @writer : 문상혁
 */
FormUtility.prototype.setAutoHypen = function(value, id) {
    let addHypen = "";

    if(id.includes("REGINO")){
        if(value.length === 13){ // 주민번호 형식 하이픈 적용
            addHypen = value.replace(/(.{6})(.*)/, "$1-$2");
        }else{                   // 사업자등록번호 형식 하이픈 적용
            addHypen = value.replace(/(.{3})(.{2})(.{5})/, "$1-$2-$3");
        }
    } else if(id.includes("FORM_OKNO")){ //  제원관리번호 데이터 형식 하이픈 적용
        addHypen = value.replace(/^(.{3})(.{1})(.{5})(.{4})(.{4})$/, '$1-$2-$3-$4-$5');
    } else if(id.includes("TEL_NO")){    //  전화번호 데이터 형식 하이픈 적용
        addHypen = value.replace(/(\d{2,3})(\d{3,4})(\d{4})/, "$1-$2-$3");
    } else if(id.includes("YMD")){   //  날짜 데이터 형식 하이픈 적용
        addHypen = value.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
    } else {
        addHypen = value;
    }

    return addHypen;
}
/**
 * @title : setSpecialCharacters
 * @v : value 적용대상의 값[String]
 * @f : setStringFormat 적용대상의 형식 ex) "3,2,1" [String]
 * @s : 삽입할 특수 기호 ex) [String]
 * @text : 설정한 자리수에 특수 문자 넣어주는 기능
 * @writer : 이경태
 * */
FormUtility.prototype.setSpecialCharacters = function(v , f , s ){
    let cleaned = "";
    let stringFormatArray = [];
    let format = "";
    let resultFormat = "";
    let match = "";
    let returnValue = "";
    if(this.checkEmptyValue(v) && this.checkEmptyValue(f) && this.checkEmptyValue(s)){
        cleaned = v.replace(/\s/g, "");
        stringFormatArray = f.split(",");
        stringFormatArray.map(function(e,i){
            format += "(.{"+e+"})";
        });
        resultFormat = new RegExp("^"+format+"$");
        match = cleaned.match(resultFormat);
        if(match){
            match.map(function(e,i){
                if(0 === i){
                }else if(i === match.length-1){
                    returnValue += e;
                }else{
                    returnValue += e+s;
                }
            })
            return returnValue;
        }else{
            formUtil.alertPopup("match is "+ match+", length of value is not match" );
        }
    }else{
        this.alertPopup("The value does not Exist");
    }
}
/**
 * @title : transSpecialCharacter
 * @v : value 값[String]
 * @f : setStringFormat 적용대상의 형식 ex) 다중 직접정의 :"3,2,1" 단일자리수 "3" [String]
 * @s : 삽입할 특수 기호 ex) [String]
 * @text : 설정한 자리수에 특수 문자 넣어주거나 이미 해당 특수문자가 있으면 제거해서 반환
 *         특수문자를 제거해서 반환하고 싶으면 formUtil.transSpecialChar("1,000","",","); f 값은 빈값으로 넘겨주고 제거할 특수문자를 삽입해준다.
 * @writer : 이경태
 * */
FormUtility.prototype.transSpecialChar = function(v,f,s){
    let cleaned = "";
    let format = "";
    let returnValue = "";
    let resultFormat = "";
    let match = "";
    let stringFormatArray = [];
    let e = "";
    try{
        if(v.length <= parseInt(f)){
            e = "Value cannot be smaller \n than the number you want to divide";
            throw e;
        }
        if(!this.checkEmptyValue(v)){
            e = "Value is undefined";
            throw e;
        }
        if(!this.checkEmptyValue(s)){
            e = "SpecialCharacter is undefined";
            throw e;
        }
        cleaned = v.replace(/\s/g, "");
        if(cleaned.includes(s)){
            returnValue = cleaned.replaceAll(s,"");
        }else{
            if(f.includes(",")){
                stringFormatArray = f.split(",");
                stringFormatArray.map(function(e,i){
                    format += "(.{"+e+"})";
                });
                resultFormat = new RegExp("^"+format+"$");
                match = cleaned.match(resultFormat);
                if(!this.checkEmptyValue(match)){
                    throw "Did Not Macthed Value of length";
                }
                if(match){
                    match.map(function(e,i){
                        if(0 === i){
                        }else if(i === match.length-1){
                            returnValue += e;
                        }else{
                            returnValue += e+s;
                        }
                    })
                }else{
                    throw e;
                }
            }else{
                let reversed = cleaned.split("").reverse().join("");
                let formatted = "";
                for (let i = 0; i < reversed.length; i++) {
                    if (i > 0 && i % parseInt(f) === 0) {
                        formatted += s;
                    }
                    formatted += reversed.charAt(i);
                }
                formatted = formatted.split("").reverse().join("");
                returnValue = formatted;
            }
        }
        return returnValue;
    }catch (e){
        this.alertPopup("transSpecialCharacter: "+e);
    }
}

FormUtility.prototype.activatedMenu = function (reqUrl) {
    let sessionUrl = JSON.parse(sessionStorage.getItem("recentPage")).url;

    if(sessionUrl !== "/index/index" && sessionUrl !== "/" && sessionUrl !== "/common/myinfo" && (!reqUrl.includes("Register") || !reqUrl.includes("Modify"))){
        if (sessionUrl.startsWith('/safety/safetyInspection')) sessionUrl = sessionUrl.replaceAll('New', '').replaceAll('Continuous','');
        let refineRecentPage = sessionUrl.replaceAll("Detail","List").replaceAll("Register","List").replaceAll("Modify","List").replaceAll("_2","");
        let refineRecentPageInfo = {
            url : refineRecentPage
        };
        sessionStorage.setItem("recentPage", JSON.stringify(refineRecentPageInfo));
    }

    if(reqUrl.slice(-6) !== "Detail" && reqUrl.slice(-6) !== "Modify" && reqUrl !== "/index/index" && reqUrl !== "/common/myinfo"){
        let activatedMenuInfo = {
            url : reqUrl
        }
        sessionStorage.setItem("activatedMenu", JSON.stringify(activatedMenuInfo));

        // 모든 버튼 닫기 처리 후
        let allLiButtonList = $("#side_nav_menu > li");

        allLiButtonList.each(function (){
            let $button = $(this);
            $button.find("a:not(.sideNavPageLoad)").removeClass("active").addClass("collapsed");
            $button.find("a.sideNavPageLoad").removeClass("active page");
            $button.find("ul").stop(true, true).slideUp(150);
        });

        if(formUtil.checkEmptyValue(reqUrl) && reqUrl !== "/index/index" && reqUrl !== "/common/myinfo"){
            let $activatedMenu = $("[data-page-name='" + reqUrl.toString() + "']");
            let menuLevel1 = $activatedMenu.parents("li").last().children("a");
            let menuLevel2 = $activatedMenu.closest("ul").closest("li").children("a");

            menuLevel1.trigger("click");
            menuLevel2.trigger("click");
            $activatedMenu.addClass("active page");
        }
    }
}

FormUtility.prototype.loadContent = function(reqUrl,DATA){
    let cont = JSON.stringify(DATA);
    let url = `/common/redirectPage/redirect?url=${encodeURIComponent(reqUrl+".html")}`;
    axios.get(url).then(response => {
        this.resetFormUtilityValue();
        let pageSources = response.data;

        $("#gi-road-content").empty().html(pageSources);

        if(!formUtil.checkEmptyValue(sessionStorage.getItem("DATA"))){
            sessionStorage.removeItem("DATA");
            sessionStorage.setItem("DATA",cont);
        }else{
            sessionStorage.removeItem("DATA");
            sessionStorage.setItem("DATA",cont);
        }

        if(typeof changedHomeType !== "undefined" && formUtil.checkEmptyValue(changedHomeType)){
            $("#gi-road-content article:first").each(function() {
                this.style.setProperty("width", "100%", "important");
                if(!$(this).hasClass("gi-col-99") && !$(this).hasClass("gi-col-100")){
                    this.style.setProperty("height", "98%", "important");
                }
            });

            $("#gi-road-content article#gi-search-popup").addClass("gi-row-84-important");
        }

        formUtil.activatedMenu(reqUrl);

    })
        .catch(error => {
            this.alertPopup('Failed to load content:', error);
        });
}
/**
 * @text : API Gateway를 통한 loadContent
 * @param prefixUrl
 * @param reqUrl
 * @param DATA
 */
FormUtility.prototype.apiLoadContent = function(prefixUrl,reqUrl,DATA){
    let cont = JSON.stringify(DATA);
    let url = prefixUrl+`/page/load`+`?url=${encodeURIComponent(reqUrl+".html")}`;
    axios.get(url).then(response => {
        this.resetFormUtilityValue();
        let pageSources = response.data;

        $("#gi-road-content").empty().html(pageSources);

        if(!formUtil.checkEmptyValue(sessionStorage.getItem("DATA"))){
            sessionStorage.removeItem("DATA");
            sessionStorage.setItem("DATA",cont);
        }else{
            sessionStorage.removeItem("DATA");
            sessionStorage.setItem("DATA",cont);
        }
    }).catch(error => {
        this.alertPopup('Failed to load content:', error);
    });
}
/**
 * @title : loadToHtml .html 코드 삽입 함수
 * @cont :[url:url,data:data]
 * @text : html코드를 사입 하기 위한 함수 함수앞에 awaite 추가  ex) awaite formUtil.loadToHtml(cont)
 * @writer : 이경태
 * */
FormUtility.prototype.loadToHtml = async function(cont){
    return new Promise(resolve => {
        let url = `/common/redirectPage/redirect?url=${encodeURIComponent(cont.url+".html")}`;
        let data = JSON.stringify(cont.data);
        axios.get(url).then(response => {
            if(formUtil.checkEmptyValue(response)){
                if(!formUtil.checkEmptyValue(sessionStorage.getItem("DATA"))){
                    sessionStorage.removeItem("DATA");
                    sessionStorage.setItem("DATA",data);
                }else{
                    sessionStorage.removeItem("DATA");
                    sessionStorage.setItem("DATA",data);
                }

                return resolve(response.data);
            }
        }).catch(error => {
                this.alertPopup('Failed to load content:', error);
        });
    })
}

/**
 * @title : giCalendarSeletedDate
 * @text : 달력에서 날짜를 선택하면 그 값을 리턴한다.
 * @writer : 이경태
 * */
FormUtility.prototype.giCalendarSeletedDate = function(e){
    return giCalendarSeletedDateList;
}
/**
 * @title : giCalendar
 * @e : giCalendar ID
 * @text : 달력 생성 , giCalendarSeletedDate를 통해 선택한 값을 불러올 수 있다.
 * @writer : 이경태
 * */
let addScheduleFlag = false;
let addClickDateFlag = false;
let addClickDateSettingFunction = "";
let addScheduleParameter = "";
let addScheduleFunction;
let setAfterEventFlag = false;
let setAfterEventFunction;
FormUtility.prototype.giCalendar = function(e){
    let date = new Date();
    let nowMonth = 0;
    let nowYear = 0;

    if(undefined !== e){ //prev , next Month 클릭시
        date = e;
        nowYear = date.getFullYear();
        nowMonth = date.getMonth()+1;
    }else{ // 기본 현재 달력 정보(year , month)
        nowYear = date.getFullYear()
        nowMonth = date.getMonth()+1;
    }

    let text_nowMonth = nowMonth; //달력에 월 표시

    let preMonthEndData = new Date(nowYear, nowMonth-1 ,0); // 전달 마지막날 데이터
    let nowMonthEndData = new Date(nowYear , nowMonth , 0); // 현재달 마지막 날 데이터
    let nowMonthStrData = new Date(nowYear , nowMonth-1 ); // 현재달 첫째날 데이터
    let giCalendarNextMonthStrData = new Date(nowYear , nowMonth,1); // 다음달 첫날 데이터


    let preEndDay = preMonthEndData.getDate(); // 전달 마지막 날짜
    let endDay = nowMonthEndData.getDate(); // 현재 마지막 날짜
    let endDate =nowMonthEndData.getDay(); //현재 마지막 날
    let strDate =nowMonthStrData.getDay(); //현재 처음 날
    let nextStrDate = giCalendarNextMonthStrData.getDate(); // 다음달 첫 날짜

    let weekly_date_html = "";

    let preDate_no = 0;
    let nextDate_no = 0;
    if(1 !== strDate){
        if(0 === strDate){
            preDate_no = 6;
        }else{
            preDate_no = strDate - 1;
        }
    }
    if(0 !== endDate){
        nextDate_no = 7 - endDate;
    }
    // 달력 헤더설정
    let CalendarBox ='<div id="gi-calendar-main" class="gi-col-100 gi-row-100">'
        +'<div class="gi-calendar-top gi-flex gi-flex-justify-content-center">'
        // +'<div class="gi-calendar-pre gi-col-20px gi-flex gi-cursor-pointer" onclick="giCalendarPrevMonth()"><i class="fa-solid fa-angle-left"></i></div>'
        +'<div class="gi-calendar-pre gi-col-20px gi-flex gi-cursor-pointer"><i class="fa-solid fa-angle-left"></i></div>'
        +'<div class="gi-calendar-top-date gi-col-40 gi-row-100 gi-flex gi-flex-align-items-center gi-flex-justify-content-center"><span class="gi-calendar-YEAR">'+nowYear+'</span>년<span class="gi-calendar-MONTH">'+text_nowMonth+'</span>월</div>'
        // +'<div class="gi-calendar-next gi-col-20px gi-flex gi-cursor-pointer" onclick="giCalendarNextMonth()"><i class="fa-solid fa-angle-right"></i></div>'
        +'<div class="gi-calendar-next gi-col-20px gi-flex gi-cursor-pointer"><i class="fa-solid fa-angle-right"></i></div>'
        +'</div>'
        +'<div class="gi-calendar-week gi-flex gi-flex-justify-content-center">'
        +'<div class="gi-calendar-week-content">월</div>'
        +'<div class="gi-calendar-week-content">화</div>'
        +'<div class="gi-calendar-week-content">수</div>'
        +'<div class="gi-calendar-week-content">목</div>'
        +'<div class="gi-calendar-week-content">금</div>'
        +'<div class="gi-calendar-week-content">토</div>'
        +'<div class="gi-calendar-week-content">일</div>'
        +'</div>'
        +'<div id ="gi-calendar-weekly-box" class="gi-calendar-weekly gi-flex gi-col-100">'
        +'</div>'
        +'</div>'

    $("#gi-calendar").html(CalendarBox);
    $(".gi-calendar-pre").off("click.calendarPreClickEventHandler").on("click.calendarPreClickEventHandler",calendarPreClickEventHandler);
    $(".gi-calendar-next").off("click.calendarNextClickEventHandler").on("click.calendarNextClickEventHandler",calendarNextClickEventHandler);

    function calendarPreClickEventHandler(){
        if(formUtil.checkEmptyValue(addScheduleFlag) && formUtil.checkEmptyValue(addScheduleParameter)){
            giCalendarPrevMonth(addScheduleFlag,addScheduleParameter);
        }else if(formUtil.checkEmptyValue(addClickDateFlag) ){
            giCalendarPrevMonth(addClickDateFlag);
        }else{
            giCalendarPrevMonth();
        }
    }
    function calendarNextClickEventHandler(){
        if(formUtil.checkEmptyValue(addScheduleFlag) && formUtil.checkEmptyValue(addScheduleParameter)){
            giCalendarNextMonth(addScheduleFlag,addScheduleParameter);
        }else if(formUtil.checkEmptyValue(addClickDateFlag) ) {
            giCalendarNextMonth(addClickDateFlag);
        }else{
            giCalendarNextMonth();
        }
    }
    //  현재 달력의 남은 부분 전 달 날짜로 채워 넣기
    for(let j = preDate_no; j--;){
        weekly_date_html += '<div class="gi-calendar-weekly-date-layer">'
            +'<div class="gi-calendar-weekly-date gi-calendar-weekly-pre-date">'+(preEndDay-j)+'</div>'
            +'</div>';

    }
    // 현재 달력 출력
    for(let i =1; i < endDay+1; i++){
        let date = new Date(nowYear, nowMonth - 1, i);
        let day = date.getDay();
        let weekend = (0 === day || day === 6) ? "Y" : "N";
        let sunday = 0 === day ? "Y" : "N";
            weekly_date_html += '<div class="gi-calendar-weekly-date-layer">'
                                     +'<div class="gi-calendar-weekly-date" data-weekend="'+weekend+'" data-day-select="false" data-detail-status="false" data-holiday="N" data-sunday="'+sunday+'" data-nowdate="'+i+'">'
                                         // +'<div class="gi-day gi-row-100 gi-overflow-scroll gi-flex gi-flex-justify-content-space-between gi-flex-align-items-center">'
                                         +'<div class="gi-day gi-row-100 gi-flex gi-flex-justify-content-space-between gi-flex-align-items-center">'
                                            +'<div class="gi-holiday"></div>'+i
                                         +'</div>'
                                         +'<div class="gi-day-schedule gi-overflow-scroll gi-flex gi-flex-align-items-center"></div>'
                                     +'</div>'
                                 +'</div>'
    }

    //  현재 달력의 끝부분 남는 부분 다음 달 날짜로 채워 넣기
    for(let k =0; k<nextDate_no; k++){
        weekly_date_html += '<div class="gi-calendar-weekly-date-layer">'
            +'<div class="gi-calendar-weekly-date gi-calendar-weekly-next-date">'+(nextStrDate+k)+'</div>'
            +'</div>'
    }
    $("#gi-calendar-main > #gi-calendar-weekly-box").html(weekly_date_html);

    giCalendarToDayCheck(); //오늘 날짜 표시
    if(!formUtil.checkEmptyValue(sessionStorage.getItem("holiday"+nowYear))){
        searchHoliday(nowYear,nowMonth); //공휴일 조회
    }else{
        giCalendarAddHoliday(nowYear,nowMonth); //달력에 공휴일 표시
    }

    function setSchedulerEvent(){
        addScheduleHandler(addScheduleParameter, nowYear ,nowMonth);
    }
    function setClickDateEvent(){
        addScheduleClickHandler(addClickDateSettingFunction,nowYear ,nowMonth);
    }

    return {
        setEventChoiceDate:function(){
            /**
             * 날짜선택 이벤트
             **/
            $(".gi-calendar-weekly-date").on("click",function(){
                if(formUtil.checkEmptyValue($(this).data("daySelect"))){
                    if(!$(this).data("daySelect") && "N" === $(this).data("holiday") && "N" === $(this).data("weekend")){
                        $(this).data("daySelect",true);
                        $(this).attr("data-day-select",true);
                        giCalendarSeletedDateList.push({year:nowYear.toString(),month:nowMonth.toString(),date:$(this).data("nowdate").toString()});
                    }else{
                        $(this).data("daySelect",false);
                        $(this).attr("data-day-select",false);
                        giCalendarSeletedDateList = giCalendarSeletedDateList.filter(item =>{
                            let itemKey  = item.year+item.month+item.date;
                            return item !== itemKey;
                        });
                    }
                }else{
                }
            });
        },
        // 날짜 클릭시 일정 디테일 생성 이벤트
        addClickDateEvent:async function(fn){
            addClickDateFlag = true;
            addClickDateSettingFunction = fn;
            setClickDateEvent();

        },
        /**
         * @title : giCalendarAddSchedule
         * @text : 일정추가
         * @writer : 이경태
         * @cont : Array
         * @cont[url, dateColumn, memo, prefixMemoText, suffixMemoText ,param:{ table parameter setting} ]
         * @url : 컨트롤러 url
         * @dateColumn : 지정된 날짜 컬럼
         * */
        addSchedule: function(cont,fn){
            addScheduleFlag = true;
            addScheduleParameter = cont;
            addScheduleFunction = fn;
            setSchedulerEvent();
        },
        addClickDateEventSetAfterEvent:function(event){
            setAfterEventFlag = true;
            setAfterEventFunction = event;
        }
    }
    async function addScheduleHandler(cont,nowYear,nowMonth) {
        let targetColumn = cont.dateColumn;
        let memoColumn = "";
        let prefixIcon = '<i class="gi-text-align-right gi-row-40 fa-regular fa-circle gi-row-100"></i>';
        let suffixIcon = "";
        let flexJustifyContent = "gi-flex-justify-content-";
        let textAlign = "flex-start";
        let defaultPrefixRow = "gi-row-15";
        let defaultSuffixRow = "gi-row-15";
        let defaultMemoRow = "gi-row-70";
        if(formUtil.checkEmptyValue(cont.memoColumn)) {
            memoColumn = cont.memoColumn;
        }
        if(formUtil.checkEmptyValue(cont.prefixMemoText)) {
            prefixIcon = cont.prefixMemoText;
            defaultPrefixRow = "";
            defaultMemoRow = "";
        }
        if(formUtil.checkEmptyValue(cont.suffixMemoText)){
            suffixIcon = cont.suffixMemoText;
            defaultSuffixRow = "";
            defaultMemoRow = "";
        }
        if(formUtil.checkEmptyValue(cont.text_align)) textAlign = cont.text_align;
        let data = await findByScheduleTable(cont,nowYear,nowMonth);
        let tableData = []; // 테이블 연동시 데이터 매핑 해줄 변수
        data.map((item) => {
            item[targetColumn] = item[targetColumn].replaceAll("-","");

            let param = {
                target_yyyy: item[targetColumn].substring(0, 4),
                target_mm: item[targetColumn].substring(4, 6),
                target_dt: item[targetColumn].substring(6, 8),
                memo: formUtil.checkEmptyValue(memoColumn) ? item[memoColumn] : ""
            }
            tableData.push(param);
        })
        let gi_schedule_data = "";
        if (tableData.length !== 0) {
            for (let i = 0; i < tableData.length; i++) {
                let schedule_date = tableData[i].target_dt;
                if(schedule_date.charAt(0) === "0"){
                    schedule_date = schedule_date.replace('0','');
                }
                // gi_schedule_data = '<div class="gi-row-90 gi-flex-justify-content-flex-end gi-flex gi-flex-align-items-center"><span>'+prefixIcon+'</span><div class="gi-row-60 gi-text-align-right">' + tableData[i].memo + '</div><span>'+suffixIcon+'</span></div>';
                gi_schedule_data = '<div class="gi-row-90 gi-flex gi-flex-align-items-center '+flexJustifyContent+textAlign+'"><span class="gi-padding-left-right-5px '+defaultPrefixRow+'">'+prefixIcon+'</span><div class="gi-text-align-right '+defaultMemoRow+'">' + tableData[i].memo + '</div><span class="gi-padding-left-right-5px '+defaultSuffixRow+'">'+suffixIcon+'</span></div>';
                $(".gi-calendar-weekly-date[data-nowdate=" + schedule_date + "] > .gi-day-schedule").append(gi_schedule_data);
            }
            if(formUtil.checkEmptyValue(addScheduleFunction)){
                addScheduleFunction(data);
            }
        }

    }
}
async function findByScheduleTable(cont,nowYear,nowMonth) {

    let _targetColumn = "_"+cont.dateColumn;
    return new Promise(function (resolve) {
        let url = cont.url;
        let param = {};
        if(formUtil.checkEmptyValue(cont.param)){
            for(let key in cont.param){
                param[key] = cont.param[key];
            }
        }
        let resultNowMonth = nowMonth.toString().padStart(2,'0');
        param[_targetColumn] =  nowYear + "" + resultNowMonth;
        axios.post(url, param).then(response => {
            return resolve(response.data);
        }).catch(error => {
            formUtil.alertPopup(error + "");
        })
    })
}
function addScheduleClickHandler(fn,nowYear ,nowMonth){
    let  $giCalendarWeeklyDate = $(".gi-calendar-weekly-date").not(".gi-calendar-weekly-pre-date").not(".gi-calendar-weekly-next-date");
    $giCalendarWeeklyDate.off("click.clickDateEventHandler").on("click.clickDateEventHandler",async function(e){
        await clickDateEventHandler(e);
    });
    async function clickDateEventHandler(e){
        let sundayFlag = $(e.currentTarget).data("sunday") === "N";
        let detail_cnt = $(".gi-schedule-detail").length;
        let detail_isEmpty = $(e.currentTarget).children(".gi-day-schedule").children().length === 0;
        let day =$(e.currentTarget).data("nowdate");
        let $giCalendarWeeklyDateDataNowDate = $(".gi-calendar-weekly-date[data-nowdate='"+day+"']");
        let detailStatus = $giCalendarWeeklyDateDataNowDate.data("detailStatus");
        let scheduleDetailHtml = "";
        let StringNowMonth = nowMonth.toString().padStart(2,'0');
        let StringNowDay = day.toString().padStart(2,'0')
        let returnData = {
            YEAR: nowYear,
            MONTH: StringNowMonth ,
            DAY: StringNowDay,
            EVENT: e,
            DATA : addScheduleParameter
        };
        if(detail_isEmpty) return false;
        if(1 <= detail_cnt){
            if (detailStatus) {
                $giCalendarWeeklyDateDataNowDate.parent().children(".gi-schedule-detail").remove();
                $giCalendarWeeklyDateDataNowDate.data("detail-status", false);
            }else{
                if(sundayFlag){
                    if(formUtil.checkEmptyValue(fn)) scheduleDetailHtml = await fn(returnData);
                    $giCalendarWeeklyDate.parent().children(".gi-schedule-detail").remove();
                    $giCalendarWeeklyDate.data("detail-status", false);
                    let detailHtml = '<div class="gi-schedule-detail">'
                        +'<div class="gi-schedule-detail-cancel-button"><i class="fa-solid fa-xmark"></i></div>'
                        +'<div class="gi-schedule-detail-title-box gi-flex ">'
                        +scheduleDetailHtml
                        +'</div>';

                    $giCalendarWeeklyDateDataNowDate.parent().append(detailHtml);
                    $giCalendarWeeklyDateDataNowDate.data("detail-status", true);
                    let children = $(".gi-schedule-detail-title-box").children()[0];
                    if(formUtil.checkEmptyValue(children)) {
                        $(".gi-schedule-detail").css("width",children.offsetWidth+"px");
                        $(".gi-schedule-detail").css("height",children.offsetHeight+"px");
                    }
                }else{
                    return false;
                }
            }


        }else{
            if (detailStatus) {
                $giCalendarWeeklyDateDataNowDate.parent().children(".gi-schedule-detail").remove();
                $giCalendarWeeklyDateDataNowDate.data("detail-status", false);
            } else {
                if(sundayFlag){
                    if(formUtil.checkEmptyValue(fn)) scheduleDetailHtml = await fn(returnData);

                    let detailHtml = '<div class="gi-schedule-detail">'
                        +'<div class="gi-schedule-detail-cancel-button"><i class="fa-solid fa-xmark"></i></div>'
                        +'<div class="gi-schedule-detail-title-box gi-flex ">'
                        +scheduleDetailHtml
                        +'</div>';

                    $giCalendarWeeklyDateDataNowDate.parent().append(detailHtml);
                    $giCalendarWeeklyDateDataNowDate.data("detail-status", true);
                    let children = $(".gi-schedule-detail-title-box").children()[0];
                    if(formUtil.checkEmptyValue(children)) {
                        $(".gi-schedule-detail").css("width",children.offsetWidth+"px");
                        if(children.offsetHeight === 0){
                            $(".gi-schedule-detail").css("height","auto");
                        }else{
                            $(".gi-schedule-detail").css("height",children.offsetHeight+"px");
                        }

                    }

                }else{
                    return false;
                }
            }
        }
        if(setAfterEventFlag){
            setAfterEventFunction(e);
        }
        $(".gi-schedule-detail-cancel-button").on("click",function(){
            $giCalendarWeeklyDateDataNowDate.parent().children(".gi-schedule-detail").remove();
            $giCalendarWeeklyDateDataNowDate.data("detail-status", false);
        })
    }
}
/**
 * @title : searchHoliday
 * @text : 공공포탈 API 공휴일 정보 받아오는 함수
 * @writer : 이경태
 * */
function searchHoliday(nowYear,nowMonth){
    let url = "/api/open/holiday/search";
    let param= {
        year : nowYear
    }
    axios.post(url,param).then(response =>{

        let data = response.data[0].response.body.items.item;
        if(!formUtil.checkEmptyValue(sessionStorage.getItem("holiday"+nowYear))){
            sessionStorage.setItem("holiday"+nowYear, JSON.stringify(data));
            giCalendarAddHoliday(nowYear,nowMonth);
        }
    }).catch(error => {
        console.log("공휴일 API가 존재하지 않습니다. 관리자에게 문의해주세요");
    })

}
/**
 * @title : colorSelector
 * @text : 일정 detail 박스에 초기 시간 셋팅
 * @writer : 이경태
 * */
function giCalendarColorSelector(e){
    let colorOptions = [{ value: "#FF0000", text: "Red" },
        { value: "#0000FF", text: "Blue" },
        { value: "#00FF00", text: "Green" },
        { value: "#FFFF00", text: "Yellow" },
        { value: "#FFA500", text: "Orange" }];
    let options = '';
    for(let i = 0;  i < colorOptions.length; i++){i
        options += '<option value="'+colorOptions[i].value+'">'+colorOptions[i].text+'</option>';
    }
    $("."+e).append(options);
}

/**
 * @title : resetTime
 * @text : 일정 detail 박스에 초기 시간 셋팅
 * @writer : 이경태
 * */
function resetTime(startTime , endTime){
    $("."+startTime).val("12:00");
    $("."+endTime).val("13:00");
}
/**
 * @title : giCalendarToDayCheck
 * @text : 달력에 오늘 날짜 표시 해주는 함수
 * @writer : 이경태
 * */
function giCalendarToDayCheck(){
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth()+1;
    let today = date.getDate();

    let checkYear = parseInt($(".gi-calendar-YEAR").text());
    let checkMonth = parseInt($(".gi-calendar-MONTH").text());

    //현재 년,월이 달력의 checkYear ,checkMonth 가 각가 같으면 today(오늘)을 표시 해준다.
    if(checkYear === year && checkMonth === month){
        $(".gi-calendar-weekly-date[data-nowdate='"+today+"'] > .gi-day").parent().css(
            {
                "border": "1px solid #d1d1d1"
                ,"box-shadow": "0px 0px 8px #0000003b"
            }
        )
    }
}
/**
 * @title : giCalendarAddHoliday
 * @text : 공휴일추가
 * @writer : 이경태
 * */
function giCalendarAddHoliday(year,month){
    if(formUtil.checkEmptyValue(sessionStorage.getItem("holiday"+year))){
        if(formUtil.checkEmptyValue(JSON.parse(sessionStorage.getItem("holiday"+year)))){
            let holidayData = JSON.parse(sessionStorage.getItem("holiday"+year));
            let tableData = [];
            holidayData.map(e =>{
                let target_yyyy = parseInt(e.locdate.toString().substring(0,4));
                let target_mm =parseInt(e.locdate.toString().substring(4,6));
                let target_dt = parseInt(e.locdate.toString().substring(6,8)).toString();
                let memo = e.dateName;
                let isholiday = e.isHoliday;
                tableData.push({
                        "target_yyyy":target_yyyy,
                        "target_mm":target_mm,
                        "target_dt":target_dt,
                        "memo":memo,
                        "isholiday":isholiday
                })
            })

            if(tableData.length !== 0){
                for(let i =0; i<tableData.length; i++){
                    if(year === tableData[i].target_yyyy && month === tableData[i].target_mm){
                        let schedule_date = tableData[i].target_dt
                        let gi_schedule_data  ='<div class="gi-flex gi-flex-align-items-center">'+tableData[i].memo+'</div>';

                        $(".gi-calendar-weekly-date[data-nowdate="+schedule_date+"] > .gi-day > .gi-holiday").append(gi_schedule_data);
                        if( "Y" === tableData[i].isholiday){
                            $(".gi-calendar-weekly-date[data-nowdate="+schedule_date+"]").attr("data-holiday","Y");
                        }
                    }
                }
            }
        }
    }else{

    }
}
/**
 * @title : giCalendarPrevMonth
 * @text : 이전달 조회
 * @writer : 이경태
 * */
function giCalendarPrevMonth(flag1 = addScheduleFlag,flag2 =addScheduleParameter, flag3 = addClickDateFlag) {
    let year = parseInt($(".gi-calendar-YEAR").text());
    let month = parseInt($(".gi-calendar-MONTH").text())-1;
    let date = new Date(year,month-1);
    let giCalendarGrid = formUtil.giCalendar(date);
    if(flag3){
        giCalendarGrid.addClickDateEvent(addClickDateSettingFunction);
    }
    if(flag1){
        giCalendarGrid.addSchedule(flag2);
    }
    if(setAfterEventFlag){
        giCalendarGrid.addClickDateEventSetAfterEvent(setAfterEventFunction);
    }
}
/**
 * @title : giCalendarNextMonth
 * @text : 다음달 조회
 * @writer : 이경태
 * */
function giCalendarNextMonth(flag1 = addScheduleFlag,flag2 =addScheduleParameter, flag3 = addClickDateFlag) {
    let year = parseInt($(".gi-calendar-YEAR").text());
    let month = parseInt($(".gi-calendar-MONTH").text())+1;

    let date = new Date(year,month-1);
    let giCalendarGrid = formUtil.giCalendar(date);
    if(flag3){
        giCalendarGrid.addClickDateEvent(addClickDateSettingFunction);
    }
    if(flag1){
        giCalendarGrid.addSchedule(flag2);
    }
    if(setAfterEventFlag){
        giCalendarGrid.addClickDateEventSetAfterEvent(setAfterEventFunction);
    }
}

/**
 * @title : giDatePicker
 * @e : {form_date ID, to_date ID}
 * @text : input 태그에 커스텀 태그로 사용 input[gi-datepicker]
 * @writer : 이경태
 * */
FormUtility.prototype.giDatePicker = function(input,e){
    let date = new Date();
    let nowMonth = 0;
    let nowYear = 0;
    let datepickerId = "gi-datepicker_calendar-main";
    if(formUtil.checkEmptyValue(e)){ //prev , next Month 클릭시
        date = e;
        nowYear = date.getFullYear();
        nowMonth = date.getMonth()+1;
    }else{ // 기본 현재 달력 정보(year , month)
        nowYear = date.getFullYear()
        nowMonth = date.getMonth()+1;
    }

    let text_nowMonth = nowMonth; //달력에 월 표시

    let preMonthEndData = new Date(nowYear, nowMonth-1 ,0); // 전달 마지막날 데이터
    let nowMonthEndData = new Date(nowYear , nowMonth , 0); // 현재달 마지막 날 데이터
    let nowMonthStrData = new Date(nowYear , nowMonth-1 ); // 현재달 첫째날 데이터
    let giCalendarNextMonthStrData = new Date(nowYear , nowMonth,1); // 다음달 첫날 데이터


    let preEndDay = preMonthEndData.getDate(); // 전달 마지막 날짜
    let endDay = nowMonthEndData.getDate(); // 현재 마지막 날짜
    let endDate =nowMonthEndData.getDay(); //현재 마지막 날
    let strDate =nowMonthStrData.getDay(); //현재 처음 날
    let nextStrDate = giCalendarNextMonthStrData.getDate(); // 다음달 첫 날짜

    let weekly_date_html = "";

    let preDate_no = 0;
    let nextDate_no = 0;
    if(1 !== strDate){
        if(0 === strDate){
            preDate_no = 6;
        }else{
            preDate_no = strDate - 1;
        }
    }
    if(0 !== endDate){
        nextDate_no = 7 - endDate;
    }
    // 달력 헤더설정
    let CalendarBox ='<div id="'+datepickerId+'" class="gi-col-100 gi-row-100 ">'
        +'<div class="gi-calendar-top gi-flex gi-flex-justify-content-center">'
        +'<div class="gi-calendar-pre gi-col-20px gi-flex gi-cursor-pointer" onclick="giDatePickerPrevMonth(\'' + input + '\')"><i class="fa-solid fa-angle-left"></i></div>'
        +'<div class="gi-calendar-top-date gi-col-40 gi-row-100 gi-flex gi-flex-align-items-center gi-flex-justify-content-center"><span class="gi-calendar-YEAR tilt-in-top-1">'+nowYear+'</span>년<span class="gi-calendar-MONTH tilt-in-top-1">'+text_nowMonth+'</span>월</div>'
        +'<div class="gi-calendar-next gi-col-20px gi-flex gi-cursor-pointer" onclick="giDatePickerNextMonth(\'' + input + '\')"><i class="fa-solid fa-angle-right"></i></div>'
        +'</div>'
        +'<div class="gi-calendar-week gi-flex gi-flex-justify-content-center">'
        +'<div class="gi-calendar-week-content">월</div>'
        +'<div class="gi-calendar-week-content">화</div>'
        +'<div class="gi-calendar-week-content">수</div>'
        +'<div class="gi-calendar-week-content">목</div>'
        +'<div class="gi-calendar-week-content">금</div>'
        +'<div class="gi-calendar-week-content">토</div>'
        +'<div class="gi-calendar-week-content">일</div>'
        +'</div>'
        +'<div id ="gi-calendar-weekly-box" class="gi-calendar-weekly gi-flex gi-col-100">'
        +'</div>'
        +'</div>'

    $("#giDatePicker").html(CalendarBox);

    //  현재 달력의 남은 부분 전 달 날짜로 채워 넣기
    for(let j = preDate_no; j--;){
        weekly_date_html += '<div class="gi-calendar-weekly-date-layer">'
            +'<div class="gi-calendar-weekly-date gi-calendar-weekly-pre-date">'+(preEndDay-j)+'</div>'
            +'</div>';

    }
    if($("#"+input).attr("gi-datepicker") === "notBeforeDate"){
        // 오늘보다 이전 선택 불가 달력 출력
        notBeforeSelect();
    }else if($("#"+input).attr("gi-datepicker") === "notAfterDate"){
        // 오늘보다 이후 선택 불가 달력 출력
        notAfterSelect();
    }else if($("#"+input).attr("gi-datepicker") === "fromTodayUntilAMonthLater"){
        // 오늘 포함 한달 뒤 까지만 선택 가능
        fromTodayUntilAMonthLaterSelect();
    }else if($("#"+input).attr("gi-datepicker") === "setRange"){
        // gi-date-min , gi-date-max 사이의 날짜만 선택 가능 (min, max는 옵셔널이며 'YYYY-MM-DD')
        selectByRange();
    }else{
        nowMonthSelectAble();
    }


    //  현재 달력의 끝부분 남는 부분 다음 달 날짜로 채워 넣기
    for(let k =0; k<nextDate_no; k++){
        weekly_date_html += '<div class="gi-calendar-weekly-date-layer">'
            +'<div class="gi-calendar-weekly-date gi-calendar-weekly-next-date">'+(nextStrDate+k)+'</div>'
            +'</div>'
    }

    $("#"+datepickerId+" > #gi-calendar-weekly-box").html(weekly_date_html);

    giCalendarToDayCheck(); //오늘 날짜 표시

    /**
     * 날짜선택 이벤트
     **/
    $(".gi-calendar-weekly-date").on("click",function(e){
        //이전달 날자 선택 불가
        if(!$(this).hasClass("gi-calendar-weekly-next-date") && !$(this).hasClass("gi-calendar-weekly-pre-date")){
            let date = $(this).data("nowdate").toString().padStart(2,'0');
            let month  = $(e.currentTarget).parents().find("#"+datepickerId).find(".gi-calendar-MONTH").text().padStart(2,'0');
            let year = $(e.currentTarget).parents().find("#"+datepickerId).find(".gi-calendar-YEAR").text();
            let selectDate = year +"-"+month+"-"+date;
            $("#"+input).val(selectDate).trigger("change");
            commonTag.inputTagReset($(".gi-input"));
            giDatepickerBodyEmpty();
        }
    });
    $(".gi-day").on("click",function(e){
        let date = $(this).parent().data("nowdate").toString().padStart(2,'0');
        let month  = $(e.currentTarget).parents().find("#"+datepickerId).find(".gi-calendar-MONTH").text().padStart(2,'0');
        let year = $(e.currentTarget).parents().find("#"+datepickerId).find(".gi-calendar-YEAR").text();
        let selectDate = year +"-"+month+"-"+date;
        $("#"+input).val(selectDate).trigger("change");
        commonTag.inputTagReset($(".gi-input"));
        giDatepickerBodyEmpty();
    });
    $(document).off("mousedown.calendarMouseDownEventHandler").on("mousedown.calendarMouseDownEventHandler", function(event) {
        calendarMouseDownEventHandler(event);

    });
    function calendarMouseDownEventHandler(event){
        // 클릭한 요소를 확인
        const target = $(event.target);
        // `gi-calendar-main` 또는 그 하위 요소를 클릭했는지 확인
        if (!target.closest("#gi-datepicker_calendar-main").length) {
            giDatepickerBodyEmpty();
        }
    }



    function giDatepickerBodyEmpty(){
        $("#giDatepickerBody").empty();
    }
    function nowMonthSelectAble(){
        // 현재 달력 출력
        for(let i =1; i < endDay+1; i++){
            let date = new Date(nowYear, nowMonth - 1, i);
            let day = date.getDay();
            let weekend = (0 === day || day === 6) ? "Y" : "N";

            weekly_date_html += '<div class="gi-calendar-weekly-date-layer">'
                +'<div class="gi-calendar-weekly-date" data-weekend="'+weekend+'" data-day-select="false" data-detail-status="false" data-holiday="N" data-nowdate="'+i+'">'
                // +'<div class="gi-day gi-row-100 gi-overflow-scroll gi-flex gi-flex-justify-content-space-between gi-flex-align-items-center">'
                +'<div class="gi-day gi-row-100 gi-flex gi-flex-justify-content-space-between gi-flex-align-items-center">'
                +'<div class="gi-holiday"></div>'+i
                +'</div>'
                +'<div class="gi-day-schedule gi-overflow-scroll gi-flex gi-flex-align-items-center"></div>'
                +'</div>'
                +'</div>'
        }
    }
    function notBeforeSelect(){
        for(let i =1; i < endDay+1; i++){
            let date = new Date(nowYear, nowMonth - 1, i);
            let day = date.getDay();
            let weekend = (0 === day || day === 6) ? "Y" : "N";
            let toDate = new Date();
            if(date < toDate){
                weekly_date_html += '<div class="gi-calendar-weekly-date-layer">'
                    +'<div class="gi-calendar-weekly-date gi-calendar-weekly-pre-date">'+i+'</div>'
                    +'</div>';

            }else{
                weekly_date_html += '<div class="gi-calendar-weekly-date-layer">'
                    +'<div class="gi-calendar-weekly-date" data-weekend="'+weekend+'" data-day-select="false" data-detail-status="false" data-holiday="N" data-nowdate="'+i+'">'
                    // +'<div class="gi-day gi-row-100 gi-overflow-scroll gi-flex gi-flex-justify-content-space-between gi-flex-align-items-center">'
                    +'<div class="gi-day gi-row-100 gi-flex gi-flex-justify-content-space-between gi-flex-align-items-center">'
                    +'<div class="gi-holiday"></div>'+i
                    +'</div>'
                    +'<div class="gi-day-schedule gi-overflow-scroll gi-flex gi-flex-align-items-center"></div>'
                    +'</div>'
                    +'</div>'
            }
        }
    }
    function notAfterSelect(){
        for(let i =1; i < endDay+1; i++){
            let date = new Date(nowYear, nowMonth - 1, i);
            let day = date.getDay();
            let weekend = (0 === day || day === 6) ? "Y" : "N";
            let toDate = new Date();
            if(date > toDate){
                weekly_date_html += '<div class="gi-calendar-weekly-date-layer">'
                    +'<div class="gi-calendar-weekly-date gi-calendar-weekly-next-date">'+i+'</div>'
                    +'</div>'

            }else{
                weekly_date_html += '<div class="gi-calendar-weekly-date-layer">'
                    +'<div class="gi-calendar-weekly-date" data-weekend="'+weekend+'" data-day-select="false" data-detail-status="false" data-holiday="N" data-nowdate="'+i+'">'
                    // +'<div class="gi-day gi-row-100 gi-overflow-scroll gi-flex gi-flex-justify-content-space-between gi-flex-align-items-center">'
                    +'<div class="gi-day gi-row-100 gi-flex gi-flex-justify-content-space-between gi-flex-align-items-center">'
                    +'<div class="gi-holiday"></div>'+i
                    +'</div>'
                    +'<div class="gi-day-schedule gi-overflow-scroll gi-flex gi-flex-align-items-center"></div>'
                    +'</div>'
                    +'</div>'
            }
        }
    }

    function fromTodayUntilAMonthLaterSelect() {
        for(let i =1; i < endDay+1; i++){
            let date = new Date(nowYear, nowMonth - 1, i);
            let day = date.getDay();
            let weekend = (0 === day || day === 6) ? "Y" : "N";
            let toDate = new Date();
            if(date < toDate.setDate(toDate.getDate()-1) || date > toDate.setDate(toDate.getDate()+31)){
                weekly_date_html += '<div class="gi-calendar-weekly-date-layer">'
                    +'<div class="gi-calendar-weekly-date gi-calendar-weekly-pre-date">'+i+'</div>'
                    +'</div>';

            }else{
                weekly_date_html += '<div class="gi-calendar-weekly-date-layer">'
                    +'<div class="gi-calendar-weekly-date" data-weekend="'+weekend+'" data-day-select="false" data-detail-status="false" data-holiday="N" data-nowdate="'+i+'">'
                    // +'<div class="gi-day gi-row-100 gi-overflow-scroll gi-flex gi-flex-justify-content-space-between gi-flex-align-items-center">'
                    +'<div class="gi-day gi-row-100 gi-flex gi-flex-justify-content-space-between gi-flex-align-items-center">'
                    +'<div class="gi-holiday"></div>'+i
                    +'</div>'
                    +'<div class="gi-day-schedule gi-overflow-scroll gi-flex gi-flex-align-items-center"></div>'
                    +'</div>'
                    +'</div>'
            }
        }
    }

    function selectByRange() {
        let minDateAttr = $("#" + input).attr("gi-date-min");
        let maxDateAttr = $("#" + input).attr("gi-date-max");

        let minDate = minDateAttr ? new Date(minDateAttr).setHours(0, 0, 0, 0) : null;
        let maxDate = maxDateAttr ? new Date(maxDateAttr).setHours(23, 59, 59, 999) : null;

        for (let i = 1; i < endDay + 1; i++) {
            let currentDate = new Date(nowYear, nowMonth - 1, i);
            currentDate.setHours(0, 0, 0, 0);

            let isInRange =
                (minDate ? currentDate >= minDate : true) &&
                (maxDate ? currentDate <= maxDate : true);

            let day = currentDate.getDay();
            let weekend = (day === 0 || day === 6) ? "Y" : "N";

            if (isInRange) {
                weekly_date_html += `
                  <div class="gi-calendar-weekly-date-layer">
                    <div class="gi-calendar-weekly-date" data-weekend="${weekend}" data-day-select="false" data-detail-status="false" data-holiday="N" data-nowdate="${i}">
                      <div class="gi-day gi-row-100 gi-flex gi-flex-justify-content-space-between gi-flex-align-items-center">
                        <div class="gi-holiday"></div>${i}
                      </div>
                      <div class="gi-day-schedule gi-overflow-scroll gi-flex gi-flex-align-items-center"></div>
                    </div>
                  </div>`;
            } else {
                weekly_date_html += `
                  <div class="gi-calendar-weekly-date-layer">
                    <div class="gi-calendar-weekly-date gi-calendar-weekly-pre-date">${i}</div>
                  </div>`;
            }
        }
    }
}

/**
 * @title : giDatePickerPrevMonth
 * @text : 이전달 조회
 * @writer : 이경태
 * */
function giDatePickerPrevMonth(input) {
    let year = parseInt($("#gi-datepicker_calendar-main").find(".gi-calendar-YEAR").text());
    let month = parseInt($("#gi-datepicker_calendar-main").find(".gi-calendar-MONTH").text())-1;
    let date = new Date(year,month-1);
    formUtil.giDatePicker(input,date);
}
/**
 * @title : giDatePickerNextMonth
 * @text : 다음달 조회
 * @writer : 이경태
 * */
function giDatePickerNextMonth(input) {
    let year = parseInt($("#gi-datepicker_calendar-main").find(".gi-calendar-YEAR").text());
    let month = parseInt($("#gi-datepicker_calendar-main").find(".gi-calendar-MONTH").text())+1;
    let date = new Date(year,month-1);

    formUtil.giDatePicker(input,date);
}
/**
 * @title : pieChartInit
 * @text : 파이차트 생성
 * @id : pieChart 적용 ID 파라미터 [String]
 * @writer : 이경태
 * */
FormUtility.prototype.pieChartInit = function(ID){
    const canvas = $("#"+ID)[0];
    const ctx = canvas.getContext('2d');
    function resizeCanvas() {
        canvas.width = $(canvas).width();
        canvas.height = $(canvas).height();

        drawChart();
    }
    function drawChart() {
        let width = canvas.width;
        let height = canvas.height;
        let cont = [
            {NUM : 9, TEXT:"남은 휴가"},
            {NUM : 3, TEXT:"반차"},
            {NUM : 3, TEXT:"연차"}
        ];
        ctx.clearRect(0,0,width, height);

        let degree = 360;
        let radius = width * 0.9 / 2; // 반지름 동적 부여

        if(radius > height * 0.9 / 2){ // 캔버스의 넓이와 높이를 고려하여 최소크기 적용
            radius = height * 0.9 / 2;
        }
        const colorArray = ['#35a3e7','#a2a5a6','#918f8f'];

        let sum = 0;
        cont.forEach(arg => sum += arg.NUM);

        let conv_array = cont.slice().map((data)=>{ // 각도가 들어있는 배열
            let rate = data.NUM / sum;
            let myDegree = degree * rate;
            return myDegree;
        });

        degree = 0;

        let event_array = cont.slice().map(arg => []); // 이벤트(각도 범위가 있는)용 배열
        let current = -1; // 현재 동작중 인덱스
        let zero = 0; // 각(degree)에 대해서 증가하는 값

        let clr = setInterval( ()=> {
            for(let i = 0; i < conv_array.length; i++){
                let item = conv_array[i];
                if(current === -1 || current === i){
                    current = i;
                    if(zero < item){
                        if(i === 0){
                            arcMaker(radius, 0, zero, colorArray[i]);
                        }else{
                            let increase = degree + zero;
                            arcMaker(radius, degree, increase, colorArray[i]);
                        }
                        zero += 3;
                    }else{
                        current = i + 1;
                        zero = 0;
                        if(i !== 0 ){
                            let increase = degree + item;
                            arcMaker(radius, degree, increase, colorArray[i]);
                            event_array[i] = [degree, increase];
                            degree = increase;
                        }else{
                            arcMaker(radius, 0, item, colorArray[i]);
                            degree = item;
                            event_array[i] = [0, degree];
                        }
                    }
                }else if(current === conv_array.length){
                    clearInterval(clr);
                    makeText(-1);
                }
            }
        },1);

        function arcMaker(radius, begin, end, color){
            ctx.lineJoin = 'round'; // 선이만나 꺾이는 부분때문에 부여(삐져나오는 현상 방지)
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(width/2, height/2);
            ctx.arc(width/2, height/2, radius, (Math.PI/180)*begin, (Math.PI/180)* end , false);
            ctx.closePath();
            ctx.fillStyle = color;
            ctx.strokeStyle = 'white';
            ctx.fill();
            ctx.stroke();
            ctx.restore();
            middelMaker();  // 가운데 원형그리기 함수 추가
        }

        let drawed = false;

        $(canvas).on('mousemove', function (event) {
            let x1 = event.clientX - canvas.offsetLeft;
            let y1 = event.clientY - canvas.offsetTop;
            let inn = isInsideArc(x1, y1);
            if(inn.index > -1){  // 대상이 맞으면
                drawed = true;
                // hoverCanvas(inn.index);
                // makeText(inn.index);
            } else {  // 대상이 아니면
                if(drawed){  // 대상이였다가 대상이 이제 아니면
                    // hoverCanvas(-1);
                    // makeText(-1);
                }
                drawed = false;
            }
        });

        function isInsideArc(x1, y1){
            let result1 = false;
            let result2 = false;
            let index = -1;
            let circle_len = radius;
            let x = width/2 - x1;
            let y = height/2 - y1;
            let my_len = Math.sqrt(Math.abs(x * x) + Math.abs(y * y));  // 삼각함수
            if(circle_len >= my_len){
                result1 = true;
            }
            let rad = Math.atan2(y, x);
            rad = (rad*180)/Math.PI;  // 음수가 나온다
            rad += 180;  // 캔버스의 각도로 변경
            if(result1){
                event_array.forEach( (arr,idx) => {   // 각도 범위에 해당하는지 확인
                    if( rad >= arr[0] && rad <= arr[1]){
                        result2 = true;
                        index = idx;
                    }
                });
            }
            return {result1:result1, result2:result2 ,index:index, degree : rad};
        }

        // 마우스 오버효과
        // function hoverCanvas(index){
        //     ctx.clearRect(0,0,width, height);
        //     for (let i = 0; i < conv_array.length; i++) {
        //         let item = conv_array[i];
        //         let innRadius = radius;
        //         if(index == i){
        //             innRadius = radius * 1.1;  // 대상이 맞으면 1.1배 크게 키운다.
        //         }
        //         if (i == 0) {
        //             arcMaker(innRadius, 0, item, colorArray[i])
        //             degree = item;
        //         } else {
        //             arcMaker(innRadius, degree, degree + item, colorArray[i])
        //             degree = degree + item;
        //         }
        //     }
        // }

        // 도(degree)를 라디안(radian)으로 바꾸는 함수
        function degreesToRadians(degrees) {
            const pi = Math.PI;
            return degrees * (pi / 180);
        }

        // 텍스트함수
        function makeText(index){
            event_array.forEach((itm, idx) => {
                let half = (itm[1] - itm[0]) / 2;
                let degg = itm[0] + half;
                let xx = Math.cos(degreesToRadians(degg)) * radius * 0.7 + width / 2;
                let yy = Math.sin(degreesToRadians(degg)) * radius * 0.7 + height / 2;

                let txt = cont[idx].TEXT + '';
                let minus = ctx.measureText(txt).width / 2;
                ctx.save();
                if(index === idx){
                    ctx.font = "normal 12px sans-serif";
                    ctx.fillStyle = 'blue';
                } else {
                    ctx.font = "normal 0.8rem sans-serif";
                    ctx.fillStyle = 'white';
                }
                ctx.fillText(txt, xx - minus, yy);
                let txt2 = cont[idx].NUM;
                ctx.fillText(txt2, xx, yy + 16);
                ctx.restore();
            });
        }

        // 중앙 구멍(원)을 만드는 함수
        function middelMaker(){
            ctx.save();
            ctx.fillStyle='white';
            ctx.strokeStyle='white';
            ctx.lineJoin = 'round'; // 선이만나 꺾이는 부분때문에 부여(삐져나오는 현상 방지)
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(width/2, height/2);
            ctx.arc(width/2, height/2, radius/3, 0, (Math.PI/180)* 360 , false);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
            ctx.restore();

            let total = 0;
            cont.forEach( (arg)=> total+=arg.NUM);

            let minus = ctx.measureText(total).width - 5;
            ctx.save();
            ctx.font = "normal 0.8rem sans-serif";
            ctx.fillStyle = '#656565';
            ctx.fillText("Total", width/2 - ctx.measureText("Total").width/2, height/2);
            ctx.fillText(total, width/2 - minus, height/2 *1.1);
            ctx.restore();
        }
    }
    let resizeTimer;
    $(window).on('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resizeCanvas, 500); // 100ms 후에 resizeCanvas 함수 호출
    });
    resizeCanvas();
}




/**
 * @title : gi-grid
 * @text : 공통 그리드
 * @setting : "< div id='gi-Grid'> < /div> " 생성 후 사용
 * @id : gi-Grid
 * @Grid-header : column name
 * @Grid-id : column id
 * @Grid-width : 숫자(%) ,숫자+px(px)
 * @Grid-type : text, radio, button, checkbox
 * @Grid-textAlign : left , right, center
 * @Grid-hidden : true = add hidden Class , false = remove hidden Class
 * @Grid-CommonCodeGroupId : group_code_id in common_code table
 * @Grid-pagingSet(findByMenuList) : findByMenuList = row select 박스 값 변경 및 페이징 버튼클릭시 호출될 함수명
 * @Grid-detailBtnClick(fn,"btnName") : fn : 그리드내부 상세버튼 클릭시 호출될 함수명, btnName : 상세보기버튼 class Name
 * @writer : 이경태
 * */
FormUtility.prototype.giGrid = function(layout,paging,page,gridId) {
    //localStorage에서 정렬값을 가져와 setting
    gridSortManager.loadSortState();

    let title = layout.title;
    let grid_list_header = "";
    let headerItem = [];
    let prePageAnimationCont = $("#gi-grid-list-body").data("pageNumber");
    let currentPageAnimationCont = page
    let pagingAnimationClass = "";

    if(!formUtil.checkEmptyValue(gridId)) gridId = "gi-Grid";

    if(formUtil.checkEmptyValue(prePageAnimationCont)){
        //애니메이션 효과 적용
        if(prePageAnimationCont > currentPageAnimationCont){
            pagingAnimationClass = "tilt-in-left-1";
        }else if(prePageAnimationCont < currentPageAnimationCont){
            pagingAnimationClass = "tilt-in-right-1";
        }else if(prePageAnimationCont === currentPageAnimationCont){
            pagingAnimationClass = "fade-in";
        }
    }


    layout.list.map((item) => {
        let hidden = "";
        let sort = "";
        //그리드 데이터 각 row 생성하기 위해 데이터 담기
        headerItem.push({
            ID : item.ID,
            WIDTH : item.WIDTH,
            TEXT_ALIGN : item.TEXT_ALIGN,
            FONT_SIZE : item.FONT_SIZE,
            TYPE : item.TYPE,
            HEADER : item.HEADER,
            COMMON_CODE_GROUP_ID : item.COMMON_CODE_GROUP_ID,
            TARGET : item.TARGET,
            HIDDEN : item.HIDDEN
        });
        // //정렬 대상이라면 정렬순서 추가
        // if (gridSortManager.sortColumn !== null && gridSortManager.sortColumn !== undefined && gridSortManager.sortColumn.trim() !== '') {
        //     if (gridSortManager.sortColumn === item.ID) {
        //         sort = 'gi-grid-sort-'+gridSortManager.sortColumn;
        //     }
        // }

        //컬럼 히든처리
        if(formUtil.checkEmptyValue(item.HIDDEN)){
            if(item.HIDDEN){
                hidden = "gi-hidden ";
            }else{
                hidden = "gi-show-li ";
            }
        }else{
        }
        let sortArray = gridSortManager.getSort();
        if(sortArray.order !== null){
            if(item.ID === sortArray.column) {
                sort = 'gi-grid-sort-' + sortArray.order;
            }
        }
        // grid_list_header += '<li class="gi-row-' + item.WIDTH + ' gi-flex gi-flex-center gi-overflow-scroll gi-col-30px '+hidden+'">' +
        switch(item.TYPE){
            case "checkbox" :
                grid_list_header += '<li data-column="' + item.ID + '_checkbox_all" class="gi-min-row-50px gi-row-' + item.WIDTH + ' gi-grid gi-grid-place-content-space-around gi-overflow-scroll gi-col-30px ' + hidden +'' + sort + '">' +
                    '<input type="checkbox" id="'+gridId+'_checkbox_all" class="gi-padding-left-right-10px"/>' +
                    '</li>';
                break;
            default :
                grid_list_header += '<li data-column="' + item.ID + '" class="resizableBox gi-min-row-50px gi-row-' + item.WIDTH + ' gi-grid gi-grid-place-content-space-around gi-overflow-scroll gi-col-30px ' + hidden +'' + sort + '">' +
                                        '<span class="gridColumResizer gi-padding-left-right-10px">' + item.HEADER + '</span>' +
                                    '</li>';
                break;
        }

    })

    let totalPageCount = Math.ceil(paging);
    let maxPagesToShow = 10;

    let startPage = Math.floor((page - 1) / maxPagesToShow) * maxPagesToShow + 1;
    let endPage = Math.min(totalPageCount, startPage + maxPagesToShow - 1);

    let pagingArea = '';
    let giGridPagingBtn = gridId+"_gi-grid-paging-btn";
    if(startPage > 1) {
        pagingArea += '<span class="'+giGridPagingBtn+' gi-grid-paging-btn gi-grid-paging-prev-btn" data-field="'+(startPage - maxPagesToShow)+'">&lsaquo;</span>';
    }

    for(let i = startPage; i <= endPage; i++) {
        pagingArea += '<span class="'+giGridPagingBtn+' gi-grid-paging-btn" data-field="'+i+'">'+i+'</span>';
    }

    if(endPage < totalPageCount) {
        pagingArea += '<span class="'+giGridPagingBtn+' gi-grid-paging-btn gi-grid-paging-next-btn" data-field="'+(startPage + maxPagesToShow)+'">&rsaquo;</span>';
    }

    //페이징 row 개수 설정
    let options = "";
    let giGridRowSelectorId = "gi-grid-row-selector_"+gridId;
    for(let i = 1; i < 11; i++){
        let selectedOption = "";
        if( parseInt($("#"+giGridRowSelectorId+" option:selected").val()) === 10*i){
            selectedOption = "selected";
        }
        options += '<option value="'+10*i+'" '+selectedOption+'>'+10*i+' row</option>>'
    }

    let grid =
        '            <figure class="gi-figure-content gi-overflow-scroll gi-col-100 gi-row-100 gi-flex gi-flex-justify-content-center gi-flex gi-flex-direction-column">' +
        '                <div class="gi-article-content gi-min-col-90 gi-col-100 gi-row-100">' +
        // '                    <header class="gi-row-100 gi-col-5 gi-margin-bottom-1"><h4>' + title + '</h4></header>' +
        '                    <div class="gi-row-100 gi-flex gi-margin-bottom-1 ">' +
        '                        <select class="gi-grid-row-selector" id="'+giGridRowSelectorId+'" class="gi-row-65px">' +
                                   options+
        '                        </select>'+
        '                    </div>'+
        '                    <div id="gi-grid-list-body" data-page-number="'+page+'" class="gi-row-100 gi-overflow-scroll gi-flex gi-flex-direction-column">' +
        '                        <ul class="gi-grid-list-header gi-row-100 gi-col-30px gi-ul gi-flex gi-flex-justify-content-space-evenly">' +
                                        grid_list_header +
        '                        </ul>' +
        '                    </div>' +
        '                </div>' +
        '                <div class="gi-grid-paging-content gi-col-5 gi-row-100">' +
                            pagingArea +
        '                </div>' +
        '            </figure>';


    $("#"+gridId).html(grid);

    let items = $("#"+gridId).find(".gi-show-li");
    items.map((index,item) => {
        if (index !== items.length-1) {
            item.style.borderRight = '1px solid #bbbbbb6e';
        }
    });

    // 초기 활성화 페이징 번호 설정
    $(`.${giGridPagingBtn}[data-field="${page}"]`).addClass("active");

    //그리드 생성 후 데이터 바인딩
    return {
        //그리드 데이터 설정
        DataSet: async function (data) {
            let flag = formUtil.checkEmptyValue(data);
            let grid_list = "";
            let commonCodeGroupIdArray = [];
            if(flag){
                for (let i = 0; i < data.length; i++) {
                    grid_list += '<ul class="gi-grid-list gi-row-100 gi-ul gi-flex gi-flex-justify-content-space-evenly '+pagingAnimationClass+'" data-row-num="'+i+'">';

                    for (let j = 0; j < headerItem.length; j++) {
                        let item = headerItem[j];
                        let tag = "";
                        let commonCodeName = "";
                        let commonCodeValue = "";
                        let hidden = true;
                        if(formUtil.checkEmptyValue(item.COMMON_CODE_GROUP_ID)){

                            //NOTE: 불필요한 다중 공통코드 조회 차단
                            commonCodeName = await checkSameCode(commonCodeGroupIdArray,item.COMMON_CODE_GROUP_ID,data[i]);
                            commonCodeValue =  data[i][item.ID];
                        }else{
                            commonCodeName = data[i][item.ID];
                        }
                        if(formUtil.checkEmptyValue(item.HIDDEN)){
                            if(item.HIDDEN){
                                hidden = "hidden";
                            }else{
                                hidden = "";
                            }
                        }

                        if(!formUtil.checkEmptyValue(commonCodeName)) commonCodeName = "";

                        switch (item.TYPE) {
                            case "text":
                                commonCodeValue
                                    ?
                                    tag = '<span class="resizer gi-row-100 gi-padding-left-right-10px gi-font-size-' + item.FONT_SIZE + '" data-grid-value="'+commonCodeValue+'">' + commonCodeName + '</span>'
                                    :
                                    tag = '<span class="resizer gi-row-100 gi-padding-left-right-10px gi-font-size-' + item.FONT_SIZE + '">' + commonCodeName + '</span>';
                                break;
                            // case "radio":
                            //     tag = '<input type="radio" class="gi-row-100 gi-padding-left-right-10px gi-font-size-' + item.FONT_SIZE + '" data-field="'+data[i][item.ID]+'"/>';
                            //     break;
                            case "button":
                                tag = '<button type="button" id="'+ item.ID +"_"+i+'" class="gi-grid-btn gi-row-50 gi-font-size-' + item.FONT_SIZE + ' '+item.ID+'" data-row-num="'+i+'" data-btn-target="'+ item.TARGET + '">' + item.HEADER + '</button>';
                                break;
                            case "map":
                                tag = '<span id="'+ item.ID +"_"+i+'" class="gi-map-btn gi-row-50 gi-font-size-' + item.FONT_SIZE + ' '+item.ID+'" data-row-num="'+i+'" data-btn-target="'+ item.TARGET + '">' + '</span>';
                                break;
                            case "checkbox":
                                tag = '<input type="checkbox" id="'+gridId+'_checkbox_'+i+'" class="gi-padding-left-right-10px gi-font-size-' + item.FONT_SIZE + '" value="' + data[i][item.ID] + '" />';
                                break;
                        }
                        grid_list += '<li class="resizableBox gi-min-row-50px gi-row-'+item.WIDTH+' gi-col-16px gi-flex gi-overflow-scroll gi-flex-justify-content-'+item.TEXT_ALIGN+' gi-text-align-'+item.TEXT_ALIGN+' '+hidden+'" data-grid-row="'+j+'" data-field="'+item.ID+'">' + tag + '</li>';
                    }
                    grid_list += '</ul>';
                }
            }else{
                grid_list = '<div class="gi-row-100 gi-col-100 gi-flex gi-flex-align-items-center gi-flex-justify-content-center bounce-in-top">No Data</div>';
                $("#"+gridId+" .gi-grid-paging-content").html('');
            }
            $("#"+gridId+" .gi-grid-list-header").after(grid_list);

            let rows  = $("#"+gridId+" .gi-grid-list");
            rows.map((i,row) =>{
                let rowInLi = $(row).find("li");

                $(rows).not("[data-row-num='0']").addClass("border-top-dotted-gray");
                $(rowInLi).not(":last").addClass("gi-grid-li-border-dotted");
                unUsedMenuUISettings(row);
            })

            function unUsedMenuUISettings(e){
                let flag = $(e).find("li[data-field='use_yn']").not(".hidden").find("span[data-grid-value]").length === 0;
                let a = ""; //NOTE: 그리드 내부에 COMMON_CODE_GROUP_ID 함수로 인해 값이 동적으로 변화 하는걸 대비(공통코드 적용시 text, 미적용시 interger)
                let b = "";
                let c = "";
                if(flag){
                    a = $(e).find("li[data-field='use_yn']").not(".hidden").find("span").text();
                    b = "0";
                    c = "1";
                }else{
                    a = $(e).find("li[data-field='use_yn']").not(".hidden").find("span").data("gridValue");
                    b = 0;
                    c = 1;
                }
                if(a === b){
                    $(e).addClass("unused-menu");
                }else{
                    if(a === b && a === c){
                        $(e.$row).removeClass("unused-menu");
                    }
                }
            }
        },
        //그리드 row 개수 변경 및 페이징 버튼 이벤트 설정
        pagingSet: function(fn){
            let range = "";

            $("#"+giGridRowSelectorId).change(function(){
                range = parseInt($("#"+giGridRowSelectorId+" option:selected").val());
                $("#"+giGridRowSelectorId).val(range);
                fn(1,range);
            })
            $("."+giGridPagingBtn).click(function(){
                // 기존에 활성화된 페이징 넘버에서 active 클래스를 제거
                $("."+giGridPagingBtn).removeClass("active");

                // 현재 클릭된 페이징 넘버에 active 클래스 추가
                $(this).addClass("active");

                let pagingNum = $(this).data("field");
                    range = parseInt($("#"+giGridRowSelectorId+" option:selected").val());
                fn(pagingNum,range);
            })
        },
        //그리드 내부의 상세 버튼 클릭 이벤트 설정(버튼클릭시 호출될 함수, 그리드 헤더 부분에 설정한 버튼 ID)
        detailBtnClick:function(fn,btnName){
            let flag = formUtil.checkEmptyValue(fn);
            if(flag){

                //최초 한번은 이벤트 등록
                $("."+btnName).off("click.rowClickEventHandler").on("click.rowClickEventHandler",function(e){
                    detailBtnClickEventHandler(e);
                });
                // grid 안에 상세버튼 클릭 이벤트
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.addedNodes.length > 0) {
                            let $giGridList = $(".gi-grid-list");
                            if ($giGridList.length > 0) {
                                observer.disconnect();
                            }
                            $("."+btnName).off("click.rowClickEventHandler").on("click.rowClickEventHandler",function(e){
                                detailBtnClickEventHandler(e);
                            });
                        }
                    });
                });
                observer.observe($("#"+gridId)[0], { childList: true, subtree: true });
                function detailBtnClickEventHandler(e){
                    let rowId = $(e.target).data("rowNum");
                    let dataItems = $(e.currentTarget).parents(".gi-grid-list").children("li");
                    let dataList = {};
                    dataItems.map((i,item) => {
                        let columnName = $(item).data("field");
                        let columnValue = "";

                        $(item).children().each(function() {
                            if($(this).is("span")){
                                formUtil.checkEmptyValue($(this).data("gridValue")) ? columnValue = $(this).data("gridValue")+"" : columnValue = $(this).text();

                            }else if($(this).is("button")){
                                columnName = "target";
                                columnValue = $(this).data("btn-target");
                            }
                        });

                        if (columnValue === '') columnValue =  null;

                        dataList[columnName] = columnValue;
                    })
                    // console.log(dataList);
                    fn(dataList);
                }
            }else{
                formUtil.showMessage("detailBtnClick : please set function call name");
            }
        },
        //수정 버튼 설정
        updateBtnClick:function(fn,btnName){
            $("."+btnName).off("click.rowClickEventHandler").on("click.rowClickEventHandler",function(e){
                updateBtnClickEventHandler(e);
            });
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.addedNodes.length > 0) {
                        let $giGridList = $(".gi-grid-list");
                        if ($giGridList.length > 0) {
                            observer.disconnect();
                        }
                        $("."+btnName).off("click.rowClickEventHandler").on("click.rowClickEventHandler",function(e){
                            updateBtnClickEventHandler(e);
                        });
                    }
                });
            });
            observer.observe($("#"+gridId)[0], { childList: true, subtree: true });
            function updateBtnClickEventHandler(e){
                let rowId = $(e.target).data("rowNum");
                let dataItems = $(e.currentTarget).parents(".gi-grid-list").children("li");
                let dataList = {};
                dataItems.map((i,item) => {
                    let columnName = $(item).data("field");
                    let columnValue = "";

                    $(item).children().each(function() {
                        if($(this).is("span")){
                            formUtil.checkEmptyValue($(this).data("gridValue")) ? columnValue = $(this).data("gridValue")+"" : columnValue = $(this).text();

                        }else if($(this).is("button")){
                            columnName = "target";
                            columnValue = $(this).data("btn-target");
                        }
                    });

                    if (columnValue === '') columnValue =  null;

                    dataList[columnName] = columnValue;
                })
                // console.log(dataList);
                formUtil.popup("updatePopup_"+btnName,Message.Label.Array["CONFIRM.UPDATE"],fn,dataList);
                // fn(dataList);
            }
        },
        //삭제 버튼 설정
        deleteBtnClick:function(fn,btnName){
            //최초 한번 이벤트 바인딩
            $("."+btnName).off("click.rowClickEventHandler").on("click.rowClickEventHandler",function(e){
                deleteBtnClickEventHandler(e);
            });
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.addedNodes.length > 0) {
                        let $giGridList = $(".gi-grid-list");
                        if ($giGridList.length > 0) {
                            observer.disconnect();
                        }
                        $("."+btnName).off("click.rowClickEventHandler").on("click.rowClickEventHandler",function(e){
                            deleteBtnClickEventHandler(e);
                        });
                    }
                });
            });
            observer.observe($("#"+gridId)[0], { childList: true, subtree: true });
            function deleteBtnClickEventHandler(e){
                let rowId = $(e.target).data("rowNum");
                let dataItems = $(e.currentTarget).parents(".gi-grid-list").children("li");
                let dataList = {};
                dataItems.map((i,item) => {
                    let columnName = $(item).data("field");
                    let columnValue = "";

                    $(item).children().each(function() {
                        if($(this).is("span")){
                            formUtil.checkEmptyValue($(this).data("gridValue")) ? columnValue = $(this).data("gridValue")+"" : columnValue = $(this).text();

                        }else if($(this).is("button")){
                            columnName = "target";
                            columnValue = $(this).data("btn-target");
                        }
                    });

                    if (columnValue === '') columnValue =  null;

                    dataList[columnName] = columnValue;
                })
                // console.log(dataList);
                formUtil.popup("deletePopup_"+btnName,Message.Label.Array["CONFIRM.DELETE"],fn,dataList);
                // fn(dataList);
            }
        },
        //수정 버튼 설정
        resendBtnClick:function(fn,btnName){
            $("."+btnName).off("click.resendBtnClickEventHandler").on("click.resendBtnClickEventHandler",function(e){
                resendBtnClickEventHandler(e);
            });
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.addedNodes.length > 0) {
                        let $giGridList = $(".gi-grid-list");
                        if ($giGridList.length > 0) {
                            observer.disconnect();
                        }
                        $("."+btnName).off("click.resendBtnClickEventHandler").on("click.resendBtnClickEventHandler",function(e){
                            resendBtnClickEventHandler(e);
                        });
                    }
                });
            });
            observer.observe($("#"+gridId)[0], { childList: true, subtree: true });
            function resendBtnClickEventHandler(e){
                let rowId = $(e.target).data("rowNum");
                let dataItems = $(e.currentTarget).parents(".gi-grid-list").children("li");
                let dataList = {};
                dataItems.map((i,item) => {
                    let columnName = $(item).data("field");
                    let columnValue = "";

                    $(item).children().each(function() {
                        if($(this).is("span")){
                            formUtil.checkEmptyValue($(this).data("gridValue")) ? columnValue = $(this).data("gridValue")+"" : columnValue = $(this).text();

                        }else if($(this).is("button")){
                            columnName = "target";
                            columnValue = $(this).data("btn-target");
                        }
                    });

                    if (columnValue === '') columnValue =  null;

                    dataList[columnName] = columnValue;
                })
                // console.log(dataList);
                formUtil.popup("updatePopup_"+btnName,Message.Label.Array["CONFIRM.RESEND"],fn,dataList);
                // fn(dataList);
            }
        },
        mapBtnClick: function(tagId,keywordColumnName,btnName){
            let map = new kakaoMap();
            //최초 한번 이벤트 바인딩
            $("."+btnName).off("click.rowClickEventHandler").on("click.rowClickEventHandler",function(e){
                mapBtnClickEventHandler(e);
            });
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.addedNodes.length > 0) {
                        let $giGridList = $(".gi-grid-list");
                        if ($giGridList.length > 0) {
                            observer.disconnect();
                        }
                        $("."+btnName).off("click.rowClickEventHandler").on("click.rowClickEventHandler",function(e){
                            mapBtnClickEventHandler(e);
                        });
                    }
                });
            });
            observer.observe($("#"+gridId)[0], { childList: true, subtree: true });
            function mapBtnClickEventHandler(e){

                let mapCloseBtn = '<div class="map_close-btn"><span>X</span></div>'
                let $tagId = $("#"+tagId);
                let  targetUl = $(e.currentTarget).parent().parent();
                let  targetLi = $(targetUl).children("li");
                let  keyword = "";

                $("[data-side-grid-open]").map((i,item) => {
                    $(item).attr("data-side-grid-open","false");
                    $(item).empty();
                })

                $($tagId).attr("data-side-grid-open","true");

                targetLi.map((i,item)=>{
                    if($(item).data("field") === keywordColumnName){
                        keyword = $(item)[0].innerText;
                    }
                });

                map.createMap(tagId,keyword);
                $tagId.append(mapCloseBtn);

                $(".map_close-btn").click(function(e){
                    $($tagId).attr("data-side-grid-open","false");
                    $("#"+tagId).empty();
                })
            }
        },
        sideOpenBtnClick:function(tagId,btnName){
            let $tagId = $("#"+tagId);
            let $btnName = $("."+btnName);
            let sideGridOpenCloseBtn = '<div class="side_grid_close-btn"><span>X</span></div>'
            let $sideGridCloseBtn = $(".side_grid_close-btn");

            if($btnName.length === 0){
                // MutationObserver로 동적 추가된 요소에 대해서도 이벤트 설정
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.addedNodes.length > 0) {
                            let $giGridList = $(".gi-grid-list");
                            if ($giGridList.length > 0) {
                                observer.disconnect(); // 추가된 노드가 있을 때만 observer를 종료
                            }
                            let $btnName = $("."+btnName);
                            // 이벤트 처리
                            $btnName.off("click.sideOpenBtnClickEventHandler").on("click.sideOpenBtnClickEventHandler",function(e){
                                sideOpenBtnClickEventHandler(e);
                            });
                        }
                    });
                });

                observer.observe($("#" + gridId)[0], { childList: true, subtree: true });
            }else{
                $btnName.off("click.sideOpenBtnClickEventHandler").on("click.sideOpenBtnClickEventHandler",function(e){
                    sideOpenBtnClickEventHandler(e);
                });
            }


            function sideOpenBtnClickEventHandler(e){
                $("[data-side-grid-open]").map((i,item) => {
                    $(item).attr("data-side-grid-open","false");
                })

                $($tagId).attr("data-side-grid-open","true");
                $tagId.append(sideGridOpenCloseBtn);
                sideGridCloseBtnEvent();

                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.addedNodes.length > 0) {
                            let $giGridList = $(".gi-grid-list");
                            if ($giGridList.length > 0) {
                                observer.disconnect(); // 추가된 노드가 있을 때만 observer를 종료
                            }
                            if ($tagId.find(".side_grid_close-btn").length === 0) {
                                $tagId.append(sideGridOpenCloseBtn);
                                sideGridCloseBtnEvent();
                            }
                        }
                    });
                });

                observer.observe($("#" + tagId)[0], { childList: true, subtree: true });

                function sideGridCloseBtnEvent(){
                    $(".side_grid_close-btn").off("click.sideGridCloseBtnClickEventHandler").on("click.sideGridCloseBtnClickEventHandler",function(e){
                        sideGridCloseBtnClickEventHandler();
                    })
                    function sideGridCloseBtnClickEventHandler(){
                        $("[data-side-grid-open]").map((i,item) => {
                            if(formUtil.checkEmptyValue($(item).data("sideGridOpenInit"))){
                                let flag = $(item).data("sideGridOpenInit");
                                flag = flag.toString();
                                $(item).attr("data-side-grid-open",flag);
                            }
                        })
                        $($tagId).attr("data-side-grid-open","false");
                        $("#"+tagId).empty();
                    }
                }
            }
        },
        //정렬용 컬럼 클릭 이벤트
        sortDataSet:function(fn, notSortList){
            notSortList = notSortList || [];
            // 이벤트 위임: 부모 요소에 클릭 이벤트 등록
            $("#"+gridId+' ul.gi-grid-list-header').off('click').on('click', 'li', function(e) {
                let column = $(this).data('column');

                // 버튼 컬럼이나 제외 컬럼은 처리하지 않음
                if (column.endsWith('_btn') || column.endsWith('_checkbox_all') || notSortList.includes(column)) {
                    return;
                }

                // 정렬 상태 변경
                if (gridSortManager.sortColumn === column && gridSortManager.sortOrder === 'asc') {
                    gridSortManager.setSort(column, 'desc');
                } else if (gridSortManager.sortColumn === column && gridSortManager.sortOrder === 'desc') {
                    gridSortManager.setSort(null, null); // 정렬 해제
                } else {
                    gridSortManager.setSort(column, 'asc');
                }

                // 현재 설정된 옵션
                let pagingOption = $('#' + giGridRowSelectorId + ' option:selected').val();
                let currentPage = $('.active').data('field');

                // 정렬용 콜백 함수 실행
                fn(currentPage, pagingOption, gridSortManager.sortColumn, gridSortManager.sortOrder);
            });
        },
        rowClick: function(fn) {
            // 최초 로딩 시 이벤트를 설정
            setRowClickEvent(fn);

            // MutationObserver로 동적 추가된 요소에 대해서도 이벤트 설정
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.addedNodes.length > 0) {
                        let $giGridList = $(".gi-grid-list");
                        if ($giGridList.length > 0) {
                            observer.disconnect(); // 추가된 노드가 있을 때만 observer를 종료
                        }
                        // 이벤트 처리
                        setRowClickEvent(fn);  // 추가된 그리드에도 rowClick 이벤트 설정
                    }
                });
            });
            observer.observe($("#" + gridId)[0], { childList: true, subtree: true });

            // rowClick 이벤트를 설정하는 함수
            function setRowClickEvent(fn) {
                let gridSelector = "#"+gridId;
                $(gridSelector).find(".gi-grid-list").addClass("gi-cursor-pointer");
                $(gridSelector).find(".gi-grid-list")
                    .mouseenter(function() {
                    $(this).addClass("gi-grid-list-hover");
                })
                    .mouseleave(function() {
                    $(this).removeClass("gi-grid-list-hover");
                })
                    .click(function(){
                    if($(this).hasClass("gi-grid-list-select")){
                        $(this).removeClass("gi-grid-list-select");
                    }else{
                        $(gridSelector).find(".gi-grid-list").removeClass("gi-grid-list-select");
                        $(this).addClass("gi-grid-list-select");
                    }
                });


                $(gridSelector).find("ul[data-row-num]").off("click.rowClickEventHandler").on("click.rowClickEventHandler", function (e) {
                    if (!$(e.target).is("button")) {
                        rowClickEventHandler(e, fn);
                    }
                });
            }

            // rowClick 이벤트 핸들러
            function rowClickEventHandler(e, fn) {
                let columnArray = $(e.currentTarget).children("li");
                let resultList = [];
                columnArray.map((i, item) => {
                    const columnName = $(item).data("field");
                    const columnValue = $(item).children("span").text();
                    const hasDataGridValue = $(item).children("span").data("gridValue");
                    if(formUtil.checkEmptyValue(hasDataGridValue)){
                        resultList[columnName+"_value"] = hasDataGridValue;
                    }
                    resultList[columnName] = columnValue;
                });
                fn(resultList,e);
            }
        },
        //NOTE : doubleClick 이벤트 설정
        rowDoubleClick:function(fn){
            // 최초 로딩 시 이벤트를 설정
            setRowDoubleClickEvent(fn);

            // MutationObserver로 동적 추가된 요소에 대해서도 이벤트 설정
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.addedNodes.length > 0) {
                        let $giGridList = $(".gi-grid-list");
                        if ($giGridList.length > 0) {
                            observer.disconnect(); // 추가된 노드가 있을 때만 observer를 종료
                        }
                        // 이벤트 처리
                        setRowDoubleClickEvent(fn);  // 추가된 그리드에도 rowClick 이벤트 설정
                    }
                });
            });
            observer.observe($("#" + gridId)[0], { childList: true, subtree: true });

            // rowClick 이벤트를 설정하는 함수
            function setRowDoubleClickEvent(fn) {
                let gridSelector = "#"+gridId;
                $(gridSelector).find(".gi-grid-list").addClass("gi-cursor-pointer");
                $(gridSelector).find(".gi-grid-list")
                    .mouseenter(function() {
                        $(this).addClass("gi-grid-list-hover");
                        $(this).addClass("no-drag");
                    })
                    .mouseleave(function() {
                        $(this).removeClass("gi-grid-list-hover");
                    });
                $(gridSelector).find("ul[data-row-num]").off("dblclick.rowDoubleClickEventHandler").on("dblclick.rowDoubleClickEventHandler", function (e) {
                    if (!$(e.target).is("button") && e.target.type !== "checkbox") {
                        rowDoubleClickEventHandler(e, fn);
                    }
                });
            }

            // rowClick 이벤트 핸들러
            function rowDoubleClickEventHandler(e, fn) {
                let columnArray = $(e.currentTarget).children("li");
                let resultList = [];
                columnArray.map((i, item) => {
                    const columnName = $(item).data("field");
                    const columnValue = $(item).children("span").text();
                    const hasDataGridValue = $(item).children("span").data("gridValue");
                    if(formUtil.checkEmptyValue(hasDataGridValue)){
                        resultList[columnName+"_value"] = hasDataGridValue;
                    }
                    resultList[columnName] = columnValue;
                });
                fn(resultList);
            }
        },
        rowCheckboxClick:function(fn){
            setRowCheckBoxClickEvent(fn);
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.addedNodes.length > 0) {
                        let $giGridList = $(".gi-grid-list");
                        if ($giGridList.length > 0) {
                            observer.disconnect(); // 추가된 노드가 있을 때만 observer를 종료
                        }
                        // 이벤트 처리
                        setRowCheckBoxClickEvent(fn);  // 추가된 그리드에도 CheckBoxClick 이벤트 설정
                    }
                });
            });
            observer.observe($("#" + gridId)[0], { childList: true, subtree: true });

            function setRowCheckBoxClickEvent(fn){
                let gridSelector = "#"+gridId;
                $(gridSelector).find("input[type='checkbox']").addClass("gi-cursor-pointer");
                $(gridSelector).find("input[type='checkbox']").off("click.rowCheckBoxClickEventHandler").on("click.rowCheckBoxClickEventHandler", function (e) {
                    if (!$(e.target).is("button")) {
                        rowCheckBoxClickEventHandler(e, fn);
                    }
                });
            }
            function rowCheckBoxClickEventHandler(e, fn) {
                let $checkBoxArray = $("#" + gridId + " input[type='checkbox']");
                let resultList = [];
                let isCheckBoxAll = e.currentTarget.id.includes("_checkbox_all");
                let isChecked = $(e.currentTarget).is(":checked");

                // 전체 선택/해제 로직 최적화
                if (isCheckBoxAll) {
                    $checkBoxArray.prop("checked", isChecked);
                }

                // 체크된 항목 정보 수집
                $checkBoxArray.each((i, item) => {
                    if ($(item).is(":checked") && !item.id.includes("_checkbox_all")) {
                        let tempArray = {};
                        $(item).closest(".gi-grid-list").children("li").each((_, liItem) => {
                            const columnName = $(liItem).data("field");
                            const columnValue = $(liItem).children("span").text();
                            tempArray[columnName] = columnValue;
                        });
                        resultList.push(tempArray);
                    }
                });

                // "_checkbox_all" 체크 상태 동기화
                $checkBoxArray.each((_, item) => {
                    if (item.id.includes("_checkbox_all")) {
                        $(item).prop("checked", resultList.length === $checkBoxArray.length - 1);
                    }
                });

                fn(resultList);
            }
        },
        rowMultiSelectClick:function(fn){
            setMultiRowClickEvent(fn);
            // MutationObserver로 동적 추가된 요소에 대해서도 이벤트 설정
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.addedNodes.length > 0) {
                        let $giGridList = $(".gi-grid-list");
                        if ($giGridList.length > 0) {
                            observer.disconnect(); // 추가된 노드가 있을 때만 observer를 종료
                        }
                        setMultiRowClickEvent(fn)// 이벤트 처리
                    }
                });
            });

            observer.observe($("#" + gridId)[0], { childList: true, subtree: true });
            function setMultiRowClickEvent(fn) {
                $(".gi-grid-list").addClass("gi-cursor-pointer");
                $(".gi-grid-list").mouseenter(function() {
                    $(this).addClass("gi-grid-list-hover");
                }).mouseleave(function() {
                    $(this).removeClass("gi-grid-list-hover");
                });

                // 클릭 시 이벤트 설정
                $("ul[data-row-num]").off("click.rowClickEventHandler").on("click.rowClickEventHandler", function(e) {
                    if (!$(e.target).is("button")) {
                        rowMultiClickEventHandler(e, fn);
                    }
                });
                function rowMultiClickEventHandler(e, fn){
                    let target = e.currentTarget;
                    let isSelected = target.classList.contains("gi-grid-list-multi_select");
                    let resultList = [];

                    if(isSelected){
                        $(target).removeClass("gi-grid-list-multi_select");
                    }else{
                        $(target).addClass("gi-grid-list-multi_select");
                    }

                    let isSelectedVolume = $("#"+gridId + " .gi-grid-list-multi_select");
                    isSelectedVolume.each((i,item)=>{
                        let columnArray = $(item).children("li");
                        let tempList = [];
                        columnArray.map((i, item) => {
                            const columnName = $(item).data("field");
                            const columnValue = $(item).children("span").text();
                            tempList[columnName] = columnValue;
                        });
                        resultList.push(tempList);
                    })
                    fn(resultList);
                }
            }
        },
        gridColumResize : function (gridId){
            formUtil.gridResize(gridId);
        }
    }
}

//NOTE: 불필요한 COMMON_CODE 조회 차단 로직
async function checkSameCode(commonCodeGroupIdArray,commonGroupCodeId,cont){
    let param = {group_id : commonGroupCodeId};
    let commonCodeArray = [];
    //NOTE: 공통코드 Array에 그리드 COMMON_CODE_GROUP_ID 값과 일치하는 값이 있는지 여부
    let isExist = commonCodeGroupIdArray.some(item => {
        return Object.keys(item)[0] === commonGroupCodeId;
    });

    //NOTE : 그리드 DataSet 호출 시 그리드 내의 COMMON_CODE_GROUP_ID로 COMMON_CODE 조회 후 commonCodeGroupIdArray 배열에 추가
    if (!isExist) {
        let commonCodeList = await findCommonCode(param);
        commonCodeList.map(item =>{
            commonCodeArray.push({[item.code_id]:item.code_name});
        })
        commonCodeGroupIdArray.push({ [commonGroupCodeId]: commonCodeArray });
    }
    //NOTE: commonCodeGroupIdArray 배열의 COMMON_CODE 키:값 으로 데이터 바인딩
    for(let key in cont){
        let returnVALUE = "";
        let lowerKey = commonGroupCodeId.toLowerCase();
        //NOTE : 그리드 row의 키가 COMMON_CODE_GROUP_ID와 일치 하는지 여부 파악
        if(key.toLowerCase() === lowerKey){
            //NOTE: commonCodeGroupIdArray 배열안의 키:값과 일치 하면 CODE_NAME 리턴
            commonCodeGroupIdArray.find(item=>{
                if(formUtil.checkEmptyValue(item[commonGroupCodeId])){
                    item[commonGroupCodeId].find(valueItem=>{
                        if(Object.keys(valueItem)[0] === cont[key]){
                            returnVALUE = valueItem[cont[key]];
                        }
                    })
                }
            })
            return returnVALUE;
        }
    }
    // console.log("푸쉬 푸쉬::", JSON.parse(JSON.stringify(commonCodeGroupIdArray)));
}
/**
 * @title : pageReDirectAnimation
 * @text : 페이지 이동시 애니메이션 설정
 * @writer : 이경태
 * */
FormUtility.prototype.pageReDirectAnimation = function(){
    if($("#gi-road-content").data("animation")){
        $(".gi-article-content").addClass("animate-content-start");
    }else{
        $(".gi-article-content").addClass("animate-content-end");
        $("#gi-road-content").data("animation",true);
    }
}

/**
 * @title : pageReDirectAnimation
 * @text : 페이지 이동시 애니메이션 설정
 * @writer : 이경태
 * */
FormUtility.prototype.setTitle = function(){
    if(formUtil.checkEmptyValue(sessionStorage.getItem("DATA"))){
        let data = JSON.parse(sessionStorage.getItem("DATA"));
        $(".gi-page-title").html(data.title)
    }
}

/**
 * type : hyphen(yyyy-MM-dd), normal(yyyyMMdd)
 */

FormUtility.prototype.dateFormatting = function(date, type){
    let target;

    // 입력 받은 date가 YYYYMMDD 형식일 때
    if (date && /^\d{8}$/.test(date)) {
        const year = parseInt(date.substring(0, 4), 10);
        const month = parseInt(date.substring(4, 6), 10) - 1;
        const day = parseInt(date.substring(6, 8), 10);
        target = new Date(year, month, day);
    } else {
        target = date ? new Date(date) : new Date();
    }

    let year = target.getFullYear();
    let month = (target.getMonth() + 1).toString().padStart(2, '0');
    let day = target.getDate().toString().padStart(2, '0');

    if(!formUtil.checkEmptyValue(type)){
        type = "yyyy-mm-dd";
    }

    if(type === "yyyy-mm-dd"){
        return `${year}-${month}-${day}`;
    }else{
        return `${year}${month}${day}`;
    }
}
FormUtility.prototype.setCommonCodeName = async function(fieldName , groupId, cont){
    let codeId = cont[fieldName];
    let param = {
        group_id : groupId,
        code_id : codeId
    }
    let data = await findCommonCode(param);
    if(data.length > 0){
        let value = data[0].code_name;
        $("[data-field="+fieldName+"]").text(value);
    }
}

FormUtility.prototype.setClassVariables = function(type){
    let sessionInit = new session();
    let dataBindingInit = new dataBinding();
    let popupInit = new popup();

    if(type === "session"){
        return sessionInit;
    }else if(type === "dataBinding"){
        return dataBindingInit;
    }else if(type === "popup"){
        return popupInit;
    }
}

/**
 *
 * @param layout
 * @param paging
 * @param page
 * @param gridId
 * @returns {{DataSet: ((function(*): Promise<void>)|*), HierarchyOption: *, pagingSet: *, detailBtnClick: *, updateBtnClick: *, deleteBtnClick: *, sortDataSet: *, rowClick: *, rowMultiSelectClick: *, sideOpenBtnClick: *, Hierarchy2DepthMultiSelectClick: *}}
 */
FormUtility.prototype.giGridHierarchy = function(layout,paging,page,gridId) {
    //localStorage에서 정렬값을 가져와 setting
    gridSortManager.loadSortState();
    if(!formUtil.checkEmptyValue(paging)) paging = 1;
    if(!formUtil.checkEmptyValue(page)) page = 1;

    let title = layout.title;
    let grid_list_header = "";
    let headerItem = [];
    let prePageAnimationCont = $("#gi-grid-list-body").data("pageNumber");
    let currentPageAnimationCont = page
    let pagingAnimationClass = "";
    let application_level_hierarchyOptionColumn = "";
    let application_parent_hierarchyOptionColumn = "";
    let application_sub_hierarchyOptionColumn = "";
    if(!formUtil.checkEmptyValue(gridId)) gridId = "gi-Grid";

    if(formUtil.checkEmptyValue(prePageAnimationCont)){
        //애니메이션 효과 적용
        if(prePageAnimationCont > currentPageAnimationCont){
            pagingAnimationClass = "tilt-in-left-1";
        }else if(prePageAnimationCont < currentPageAnimationCont){
            pagingAnimationClass = "tilt-in-right-1";
        }else if(prePageAnimationCont === currentPageAnimationCont){
            pagingAnimationClass = "fade-in";
        }
    }


    layout.list.map((item) => {
        let hidden = "";
        let sort = "";
        //그리드 데이터 각 row 생성하기 위해 데이터 담기
        headerItem.push({
            ID : item.ID,
            WIDTH : item.WIDTH,
            TEXT_ALIGN : item.TEXT_ALIGN,
            FONT_SIZE : item.FONT_SIZE,
            TYPE : item.TYPE,
            HEADER : item.HEADER,
            COMMON_CODE_GROUP_ID : item.COMMON_CODE_GROUP_ID,
            TARGET : item.TARGET,
            HIDDEN : item.HIDDEN,
            VISIBLE_OPTION_BTN : item.VISIBLE_OPTION_BTN
        });
        // //정렬 대상이라면 정렬순서 추가
        // if (gridSortManager.sortColumn !== null && gridSortManager.sortColumn !== undefined && gridSortManager.sortColumn.trim() !== '') {
        //     if (gridSortManager.sortColumn === item.ID) {
        //         sort = 'gi-grid-sort-'+gridSortManager.sortColumn;
        //     }
        // }

        //컬럼 히든처리
        if(formUtil.checkEmptyValue(item.HIDDEN)){
            if(item.HIDDEN){
                hidden = "gi-hidden ";
            }else{
                hidden = "gi-show-li ";
            }
        }else{
        }
        let sortArray = gridSortManager.getSort();
        if(sortArray.order !== null){
            if(item.ID === sortArray.column) {
                sort = 'gi-grid-sort-' + sortArray.order;
            }
        }
        // grid_list_header += '<li class="gi-row-' + item.WIDTH + ' gi-flex gi-flex-center gi-overflow-scroll gi-col-30px '+hidden+'">' +
        grid_list_header +=
            '<li data-column="' + item.ID + '" class="resizableBox gi-min-row-50px gi-row-' + item.WIDTH + ' gi-grid gi-grid-place-content-space-around gi-overflow-scroll gi-col-30px ' + hidden +'' + sort + '">' +
                '<span class="gridColumResizer gi-padding-left-right-10px">' + item.HEADER + '</span>' +
            '</li>';
    })
    let totalPageCount = Math.ceil(paging);
    let maxPagesToShow = 10;

    let startPage = Math.floor((page - 1) / maxPagesToShow) * maxPagesToShow + 1;
    let endPage = Math.min(totalPageCount, startPage + maxPagesToShow - 1);

    let pagingArea = '';
    let giGridPagingBtn = gridId+"_gi-grid-paging-btn";
    if(startPage > 1) {
        pagingArea += '<span class="'+giGridPagingBtn+' gi-grid-paging-btn gi-grid-paging-prev-btn" data-field="'+(startPage - maxPagesToShow)+'">&lsaquo;</span>';
    }

    for(let i = startPage; i <= endPage; i++) {
        pagingArea += '<span class="'+giGridPagingBtn+' gi-grid-paging-btn" data-field="'+i+'">'+i+'</span>';
    }

    if(endPage < totalPageCount) {
        pagingArea += '<span class="'+giGridPagingBtn+' gi-grid-paging-btn gi-grid-paging-next-btn" data-field="'+(startPage + maxPagesToShow)+'">&rsaquo;</span>';
    }

    //페이징 row 개수 설정
    let options = "";
    let giGridRowSelectorId = "gi-grid-row-selector_"+gridId;
    for(let i = 1; i < 11; i++){
        let selectedOption = "";
        if( parseInt($("#"+giGridRowSelectorId+" option:selected").val()) === 10*i){
            selectedOption = "selected";
        }
        options += '<option value="'+10*i+'" '+selectedOption+'>'+10*i+' row</option>>'
    }

    let grid =
        '            <figure class="gi-figure-content gi-overflow-scroll gi-col-100 gi-row-100 gi-flex gi-flex-justify-content-center gi-flex gi-flex-direction-column">' +
        '                <div class="gi-article-content gi-min-col-90 gi-col-100 gi-row-100">' +
        // '                    <header class="gi-row-100 gi-col-5 gi-margin-bottom-1"><h4>' + title + '</h4></header>' +
        //'                    <div class="gi-row-100 gi-flex gi-margin-bottom-1 gi-col-25px">' +
        // '                        <select id="gi-grid-row-selector" class="gi-row-65px">' +
        // options+
        // '                        </select>'+
        //'                    </div>'+
        '                    <div id="gi-grid-list-body" data-page-number="'+page+'" class="gi-row-100 gi-overflow-scroll gi-flex gi-flex-direction-column gi-margin-top-10px">' +
        '                        <ul class="gi-grid-list-header gi-row-100 gi-col-30px gi-ul gi-flex gi-flex-justify-content-space-evenly">' +
        grid_list_header +
        '                        </ul>' +
        '                    </div>' +
        '                </div>' +
        '                <div class="gi-grid-paging-content gi-col-5 gi-row-100">' +
        // pagingArea +
        '                </div>' +
        '            </figure>';


    $("#"+gridId).html(grid);

    const items = document.querySelectorAll('.gi-grid-list-header > .gi-show-li');
    items.forEach((item, index) => {
        if (index !== items.length-1) {
            item.style.borderRight = '1px solid #bbbbbb6e';
        }
    });

    // 초기 활성화 페이징 번호 설정
    $(`.${giGridPagingBtn}[data-field="${page}"]`).addClass("active");

    //그리드 생성 후 데이터 바인딩
    return {
        //계층구조 기준 컬럼 설정
        DataSet: async function (data) {
            let flag = formUtil.checkEmptyValue(data);
            let isHierarchy = formUtil.checkEmptyValue(application_level_hierarchyOptionColumn)
                                    && formUtil.checkEmptyValue(application_parent_hierarchyOptionColumn)
                                    && formUtil.checkEmptyValue(application_sub_hierarchyOptionColumn);
            let grid_list = "";
            let commonCodeGroupIdArray = [];

            //NOTE: rows BTN 노출 이벤트 로직 설정
            let visibleOptionArray = [];
            let originalDataForVisibleOption = [];
            function constSetVisibleOption(){
                headerItem.map(item => {
                    if(formUtil.checkEmptyValue(item.VISIBLE_OPTION_BTN)){
                        item.VISIBLE_OPTION_BTN["BTN_ID"] = item.ID;
                        visibleOptionArray.push(item.VISIBLE_OPTION_BTN);
                    }
                })
            }

            if(flag){
                //NOTE: rows BTN 노출 이벤트 함수 호출
                constSetVisibleOption();
                for (let i = 0; i < data.length; i++) {
                    grid_list += '<ul class="gi-grid-list gi-row-100 gi-ul gi-flex gi-flex-justify-content-space-evenly '+pagingAnimationClass+'" data-row-num="'+i+'">';
                    originalDataForVisibleOption = [];
                    for (let j = 0; j < headerItem.length; j++) {
                        let item = headerItem[j];
                        let tag = "";
                        let commonCodeName = "";
                        let commonCodeValue = "";
                        let hidden = true;
                        if(formUtil.checkEmptyValue(item.COMMON_CODE_GROUP_ID)){
                            commonCodeName = await checkSameCode(commonCodeGroupIdArray,item.COMMON_CODE_GROUP_ID,data[i]);
                            commonCodeValue =  data[i][item.ID];
                        }else{
                            commonCodeName = data[i][item.ID];
                        }
                        if(formUtil.checkEmptyValue(item.HIDDEN)){
                            if(item.HIDDEN){
                                hidden = "hidden";
                            }else{
                                hidden = "";
                            }
                        }

                        //NOTE: rows BTN 노출 이벤트 함수 호출
                        visibleOptionArray.map(visibleOptionKeys =>{
                            //NOTE: VISIBLE_OPTION_BTN:[{"menu_level":"0"},{"menu_level":"1"}] 조건이 배열일때 적용 합수
                            if(formUtil.checkEmptyValue(visibleOptionKeys.length)){
                                visibleOptionKeys.map(ArrItem =>{
                                    if(Object.keys(ArrItem)[0] === item.ID){
                                        let isExist = originalDataForVisibleOption.some(optionItem => {
                                            return Object.keys(optionItem)[0] === item.ID;
                                        });
                                        if(!isExist){
                                            if(ArrItem[item.ID] === commonCodeName){
                                                originalDataForVisibleOption[visibleOptionKeys.BTN_ID]= "true";
                                            }
                                        }
                                    }
                                })
                            }else{
                                //NOTE: VISIBLE_OPTION_BTN:{"menu_level":"0"} 조건이 하나 일때
                                if(Object.keys(visibleOptionKeys)[0] === item.ID){
                                    let isExist = originalDataForVisibleOption.some(optionItem => {
                                        return Object.keys(optionItem)[0] === item.ID;
                                    });
                                    if(!isExist){
                                        if(visibleOptionKeys[item.ID] === commonCodeName){
                                            originalDataForVisibleOption[visibleOptionKeys.BTN_ID]= "true";
                                        }
                                    }
                                }
                            }
                        })
                        if(!formUtil.checkEmptyValue(commonCodeName)) commonCodeName = "";
                        switch (item.TYPE) {
                               case "text":
                                   commonCodeValue
                                       ?
                                       tag = '<span class="resizer gi-row-100 gi-padding-left-right-10px gi-font-size-' + item.FONT_SIZE + '" data-grid-value="'+commonCodeValue+'">' + commonCodeName + '</span>'
                                       :
                                       tag = '<span class="resizer gi-row-100 gi-padding-left-right-10px gi-font-size-' + item.FONT_SIZE + '">' + commonCodeName + '</span>';
                                       break;
                               // case "radio":
                               //     tag = '<input type="radio" class="gi-row-100 gi-padding-left-right-10px gi-font-size-' + item.FONT_SIZE + '" data-field="'+data[i][item.ID]+'"/>';
                               //     break;
                               case "button":
                                   if(!originalDataForVisibleOption[item.ID]){
                                        tag = '<button type="button" id="'+ item.ID +"_"+i+'" class="resizer gi-grid-btn gi-row-50 gi-font-size-' + item.FONT_SIZE + ' '+item.ID+'" data-row-num="'+i+'" data-btn-target="'+ item.TARGET + '">' + item.HEADER + '</button>';
                                        break;
                                   }
                               // case "checkbox":
                               //     tag = '<input type="checkbox" class="gi-row-100 gi-padding-left-right-10px gi-font-size-' + item.FONT_SIZE + '" value="' + data[i][item.ID] + '" />';
                               //     break;
                           }
                           grid_list += '<li class="resizableBox gi-min-row-50px gi-row-'+item.WIDTH+' gi-col-16px gi-flex gi-overflow-scroll gi-flex-justify-content-'+item.TEXT_ALIGN+' gi-text-align-'+item.TEXT_ALIGN+' '+hidden+'" data-grid-row="'+j+'" data-field="'+item.ID+'">' + tag + '</li>';
                   }
                   grid_list += '</ul>';
                }
            }else{
                grid_list = '<div class="gi-row-100 gi-col-100 gi-flex gi-flex-align-items-center gi-flex-justify-content-center bounce-in-top">No Data</div>';
                $("#"+gridId+" .gi-grid-paging-content").html('');
            }

            $("#"+gridId+" .gi-grid-list-header").after(grid_list);

            if (isHierarchy) {
                // 1. 필요한 데이터 추출 rows에 보관
                // ex) rows[0] = { $row: jQuery.fn.init {0: ul.gi-grid-list.gi-row-100.gi-ul.gi-flex.gi-flex-justify-content-space-evenly.gi-cursor-pointer, length: 1}
                //              ,level : "0"
                //              ,parentVal : "SPECIFICATION_MANAGEMENT"
                //              ,subVal : "-"
                let rows = [];
                $("#"+gridId+" .gi-grid-list").each(function () {
                    let $row = $(this);
                    // 각 행 내부에서 필요한 값을 추출 (trim()으로 공백 제거)
                    let level = $row.find(`li[data-field="${application_level_hierarchyOptionColumn}"] span`)
                        .first().text().trim();
                    let parentVal = $row.find(`li[data-field="${application_parent_hierarchyOptionColumn}"] span`)
                        .first().text().trim();
                    let subVal = $row.find(`li[data-field="${application_sub_hierarchyOptionColumn}"] span`)
                        .first().text().trim();
                    rows.push({ $row, level, parentVal, subVal});

                });
                // 2. 레벨별 그룹화
                let depth0 = rows.filter(r => r.level === "0");
                let depth1 = rows.filter(r => r.level === "1");
                let depth2 = rows.filter(r => r.level === "2");

                // HIDDEN이 아닌 첫번째 li에 계층 클래스 추가
                rows.forEach((r,i) => {
                    //NOTE: row의 li 요소중 hidden과 마지막 li 요소를 제외한 li에 border dotted 추가
                    r.$row.find("li").not('.hidden').not(":last").addClass("gi-grid-li-border-dotted");
                    if (r.level === "0") {
                        r.$row.find("li").not('.hidden').first().addClass("gi-grid-hierarchy-depth0");
                        //NOTE: 첫번째 row를 제외한 row에 border-top-dotted-gray 추가
                        // r.$row.not("[data-row-num='"+(i+1)+"']").addClass("border-top-dotted-gray");
                        if (r !== depth0[0]) {
                            r.$row.addClass("border-top-dotted-gray");
                        }
                        unUsedMenuUISettings(r);

                    } else if (r.level === "1") {
                        r.$row.find("li").not('.hidden').first().addClass("gi-grid-hierarchy-depth1");
                        unUsedMenuUISettings(r);
                    } else if (r.level === "2") {
                        r.$row.find("li").not('.hidden').first().addClass("gi-grid-hierarchy-depth2");
                        unUsedMenuUISettings(r);
                    }

                    //NOTE: 사용여부에 따른 ui 변경
                    function unUsedMenuUISettings(e){
                        //NOTE: 미사용시 메뉴 비활성화
                        let flag = e.$row.find("li[data-field='use_yn']").not(".hidden").find("span[data-grid-value]").length === 0;
                        let a = ""; //NOTE: 그리드 내부에 COMMON_CODE_GROUP_ID 함수로 인해 값이 동적으로 변화 하는걸 대비(공통코드 적용시 text, 미적용시 interger)
                        let b = "";
                        let c = "";
                        if(flag){
                            a = e.$row.find("li[data-field='use_yn']").not(".hidden").find("span").text();
                            b = "0";
                            c = "1";
                        }else{
                            a = e.$row.find("li[data-field='use_yn']").not(".hidden").find("span").data("gridValue");
                            b = 0;
                            c = 1;
                        }
                        if(a === b){
                            $(e.$row).addClass("unused-menu");
                            let parentValue = $(e)[0].parentVal;
                            let dept2CodeName = "";
                            rows.forEach(item =>{
                                if(item.subVal === parentValue){
                                    $(item.$row).addClass("unused-menu")
                                    dept2CodeName = $(item.$row).find("li[data-field='menu_code']").find("span").text();
                                }
                                if(item.subVal === dept2CodeName){
                                    $(item.$row).addClass("unused-menu")
                                }
                            });
                        }else{
                            //NOTE: 사용중인 최상위 메뉴의 하위메뉴 비활성화
                            if(a === b && a === c){
                                $(e.$row).removeClass("unused-menu");
                            }
                        }
                    }
                });

                // 3. 데이터 배치
                let finalOrder = [];
                depth0.forEach(r0 => {
                    finalOrder.push(r0);
                    // depth1에서 부모로 찾기
                    let matchingDepth1 = depth1.filter(r1 => r1.subVal === r0.parentVal);
                    matchingDepth1.forEach(r1 => {
                        finalOrder.push(r1);
                        // depth2에서 부모로 찾기
                        let matchingDepth2 = depth2.filter(r2 => r2.subVal === r1.parentVal);
                        matchingDepth2.forEach(r2 => {
                            finalOrder.push(r2);
                        });
                    });
                });

                // 4. 삽입
                let $body = $("#"+gridId+" #gi-grid-list-body");

                $body.find("ul.gi-grid-list").detach(); //remove대신 사용

                finalOrder.forEach(r => {
                    $body.append(r.$row);
                });
            }
        },
        //그리드 데이터 설정
        HierarchyOption: function(hierarchyOptionItem){
            application_level_hierarchyOptionColumn = hierarchyOptionItem.level_column;
            application_parent_hierarchyOptionColumn = hierarchyOptionItem.parent_depth_column;
            application_sub_hierarchyOptionColumn = hierarchyOptionItem.child_depth_column;
        },
        //그리드 row 개수 변경 및 페이징 버튼 이벤트 설정
        pagingSet: function(fn){
            let range = "";
            $("#"+giGridRowSelectorId).change(function(){
                range = parseInt($("#"+giGridRowSelectorId+" option:selected").val());
                $("#"+giGridRowSelectorId).val(range);
                fn(1,range);
            })
            $("."+giGridPagingBtn).click(function(){
                // 기존에 활성화된 페이징 넘버에서 active 클래스를 제거
                $("."+giGridPagingBtn).removeClass("active");

                // 현재 클릭된 페이징 넘버에 active 클래스 추가
                $(this).addClass("active");

                let pagingNum = $(this).data("field");
                range = parseInt($("#"+giGridRowSelectorId+" option:selected").val());
                fn(pagingNum,range);
            })
        },
        //그리드 내부의 상세 버튼 클릭 이벤트 설정(버튼클릭시 호출될 함수, 그리드 헤더 부분에 설정한 버튼 ID)
        detailBtnClick:function(fn,btnName){
            let flag = formUtil.checkEmptyValue(fn);
            if(flag){

                //최초 한번은 이벤트 등록
                $("."+btnName).off("click.rowClickEventHandler").on("click.rowClickEventHandler",function(e){
                    detailBtnClickEventHandler(e);
                });
                // grid 안에 상세버튼 클릭 이벤트
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.addedNodes.length > 0) {
                            let $giGridList = $(".gi-grid-list");
                            if ($giGridList.length > 0) {
                                observer.disconnect();
                            }
                            $("."+btnName).off("click.rowClickEventHandler").on("click.rowClickEventHandler",function(e){
                                detailBtnClickEventHandler(e);
                            });
                        }
                    });
                });
                observer.observe($("#"+gridId)[0], { childList: true, subtree: true });
                function detailBtnClickEventHandler(e){
                    let rowId = $(e.target).data("rowNum");
                    let dataItems = $(e.currentTarget).parents(".gi-grid-list").children("li");
                    let dataList = {};
                    dataItems.map((i,item) => {
                        let columnName = $(item).data("field");
                        let columnValue = "";

                        $(item).children().each(function() {
                            if($(this).is("span")){
                                formUtil.checkEmptyValue($(this).data("gridValue")) ? columnValue = $(this).data("gridValue")+"" : columnValue = $(this).text();

                            }else if($(this).is("button")){
                                columnName = "target";
                                columnValue = $(this).data("btn-target");
                            }
                        });

                        if (columnValue === '') columnValue =  null;

                        dataList[columnName] = columnValue;
                    })
                    // console.log(dataList);
                    fn(dataList);
                }
            }else{
                formUtil.showMessage("detailBtnClick : please set function call name");
            }
        },
        //수정 버튼 설정
        updateBtnClick:function(fn,btnName){
            $("."+btnName).off("click.rowClickEventHandler").on("click.rowClickEventHandler",function(e){
                updateBtnClickEventHandler(e);
            });
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.addedNodes.length > 0) {
                        let $giGridList = $(".gi-grid-list");
                        if ($giGridList.length > 0) {
                            observer.disconnect();
                        }
                        $("."+btnName).off("click.rowClickEventHandler").on("click.rowClickEventHandler",function(e){
                            updateBtnClickEventHandler(e);
                        });
                    }
                });
            });
            observer.observe($("#"+gridId)[0], { childList: true, subtree: true });
            function updateBtnClickEventHandler(e){
                let rowId = $(e.target).data("rowNum");
                let dataItems = $(e.currentTarget).parents(".gi-grid-list").children("li");
                let dataList = {};
                dataItems.map((i,item) => {
                    let columnName = $(item).data("field");
                    let columnValue = "";

                    $(item).children().each(function() {
                        if($(this).is("span")){
                            formUtil.checkEmptyValue($(this).data("gridValue")) ? columnValue = $(this).data("gridValue")+"" : columnValue = $(this).text();

                        }else if($(this).is("button")){
                            columnName = "target";
                            columnValue = $(this).data("btn-target");
                        }
                    });

                    if (columnValue === '') columnValue =  null;

                    dataList[columnName] = columnValue;
                })
                // console.log(dataList);
                formUtil.popup("updatePopup_"+btnName,Message.Label.Array["CONFIRM.UPDATE"],fn,dataList);
                // fn(dataList);
            }
        },
        //삭제 버튼 설정
        deleteBtnClick:function(fn,btnName){
            //최초 한번 이벤트 바인딩
            $("."+btnName).off("click.rowClickEventHandler").on("click.rowClickEventHandler",function(e){
                deleteBtnClickEventHandler(e);
            });
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.addedNodes.length > 0) {
                        let $giGridList = $(".gi-grid-list");
                        if ($giGridList.length > 0) {
                            observer.disconnect();
                        }
                        $("."+btnName).off("click.rowClickEventHandler").on("click.rowClickEventHandler",function(e){
                            deleteBtnClickEventHandler(e);
                        });
                    }
                });
            });
            observer.observe($("#"+gridId)[0], { childList: true, subtree: true });
            function deleteBtnClickEventHandler(e){
                let rowId = $(e.target).data("rowNum");
                let dataItems = $(e.currentTarget).parents(".gi-grid-list").children("li");
                let dataList = {};
                dataItems.map((i,item) => {
                    let columnName = $(item).data("field");
                    let columnValue = "";

                    $(item).children().each(function() {
                        if($(this).is("span")){
                            formUtil.checkEmptyValue($(this).data("gridValue")) ? columnValue = $(this).data("gridValue")+"" : columnValue = $(this).text();

                        }else if($(this).is("button")){
                            columnName = "target";
                            columnValue = $(this).data("btn-target");
                        }
                    });

                    if (columnValue === '') columnValue =  null;

                    dataList[columnName] = columnValue;
                })
                // console.log(dataList);
                formUtil.popup("deletePopup_"+btnName,Message.Label.Array["CONFIRM.DELETE"],fn,dataList);
                // fn(dataList);
            }
        },
        //정렬용 컬럼 클릭 이벤트
        sortDataSet:function(fn, notSortList){
            notSortList = notSortList || [];

            // 중복실행이 너무 많아서 수정 -> 부모 요소에 클릭 이벤트 등록
            $("#"+gridId+' ul.gi-grid-list-header').off('click').on('click', 'li', function() {
                let column = $(this).data('column');

                // 버튼 컬럼이나 제외 컬럼은 처리하지 않음
                if (column.endsWith('_btn') || notSortList.includes(column)) {
                    return;
                }

                // 정렬 상태 변경
                if (gridSortManager.sortColumn === column && gridSortManager.sortOrder === 'asc') {
                    gridSortManager.setSort(column, 'desc');
                } else if (gridSortManager.sortColumn === column && gridSortManager.sortOrder === 'desc') {
                    gridSortManager.setSort(null, null); // 정렬 해제
                } else {
                    gridSortManager.setSort(column, 'asc');
                }

                // 현재 설정된 옵션
                let pagingOption = $('#' + giGridRowSelectorId + ' option:selected').val();
                let currentPage = $('.active').data('field');

                // 정렬용 콜백 함수 실행
                fn(currentPage, pagingOption, gridSortManager.sortColumn, gridSortManager.sortOrder);
            });
        },
        rowClick: function(fn) {
            // 최초 로딩 시 이벤트를 설정
            setRowClickEvent(fn);
            // MutationObserver로 동적 추가된 요소에 대해서도 이벤트 설정
            const observer = new MutationObserver((mutations) => {
                const hasAddedNodes = mutations.some(mutation => mutation.addedNodes.length > 0);
                if (hasAddedNodes) {
                    let $giGridList = $(".gi-grid-list");
                    if ($giGridList.length > 0) {
                        observer.disconnect(); // 필요시 사용
                    }
                    setRowClickEvent(fn);
                }
            });

            observer.observe($("#" + gridId)[0], { childList: true, subtree: true });

            // rowClick 이벤트를 설정하는 함수
            function setRowClickEvent(fn) {
                let gridSelector = "#"+gridId;
                $(gridSelector).find(".gi-grid-list").addClass("gi-cursor-pointer");
                $(gridSelector).find(".gi-grid-list, .unused-menu")
                    .mouseenter(function() {
                    $(this).addClass("gi-grid-list-hover");
                })
                    .mouseleave(function() {
                    $(this).removeClass("gi-grid-list-hover");
                })
                    .click(function(){
                        if($(this).hasClass("gi-grid-list-select")){
                            $(this).removeClass("gi-grid-list-select");
                        }else{
                            $(".gi-grid-list").removeClass("gi-grid-list-select");
                            $(this).addClass("gi-grid-list-select");
                        }
                    })
                ;

                // 클릭 시 이벤트 설정
                $("ul[data-row-num]").off("click.rowClickEventHandler").on("click.rowClickEventHandler", function(e) {
                    if (!$(e.target).is("button")) {
                        rowClickEventHandler(e, fn);
                    }
                });
            }

            // rowClick 이벤트 핸들러
            function rowClickEventHandler(e, fn) {
                let columnArray = $(e.currentTarget).children("li");
                let resultList = [];
                columnArray.map((i, item) => {
                    const columnName = $(item).data("field");
                    const columnValue = $(item).children("span").text();
                    const hasDataGridValue = $(item).children("span").data("gridValue");
                    if(formUtil.checkEmptyValue(hasDataGridValue)){
                        resultList[columnName+"_value"] = hasDataGridValue;
                    }
                    resultList[columnName] = columnValue;
                    resultList["EVENT"] = e;
                });
                fn(resultList,e);
            }
        },
        rowMultiSelectClick:function(fn){
            setMultiRowClickEvent(fn);
            // MutationObserver로 동적 추가된 요소에 대해서도 이벤트 설정
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.addedNodes.length > 0) {
                        let $giGridList = $(".gi-grid-list");
                        if ($giGridList.length > 0) {
                            observer.disconnect(); // 추가된 노드가 있을 때만 observer를 종료
                        }
                        setMultiRowClickEvent(fn)// 이벤트 처리
                    }
                });
            });

            observer.observe($("#" + gridId)[0], { childList: true, subtree: true });
            function setMultiRowClickEvent(fn) {
                $(".gi-grid-list").addClass("gi-cursor-pointer");
                $(".gi-grid-list").mouseenter(function() {
                    $(this).addClass("gi-grid-list-hover");
                }).mouseleave(function() {
                    $(this).removeClass("gi-grid-list-hover");
                });

                // 클릭 시 이벤트 설정
                $("ul[data-row-num]").off("click.rowClickEventHandler").on("click.rowClickEventHandler", function(e) {
                    if (!$(e.target).is("button")) {
                        rowMultiClickEventHandler(e, fn);
                    }
                });
                function rowMultiClickEventHandler(e, fn){
                    let target = e.currentTarget;
                    let isSelected = target.classList.contains("gi-grid-list-multi_select");
                    let resultList = [];

                    if(isSelected){
                        $(target).removeClass("gi-grid-list-multi_select");
                    }else{
                        $(target).addClass("gi-grid-list-multi_select");
                    }

                    let isSelectedVolume = $("#"+gridId + " .gi-grid-list-multi_select");
                    isSelectedVolume.each((i,item)=>{
                        let columnArray = $(item).children("li");
                        let tempList = [];
                        columnArray.map((i, item) => {
                            const columnName = $(item).data("field");
                            const columnValue = $(item).children("span").text();
                            tempList[columnName] = columnValue;
                        });
                        resultList.push(tempList);
                    })
                    fn(resultList);
                }
            }
        },
        sideOpenBtnClick:function(tagId,btnName){
            let $tagId = $("#"+tagId);
            let $btnName = $("."+btnName);
            let sideGridOpenCloseBtn = '<div class="side_grid_close-btn"><span>X</span></div>'
            let $sideGridCloseBtn = $(".side_grid_close-btn");

            if($btnName.length === 0){
                // MutationObserver로 동적 추가된 요소에 대해서도 이벤트 설정
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.addedNodes.length > 0) {
                            let $giGridList = $(".gi-grid-list");
                            if ($giGridList.length > 0) {
                                observer.disconnect(); // 추가된 노드가 있을 때만 observer를 종료
                            }
                            let $btnName = $("."+btnName);
                            // 이벤트 처리
                            $btnName.off("click.sideOpenBtnClickEventHandler").on("click.sideOpenBtnClickEventHandler",function(e){
                                sideOpenBtnClickEventHandler(e);
                            });
                        }
                    });
                });

                observer.observe($("#" + gridId)[0], { childList: true, subtree: true });
            }else{
                $btnName.off("click.sideOpenBtnClickEventHandler").on("click.sideOpenBtnClickEventHandler",function(e){
                    sideOpenBtnClickEventHandler(e);
                });
            }


            function sideOpenBtnClickEventHandler(e){
                $("[data-side-grid-open]").map((i,item) => {
                    $(item).attr("data-side-grid-open","false");
                })

                $($tagId).attr("data-side-grid-open","true");
                $tagId.html(sideGridOpenCloseBtn);
                sideGridCloseBtnEvent();

                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.addedNodes.length > 0) {
                            let $giGridList = $(".gi-grid-list");
                            if ($giGridList.length > 0) {
                                observer.disconnect(); // 추가된 노드가 있을 때만 observer를 종료
                            }
                            if ($tagId.find(".side_grid_close-btn").length === 0) {
                                $tagId.html(sideGridOpenCloseBtn);
                                sideGridCloseBtnEvent();
                            }
                        }
                    });
                });

                observer.observe($("#" + tagId)[0], { childList: true, subtree: true });

                function sideGridCloseBtnEvent(){
                    $(".side_grid_close-btn").off("click.sideGridCloseBtnClickEventHandler").on("click.sideGridCloseBtnClickEventHandler",function(e){
                        sideGridCloseBtnClickEventHandler();
                    })
                    function sideGridCloseBtnClickEventHandler(){
                        $("[data-side-grid-open]").map((i,item) => {
                            if(formUtil.checkEmptyValue($(item).data("sideGridOpenInit"))){
                                let flag = $(item).data("sideGridOpenInit");
                                flag = flag.toString();
                                $(item).attr("data-side-grid-open",flag);
                            }
                        })
                        $($tagId).attr("data-side-grid-open","false");
                        $("#"+tagId).empty();
                    }
                }
            }
        },
        Hierarchy2DepthMultiSelectClick: function (fn) {
            //cursor & hover
            $(".gi-grid-list").addClass("gi-cursor-pointer");

            // clickEvent
            $("ul[data-row-num]").off("click.hierarchy2DepthMultiSelectClickEventHandler").on("click.hierarchy2DepthMultiSelectClickEventHandler", function (e) {
                let $ul = $(e.currentTarget);
                let firstLi = $ul.children("li").not('.hidden').first(); //depth 클래스가 있는 위치
                let resultList = [];

                // 'gi-grid-hierarchy-depth0'(상위)인지 확인
                if (firstLi.hasClass("gi-grid-hierarchy-depth0")) {
                    let isSelected = $ul.hasClass("gi-grid-list-root-select");

                    $ul.toggleClass("gi-grid-list-root-select");

                    // 다음 상위 요소가 나오기 전까지 모든 하위 요소 처리
                    $ul.nextAll("ul[data-row-num]").each(function () {
                        let $nextUl = $(this);
                        let $firstLi = $nextUl.children("li").first();

                        if ($firstLi.hasClass("gi-grid-hierarchy-depth0")) {
                            return false;
                        }
                        $nextUl.toggleClass("gi-grid-list-multi_select", !isSelected);
                    });
                } else { // 하위요소라면 본인만 처리
                    $ul.toggleClass("gi-grid-list-multi_select");
                }

                // 선택된 모든 요소의 데이터를 가져와서 배열로 변환
                let isSelectedVolume = $(".gi-grid-list-multi_select");
                isSelectedVolume.each((i, item) => {
                    let columnArray = $(item).children("li");
                    let tempList = {};
                    columnArray.each((i, li) => {
                        const columnName = $(li).data("field");
                        const columnValue = $(li).children("span").text();
                        tempList[columnName] = columnValue;
                    });
                    resultList.push(tempList);
                });

                fn(resultList);
            });
        },
        gridColumResize : function (gridId){
            formUtil.gridResize(gridId);
        }
    }
}
FormUtility.prototype.gridResize = function(gridId){
    $(".gridColumResizer").css("cursor","ew-resize");
    $("#"+gridId+" .gridColumResizer").on("mousedown", function (e) {
        const $resizer = $(this);
        const $headerLi = $resizer.closest("li");
        const columnKey = $headerLi.data("column");
        const startX = e.clientX;

        // 헤더: data-column
        const $headerCols = $("#"+gridId+" li[data-column='" + columnKey + "']");
        // 바디: data-field
        const $bodyCols = $("#"+gridId+" li[data-field='" + columnKey + "']");

        const $allCols = $headerCols.add($bodyCols);

        // 각각의 시작 너비 저장
        const startWidths = $allCols.map(function () {
            return $(this).outerWidth();
        }).get();

        // 마우스 이동 이벤트
        $(window).on("mousemove.resize", function (e) {
            const delta = e.clientX - startX;

            $allCols.each(function (i) {
                const newWidth = startWidths[i] + delta;
                if (newWidth > 30) {
                    $(this).width(newWidth);
                }
            });
        });

        // 마우스 해제 시 이벤트 제거
        $(window).on("mouseup.resize", function () {
            $(window).off(".resize");
        });

        e.preventDefault(); // 드래그 시 텍스트 선택 방지
    });
}
/**
 * @title : handleToolTip
 * @writer: 문상혁
 */
FormUtility.prototype.handleToolTip = function() {
    $(".gi-tooltip-info-icon").hover(
        function (){
            $(this).siblings(".gi-tooltip-info-text").removeClass("gi-hidden");
        },
        function (){
            $(this).siblings(".gi-tooltip-info-text").addClass("gi-hidden");
        },
    );
}
/**
 * @title : 이미지 파일 업로드
 * @id : 파일업로드 팝업을 띄울 버튼 click event ID 설정 (이벤트를 걸어줄 아이디) [String]
 * @path : controller URL 입력
 * @writer : 이경태
 * */
FormUtility.prototype.createImgFileUpload = function(id,path,cont,fn=false){
    let finalCommFileList = {};
    let tempCommFileList = {};
    let clipPathCirclePX = "84px";
    //이벤트 호출
    initEventHandler();
    function createImageFileUploadClickEvent(){
        //파일팝업 취소 버튼 클릭 이벤트
        $(".formUtil-fileUpload_cancelBtn").off("click.cancelBtnClickEventHandler").on("click.cancelBtnClickEventHandler",function(e){
            cancelBtnClickEventHandler(e);
        })
        //이미지 파일 업로드 버튼 클릭 이벤트
        $("#fileElem").off("change.chooseImgFileBtnChangeEventHandler").on("change.chooseImgFileBtnChangeEventHandler",function(e){
            chooseImgFileBtnChangeEventHandler(e);
        })

        $(".formUtil-fileUpload_uploadBtn").off("click.cancelBtnClickEventHandler").on("click.cancelBtnClickEventHandler",function(e){
            filePopupUploadBtnClickEvent(cont);
        });
    }
    //파일팝업 취소 버튼 클릭 이벤트 핸들러
    function cancelBtnClickEventHandler(){
        $("#formUtil_fileUpload").empty();
    }

    //이미지 파일 업로드 버튼 클릭 이벤트 핸들러
    function chooseImgFileBtnChangeEventHandler(e){
        if(formUtil.checkEmptyValue(e.currentTarget.files[0])){
            let fileInfo = e.currentTarget.files;
            handleFiles(fileInfo);
        }

    }

    //이벤트 할당 핸들러
    function initEventHandler(){
        //이미지 파일 업로드 버튼 클릭이벤트
        imgFileUploadBtnClickEvent();
    }
    //해당페이지의 이미지 파일 업로드 버튼 클릭 이벤트
    function imgFileUploadBtnClickEvent(){
        $("#" + id).off("click.imgFileUploadBtnClickEventHandler").on("click.imgFileUploadBtnClickEventHandler",async function(e){
            //이미지 파일 업로드 버튼 클릭이벤트핸들러
            await imgFileUploadBtnClickEventHandler(e);
        })
    }
    //해당페이지의 이미지 파일 업로드 버튼 클릭 이벤트 핸들러
    async function imgFileUploadBtnClickEventHandler(e){
        let contents = await setImgFileUploadHtmlLayout();
        $("#formUtil_fileUpload").html(contents);

        dragAndDropEventHandler();
        createImageFileUploadClickEvent();
    }
    //파일 드래그앤 드랍 설정 이벤트 함수
    function dragAndDropEventHandler(){
        let dropArea = $(".formUtil-fileUpload_body")[0];

        // 드래그 앤 드롭 이벤트를 처리하는 함수 추가
        dropArea.addEventListener('dragover', handleDragOver, false);
        dropArea.addEventListener('dragleave', handleDragLeave, false);
        dropArea.addEventListener('drop', handleDrop, false);

        function handleDragOver(evt) {
            evt.stopPropagation();
            evt.preventDefault();
            evt.dataTransfer.dropEffect = 'copy';
        }

        function handleDragLeave(evt) {
            evt.stopPropagation();
            evt.preventDefault();
        }

        function handleDrop(evt) {
            evt.stopPropagation();
            evt.preventDefault();
            let files = evt.dataTransfer.files;
            handleFiles(files); // 선택한 파일 목록을 처리하는 함수 호출
        }

    }

    // 이미지 크기 조정 함수
    function resizeImage(file, maxWidth, maxHeight, callback) {
        let reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = function (event) {
            let img = new Image();
            img.src = event.target.result;

            img.onload = function () {
                let canvas = document.createElement("canvas");
                let ctx = canvas.getContext("2d");

                let width = img.width;
                let height = img.height;
                // 비율 유지하며 크기 조정
                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);

                // Canvas 데이터를 Blob으로 변환
                canvas.toBlob((blob) => {
                    let resizedFile = new File([blob], file.name, { type: file.type });
                    callback(resizedFile);
                }, file.type);
            };
        };
    }
    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    function dragAble(flag,fileName,fileExtension){
        let dragPointer = $(".drag_pointer");
        let imgThumbNailLayout = $("#img_thumb_nail_layout");
        let circleX = "";
        let circleY = "";
        if(dragPointer.length > 0){
            dragPointer.remove();
            $("#img_crop_thumb_nail").css({
                width: 0,
                height: 0,
            })
        }
        if(formUtil.checkEmptyValue(flag)){
            let dragPointerHtml = "<div class='drag_pointer'></div>";
            $("#img_thumb_nail_layout").append(dragPointerHtml);

            dragPointer = $(".drag_pointer");

            let isDragging = false;
            let offsetX = 0
            let offsetY = 0;
            circleX = parseInt(dragPointer[0].offsetLeft);
            circleY = parseInt(dragPointer[0].offsetTop);

            //그래그 하지 않고 바로 저장시 현재 지정된 영역 crop
            cropImagUpload();

            dragPointer.off("mousedown").on("mousedown", function(e) {
                isDragging = true;
                offsetX = e.clientX - $(this).position().left;
                offsetY = e.clientY - $(this).position().top;

            });
            imgThumbNailLayout.off("mousemove").on("mousemove", function(e) {
                if (isDragging) {
                     let newX = e.clientX - offsetX;
                     let newY = e.clientY - offsetY;

                    dragPointer.css({
                        left: newX + "px",
                        top: newY + "px",
                        transition : "none"
                    });
                    $("#img_crop_thumb_nail").css({
                        width: 200 + "px",
                        height: 200 + "px"
                    })
                    let thumbNail = $("#img_thumb_nail");
                    thumbNail.css("clip-path", "circle("+clipPathCirclePX+" at "+newX+"px "+newY + "px"+")" );
                    circleX = newX;
                    circleY = newY;
                }
            });

            imgThumbNailLayout.off("mouseup").on("mouseup", function() {
                isDragging = false;
                cropImagUpload();
            });
            function cropImagUpload(){
                let reader = new FileReader();
                reader.readAsDataURL(tempCommFileList[0]);
                reader.onload = function (event) {
                    let img = new Image();
                    img.src = event.target.result;

                    img.onload = function () {
                        cropToCircle(img,circleX,circleY, (croppedBlob) => {
                            let croppedUrl = URL.createObjectURL(croppedBlob);
                            finalCommFileList = { 0: new File([croppedBlob], fileName+"."+fileExtension, { type: "image/png" }) };
                            //잘린 결과물 확인
                            // $("#img_thumb_nail").css("background-image","url("+croppedUrl+")");
                            // $(".gi-img-size_guide").css("background-image","url("+croppedUrl+")");
                            $("#img_crop_thumb_nail").css("background-image","url("+croppedUrl+")");
                        });
                    };
                };
            }
        }
    }
    //이미지 자르기 함수
    function cropToCircle(image,newX,newY, callback) {
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");

        let circleRadius = 100; // 원형 반지름
        let finalSize = circleRadius * 2; // 최종 캔버스 크기 (200x200px)

        canvas.width = finalSize;
        canvas.height = finalSize;

        // 화면에서 보이는 img_thumb_nail_layout 크기
        let thumbNailLayout = $("#img_thumb_nail_layout");
        let layoutWidth = thumbNailLayout.width();   // 화면에서의 크기
        let layoutHeight = thumbNailLayout.height();

        // 원본 이미지 크기
        let originalWidth = image.width;
        let originalHeight = image.height;

        // 이미지 비율을 유지하면서 자를 영역 계산
        let scaleX = originalWidth / layoutWidth;
        let scaleY = originalHeight / layoutHeight;

        // newX, newY는 img_thumb_nail_layout 영역을 기준으로 주어지므로,
        // 이를 원본 이미지 크기에 맞게 변환
        let cropX = newX * scaleX - circleRadius; // 원본 이미지의 크기 기준
        let cropY = newY * scaleY - circleRadius; // 원본 이미지의 크기 기준

        // 원형 마스크 적용
        ctx.beginPath();
        ctx.arc(circleRadius, circleRadius, circleRadius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        // 원본 이미지에서 자른 부분을 캔버스에 그림
        ctx.drawImage(image, cropX, cropY, finalSize, finalSize, 0, 0, finalSize, finalSize);

        // Blob으로 변환 후 콜백 호출
        canvas.toBlob((blob) => {
            callback(blob);
        }, "image/png");
    }
    //파일,썸네일 셋팅
    function handleFiles(files) {
        let fileInput = files[0];
        if(formUtil.checkEmptyValue(fileInput)){
            let fileInfo = fileInput;
            let fileArray = fileInfo.name.split(".");
            let fileName = fileArray[0];
            let lastDotPosition = fileArray.length-1;
            let fileSize = formatBytes(fileInfo.size);
            let fileExtension = fileArray[lastDotPosition];
            let ObjectUrl = URL.createObjectURL(fileInfo);
            if(formUtil.checkEmptyValue(fileName)){
                resizeImage(fileInfo, 1000, 1000, (resizedFile) => {
                    let resizedUrl = URL.createObjectURL(resizedFile);
                    $("#img_crop_thumb_nail").css("background-image","none");
                    $("#img_thumb_nail").css("background-image","url("+resizedUrl+")");
                    $("#img_thumb_nail").css("clip-path","circle("+clipPathCirclePX+" at 50% 50%");
                    $(".gi-img-size_guide").css("background-image","url("+resizedUrl+")");

                    $("#img_thumb_nail_layout").removeClass("gi-hidden");
                    $("#choose_img_file-name").val(fileName);
                    $("#choose_img_file-size").val(fileSize);
                    $("#choose_img_file-extension").val(fileExtension);
                    finalCommFileList = files;
                    tempCommFileList = files;

                    //자르는 영역 로직 설정
                    dragAble(true,fileName,fileExtension);
                });
            }else{
                formUtil.showMessage("파일 이름이 없습니다");
            }
        }
    }

    function filePopupUploadBtnClickEvent(cont){
        //파일업로드 팝업 업로드 버튼 클릭 이벤트
        let url = "/fileManager/upload";
        let param = new FormData();
        param.append("folder_name",cont.FOLDER_NAME)
        if(formUtil.checkEmptyValue($(".formUtil-file_description").val())){
            param.append("file_description",$(".formUtil-file_description").val());
        }else{
            param.append("file_description","");
        }
        for (let key in finalCommFileList) {
            if (Object.prototype.hasOwnProperty.call(finalCommFileList, key)) {
                param.append('files', finalCommFileList[key]);
            }
        }
        let MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
        for (let key in finalCommFileList) {
            if (Object.prototype.hasOwnProperty.call(finalCommFileList, key)) {
                if (finalCommFileList[key].size > MAX_FILE_SIZE) {
                    formUtil.alertPopup(Message.Label.Array["MAXIMUM.UPLOAD.SIZE.100MB"]);
                    return;
                }
            }
        }
        // 공통파일 테이블에 inset 후 uuid return
        axios.post(url, param, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(response => {
            let data = new dataBinding().getData("imgFileUploadForm")
            let comFileData = response.data[0];
            let url = path + '/register';
            let param = [{
                file_id: comFileData.file_id,
                file_path: comFileData.file_path,
                system_create_userid: comFileData.system_create_userid,
                uuid: comFileData.file_uuid,
                file_description: "",
                row_seq: 1,
                file_name : data.file_name,
                file_size : data.file_size,
                file_extension: data.file_extension
            }];
            //설정한 파일테이블에 insert
            axios.post(url , param).then(response => {
                let data = response.data;
                if(data === 1){
                    $("#uuid").val(comFileData.file_uuid);
                    if(fn){
                        fn();
                    }
                    formUtil.showMessage("File Upload Success!!");
                }else{
                    formUtil.alertPopup("File Upload Fail!!");
                }
            }).catch(error =>{
                formUtil.alertPopup(error.response.data);
            })
        }).catch(error => {
            formUtil.alertPopup(error+"");
        });
    }

    //파일 레이아웃 html 설정
    async function setImgFileUploadHtmlLayout(){
        return new Promise(resolve =>{

            let contents=
                '<div class="formUtil-fileUpload_body"">'+
                    '<div class="formUtil-fileUpload gi-grid gi-grid-template-rows-9fr-1fr slide-in-blurred-top gi-grid-gap-30px">' +
                        '<div id="img_thumb_nail_layout" class="gi-row-100 gi-col-95 gi-hidden gi-flex gi-flex-center gi-overflow">' +
                            '<div id="img_crop_thumb_nail"></div>'+
                            '<div id="img_thumb_nail"></div>'+
                            '<div class="gi-img-size_guide"></div>'+
                        '</div>'+
                        '<form id="imgFileUploadForm" enctype="multipart/form-data">' +
                            '<div class="formUtil-fileUpload_dropArea">'+
                                '<label for="fileElem" >'+
                                    '<i class="bi bi-upload" style="color: #999 !important;margin-right: 1.3rem !important;font-size: 3rem;"></i>'+
                                    '<div class="formUtil-fileUpload_span-body">'+
                                        '<span class="formUtil-fileUpload_span" style="display:block">FILE UPLOAD CLICK</span>'+
                                        '<span class="formUtil-fileUpload_span">[Drag And Drop]</span>'+
                                    '</div>'+
                                '</label>'+
                            '</div>'+
                            '<input type="file" class="gi-hidden" id="fileElem" name="fileElem" accept="image/*"/>' +
                            '<input class="gi-hidden" data-field="file_name" id="choose_img_file-name" type="text"/>'+
                            '<input class="gi-hidden" data-field="file_size" id="choose_img_file-size" type="text"/>'+
                            '<input class="gi-hidden" data-field="file_extension" id="choose_img_file-extension" type="text"/>'+
                        '</form>'+
                        '<article class="formUtil-fileUpload_footer">'+
                            '<button class="formUtil-fileUpload_uploadBtn">'+
                                '<span>업로드</span>'+
                                '<span></span>'+
                            '</button>'+
                            '<button class="formUtil-fileUpload_cancelBtn">'+
                                '<span>취소</span>'+
                                '<span></span>'+
                            '</button>'+
                        '</article>'+
                    '</div>'+
                '</div>';
            return resolve(contents);
        })
    }
}
/**
 * @title : 이미지 파일 업로드
 * @id : 파일업로드 팝업을 띄울 버튼 click event ID 설정 (이벤트를 걸어줄 아이디) [String]
 * @path : controller URL 입력
 * @writer : 이경태 / 이진주 수정
 * */
FormUtility.prototype.createUncutImgFileUpload = function (id, path, cont, fn = false) {
    let finalCommFileList = {};
    let tempCommFileList = {};
    //이벤트 호출
    initEventHandler();

    function createImageFileUploadClickEvent() {
        //파일팝업 취소 버튼 클릭 이벤트
        $("#formUtil_uncutFileUpload .formUtil-fileUpload_cancelBtn").off("click.cancelBtnClickEventHandler").on("click.cancelBtnClickEventHandler", function (e) {
            cancelBtnClickEventHandler(e);
        })
        //이미지 파일 업로드 버튼 클릭 이벤트
        $("#formUtil_uncutFileUpload #fileElem").off("change.chooseImgFileBtnChangeEventHandler").on("change.chooseImgFileBtnChangeEventHandler", function (e) {
            chooseImgFileBtnChangeEventHandler(e);
        })

        $("#formUtil_uncutFileUpload .formUtil-fileUpload_uploadBtn").off("click.cancelBtnClickEventHandler").on("click.cancelBtnClickEventHandler", function (e) {
            filePopupUploadBtnClickEvent(cont);
        });
    }

    //파일팝업 취소 버튼 클릭 이벤트 핸들러
    function cancelBtnClickEventHandler() {
        $("#formUtil_uncutFileUpload").empty();
    }

    //이미지 파일 업로드 버튼 클릭 이벤트 핸들러
    function chooseImgFileBtnChangeEventHandler(e) {
        if (formUtil.checkEmptyValue(e.currentTarget.files[0])) {
            let fileInfo = e.currentTarget.files;
            handleFiles(fileInfo);
        }

    }

    //이벤트 할당 핸들러
    function initEventHandler() {
        //이미지 파일 업로드 버튼 클릭이벤트
        imgFileUploadBtnClickEvent();
    }

    //해당페이지의 이미지 파일 업로드 버튼 클릭 이벤트
    function imgFileUploadBtnClickEvent() {
        $("#" + id).off("click.imgFileUploadBtnClickEventHandler").on("click.imgFileUploadBtnClickEventHandler", async function (e) {
            //이미지 파일 업로드 버튼 클릭이벤트핸들러
            await imgFileUploadBtnClickEventHandler(e);
        })
    }

    //해당페이지의 이미지 파일 업로드 버튼 클릭 이벤트 핸들러
    async function imgFileUploadBtnClickEventHandler(e) {
        let contents = await setImgFileUploadHtmlLayout();
        $("#formUtil_uncutFileUpload").html(contents);

        dragAndDropEventHandler();
        createImageFileUploadClickEvent();
    }

    //파일 드래그앤 드랍 설정 이벤트 함수
    function dragAndDropEventHandler() {
        let dropArea = $("#formUtil_uncutFileUpload .formUtil-fileUpload_body")[0];

        // 드래그 앤 드롭 이벤트를 처리하는 함수 추가
        dropArea.addEventListener('dragover', handleDragOver, false);
        dropArea.addEventListener('dragleave', handleDragLeave, false);
        dropArea.addEventListener('drop', handleDrop, false);

        function handleDragOver(evt) {
            evt.stopPropagation();
            evt.preventDefault();
            evt.dataTransfer.dropEffect = 'copy';
        }

        function handleDragLeave(evt) {
            evt.stopPropagation();
            evt.preventDefault();
        }

        function handleDrop(evt) {
            evt.stopPropagation();
            evt.preventDefault();
            let files = evt.dataTransfer.files;
            handleFiles(files); // 선택한 파일 목록을 처리하는 함수 호출
        }

    }

    // 이미지 크기 조정 함수
    function resizeImage(file, maxWidth, maxHeight, callback) {
        let reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = function (event) {
            let img = new Image();
            img.src = event.target.result;

            img.onload = function () {
                let canvas = document.createElement("canvas");
                let ctx = canvas.getContext("2d");

                let width = img.width;
                let height = img.height;
                // 비율 유지하며 크기 조정
                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);

                // Canvas 데이터를 Blob으로 변환
                canvas.toBlob((blob) => {
                    let resizedFile = new File([blob], file.name, {type: file.type});
                    callback(resizedFile);
                }, file.type);
            };
        };
    }

    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    //파일,썸네일 셋팅
    function handleFiles(files) {
        let fileInput = files[0];
        if (formUtil.checkEmptyValue(fileInput)) {
            let fileInfo = fileInput;
            let fileArray = fileInfo.name.split(".");
            let fileName = fileArray[0];
            let lastDotPosition = fileArray.length - 1;
            let fileSize = formatBytes(fileInfo.size);
            let fileExtension = fileArray[lastDotPosition];
            let ObjectUrl = URL.createObjectURL(fileInfo);
            if (formUtil.checkEmptyValue(fileName)) {
                resizeImage(fileInfo, 1000, 1000, (resizedFile) => {
                    let resizedUrl = URL.createObjectURL(resizedFile);
                    $("#formUtil_uncutFileUpload .gi-img-size_guide").css("background-image", "url(" + resizedUrl + ")");

                    $("#formUtil_uncutFileUpload #img_thumb_nail_layout").removeClass("gi-hidden");
                    $("#formUtil_uncutFileUpload #choose_img_file-name").val(fileName);
                    $("#formUtil_uncutFileUpload #choose_img_file-size").val(fileSize);
                    $("#formUtil_uncutFileUpload #choose_img_file-extension").val(fileExtension);
                    finalCommFileList = files;
                    tempCommFileList = files;
                });
            } else {
                formUtil.showMessage("파일 이름이 없습니다");
            }
        }
    }

    function filePopupUploadBtnClickEvent(cont) {
        //파일업로드 팝업 업로드 버튼 클릭 이벤트
        let url = "/fileManager/upload";
        let param = new FormData();
        param.append("folder_name", cont.FOLDER_NAME)
        if (formUtil.checkEmptyValue($("#formUtil_uncutFileUpload .formUtil-file_description").val())) {
            param.append("file_description", $("#formUtil_uncutFileUpload .formUtil-file_description").val());
        } else {
            param.append("file_description", "");
        }
        for (let key in finalCommFileList) {
            if (Object.prototype.hasOwnProperty.call(finalCommFileList, key)) {
                param.append('files', finalCommFileList[key]);
            }
        }
        let MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
        for (let key in finalCommFileList) {
            if (Object.prototype.hasOwnProperty.call(finalCommFileList, key)) {
                if (finalCommFileList[key].size > MAX_FILE_SIZE) {
                    formUtil.alertPopup(Message.Label.Array["MAXIMUM.UPLOAD.SIZE.100MB"]);
                    return;
                }
            }
        }
        // 공통파일 테이블에 inset 후 uuid return
        axios.post(url, param, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(response => {
            let data = new dataBinding().getData("imgFileUploadForm")
            let comFileData = response.data[0];
            let url = path + '/register';
            let param = [{
                file_id: comFileData.file_id,
                file_path: comFileData.file_path,
                system_create_userid: comFileData.system_create_userid,
                uuid: comFileData.file_uuid,
                file_description: "",
                row_seq: 1,
                file_name: data.file_name,
                file_size: data.file_size,
                file_extension: data.file_extension
            }];
            //설정한 파일테이블에 insert
            axios.post(url, param).then(response => {
                let data = response.data;
                if (data === 1) {
                    $("#uuid").val(comFileData.file_uuid);
                    if (fn) {
                        fn();
                    }
                    formUtil.showMessage("File Upload Success!!");
                } else {
                    formUtil.alertPopup("File Upload Fail!!");
                }
            }).catch(error => {
                formUtil.alertPopup(error.response.data);
            })
        }).catch(error => {
            formUtil.alertPopup(error + "");
        });
    }

    //파일 레이아웃 html 설정
    async function setImgFileUploadHtmlLayout() {
        return new Promise(resolve => {

            let contents =
                '<div class="formUtil-fileUpload_body"">' +
                '<div class="formUtil-fileUpload gi-grid gi-grid-template-rows-9fr-1fr slide-in-blurred-top gi-grid-gap-30px">' +
                '<div id="img_thumb_nail_layout" class="gi-row-100 gi-col-95 gi-hidden gi-flex gi-flex-center gi-overflow">' +
                '<div class="gi-img-size_guide"></div>' +
                '</div>' +
                '<form id="imgFileUploadForm" enctype="multipart/form-data">' +
                '<div class="formUtil-fileUpload_dropArea">' +
                '<label for="fileElem" >' +
                '<i class="bi bi-upload" style="color: #999 !important;margin-right: 1.3rem !important;font-size: 3rem;"></i>' +
                '<div class="formUtil-fileUpload_span-body">' +
                '<span class="formUtil-fileUpload_span" style="display:block">FILE UPLOAD CLICK</span>' +
                '<span class="formUtil-fileUpload_span">[Drag And Drop]</span>' +
                '</div>' +
                '</label>' +
                '</div>' +
                '<input type="file" class="gi-hidden" id="fileElem" name="fileElem" accept="image/*"/>' +
                '<input class="gi-hidden" data-field="file_name" id="choose_img_file-name" type="text"/>' +
                '<input class="gi-hidden" data-field="file_size" id="choose_img_file-size" type="text"/>' +
                '<input class="gi-hidden" data-field="file_extension" id="choose_img_file-extension" type="text"/>' +
                '</form>' +
                '<article class="formUtil-fileUpload_footer">' +
                '<button class="formUtil-fileUpload_uploadBtn">' +
                '<span>업로드</span>' +
                '<span></span>' +
                '</button>' +
                '<button class="formUtil-fileUpload_cancelBtn">' +
                '<span>취소</span>' +
                '<span></span>' +
                '</button>' +
                '</article>' +
                '</div>' +
                '</div>';
            return resolve(contents);
        })
    }
}
/**
 * @title : tab 기능 설정
 * @SECTION_TAB : .gi-tab이 작성되어 있는 부모 태그
 * @fn : tab click 이벤트 발생시 동작하는 함수명
 * @data : tab click 이벤트 발생시 동작하는 함수에 할당되는 데이터
 * @text : .gi-tab 설정시 자동으로 data-tab-value 가 순차적으로 설정 되고 returnData에 자동 할당
 * @writer : 이경태
 * */
FormUtility.prototype.giTab = function(SECTION_TAB,fn=false,data=false){

    tabDataSetting(SECTION_TAB);

    $("#"+SECTION_TAB + " > "+".gi-tab").off("click.giTabClickEventHandler").on("click.giTabClickEventHandler",function(e){
        giTabClickEventHandler(e);
    });
    function giTabClickEventHandler(e){
        let target = e.currentTarget;

        $(target).addClass("gi-tab-active");
        $("#"+SECTION_TAB +" > "+".gi-tab").not(target).removeClass("gi-tab-active");

        let returnData = {
            tab_value : $(target).data("tabValue")
        };
            if(fn){
                if(data){
                    for(let key in data){
                        returnData[key] = data[key];
                    }
                    fn(returnData);
                }else{
                    fn(returnData);
                }
            }
    }
    function tabDataSetting(SECTION_TAB){
        let target = $("#"+SECTION_TAB +" > "+".gi-tab");
        let giTabLength = target.length;
        if(giTabLength > 0){
            target.map((i,item)=>{
                $(item).attr("data-tab-value",i);
            })
        }
    }
}
/**
 * @title : 키패드 기능 설정
 * @targetId : 숫자가 입력될 태그 아이디
 * @id : 키패드 아이디 ,아이다가 false 이면 기본 key_pad 로 설정
 * @setMaxLength(int) : 최대입력 값 설정
 * @text : 키패드 설정 태그
 * @writer : 이경태
 * */
FormUtility.prototype.giKeyPad = function(id){

    var maxLength;
    var setValuetargetId
    let keyPadId = "";
    if (formUtil.checkEmptyValue(id)) {
        keyPadId = id;
    } else {
        keyPadId = "key_pad";
    }
    let padHtml = '<div class="key_pad">' +
        '                            <div class="key_pad-number" data-key-pad-value="7"><span>7</span></div>' +
        '                            <div class="key_pad-number" data-key-pad-value="8"><span>8</span></div>' +
        '                            <div class="key_pad-number" data-key-pad-value="9"><span>9</span></div>' +
        '                            <div class="key_pad-number" data-key-pad-value="4"><span>4</span></div>' +
        '                            <div class="key_pad-number" data-key-pad-value="5"><span>5</span></div>' +
        '                            <div class="key_pad-number" data-key-pad-value="6"><span>6</span></div>' +
        '                            <div class="key_pad-number" data-key-pad-value="1"><span>1</span></div>' +
        '                            <div class="key_pad-number" data-key-pad-value="2"><span>2</span></div>' +
        '                            <div class="key_pad-number" data-key-pad-value="3"><span>3</span></div>' +
        '                            <div class="key_pad-number" data-key-pad-value="delete"><span><i class="fa-solid fa-arrow-left"></i></span></div>' +
        '                            <div class="key_pad-number" data-key-pad-value="0"><span>0</span></div>' +
        '                            <div class="key_pad-number" data-key-pad-value="cancel"><span><i class="fa-solid fa-xmark"></i></span></div>' +
        '                        </div>'
    $("#"+keyPadId).html(padHtml);
    $("#" + keyPadId + " .key_pad-number").on("click.keyPadValueClickEventHandler", function (e) {
        keyPadValueClickEventHandler(e, setValuetargetId);
    });
    return {
        setMaxLength: function (length) {
            maxLength = length;
        },
        setValueTarget: function (targetId) {
            setValuetargetId = targetId;
        }
    }

    function keyPadValueClickEventHandler(e, setValuetargetId) {
        let target = e.currentTarget;
        let keyPadValue = $(target).data("keyPadValue");
        let $targetId = $("#" + setValuetargetId);
        let $targetIdValue = $targetId.val();
        let $targetIdValueLength = $targetIdValue.length;
        if (keyPadValue === "cancel") {
            $targetId.val("");
        } else if (keyPadValue === "delete") {
            if ($targetIdValueLength !== 0) {
                let sliceValue = $targetIdValue.slice(0, $targetIdValueLength - 1);

                if($targetId[0].hasAttribute("inputpricewithcomma")){
                    sliceValue = sliceValue.replaceAll(/,/g ,"");
                    sliceValue = Number(sliceValue).toLocaleString()
                }

                $targetId.val(sliceValue)
            }
        } else {
            let resultValue = $targetIdValue + keyPadValue;
            if($targetId[0].hasAttribute("inputpricewithcomma")){
                // if(resultValue.startsWith("0")){
                //     return false;
                // }
                resultValue = resultValue.replaceAll(/,/g ,"");
                resultValue = Number(resultValue).toLocaleString()
            }
            if (formUtil.checkEmptyValue(maxLength)) {
                if (resultValue.length <= maxLength) {
                    $targetId.val(resultValue);
                }
            } else {
                $targetId.val(resultValue);
            }
        }
        commonTag.inputTagReset($targetId);
    }
}

/**
 * @title 한글 음절 단위 + 영문 + 숫자 검증
 * @param query
 */
FormUtility.prototype.isSyllable = function (query) {
    const consonantRegex = /^[ㄱ-ㅎ]+$/; // 자음만 포함
    const vowelRegex = /^[ㅏ-ㅣ]+$/; // 모음만 포함
    const syllableRegex = /^[가-힣a-zA-Z0-9]+$/; // 완전한 한글 음절만 포함

    if (consonantRegex.test(query)) {
        return false;
    }

    if (vowelRegex.test(query)) {
        return false;
    }

    /**
     * 자음 + 모음이 따로 입력 된 경우 : ㄱㅏ
     * 음절 + 자음, 음절+모음 형태로 입력 된 경우 : 가ㅇ, 가ㅏ
     */
    if (!syllableRegex.test(query)) {
        return false;
    }

    return true;
}

/**
 * @title : 오늘 날짜를 YYYY-MM-DD 형식의 문자열로 반환
 * @writer : 배수연
 */
function getTodayWithHyphens() {
    let date = new Date();
    let year = date.getFullYear();
    let month = ("0" + (1 + date.getMonth())).slice(-2);
    let day = ("0" + date.getDate()).slice(-2);

    return year + '-' + month + '-' + day;
}

async function validatePassword(url, password) {
    try {
        const response = await axios.post(url, password);

        if (response.data && response.data?.length > 0) {
            formUtil.showMessage(response.data[0]);
            return false;
        }

        return true;
    } catch (error) {
        formUtil.alertPopup(error.message || error);
        return false;
    }

}