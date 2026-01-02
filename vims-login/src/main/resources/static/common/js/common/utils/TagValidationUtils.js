/**
 * @title : TagValidationUtils
 * @text : CommonTag Validation Utility Classes
 */

/**
 * @title : GiResidentNumber
 * @see : input gi-residentnumber
 * @text : this class is validation check for resident register number
 * @writer : 이경태
 */
class GiResidentNumber {
    constructor() {
        this.validationCheck();
    }
    validationCheck() {
        const inputs = $("input[gi-residentnumber]")
        const that = this;
        inputs.map((i, item) => {
            function giResidentNumberBlurHandlerEvent(e) {
                if (formUtil.checkEmptyValue($(this).val())) {
                    const regExp = /[^0-9-]/g;
                    const ele = e.target;
                    if (regExp.test(ele.value)) {
                        ele.value = ele.value.replace(regExp, '');
                    } else {
                        if (!that.residentRegistrationNumberCheck(ele.value)) ele.value = "";
                    }
                }
            }
            function giResidentNumberKeyupHandlerEvent(e) {
                const regExp = /[^0-9-]/g;
                const ele = e.target;
                if (regExp.test(ele.value)) {
                    ele.value = ele.value.replace(regExp, '');
                } else {
                    if (6 === ele.value.length) {
                        if (e.key === "Backspace") {
                            ele.value = ele.value.substring(0, 6);
                        } else {
                            ele.value = ele.value + "-";
                        }
                    } else if (13 < ele.value.length) {
                        ele.value = ele.value.substring(0, 14).substring(0, 6) + "-" + ele.value.substring(7, 14);
                        if (!that.residentRegistrationNumberCheck(ele.value)) {
                            ele.value = "";
                        }
                    }
                }
            }

            $(item).off("blur.giResidentNumberBlurHandlerEvent").on("blur.giResidentNumberBlurHandlerEvent", giResidentNumberBlurHandlerEvent);
            $(item).off("keyup.giResidentNumberKeyupHandlerEvent").on("keyup.giResidentNumberKeyupHandlerEvent", giResidentNumberKeyupHandlerEvent).on("blur.giResidentNumberBlurHandlerEvent", giResidentNumberBlurHandlerEvent);
        })
    }
    residentRegistrationNumberCheck(value) {
        // 정규 표현식으로 기본 형식 검증
        const juminRule = /^[0-9]{6}-[1-4][0-9]{6}$/;
        if (!juminRule.test(value)) {
            formUtil.showMessage(Message.Label.Array["CHECK.FORMTYPE"]);
            return false;
        }
        // 날짜 유효성 검증
        const [yearMonthDay, genderInfo] = value.split('-');
        const year = parseInt(yearMonthDay.slice(0, 2), 10);
        const month = parseInt(yearMonthDay.slice(2, 4), 10);
        const day = parseInt(yearMonthDay.slice(4, 6), 10);

        if (parseInt(genderInfo[0], 10) > 4) {
            formUtil.showMessage("성별 분류 번호 는 4보다 클 수 없습니다");
            return false;
        }
        // 현재 연도를 기준으로 1900년대 또는 2000년대 판단
        const fullYear = (parseInt(genderInfo[0], 10) < 3 ? 2000 : 1900) + year;

        // Date 객체를 사용하여 날짜 유효성 검증
        const date = new Date(fullYear, month - 1, day);
        if (date.getFullYear() !== fullYear || date.getMonth() !== month - 1 || date.getDate() !== day) {
            formUtil.showMessage(year + "년 " + month + " 월 " + day + " 일" + "은 유효하지 않은 날짜 입니다");
            return false;
        }

        return true;
    }
}
/**
 * @title : GiCorporateNumber
 * @see : input gi-corporatenumber
 * @text : this class is validation check for corporate register number
 * @writer : 이경태
 */
