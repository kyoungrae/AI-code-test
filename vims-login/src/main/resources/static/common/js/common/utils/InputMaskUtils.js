/**
 * @title : InputMaskUtils
 * @text : CommonTag Input Masking and Filter Utilities
 */

class checkInputOnlyType {
    constructor() {
        this.init();
    }
    init() {
        const inputs = $(".gi-input[inputNumberOnly]");
        const regExp = /[^0-9-]/g;
        inputs.off("keyup.inputKeyUpHandlerEvent").on("keyup.inputKeyUpHandlerEvent", inputKeyUpHandlerEvent);
        inputs.off("blur.inputKeyBlurHandlerEvent").on("blur.inputKeyBlurHandlerEvent", inputKeyBlurHandlerEvent);
        inputs.off("input.inputKeyBlurHandlerEvent").on("input.inputKeyBlurHandlerEvent", inputKeyBlurHandlerEvent);
        function inputKeyUpHandlerEvent(e) {
            $(e.target).val($(e.target).val().replace(/[^0-9]/g, ''));
        }
        function inputKeyBlurHandlerEvent(e) {
            $(e.target).val($(e.target).val().replace(/[^0-9]/g, ''));
        }


    }
}

class checkPriceType {
    constructor() {
        this.init();
    }
    init() {
        const inputs = $(".gi-input[inputPriceWithComma]");
        inputs.off("input.inputHandler").on("input.inputHandler", inputKeyHandler);

        function inputKeyHandler(e) {
            const input = $(e.target);
            let rawValue = input.val().replace(/[^0-9]/g, ''); // 숫자 외 제거

            // 0으로 시작하는 값 처리
            if (rawValue.startsWith("0")) {
                rawValue = rawValue.replace(/^0+/, ''); // 선행 0 제거
            }

            // 세 자리마다 콤마 추가
            const formattedValue = formatNumber(rawValue);
            input.val(formattedValue);
        }

        function formatNumber(value) {
            if (!value) return ''; // 빈 값 처리
            return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
    }
}

/**
 * @title : maxLengthCheck Class
 * @value : [gi-maxlength = "length"]
 * @text : gi-maxlength 로 설정한 값이 있으면 그 길이만큼만 입력을 받는다. 한글은 3으로 계산 (오라클DB와 동일)
 * @writer : 이진주
 */
class GiMaxLengthCheck {
    constructor() {
        $("input[gi-maxlength], textarea[gi-maxlength]").each((_, element) => {
            const max = parseInt($(element).attr("gi-maxlength"));
            $(element).off(".giMaxLength").on("keyup.giMaxLength input.giMaxLength", () => {
                const val = $(element).val();
                if (this.getByteLength(val) > max) $(element).val(this.truncateByByte(val, max));
            });
        });
    }

    getByteLength(str) {
        return [...str].reduce((len, c) => len + (c.charCodeAt(0) <= 0x7f ? 1 : c.charCodeAt(0) <= 0x7ff ? 2 : 3), 0);
    }

    truncateByByte(str, max) {
        let len = 0;
        return [...str].reduce((res, c) => {
            len += c.charCodeAt(0) <= 0x7f ? 1 : c.charCodeAt(0) <= 0x7ff ? 2 : 3;
            return len > max ? res : res + c;
        }, "");
    }
}

/**
 * @title : maxLengthCheck Class
 * @value : [gi-maxlength = "length"]
 * @text : gi-maxlength 로 설정한 값이 있으면 그 길이만큼만 입력을 받는다. 한글은 3으로 계산 (오라클DB와 동일)
 * @writer : 이진주
 */
class GiMaxLengthNumberCheck {
    constructor() {
        $("input[gi-maxlength-number]").each((_, input) => {
            const max = parseInt($(input).attr("gi-maxlength-number"));
            $(input).off(".giMaxLengthNumber").on("input.giMaxLengthNumber", () => {
                const val = $(input).val();
                $(input).val(this.enforceMaxLength(val, max));
            });
        });
    }

