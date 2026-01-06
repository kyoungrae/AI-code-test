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
FormUtility.prototype.validationCheck = function (arg1, arg2) {
    let result = true;
    let formId;
    let configs = [];
    let isAutoConfig = false;
    let messagePrefix = "";

    // 인자 타입에 따른 처리
    if (Array.isArray(arg1)) {
        // 기존 방식: validation config 배열 (배열에 formId 속성 포함)
        formId = arg1.formId;
        configs = arg1;
    } else if (typeof arg1 === 'string' && typeof arg2 === 'string') {
        // 새로운 방식: formId, messagePrefix 전달
        formId = arg1;
        messagePrefix = arg2;
        isAutoConfig = true;
    }

    let requiredFields = $("#" + formId + " [data-required='true'][data-field]").not('label').not('span');

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

    // 필수 입력 필드가 비어있을 때 경고 팝업 표시
    requiredFields.each(function (index, field) {
        let $field = $(field);
        let volume = "";

        field.type === "radio" || field.type === "checkbox" ? volume = $field.is(":checked") : volume = $field.val();

        if (!volume) {
            if (isAutoConfig) {
                if ($field.data("field")) {
                    let messageId = $field.data("field").toUpperCase();
                    let message = Message.Label.Array[messagePrefix + messageId];
                    if (message) {
                        result = false;
                        formUtil.alertPopup(message);
                        return false; // 각 필수 입력 필드에 대한 경고 팝업 한 번만 표시
                    }
                }
            } else {
                for (let config of configs) {
                    if (field.id === config.id) {
                        result = false;
                        formUtil.alertPopup(config.message);
                        return false; // 각 필수 입력 필드에 대한 경고 팝업 한 번만 표시
                    }
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
                    let message = "";

                    if (isAutoConfig) {
                        if ($field.data("field")) {
                            let messageId = $field.data("field").toUpperCase();
                            message = Message.Label.Array[messagePrefix + messageId];
                        }
                    } else {
                        let config = configs.find(c => c.id === field.id);
                        if (config) message = config.message;
                    }

                    if (!isValid && message) {
                        result = false;
                        formUtil.alertPopup(message.replace('를', '를 형식에 맞게<br/>'));  //todo 하드코딩

                        //밑줄 처리
                        $field.parent().attr('data-focus-line', true);
                        $field.parent().children("label").attr('data-focus-label', true);
                        return false;
                    }
                }
            }
        }
    });
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