class GiCorporateNumber {
    constructor() {
        this.validationCheck();
    }
    validationCheck() {
        const inputs = $("input[gi-corporatenumber]");
        const that = this;

        function giCorporateNumberBlurHandlerEvent(e) {
            if (formUtil.checkEmptyValue($(this).val())) {
                const regExp = /[^0-9-]/g;
                const ele = e.target;
                if (regExp.test(ele.value)) {
                    ele.value = ele.value.replace(regExp, '');
                } else {
                    if (!that.corporateNumberCheck(ele.value)) ele.value = "";
                }
            }
        }
        function giCorporateNumberKeyupHandlerEvent(e) {
            const regExp = /[^0-9-]/g;
            const ele = e.target;
            if (regExp.test(ele.value)) {
                ele.value = ele.value.replace(regExp, '');
            } else {
                if (6 === ele.value.length) {
                    if (e.key === "Backspace") {
                        ele.value = ele.value.substring(0, 6);
                    } else {
                        ele.value = ele.value + "-";
                    }
                } else if (13 < ele.value.length) {
                    ele.value = ele.value.substring(0, 14).substring(0, 6) + "-" + ele.value.substring(7, 14);
                    if (!that.corporateNumberCheck(ele.value)) {
                        ele.value = "";
                    }
                }
            }
        }
        inputs.map((i, item) => {
            $(item).off("blur.giCorporateNumberBlurHandlerEvent").on("blur.giCorporateNumberBlurHandlerEvent", giCorporateNumberBlurHandlerEvent);
            $(item).off("keyup.giCorporateNumberKeyupHandlerEvent").on("keyup.giCorporateNumberKeyupHandlerEvent", giCorporateNumberKeyupHandlerEvent).on("blur.giCorporateNumberBlurHandlerEvent", giCorporateNumberBlurHandlerEvent);
        })
    }
    corporateNumberCheck(number) {
        number = number.split('-').join('');

        let as_Biz_no = String(number);
        let I_TEMP_SUM = 0;
        let I_CHK_DIGIT = 0;

        if (number.length !== 13) {
            formUtil.showMessage("형식에 맞게 입력해주세요");
            return false;
        }

        for (var index01 = 1; index01 < 13; index01++) {
            let i = index01 % 2;
            let j = 0;

            if (i === 1) {
                j = 1
            } else if (i === 0) {
                j = 2;
            }
            I_TEMP_SUM = I_TEMP_SUM + parseInt(as_Biz_no.substring(index01 - 1, index01), 10) * j;
        }

        I_CHK_DIGIT = I_TEMP_SUM % 10;
        if (I_CHK_DIGIT !== 0) I_CHK_DIGIT = 10 - I_CHK_DIGIT;
        if (as_Biz_no.substring(12, 13) !== String(I_CHK_DIGIT)) {
            formUtil.showMessage("유효하지 않은 법인등록번호 입니다")
            return false;
        }
        return true;


    }
}

/**
 * @title : formatCheck Class
 * @value : [gi-format-check = "validationId"]
 * @validationId : (작성 후 선택해서 사용하시면 됩니다.)
 *                  human_name
 *                  vehicle_identification_number
 *                  vehicle_identification_number_section
 * @text : 형식을 체크 하여 유효한 형식 인지 flag로 return받아 이미지로 표시해준다.
 * @writer : 진은영
 */
class GiFormatCheck {
    // 현재 validate 작성되어 있는 type 배열
    static formatTypes = ['vehicle_identification_number', 'vehicle_identification_number_section', 'number', 'phone_number', 'email', 'resident_registration_number', 'corporation_registration_number', 'company_registration_number'];

    constructor() {
        this.initializeFormatCheck();
    }

