/**
 * @title : 날짜 문자열 하이픈 삽입
 * @id : target id [String]
 * @v : 값 [String]
 * @f : 기호(-) [String]
 * @return : 1999+f+01+f+01
 * @writer : 이경태
 */
FormUtility.prototype.setHyphenStringDate = function (id, v, f) {
    if (v.length !== 8) {
        $("#" + id).val("");
        return;
    }
    let y = v.substring(0, 4);
    let m = v.substring(4, 6);
    let d = v.substring(6, 8);

    $("#" + id).val(y + f + m + f + d);
}

/**
 * @title : 날짜 텍스트 하이픈 변환
 * @ids : target ids [String[]]
 * @separator : 구분자 [string] (optional, default : '-')
 * @writer : 이진주
 */
FormUtility.prototype.setHyphenToDates = function (ids, separator) {
    if (!separator) {
        separator = "-";
    }
    for (let i = 0; i < ids.length; i++) {
        let value = $("#" + ids[i]).text();
        if (value && value.length === 8) {
            let y = value.substring(0, 4);
            let m = value.substring(4, 6);
            let d = value.substring(6, 8);
            $("#" + ids[i]).text(y + separator + m + separator + d);
        }
    }
}

/**
 * @title : 주민번호 텍스트 하이픈 변환
 * @ids : target ids [String[]]
 * @writer : 이진주
 */
FormUtility.prototype.setHyphenToReginos = function (ids) {
    for (let i = 0; i < ids.length; i++) {
        let value = $("#" + ids[i]).text();
        if (value && value.length === 13) {
            let front = value.substring(0, 6);
            let end = value.substring(6, 13);
            $("#" + ids[i]).text(front + "-" + end);
        }
    }
}

/**
 * @title : 전화번호 텍스트 하이픈 변환
 * @ids : target ids [String[]]
 * @writer : 이진주
 */
FormUtility.prototype.setHyphenToTels = function (ids) {
    for (let i = 0; i < ids.length; i++) {
        let value = $("#" + ids[i]).text();
        if (value) {
            $("#" + ids[i]).text(formUtil.formatPhoneNumber(value));
        }
    }
}

/**
 * @title : 금액 콤마 변환
 * @ids : target ids [String[]]
 * @writer : 이진주
 */
FormUtility.prototype.setCommaToMoney = function (ids) {
    for (let i = 0; i < ids.length; i++) {
        let value = $("#" + ids[i]).text();
        if (value) {
            $("#" + ids[i]).text(formUtil.addComma(value));
        }
    }
}

/**
 * @title : 문자열 전체 치환
 * @v : 값 [String]
 * @f : 찾을 문자열(format) [String]
 * @cf : 변경할 문자열(change format) [String]
 * @writer : 이경태
 */
FormUtility.prototype.replaceAll = function (v, f, cf) {
    let result = "";

    if (formUtil.checkEmptyValue(v)) {
        result = v.replaceAll(new RegExp(f, "gi"), cf);
    }

    return result;
}

/**
 * @title : 주소 검색(다음API)
 * @id : 주소 검색 후 선택한 주소를 입력할 인풋의 아이디 [String]
 * @writer : 이진주
 */
