/**
 * @title : 값 유효성 체크
 * @text : Value 값이 null,공백,undefined 인지 검사
 * @value :  값
 * @return : 값이 없으면 false, 값이 존재하면 true [Boolean]
 * @writer : 이경태
 */
FormUtility.prototype.checkEmptyValue = function (value) {
    let data = $.trim(value);
    let flag = true;

    if (data === "NaN" || data === "null" || data === null || data === "" || typeof data === "undefined" || data === "undefined" || data == [] || data.length === 0) flag = false;

    return flag;
};

/**
 * @title : 객체 유효성 체크
 * @text : checkEmptyValue 와 분리, checkEmptyValue 를 object 형식으로 사용하는 코드가 존재 하기때문에 이 함수는 오직 object 값이 존재하는지만 검사
 * @value :  값
 * @return : 값이 없으면 false, 값이 존재하면 true [Boolean]
 * @writer : 이경태
 */
FormUtility.prototype.checkObjectEmptyValue = function (value) {
    let result = true;
    if (value === "undefined" || value === null || value === "null" || value === undefined || (typeof value === "object" && !Object.keys(value).length)) {
        result = false;
    }
    return result;
}

/**
 * @title : 필수 입력 검증
 * @param arg1 : [Array|String] validation config 배열 OR formId
 * @param arg2 : [String] (Optional) messagePrefix (2번째 방식 사용 시 필요)
 * @description : 
 *    1. validationCheck(configArray): configArray에 formId 속성과 {id, message} 객체들이 포함됨
 *    2. validationCheck(formId, messagePrefix): formId 내의 required field에 대해 messagePrefix + data-field로 메시지 자동 조회
 * @text : 선행작업 requiredParamClassSetting() ,alertPopup()
 * @writer: 이경태
 */
/**
 * @title : 유효성 검사
 * @text : formId와 messagePrefix를 받아 필수 입력 항목을 검사합니다.
 * @param formId (String) : 검사할 Form의 ID
 * @param messagePrefix (String) : 메시지 키의 접두사 (예: "COM_CODE_GROUP.CHECK.")
 */
FormUtility.prototype.validationCheck = function (formId, messagePrefix) {
    console.log("validationCheck", formId, messagePrefix);
    if (!formId || !messagePrefix) {
        formUtil.toast("validationCheck error: formId and messagePrefix are required.");
        return false;
    }

    let result = true;
    let requiredFields = $("#" + formId + " [data-required='true'][data-field]").not('label').not('span');

    // UI Reset (Focus lines) - 기존 로직 참고
    requiredFields.each(function (index, field) {
        let $field = $(field);
        let volume = $field.val();
        if (!volume) {
            $field.parent().attr('data-focus-line', true);
            $field.parent().children("label").attr('data-focus-label', true);
        } else {
            $field.parent().attr('data-focus-line', false);
            $field.parent().children("label").attr('data-focus-label', true);
        }
    });

    for (let i = 0; i < requiredFields.length; i++) {
        let field = requiredFields[i];
        let $field = $(field);
        let volume = "";

        field.type === "radio" || field.type === "checkbox" ? volume = $field.is(":checked") : volume = $field.val();

        if (!volume) {
            if ($field.data("field")) {
                let messageId = $field.data("field").toUpperCase();
                let messageKey = messagePrefix + messageId;
                let message = Message.Label.Array[messageKey];

                if (!message) {
                    console.warn(`Message not found for key: ${messageKey}`);
                    message = "Message key not found: " + messageKey;
                }

                result = false;
                formUtil.toast(message, "error");

                if (field.type !== "radio" && field.type !== "checkbox") {
                    $field.focus();
                }
                return false;
            }
        }

        // 정규식 체크 (값이 있을 때만)
        if ($field.is('input[gi-format-check]')) {
            let formatCheck = new GiFormatCheck();
            let formatType = $field.attr("gi-format-check");
            let formatTypes = GiFormatCheck.getFormatTypes();

            if (formatTypes.includes(formatType)) {
                let isValid = formatCheck.validateInputFormat(field);
                let message = "";

                if ($field.data("field")) {
                    let messageId = $field.data("field").toUpperCase();
                    message = Message.Label.Array[messagePrefix + messageId];
                }

                if (!isValid && message) {
                    result = false;
                    // TODO: 메시지 커스터마이징이 필요하다면 여기서 처리
                    formUtil.toast(message.replace('를', '를 형식에 맞게<br/>'), "error");

                    $field.parent().attr('data-focus-line', true);
                    $field.parent().children("label").attr('data-focus-label', true);
                    return false;
                }
            }
        }
    }

    return result;
};

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
 * @title : 비밀번호 유효성 검증
 * @text : 서버를 통한 비밀번호 유효성 검사
 */
FormUtility.prototype.validatePassword = async function (url, password) {
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