    enforceMaxLength(value, max) {
        const filtered = value.replace(/[^0-9,-]/g, "");
        let numberCount = 0;
        return [...filtered].reduce((result, char) => {
            if (/\d/.test(char)) numberCount++;
            return numberCount > max ? result : result + char;
        }, "");
    }
}

/**
 * @title : formatting
 * @value : ["onlyNumericWithoutLeadingZero"]
 * @text : 숫자만 입력 가능하게끔 하나 첫 입력에 0 입력 시 배제처리
 * @writer : 문상혁
 */
class OnlyNumericWithoutLeadingZero {
    constructor() {
        this.init();
    }
    init() {
        // inputNumericNoLeadingZero 속성이 있는 모든 input 선택
        const numericInputs = $(".gi-input[onlyNumericWithoutLeadingZero]");

        numericInputs.on("input.numericInputHandler", (e) => {
            const input = $(e.target);
            let value = input.val();

            // 1. 선행 0 제거
            if (value.startsWith("0") && value.length > 1) {
                value = value.replace(/^0+/, '');
            }

            // 2. 숫자만 허용
            value = value.replace(/[^0-9]/g, '');

            // 3. 업데이트된 값 반영
            input.val(value);
        });
    }
}

/**
 * @title : formatting
 * @value : ["onlyValidDecimal"]
 * @text : n.n % 형식의 정수와 소수점 형식만 입력 가능, 잘못된 값은 필터링 또는 치환
 * @writer : 문상혁
 */
class ValidDecimalInput {
    constructor() {
        this.init();
    }

    init() {
        // onlyValidDecimal 속성을 가진 모든 input 선택
        const decimalInputs = $(".gi-input[onlyValidDecimal]");

        decimalInputs.on("input.validDecimalHandler", (e) => {
            const input = $(e.target);
            let value = input.val();

            // 숫자와 "."만 허용
            value = value.replace(/[^0-9.]/g, '');

            // 규칙에 따라 값 검증 및 보정
            value = this.validateValue(value);

            input.val(value);
        });
    }

    validateValue(value) {
        // 빈 값 처리
        if (!value) return '';

        // 1. 첫 번째 값은 숫자만 입력 가능, "." 금지
        if (value.startsWith('.')) {
            return ''; // 맨 앞에 "."이 들어오면 제거
        }

        // 2. "0." 형식 처리
        if (value.startsWith('0') && value.length > 1 && !value.startsWith('0.')) {
            return '0.'; // 0 다음에는 "."만 가능
        }

        // 3. 소수점 앞자리 숫자 검증
        const parts = value.split('.');
        let integerPart = parts[0]; // 소수점 앞자리
        const decimalPart = parts[1] || ''; // 소수점 뒷자리

        // 3-1. 소수점 앞자리 값이 100 초과 시 치환
        if (parseInt(integerPart, 10) > 100) {
            if (parts.length === 1) {
                // 소수점이 없을 때: 입력값을 소수점 형태로 변환
                return this.adjustToDecimal(integerPart);
            }
            // 소수점이 이미 있는 경우에는 100.0으로 강제 변환
            return '100.0';
        }

        // 4. 소수점이 두 개 이상인 경우
        if (parts.length > 2) {
            // 첫 번째 소수점만 유지
            return parts[0] + '.' + parts[1];
        }

        // 5. 소수점 뒷자리 숫자 검증
        if (decimalPart.length > 1) {
            return integerPart + '.' + decimalPart.substring(0, 1);
        }

        // 6. 소수점 앞자리가 100인 경우 뒷자리는 0만 입력 가능
        if (value.length === 5) {
            return "100.0";
        }

        return value;
    }

    adjustToDecimal(value) {
        // 세 자리 숫자를 소수점 형식으로 변환
        if (value.length <= 1) return value; // 한 자리 숫자는 그대로 반환

        let integerPart = "";
        let decimalPart = "";

        if (value.length >= 4) {
            integerPart = value.substring(0, value.length - 1);
            decimalPart = "0";
        } else {
            integerPart = value.substring(0, value.length - 1);
            decimalPart = value.substring(value.length - 1);
        }

        return integerPart + '.' + decimalPart;
    }
}
