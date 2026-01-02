/**
 * @title : ValidationUtils
 * @text : 유효성 검사 관련 함수 모음
 */

// @title : Value 값이 null,공백,undefined 인지 검사
// @value :  값
// @return : 값이 없으면 false, 값이 존재하면 true [Boolean]
// @writer : 이경태
FormUtility.prototype.checkEmptyValue = function (value) {
    let data = $.trim(value);
    let flag = true;

    if (data === "NaN" || data === "null" || data === null || data === "" || typeof data === "undefined" || data === "undefined" || data == [] || data.length === 0) flag = false;

    return flag;
};

// @title : Value 값이 null,공백,undefined 인지 검사
// @value :  값
// @return : 값이 없으면 false, 값이 존재하면 true [Boolean]
// @text : checkEmptyValue 와 분리, checkEmptyValue 를 object 형식으로 사용하는 코드가 존재 하기때문에 이 함수는 오직 object 값이 존재하는지만 검사
// @writer : 이경태
FormUtility.prototype.checkObjectEmptyValue = function (value) {
    let result = true;
    if (value === "undefined" || value === null || value === "null" || value === undefined || (typeof value === "object" && !Object.keys(value).length)) {
        result = false;
    }
    return result;
}

// @title : validation Check
// @e : [formId=\"\"{id:\"\",message:\"\"}]\n// @formId : validationCheck하려는 id가 속해있는 상위 div 혹은 form tag의 ID[String]
// @id : validationCheck하려는 id[String]
// @message : vaildationCheck시 나올 문구[String]
// @text : 선행작업 requiredParamClassSetting() ,alertPopup()
// @writer: 이경태
FormUtility.prototype.validationCheck = function (e) {
    let check = true;
    let targetId = e.formId;
    let failId = "";
    let failMessage = "";

    // 유효성 체크 실패 시 해당 input tag에 focus event
    let failFocus = function (failId) {
        $("#" + failId).focus();
    }

    for (let i = 0; i < e.length; i++) {
        let id = "#" + targetId + " #" + e[i].id;
        let value = $(id).val();
        let message = e[i].message;

        if (!this.checkEmptyValue(value)) {
            check = false;
            failId = e[i].id;
            failMessage = message;
            break;
        }
    }

    if (!check) {
        this.alertPopup(failMessage);
        failFocus(failId);
    }
    return check;
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

FormUtility.prototype.validatePassword = async function (url, password) {
    try {
        const response = await axios.post(url, password);

        if (response.data && response.data?.length > 0) {
            this.showMessage(response.data[0]);
            return false;
        }

        return true;
    } catch (error) {
        this.alertPopup(error.message || error);
        return false;
    }
}