    // defalut로 태그가 달린 input의 keyup이벤트를 발생 시킨다.
    initializeFormatCheck() {
        const formatTypes = GiFormatCheck.getFormatTypes();  // 정적 메소드 호출
        const inputs = $("input[gi-format-check]");

        inputs.each((i, input) => {
            const formatType = $(input).attr("gi-format-check");
            let that = this;

            function giFormatCheckKeyupHandlerEvent() {
                that.validateInputFormat(input);  // keyup 이벤트로 유효성 검사
            }
            function giFormatCheckBlurHandlerEvent() {
                that.validateInputFormat(input, true);  // blur 이벤트로 유효성 검사
            }
            if (formatTypes.includes(formatType)) {

                $(input).off("keyup.giFormatCheckKeyupHandlerEvent").on("keyup.giFormatCheckKeyupHandlerEvent", giFormatCheckKeyupHandlerEvent);
                $(input).off("input.giFormatCheckKeyupHandlerEvent").on("input.giFormatCheckKeyupHandlerEvent", giFormatCheckKeyupHandlerEvent);
                if (formatType === 'number') {
                    $(input).off("blur.giFormatCheckBlurHandlerEvent").on("blur.giFormatCheckBlurHandlerEvent", giFormatCheckBlurHandlerEvent);
                }
            }
        });
    }

    static getFormatTypes() {
        return this.formatTypes;
    }