FormUtility.prototype.searchAddress = function (id) {
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
FormUtility.prototype.calcDate = function (valueOfDate, type, dayNumber) {
    let pattern = /^\d{4}-\d{2}-\d{2}$/;
    let flag = pattern.test(valueOfDate);

    if (!flag) {
        formUtil.alertPopup("calcDate 함수의 날짜 형식이 맞지 않습니다 [ex:yyyy-MM-dd]");
    }

    dayNumber = parseInt(dayNumber);
    let date = new Date(valueOfDate);
    let yyyy = date.getFullYear();
    let MM = date.getMonth();
    let dd = date.getDate();
    let result = "";

    if ("+" === type) {
        dd = dd + dayNumber;
    } else if ("-" === type) {
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
FormUtility.prototype.formatPhoneNumber = function (phoneNumber) {
    let cleaned = ('' + phoneNumber).replace(/\D/g, '');

    let match = cleaned.match(/^(\d{2,3})(\d{3,4})(\d{4})$/);
    if (cleaned.length === 8) {
        match = cleaned.match(/^(\d{4})(\d{4})$/);
        if (match) {
            return match[1] + '-' + match[2];
        }
    } else {
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
FormUtility.prototype.addComma = function (v) {
    return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * @title : 응답 데이터 하이픈 처리
 * @value : Hypen 적용시킬 대상 값
 * @id    : Hypen 적용 유형(주민등록번호/사업자등록번호(REGINO), 제원관리번호(FORM_OKNO), 전화번호(TEL_NO), 날짜(YMD))
 * @writer : 문상혁
 */
FormUtility.prototype.setAutoHypen = function (value, id) {
    let addHypen = "";

    if (id.includes("REGINO")) {
        if (value.length === 13) { // 주민번호 형식 하이픈 적용
            addHypen = value.replace(/(.{6})(.*)/, "$1-$2");
        } else {                   // 사업자등록번호 형식 하이픈 적용
            addHypen = value.replace(/(.{3})(.{2})(.{5})/, "$1-$2-$3");
        }
    } else if (id.includes("FORM_OKNO")) { //  제원관리번호 데이터 형식 하이픈 적용
        addHypen = value.replace(/^(.{3})(.{1})(.{5})(.{4})(.{4})$/, '$1-$2-$3-$4-$5');
    } else if (id.includes("TEL_NO")) {    //  전화번호 데이터 형식 하이픈 적용
        addHypen = value.replace(/(\d{2,3})(\d{3,4})(\d{4})/, "$1-$2-$3");
    } else if (id.includes("YMD")) {   //  날짜 데이터 형식 하이픈 적용
        addHypen = value.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
    } else {
        addHypen = value;
    }

    return addHypen;
}
/**
 * @title : 특수문자 삽입
 * @v : value 적용대상의 값[String]
 * @f : setStringFormat 적용대상의 형식 ex) "3,2,1" [String]
 * @s : 삽입할 특수 기호 ex) [String]
 * @text : 설정한 자리수에 특수 문자 넣어주는 기능
 * @writer : 이경태
 */
FormUtility.prototype.setSpecialCharacters = function (v, f, s) {
    let cleaned = "";
    let stringFormatArray = [];
    let format = "";
    let resultFormat = "";
    let match = "";
    let returnValue = "";

    if (formUtil.checkEmptyValue(v) && formUtil.checkEmptyValue(f) && formUtil.checkEmptyValue(s)) {
        cleaned = v.replace(/\s/g, "");
        stringFormatArray = f.split(",");
        stringFormatArray.map(function (e, i) {
            format += "(.{" + e + "})";
        });

        resultFormat = new RegExp("^" + format + "$");
        match = cleaned.match(resultFormat);

        if (match) {
            match.map(function (e, i) {
                if (0 === i) {
                } else if (i === match.length - 1) {
                    returnValue += e;
                } else {
                    returnValue += e + s;
                }
            })
            return returnValue;
        } else {
            formUtil.alertPopup("match is " + match + ", length of value is not match");
        }
    } else {
        formUtil.alertPopup("The value does not Exist");
    }
}
/**
 * @title : 특수문자 변환
 * @v : value 값[String]
 * @f : setStringFormat 적용대상의 형식 ex) 다중 직접정의 :"3,2,1" 단일자리수 "3" [String]
 * @s : 삽입할 특수 기호 ex) [String]
 * @text : 설정한 자리수에 특수 문자 넣어주거나 이미 해당 특수문자가 있으면 제거해서 반환
 *         특수문자를 제거해서 반환하고 싶으면 formUtil.transSpecialChar("1,000","",","); f 값은 빈값으로 넘겨주고 제거할 특수문자를 삽입해준다.
 * @writer : 이경태
 */
FormUtility.prototype.transSpecialChar = function (v, f, s) {
    let cleaned = "";
    let format = "";
    let returnValue = "";
    let resultFormat = "";
    let match = "";
    let stringFormatArray = [];
    let e = "";

    try {
        if (v.length <= parseInt(f)) {
            e = "Value cannot be smaller \n than the number you want to divide";
            throw e;
        }
        if (!formUtil.checkEmptyValue(v)) {
            e = "Value is undefined";
            throw e;
        }
        if (!formUtil.checkEmptyValue(s)) {
            e = "SpecialCharacter is undefined";
            throw e;
        }

        cleaned = v.replace(/\s/g, "");

        if (cleaned.includes(s)) {
            returnValue = cleaned.replaceAll(s, "");
        } else {
            if (f.includes(",")) {
                stringFormatArray = f.split(",");
                stringFormatArray.map(function (e, i) {
                    format += "(.{" + e + "})";
                });

                resultFormat = new RegExp("^" + format + "$");
                match = cleaned.match(resultFormat);

                if (!formUtil.checkEmptyValue(match)) {
                    throw "Did Not Macthed Value of length";
                }

                if (match) {
                    match.map(function (e, i) {
                        if (0 === i) {
                        } else if (i === match.length - 1) {
                            returnValue += e;
                        } else {
                            returnValue += e + s;
                        }
                    })
                } else {
                    throw e;
                }
            } else {
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
    } catch (e) {
        formUtil.alertPopup("transSpecialCharacter: " + e);
    }
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

/**
 * @title : 날짜 포맷팅
 * @date : 날짜 값 [Date|String]
 * @type : 포맷 타입 - hyphen(yyyy-MM-dd), normal(yyyyMMdd) [String]
 * @return : 포맷팅된 날짜 문자열 [String]
 */
FormUtility.prototype.dateFormatting = function (date, type) {
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

    if (!formUtil.checkEmptyValue(type)) {
        type = "yyyy-mm-dd";
    }

    if (type === "yyyy-mm-dd") {
        return `${year}-${month}-${day}`;
    } else {
        return `${year}${month}${day}`;
    }
}

/**
 * @title : 파일 크기 계산 Bytes 단위를 KB, MB 등으로 변환
 * @bytes : 바이트 단위의 크기 [Number]
 * @decimals : 소수점 자리수 [Number]
 * @writer : 이경태
 */
FormUtility.prototype.formatBytes = function (bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
