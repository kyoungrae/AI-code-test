/**
 * @title : 날짜 선택기
 * @see : input gi-datepicker
 * @writer : 이경태
 */
class GiDatePicker {
    constructor() {
        this.initDatePicker();
    }
    initDatePicker() {

        const inputs = $("input[gi-datepicker]");
        const that = this;
        inputs.map((i, input) => {

            that.validationCheck(input);

            $(input).off("click").on("click", function (event) {
                that.showDatePicker(event);
            });
        })
    }
    showDatePicker(event) {
        const input = event.target;
        let $calendar = $('<div id="giDatePicker" class="gi-row-15 gi-col-26 tilt-in-top-1"></div>').css({
            position: 'absolute',
            background: '#fff',
            padding: '10px',
            display: 'block',
            zIndex: '1000',
            borderRadius: '15px',
            boxShadow: 'rgb(119 119 119 / 52%) 0px 0px 20px'
        });
        const rect = input.getBoundingClientRect();
        $calendar.css({
            top: `${rect.bottom + window.scrollY}px`,
            left: `${rect.left + window.scrollX}px`
        });
        $("#giDatepickerBody").html($calendar);

        let inputId = $(input).attr('id');
        let inputValue = $(input).val();

        let year;
        let month;
        let date;
        if (formUtil.checkEmptyValue($("#" + inputId).data("startYearMonth"))) {
            if (formUtil.checkEmptyValue(inputValue)) {
                let inputValueArray = inputValue.split("-");
                year = inputValueArray[0];
                month = inputValueArray[1];
                date = new Date(year, month - 1);
            } else {
                year = parseInt($("#" + inputId).data("startYearMonth").toString().substring(0, 4));
                month = parseInt($("#" + inputId).data("startYearMonth").toString().substring(4, 6));
                date = new Date(year, month - 1);
            }
            formUtil.giDatePicker(inputId, date);
        } else {
            if (formUtil.checkEmptyValue(inputValue)) {
                let inputValueArray = inputValue.split("-");
                year = inputValueArray[0];
                month = inputValueArray[1];
                date = new Date(year, month - 1);
                formUtil.giDatePicker(inputId, date);
            } else {
                formUtil.giDatePicker(inputId, "");
            }
        }
    }
    hideDatePicker() {
        const calendar = $("#giDatePicker");
        if (calendar) {
            calendar.remove();
        }
    }
    validationCheck(input) {
        let that = this;
        function giDatePickerBlurHandlerEvent(e) {
            commonTag.inputTagReset($(".gi-input"));
            const regExp = /[0-9-]/g;
            const ele = e.target;
            if (regExp.test(ele.value)) {
                ele.value = ele.value.replace(/[^0-9-]/g, '');
                if (!that.dateCheck(ele.value)) ele.value = "";
            } else {
                if (formUtil.checkEmptyValue(ele.value)) {
                    if (!that.dateCheck(ele.value)) ele.value = "";
                }
            }
        }
        function giDatePickerKeyupHandlerEvent(e) {
            const regExp = /[^0-9-]/g;
            const ele = e.target;
            if (regExp.test(ele.value)) {
                ele.value = ele.value.replace(regExp, '');
            } else {
                if (4 === ele.value.length) {
                    if (e.key === "Backspace") {
                        ele.value = ele.value.substring(0, 4);
                    } else {
                        ele.value = ele.value + "-";
                    }
                } else if (7 === ele.value.length) {
                    if (e.key === "Backspace") {
                        ele.value = ele.value.substring(0, 7);
                    } else {
                        ele.value = ele.value + "-";
                    }
                } else if (9 < ele.value.length) {
                    ele.value = ele.value.substring(0, 10).substring(0, 4) + "-" + ele.value.substring(5, 7) + "-" + ele.value.substring(8, 10);
                    if (!that.dateCheck(ele.value)) ele.value = "";
                } else if (ele.value.match(/[0-9]/g)
                    && ele.value.match(/[0-9]/g).length === 8
                    && ele.value.match(/-/g).length < 2) {
                    // 너무 빨리쳐서 2001010-1 이런식으로 된 경우
                    const numbered = ele.value.replace(/[^0-9]/g, "");
                    ele.value = `${numbered.slice(0, 4)}-${numbered.slice(4, 6)}-${numbered.slice(6, 8)}`;

                }
            }
        }
        $(input).off("blur.giDatePickerBlurHandlerEvent").on("blur.giDatePickerBlurHandlerEvent", giDatePickerBlurHandlerEvent)
        $(input).off("keyup.giDatePickerKeyupHandlerEvent").on("keyup.giDatePickerKeyupHandlerEvent", giDatePickerKeyupHandlerEvent);
    }
    dateCheck(value) {
        const birthDayPattern = /(19|20)\d\d-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/g;
        if (birthDayPattern.test(value)) {
            // 날짜 유효성 검증
            const [YEAR, MONTH, DAY] = value.split('-');
            const year = parseInt(YEAR);
            const month = parseInt(MONTH);
            const day = parseInt(DAY);
            // Date 객체를 사용하여 날짜 유효성 검증
            const date = new Date(year, month - 1, day);
            // 각 월별 최대 일수 정의
            // const daysInMonth = [31, this.dateCheck(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
                formUtil.showMessage(year + "년 " + month + " 월 " + day + " 일" + "은 유효하지 않은 날짜 입니다");
                return false;
            }
            return true;
        } else {
            formUtil.showMessage(Message.Label.Array["CHECK.FORMTYPE"]);
            return false;
        }

    }
    setDate(v) {
        let yyyy = v.yyyy;
        let MM = v.MM;
        //attr -> data
        $("#" + v.id).data("startYearMonth", yyyy + MM);
    }
    resetDate(v) {
        $("#" + v).removeData("startYearMonth");
    }
}

/**
 * @title : 기본값 오늘 날짜 설정
 * @value : [gi-default-today]
 * @text : 태그가 붙은 input의 value값이 오늘로 입력 된다.
 * @return : ex) 2024-08-23
 * @writer : 진은영
 */
CommonTag.prototype.defaultToday = function () {
    const date = new Date();
    const year = date.getFullYear();
    const month = ("0" + (1 + date.getMonth())).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const today = `${year}-${month}-${day}`;

    let todayInputs = $('input[gi-default-today]');

    if (formUtil.checkEmptyValue(todayInputs)) {
        todayInputs.each(function () {
            $(this).val(today);
        });
    }
}