    // validate 후 flag를 반환하고, icon을 update 한다.
    validateInputFormat(input, isBlurEvent = false) {
        let formatType = $(input).attr("gi-format-check");
        let inputVal = $(input).val();
        let flag = false;
        switch (formatType) {
            case 'vehicle_identification_number':  // 차대번호 : 17자의 대문자 및 숫자
                inputVal = inputVal.replace(/[^0-9a-zA-Z]/g, '');  // 한글 제거
                inputVal = inputVal.toUpperCase();
                if (inputVal.length > 17) {
                    inputVal = inputVal.substring(0, 17);
                }
                flag = inputVal.length === 17;
                break;

            case 'vehicle_identification_number_section': // 차대번호군 : 8자의 대문자 및 숫자
                inputVal = inputVal.replace(/[^0-9a-zA-Z]/g, '');  // 한글 제거
                inputVal = inputVal.toUpperCase();
                if (inputVal.length > 8) {
                    inputVal = inputVal.substring(0, 8);
                }
                flag = inputVal.length === 8;
                break;

            case 'human_name':  // 이름 : 최소 2글자 이상의 한글
                inputVal = inputVal.replace(/[^가-힣ㄱ-ㅎ]/g, '');  // 한글과 자음만 허용
                let pattern = /^[가-힣]{2,25}$/;
                flag = pattern.test(inputVal);
                break;

            case 'number':
                // formatType = number 일때 숫자만 입력 받게 설정
                const regExp = /[^0-9-]/g;
                if (isBlurEvent) {
                    if (regExp.test(inputVal)) {
                        inputVal = inputVal.replace(regExp, '');
                        flag = formUtil.checkEmptyValue(inputVal);
                    } else {
                        flag = formUtil.checkEmptyValue(inputVal);
                    }
                } else {
                    if (regExp.test(inputVal)) {
                        inputVal = inputVal.replace(regExp, '');
                        flag = formUtil.checkEmptyValue(inputVal);
                    } else {
                        flag = formUtil.checkEmptyValue(inputVal);
                    }
                }
                break;

            case 'phone_number':    // 전화번호 : 0dd-ddd또는dddd-dddd
                inputVal = inputVal.replace(/[^0-9]/g, '');

                if (inputVal.startsWith('02')) {  // 서울 번호 처리 (02-3자리-4자리)
                    if (inputVal.length === 11) {
                        inputVal = inputVal.replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3');
                    } else if (inputVal.length > 5) {
                        inputVal = inputVal.replace(/(\d{2})(\d{3})(\d{0,4})/, '$1-$2-$3');
                    } else if (inputVal.length > 2) {
                        inputVal = inputVal.replace(/(\d{2})(\d{0,3})/, '$1-$2');
                    }
                    if (inputVal.length > 11) {
                        inputVal = inputVal.substring(0, 11);
                    }
                    flag = inputVal.length >= 11;
                } else {  // 일반 번호 처리
                    if (inputVal.length === 10) {
                        inputVal = inputVal.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
                    } else if (inputVal.length > 6) {
                        inputVal = inputVal.replace(/(\d{3})(\d{3,4})(\d{0,4})/, '$1-$2-$3');
                    } else if (inputVal.length > 3) {
                        inputVal = inputVal.replace(/(\d{3})(\d{0,4})/, '$1-$2');
                    }
                    if (inputVal.length > 13) {
                        inputVal = inputVal.substring(0, 13);  // 최대 11자리
                    }
                    flag = (inputVal.startsWith('0') && inputVal.length >= 12);
                }
                break;

            case 'email':   //이메일
                inputVal = inputVal.replace(/[^a-zA-Z0-9@.]/g, '');
                let emailregExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i
                if (emailregExp.test(inputVal)) {
                    flag = true;
                } else {
                    flag = false;
                }
                break;

            case 'resident_registration_number':    //주민등록번호 : 날짜검증, 성별(1-4)검증 //todo 추가필요
                inputVal = inputVal.replace(/[^0-9]/g, '');

                if (inputVal.length > 13) {
                    inputVal = inputVal.substring(0, 13);
                }

                if (inputVal.length > 6 && !inputVal.includes('-')) {
                    inputVal = inputVal.replace(/(\d{6})/, '$1-');
                }

                // 생년월일 검증
                if (inputVal.length >= 6) {
                    const birthDateStr = inputVal.substring(0, 6);  // YYMMDD 추출
                    const year = parseInt(birthDateStr.substring(0, 2), 10);
                    const month = parseInt(birthDateStr.substring(2, 4), 10);
                    const day = parseInt(birthDateStr.substring(4, 6), 10);

                    if (month < 1 || month > 12 || day < 1 || day > 31) {
                        break;
                    }

                    const fullYear = year + (parseInt(inputVal.charAt(7), 10) <= 2 ? 1900 : 2000);
                    const birthDate = new Date(fullYear, month - 1, day);
                    if (birthDate.getMonth() !== (month - 1) || birthDate.getDate() !== day) {
                        break;
                    }
                }

                if (inputVal.length > 7) {
                    const firstBackDigit = inputVal.charAt(7);  // 뒷자리 첫 숫자
                    if (!['1', '2', '3', '4'].includes(firstBackDigit)) {
                        break;
                    }
                }

                flag = inputVal.length === 14;
                break;
            case 'corporation_registration_number':
                inputVal = inputVal.replace(/[^0-9]/g, '');

                if (inputVal.length === 13) {
                    inputVal = inputVal.replace(/(\d{6})(\d{7})/, '$1-$2');
                } else if (inputVal.length > 6) {
                    inputVal = inputVal.replace(/(\d{6})(\d{0,7})/, '$1-$2');
                }
                if (inputVal.length > 14) {
                    inputVal = inputVal.substring(0, 14);  // 최대 11자리
                }

                flag = inputVal.length === 14;
                break;
            case 'company_registration_number':
                inputVal = inputVal.replace(/[^0-9]/g, '');
                if (inputVal.length === 10) {
                    inputVal = inputVal.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3');
                } else if (inputVal.length > 3) {
                    inputVal = inputVal.replace(/(\d{3})(\d{0,2})/, '$1-$2');
                    if (inputVal.length > 6) {
                        inputVal = inputVal.replace(/(\d{3}-\d{2})(\d{0,5})/, '$1-$2');
                    }
                }

                if (inputVal.length > 12) {
                    inputVal = inputVal.substring(0, 12);
                }

                flag = inputVal.length === 12;
                break;

            // ...
            // 다른 조건 추가 하시면 됩니다.
            // ...
        }

        $(input).val(inputVal);
        this.toggleIcon(input, inputVal, flag);
        return flag;
    }

    // check 이미지 토글 함수
    toggleIcon(element, inputVal, flag) {
        if (flag) {
            $(element).removeClass('check_off').addClass('check_on');
        } else if (inputVal.length > 0) {
            $(element).removeClass('check_on').addClass('check_off');
        } else {
            $(element).removeClass('check_on check_off');
        }
    }

    // check 이미지 토클 함수 리셋
    resetToggleIcon() {
        $("input[gi-format-check]").removeClass('check_on check_off');
    }
}
