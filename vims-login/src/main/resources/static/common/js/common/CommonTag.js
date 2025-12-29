function CommonTag(){
}
/**
 * @title : .gi-input tag focus event
 * @value : true, false
 * @return : input line status event and label status event
 * @see : .gi-input-container[data-focus-line="false"]::after, .gi-input-container[data-focus-line="true"]::after
 * @writer : 이경태
 */
CommonTag.prototype.inputTagFocus = function(input){
    input.map((i,item) => {
        if("checkbox" === item.type) {
            $(item).off("click.giInputCheckBoxHandlerEvent").on("click.giInputCheckBoxHandlerEvent", giInputCheckBoxHandlerEvent);
        }
        if("radio" === item.type) {
            let dataFields = $(item).data("field");
            if(dataFields.length > 1){
                if($(item).is(":checked")){
                    $(item).attr("data-required",true);
                }else{
                    $(item).attr("data-required",false);
                }
            }
        }
    })

    input.off("focus.giInputFocusHandlerEvent").on("focus.giInputFocusHandlerEvent",giInputFocusHandlerEvent);
    input.off("blur.giInputBlurHandlerEvent").on("blur.giInputBlurHandlerEvent",giInputBlurHandlerEvent);
    input.off("change.giInputChangeHandlerEvent").on("change.giInputChangeHandlerEvent",giInputChangeHandlerEvent);


    function giInputFocusHandlerEvent(e){
        if("radio" !== this.type && "checkbox" !== this.type){
            let flag = $(this).parent(".gi-input-container").data("focusLine");
            if(!flag){
                $(this).parent().attr('data-focus-line',true);
                $(this).parent().children("label").attr('data-focus-label',true);
            }else{
                $(this).parent().attr('data-focus-line',false);
                $(this).parent().children("label").attr('data-focus-label',false);
            }

            if(!formUtil.checkEmptyValue($(this).val())){
                $(this).parent().attr('data-focus-line',true);
                $(this).parent().children("label").attr('data-focus-label',true);
            }else{
                $(this).parent().attr('data-focus-line',false);
                $(this).parent().children("label").attr('data-focus-label',true);
            }
        }
    }
    function giInputChangeHandlerEvent(e){
        if("radio" !== this.type && "checkbox" !== this.type){
            if(!formUtil.checkEmptyValue(e.target.value)){
                $(this).parent().attr('data-focus-line',false);
                $(this).parent().children("label").attr('data-focus-label',false);
            }else{
                $(this).parent().attr('data-focus-line',false);
                $(this).parent().children("label").attr('data-focus-label',true);
            }
        }else{
            let volumeName = e.target.name;
            let volume = "";

            volume = $("[data-field="+volumeName+"]");
            if(volume.length > 1){
                volume.map( (i,item) => {
                    $(item).attr("data-required",false);
                })

                $(e.target).attr("data-required",true);
            }

        }
    }
    function giInputBlurHandlerEvent(e){
        if("radio" !== this.type && "checkbox" !== this.type){
            if(!formUtil.checkEmptyValue(e.target.value)){
                $(this).parent().attr('data-focus-line',false);
                $(this).parent().children("label").attr('data-focus-label',false);
            }else{
                $(this).parent().attr('data-focus-line',false);
                $(this).parent().children("label").attr('data-focus-label',true);
            }
        }
    }
    function giInputCheckBoxHandlerEvent(e){
        $(this).is(":checked") ? $(this).val("1") : $(this).val("0");
    }

}
CommonTag.prototype.inputLabelTagFocus = function(label){
    label.on("click",function(e){
        let inputId = $(e.target).attr("for");
        let input = $(this).siblings("input")[0];
        let inputType = input.type;
        let disabledFlag = $("#"+inputId).attr("data-gi-tag-disabled");
        if(disabledFlag !== "undefined"){
            if("radio" === inputType || "checkbox" === inputType){

            }else{

            }
        }else{
            if("radio" === inputType){
                let isChecked = input.checked
                if(!isChecked){
                    $(input).prop("checked",true);
                }else{
                    $(input).prop("checked",false);
                }
                $(input).focus();
                $(input).off("blur.giInputBlurHandlerEvent").on("blur.giInputBlurHandlerEvent",giInputBlurHandlerEvent);
                $(input).off("focus.giInputFocusHandlerEvent").on("focus.giInputFocusHandlerEvent",giInputFocusHandlerEvent);
            }else{
                $(input).focus();
                $(input).off("blur.giInputBlurHandlerEvent").on("blur.giInputBlurHandlerEvent",giInputBlurHandlerEvent);
                $(input).off("focus.giInputFocusHandlerEvent").on("focus.giInputFocusHandlerEvent",giInputFocusHandlerEvent);
            }
        }
    });

    function giInputBlurHandlerEvent(e){
        $(this).parent().attr('data-focus-line',false);
        if(!formUtil.checkEmptyValue($(this).val())){
            $(this).parent().children("label").attr('data-focus-label',false);
        }
    }
    function giInputFocusHandlerEvent(e){
        if("radio" !== this.type && "checkbox" !== this.type){
            let flag = $(this).parent(".gi-input-container").data("focusLine");
            if(!flag){
                $(this).parent().attr('data-focus-line',true);
                $(this).parent().children("label").attr('data-focus-label',true);
            }else{
            }
        }
    }
}
/**
 * @title : .gi-input tag reset event
 * @value : form tag contain input
 * @return : input status
 * @see : .gi-input-container[data-focus-line="false"]::after, .gi-input-container[data-focus-line="true"]::after
 * @writer : 이경태
 */
CommonTag.prototype.inputTagReset = function(input){

    input.map((i,e) =>{
        if("radio" === e.type || "checkbox" === e.type){

        }else{
            if(formUtil.checkEmptyValue($(e).val())){
                $(e).parent().attr('data-focus-line',false);
                $(e).parent().children("label").attr('data-focus-label',true);
            } else{
                $(e).parent().attr('data-focus-line',false);
                $(e).parent().children("label").attr('data-focus-label',false);
            }
        }
    });
}
/**
 * @title : .gi-select tag focus event
 * @value : true, false
 * @return : select line status event and label status event
 * @see : .gi-select-container[data-focus-line="false"]::after, .gi-select-container[data-focus-line="true"]::after
 * @writer : 이경태
 */
CommonTag.prototype.selectTagFocus = function(select){
    select.map((i,item) => {
        if("checkbox" === item.type) {
            $(item).off("click.giSelectCheckBoxHandlerEvent").on("click.giSelectCheckBoxHandlerEvent", giSelectCheckBoxHandlerEvent);
        }
    })

    select.off("focus.giSelectFocusHandlerEvent").on("focus.giSelectFocusHandlerEvent",giSelectFocusHandlerEvent);
    select.off("blur.giSelectHandlerEvent").on("blur.giSelectHandlerEvent",giSelectHandlerEvent);
    select.off("change.giSelectHandlerEvent").on("change.giSelectHandlerEvent",giSelectHandlerEvent);


    function giSelectFocusHandlerEvent(e){
        let flag = $(this).parent(".gi-select-container").data("focusLine");
        if(!flag){
            $(this).parent().attr('data-focus-line',true);
            $(this).parent().children("label").attr('data-focus-label',true);
        }else{
            $(this).parent().attr('data-focus-line',false);
            $(this).parent().children("label").attr('data-focus-label',false);
        }
        if(!formUtil.checkEmptyValue($(this).val())){
            $(this).parent().attr('data-focus-line',true);
            $(this).parent().children("label").attr('data-focus-label',true);
        }else{
            $(this).parent().attr('data-focus-line',false);
            $(this).parent().children("label").attr('data-focus-label',true);
        }
    }
    function giSelectHandlerEvent(e){
        if(!formUtil.checkEmptyValue(e.target.value)){
            $(this).parent().attr('data-focus-line',false);
            $(this).parent().children("label").attr('data-focus-label',false);
        }else{
            $(this).parent().attr('data-focus-line',false);
            $(this).parent().children("label").attr('data-focus-label',true);
        }
    }
    function giSelectCheckBoxHandlerEvent(e){
        $(this).is(":checked") ? $(this).val("1") : $(this).val("0");
    }

}
CommonTag.prototype.selectLabelTagFocus = function(label){
    label.on("click",function(e){
        let selectId = $(e.target).attr("for");
        let select = $(this).siblings("select")[0];
        let disabledFlag = $("#"+selectId).attr("data-gi-tag-disabled");
        if(disabledFlag === "undefined"){
            $(select).focus();
            $(select).off("blur.giSelectBlurHandlerEvent").on("blur.giSelectBlurHandlerEvent",giSelectBlurHandlerEvent);
            $(select).off("focus.giSelectFocusHandlerEvent").on("focus.giSelectFocusHandlerEvent",giSelectFocusHandlerEvent);
        }
    });

    function giSelectBlurHandlerEvent(e){
        $(this).parent().attr('data-focus-line',false);
        if(!formUtil.checkEmptyValue($(this).val())){
            $(this).parent().children("label").attr('data-focus-label',false);
        }
    }
    function giSelectFocusHandlerEvent(e){
            let flag = $(this).parent(".gi-select-container").data("focusLine");
            if(!flag){
                $(this).parent().attr('data-focus-line',true);
                $(this).parent().children("label").attr('data-focus-label',true);
            }else{
            }
    }
}
/**
 * @title : .gi-select tag reset event
 * @value : form tag contain input
 * @return : select status
 * @see : .gi-select-container[data-focus-line="false"]::after, .gi-select-container[data-focus-line="true"]::after
 * @writer : 이경태
 */
CommonTag.prototype.selectTagReset = function(select){
    select.map((i,e) =>{
        if(formUtil.checkEmptyValue($(e).val())){
            $(e).parent().attr('data-focus-line',false);
            $(e).parent().children("label").attr('data-focus-label',true);
        } else{
            $(e).parent().attr('data-focus-line',false);
            $(e).parent().children("label").attr('data-focus-label',false);
        }
        commonTag.selectTagFocus(select);
    });
}
/**
 * @title : data-gi-tag-disabled 적용 시 default settings
 * @writer : 문상혁
 */
CommonTag.prototype.tagDisabled = function(disabled, tagIdArray){
    disabled = !formUtil.checkEmptyValue(disabled) ? true : disabled;

    if(disabled){
        if(formUtil.checkEmptyValue(tagIdArray)){
            for(let i=0; i<tagIdArray.length; i++){
                let target = $('#' + tagIdArray[i]);
                target
                    .attr('disabled', true);

                if(target.is('input') || target.is('span')){
                    target
                        .css('color', '#888888')
                        .closest('.gi-input-container').css('background-color', '#f5f5f5');
                }else if(target.is('button')){
                    target
                        .addClass('formUtil-btn-disabled')
                        .parent().siblings().css('background-color', '#f5f5f5');
                }
            }
        }else{
            $('[data-gi-tag-disabled]').each(function() {
                $(this).attr('disabled', true);

                if($(this).is('input') || $(this).is('span')) {
                    $(this)
                        .css('color', '#888888')
                        .closest('.gi-input-container').css('background-color', '#f5f5f5');
                }else if($(this).is('button')) {
                    $(this)
                        .addClass('formUtil-btn-disabled')
                        .parent().siblings().css('background-color', '#f5f5f5');
                }
            });
        }
    }else{
        if(formUtil.checkEmptyValue(tagIdArray)){
            // 특정 태그만 disabled 해제
            for(let i=0; i<tagIdArray.length; i++){
                let target = $('#' + tagIdArray[i]);
                target
                    .attr('disabled', false)
                    .removeAttr('data-gi-tag-disabled');

                if(target.is('input') || target.is('span')){
                    target
                        .css('color', '#000000')
                        .closest('.gi-input-container').css('background-color', '#ffffff');
                }else if(target.is('button')){
                    target
                        .removeClass('formUtil-btn-disabled')
                        .parent().siblings().css('background-color', '#ffffff')
                }
            }
        }else{
            $('[data-gi-tag-disabled]').each(function() {
                $(this)
                    .attr('disabled', false)
                    .removeAttr('data-gi-tag-disabled');

                if($(this).is('input') || $(this).is('span')){
                    $(this)
                        .css('color', '#000000')
                        .closest('.gi-input-container').css('background-color', '#ffffff');
                }else if($(this).is('button')){
                    $(this)
                        .removeClass('formUtil-btn-disabled')
                        .parent().siblings().css('background-color', '#ffffff');
                }
            });
        }
    }
}
/**
 * @title : GiDatePicker
 * @see : input gi-datepicker
 * @writer : 이경태
 */
class GiDatePicker{
    constructor() {
        this.initDatePicker();
    }
    initDatePicker(){

        const inputs = $("input[gi-datepicker]");
        const that = this;
        inputs.map((i,input) =>{

            that.validationCheck(input);

            $(input).off("click").on("click",function(event){
                that.showDatePicker(event);
            });
        })
    }
    showDatePicker(event) {
        const input = event.target;
        let $calendar = $('<div id="giDatePicker" class="gi-row-15 gi-col-26 tilt-in-top-1"></div>').css({
            position     : 'absolute',
            background   : '#fff',
            padding      : '10px',
            display      : 'block',
            zIndex       : '1000',
            borderRadius : '15px',
            boxShadow    : 'rgb(119 119 119 / 52%) 0px 0px 20px'
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
        let date ;
        if(formUtil.checkEmptyValue($("#"+inputId).data("startYearMonth"))){
            if(formUtil.checkEmptyValue(inputValue)){
                let inputValueArray = inputValue.split("-");
                year = inputValueArray[0];
                month = inputValueArray[1];
                date = new Date(year,month-1);
            }else{
                year = parseInt($("#"+inputId).data("startYearMonth").toString().substring(0,4));
                month = parseInt($("#"+inputId).data("startYearMonth").toString().substring(4,6));
                date = new Date(year,month-1);
            }
            formUtil.giDatePicker(inputId,date);
        }else{
            if(formUtil.checkEmptyValue(inputValue)){
                let inputValueArray = inputValue.split("-");
                year = inputValueArray[0];
                month = inputValueArray[1];
                date = new Date(year,month-1);
                formUtil.giDatePicker(inputId,date);
            }else{
                formUtil.giDatePicker(inputId,"");
            }
        }
    }
    hideDatePicker() {
        const calendar = $("#giDatePicker");
        if (calendar) {
            calendar.remove();
        }
    }
    validationCheck(input){
        let that = this;
        function giDatePickerBlurHandlerEvent(e){
            commonTag.inputTagReset($(".gi-input"));
            const regExp = /[0-9-]/g;
            const ele = e.target;
            if (regExp.test(ele.value)) {
                ele.value = ele.value.replace(/[^0-9-]/g, '');
                if(!that.dateCheck(ele.value)) ele.value = "";
            }else{
                if(formUtil.checkEmptyValue(ele.value)){
                    if(!that.dateCheck(ele.value)) ele.value = "";
                }
            }
        }
        function giDatePickerKeyupHandlerEvent(e){
            const regExp = /[^0-9-]/g;
            const ele = e.target;
            if (regExp.test(ele.value)) {
                ele.value = ele.value.replace(regExp, '');
            }else{
                if(4 === ele.value.length) {
                    if (e.key === "Backspace") {
                        ele.value = ele.value.substring(0, 4);
                    } else {
                        ele.value = ele.value + "-";
                    }
                }else if(7 === ele.value.length){
                    if (e.key === "Backspace") {
                        ele.value = ele.value.substring(0, 7);
                    } else {
                        ele.value = ele.value + "-";
                    }
                }else if(9 < ele.value.length){
                    ele.value = ele.value.substring(0, 10).substring(0, 4) + "-" + ele.value.substring(5, 7)+ "-" + ele.value.substring(8, 10);
                    if(!that.dateCheck(ele.value)) ele.value = "";
                } else if(ele.value.match(/[0-9]/g)
                        && ele.value.match(/[0-9]/g).length === 8
                        && ele.value.match(/-/g) .length < 2) {
                    // 너무 빨리쳐서 2001010-1 이런식으로 된 경우
                    const numbered = ele.value.replace(/[^0-9]/g, "");
                    ele.value = `${numbered.slice(0, 4)}-${numbered.slice(4, 6)}-${numbered.slice(6, 8)}`;

                }
            }
        }
        $(input).off("blur.giDatePickerBlurHandlerEvent").on("blur.giDatePickerBlurHandlerEvent",giDatePickerBlurHandlerEvent)
        $(input).off("keyup.giDatePickerKeyupHandlerEvent").on("keyup.giDatePickerKeyupHandlerEvent",giDatePickerKeyupHandlerEvent);
    }
    dateCheck(value){
        const birthDayPattern = /(19|20)\d\d-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/g;
        if (birthDayPattern.test(value)) {
            // 날짜 유효성 검증
            const [YEAR,MONTH,DAY] = value.split('-');
            const year = parseInt(YEAR);
            const month = parseInt(MONTH);
            const day = parseInt(DAY);
            // Date 객체를 사용하여 날짜 유효성 검증
            const date = new Date(year, month - 1, day);
            // 각 월별 최대 일수 정의
            // const daysInMonth = [31, this.dateCheck(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
                formUtil.showMessage(year+"년 "+month+" 월 "+day +" 일"+"은 유효하지 않은 날짜 입니다");
                return false;
            }
            return true;
        }else{
            formUtil.showMessage(Message.Label.Array["CHECK.FORMTYPE"]);
            return false;
        }

    }
    setDate(v){
        let yyyy = v.yyyy;
        let MM = v.MM;
        //attr -> data
        $("#"+v.id).data("startYearMonth", yyyy+MM);
    }
    resetDate(v){
        $("#"+v).removeData("startYearMonth");
    }
}


/**
 * @title : GiAddress
 * @text : 다음주소 api
 *  ex) owner_address-btn / owner_address / owner_address_detail / owner_postal_code (명명규칙 주의)
 * @see : button[gi-address]
 * @writer : 진은영
 */
class GiAddress {
    constructor() {
        this.initAddressSearch();
    }

    initAddressSearch() {
        const buttons = $("button[gi-address]");
        // 이벤트 리스너 중복 생성 방지
        buttons.off("click");
        buttons.each((i, button) => {
            $(button).on("click", (event) => {
                this.showAddressSearch(event);
            });
        });
    }

    showAddressSearch(event) {
        const button = $(event.target);
        // 공동소유자처럼 동일한 form이 반복되는 경우 끝에 인덱스('-1')를 붙여도 사용 가능 하도록 수정
        const id_parts = button.attr('id').split('-');
        let index = null;
        let id = undefined;

        id_parts.forEach(function(part) {
            if (!isNaN(part)) {
                index = part; // 숫자인 부분을 index로 저장
            } else if (part !== 'btn'){
                id = part;
            }
        });
        let input_address, input_address_detail, input_postal_code;

        if (index) {
            input_address = $('#' + id + '-' + index);                                    //transferee_use_address-2
            input_address_detail = $('#' + id + '_detail'+ '-' + index);                  //transferee_use_address_detail-2
            input_postal_code = $('#' + id.replace(/_address$/, '') + '_postal_code'+ '-' + index);  //transferee_use_postal_code-2
        } else {
            input_address = $('#' + id);                                                  //transferee_use_address
            input_address_detail = $('#' + id + '_detail');                               //transferee_use_address_detail
            input_postal_code = $('#' + id.replace(/_address$/, '') + '_postal_code');    //transferee_use_postal_code

            if (id === 'address') input_postal_code = $('#postal_code'); // '내 정보 수정' 페이지
        }

        new daum.Postcode({
            oncomplete: (data) => {
                if (input_address_detail.val() && input_address_detail.val().length !== 0) {
                    input_address_detail.val('');
                }
                // focusing & data binding(address, postal code)
                setTimeout(() => {
                    input_address.focus();
                    input_address.val(data.address).trigger("change");
                    if (input_postal_code.length) {
                        input_postal_code.val(data.zonecode);
                    }
                    input_address_detail.focus();
                }, 100);
                commonTag.inputTagFocus(input_address);
            }
        }).open();
    }
}


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
        inputs.map((i,item)=>{
            function giResidentNumberBlurHandlerEvent(e){
                if(formUtil.checkEmptyValue($(this).val())){
                    const regExp = /[^0-9-]/g;
                    const ele = e.target;
                    if (regExp.test(ele.value)) {
                        ele.value = ele.value.replace(regExp, '');
                    }else{
                        if(!that.residentRegistrationNumberCheck(ele.value)) ele.value = "";
                    }
                }
            }
            function giResidentNumberKeyupHandlerEvent(e){
                const regExp = /[^0-9-]/g;
                const ele = e.target;
                if (regExp.test(ele.value)) {
                    ele.value = ele.value.replace(regExp, '');
                }else{
                    if(6 === ele.value.length){
                        if(e.key === "Backspace"){
                            ele.value = ele.value.substring(0,6);
                        }else{
                            ele.value = ele.value + "-";
                        }
                    }else if(13 < ele.value.length){
                        ele.value = ele.value.substring(0, 14).substring(0, 6) + "-" + ele.value.substring(7, 14);
                        if(!that.residentRegistrationNumberCheck(ele.value)){
                            ele.value = "";
                        }
                    }
                }
            }

            $(item).off("blur.giResidentNumberBlurHandlerEvent").on("blur.giResidentNumberBlurHandlerEvent",giResidentNumberBlurHandlerEvent);
            $(item).off("keyup.giResidentNumberKeyupHandlerEvent").on("keyup.giResidentNumberKeyupHandlerEvent",giResidentNumberKeyupHandlerEvent).on("blur.giResidentNumberBlurHandlerEvent",giResidentNumberBlurHandlerEvent);
        })
    }
    residentRegistrationNumberCheck(value){
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

        if(parseInt(genderInfo[0], 10) > 4){
            formUtil.showMessage("성별 분류 번호 는 4보다 클 수 없습니다");
            return false;
        }
        // 현재 연도를 기준으로 1900년대 또는 2000년대 판단
        const fullYear = (parseInt(genderInfo[0], 10) < 3 ? 2000 : 1900) + year;

        // Date 객체를 사용하여 날짜 유효성 검증
        const date = new Date(fullYear, month - 1, day);
        if (date.getFullYear() !== fullYear || date.getMonth() !== month - 1 || date.getDate() !== day) {
            formUtil.showMessage(year+"년 "+month+" 월 "+day +" 일"+"은 유효하지 않은 날짜 입니다");
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
class GiCorporateNumber{
    constructor() {
        this.validationCheck();
    }
    validationCheck() {
        const inputs = $("input[gi-corporatenumber]");
        const that = this;

        function giCorporateNumberBlurHandlerEvent(e){
            if(formUtil.checkEmptyValue($(this).val())){
                const regExp = /[^0-9-]/g;
                const ele = e.target;
                if (regExp.test(ele.value)) {
                    ele.value = ele.value.replace(regExp, '');
                }else{
                    if(!that.corporateNumberCheck(ele.value)) ele.value = "";
                }
            }
        }
        function giCorporateNumberKeyupHandlerEvent(e){
            const regExp = /[^0-9-]/g;
            const ele = e.target;
            if (regExp.test(ele.value)) {
                ele.value = ele.value.replace(regExp, '');
            }else{
                if(6 === ele.value.length){
                    if(e.key === "Backspace"){
                        ele.value = ele.value.substring(0,6);
                    }else{
                        ele.value = ele.value + "-";
                    }
                }else if(13 < ele.value.length){
                    ele.value = ele.value.substring(0, 14).substring(0, 6) + "-" + ele.value.substring(7, 14);
                    if(!that.corporateNumberCheck(ele.value)){
                        ele.value = "";
                    }
                }
            }
        }
        inputs.map((i,item)=>{
            $(item).off("blur.giCorporateNumberBlurHandlerEvent").on("blur.giCorporateNumberBlurHandlerEvent",giCorporateNumberBlurHandlerEvent);
            $(item).off("keyup.giCorporateNumberKeyupHandlerEvent").on("keyup.giCorporateNumberKeyupHandlerEvent",giCorporateNumberKeyupHandlerEvent).on("blur.giCorporateNumberBlurHandlerEvent",giCorporateNumberBlurHandlerEvent);
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
            }else if (i === 0){
                j = 2;
            }
            I_TEMP_SUM = I_TEMP_SUM + parseInt(as_Biz_no.substring(index01 - 1, index01), 10) * j;
        }

        I_CHK_DIGIT = I_TEMP_SUM % 10;
        if (I_CHK_DIGIT !== 0) I_CHK_DIGIT = 10 - I_CHK_DIGIT;
        if(as_Biz_no.substring(12, 13) !== String(I_CHK_DIGIT)){
            formUtil.showMessage("유효하지 않은 법인등록번호 입니다")
            return false;
        }
        return true;


    }
}


/**
 * @title : GiSelectBox();
 * @see : input[gi-selectbox]
 * @text : input[gi-selectbox]의 data-selectbox-field 속성을 가져와 COMMON_CODE의 GROUP_ID와 매칭시켜 selectbox를 반환
 * @writer : 진은영
 */
class GiSelectBox {
    static defaultSelector = 'input[gi-selectbox]';

    constructor() {
        this.selector = GiSelectBox.defaultSelector;
        this.initialize();
    }
    // promise 처리
    async initialize() {
        await this.initSelectboxOption();   // data setting
        this.initSelectBox();               // selectbox setting
        commonTag.inputTagFocus($(".gi-input"));
    }

    // 공통코드 -> html append
    async initSelectboxOption() {
        const selectboxs = $(this.selector);
// 이경태 수정부분 시작
        selectboxs.each(async (i, selectbox) => {
            //if ($(selectbox).attr('id').endsWith('_select')) return;

            let copySelectBoxHtml = $(selectbox)[0].outerHTML;
            let fieldValue = $(selectbox).attr('data-selectbox-field').toUpperCase();
            let id = $(selectbox).attr('id');
            $(selectbox).addClass("gi-hidden");
            $(selectbox).removeAttr("gi-selectbox");
            $(selectbox).removeAttr("data-selectbox-field");

            let copySelectBox = $(copySelectBoxHtml);
            copySelectBox.attr("id", id + "_select");
            copySelectBox.removeAttr("data-field");
            copySelectBox.removeAttr("data-required");  //필수 값 속성 삭제
            $(selectbox).after(copySelectBox);
            copySelectBox.attr("readonly","readonly");

            let url = '/cms/common/commonCode/findCommonCode';
            let param = {
                group_id: fieldValue,
                use_yn: '1'
            };

            try {
                const response = await axios.post(url, param);
                let data = response.data;

                let ulElement = $('<ul class="slide-drop-down"></ul>');

                let liElement = $('<li></li>');
                liElement.html(`<button type="button" value="" style="color:#8b8b8b">선택</button>`);
                ulElement.append(liElement);

                data.forEach(item => {
                    let liElementOption = $('<li></li>');
                    liElementOption.html(`<button type="button" value="${item.code_id}" class="gi-overflow-scroll">${item.code_name}</button>`);
                    ulElement.append(liElementOption);
                });

                copySelectBox.after(ulElement);

                //slide-drop-down MutationObserver 등록 -> dataBinding().setData() 로직에서 slide-drop-down 가 페이지에 삽입됨을 감지하기 위해서 설정해 놓은값
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.addedNodes.length > 0) {
                            let $dropDown = $(copySelectBox).next().next(".slide-drop-down");
                            if ($dropDown.length > 0) {
                                observer.disconnect();
                            }
                        }
                    });
                });
                observer.observe($(copySelectBox).parent()[0], { childList: true, subtree: true });

                // selectbox를 active 할 때 가시영역에서 벗어난다면 아래로 스크롤 내리기
                const observer2 = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if ($(mutation.target).hasClass('active')) {
                            let dropdown = $(mutation.target).next('ul');

                            // 상위 부모 중 가장가까운 .gi-overflow 또는 .gi-overflow-scroll 찾기(가시영역)
                            let closestForm = dropdown.closest('.gi-overflow');
                            if (!closestForm.length) {
                                closestForm = dropdown.closest('.gi-overflow-scroll');
                            }

                            // 부모 요소가 없으면 종료
                            if (!closestForm.length) return;

                            // 드롭다운의 위치와 가시영역 위치 잡기
                            let dropdownOffset = dropdown.offset().top;
                            let dropdownHeight = dropdown.outerHeight();
                            let dropdownBottom = dropdownOffset + dropdownHeight;

                            let scrollTop = closestForm.scrollTop();
                            let containerOffset = closestForm.offset().top;
                            let containerHeight = closestForm.height();

                            let visibleBottom = containerOffset + containerHeight;

                            // console.log(scrollTop + " 현재 스크롤 위치");
                            // console.log(dropdownBottom + " 드롭다운 하단 위치");
                            // console.log(visibleBottom + " 가시영역 하단");
                            // 드롭다운이 가시영역 외로 갈 때 스크롤 조정
                            if (dropdownBottom > visibleBottom) {
                                let targetScroll = scrollTop + (dropdownBottom - visibleBottom);
                                closestForm.animate({
                                    scrollTop: targetScroll
                                }, 300);
                            }
                        }
                    });
                });

                // gi-selectbox 요소 감시
                $('[gi-selectbox]').each(function() {
                    observer2.observe(this, { attributes: true, attributeFilter: ['class'] });
                });

            } catch (error) {
                formUtil.alertPopup(error + "");
            }
        });
    }

    // selectbox event
    initSelectBox() {
        // selectbox click/enter Event
        $(this.selector).off('click keydown').on('click keydown', (e) => {
            const $target = $(e.currentTarget);

            if (e.type === 'click' || (e.type === 'keydown' && e.keyCode === 13)) {
                this.toggleSelectBox($target);
                this.chooseSelectBox($target);
            }
        });

        // 다른 요소를 클릭해서 닫아야 하는 경우
        // 1. selectbox를 눌렀다면 return
        $(document).off('click.selectbox').on('click.selectbox', (e) => {
            const $target = $(e.target);
            const $closestSelectBox = $target.closest(this.selector);
            const isSelect = $closestSelectBox.length > 0;

            if (isSelect) {
                return;
            }

            // 2. 그 외 요소라면 close
            setTimeout(() => {
                this.closeSelectBox();
            }, 100);
        });

        // hidden input에 data binding되었을 때(상세 페이지), selectbox와 매칭
        this.bindingSelectBox($(this.selector));
    }


    // 데이터를 받아왔을 때 setting
    bindingSelectBox(target){
        target.each((i, selectbox) => {
            let selectboxId = $(selectbox).attr('id');
            let hiddenInputId = selectboxId+'_hidden';
            let hiddenInputValue = $(`#${hiddenInputId}`).val();

            $('#'+selectboxId).next('ul').find('li > button').each(function () {
                if ($(this).val() === hiddenInputValue) {
                    $('#'+selectboxId).trigger('click');
                    $(this).trigger('click');
                    return false;
                }
            });
        });
    }

    // 열거나 닫기
    toggleSelectBox(target) {
        // target을 제외한 다른 selectbox가 열려있다면 닫음
        const openSelectBoxes = $(this.selector + '.active');
        if (openSelectBoxes.length > 0) {
            openSelectBoxes.each((_, openBox) => {
                const $openBox = $(openBox);
                if (!$openBox.is(target)) {
                    this.closeSelectBox(openBox);
                }
            });
        }

        // toggle
        target.toggleClass('active');

        // 닫았을 경우 포커스 제거
        if (!target.hasClass('active')) {
            target.blur();
        }

    }

    // 열린 selectbox 모두 닫기
    closeSelectBox() {
        const openSelectBoxes = $(this.selector + '.active');
        openSelectBoxes.each((_, openBox) => {
            $(openBox).removeClass('active');
        });
    }

    // 선택을 한 경우
    chooseSelectBox(target) {
        target.next('ul').find('li button').off('click').on('click', (e) => {
            const $selectedItem = $(e.currentTarget);
            let selectedText = $selectedItem.text();
            selectedText = (selectedText === '선택') ? '' : selectedText;

            const selectedValue = $selectedItem.attr('value');

            // 값 바인딩
            target.val(selectedText);

            setTimeout(function() {
                target.trigger('change');               // 셀렉박스 변경감지를 위해 trigger 수동
            }, 0);

            target.prev().val(selectedValue).trigger("change");
            target.removeClass('active');

            const label = $(`label[for="${target.attr('id')}"]`);
            label.attr('data-focus-label', selectedText === "" ? 'false' : 'true');
        });
    }
}

//데이터를 직접 넘겨주고 만드는 selectbox
class GiSelectBoxCustom {
    static defaultSelector = 'input[gi-selectbox-custom]';

    constructor(dataSet) {
        this.selector = GiSelectBoxCustom.defaultSelector;
        this.dataSet = dataSet; // 초기화 시 전달 받은 데이터 세트
        this.cleanupSelectbox();
    }

    cleanupSelectbox() {
        const selectboxs = $(this.selector);

        selectboxs.each((i, selectbox) => {
            const $selectbox = $(selectbox);
            const selectboxId = $selectbox.attr('id');

            // 기존 요소 제거
            if (selectboxId.endsWith('_select')) {
                const $customSelectbox = $selectbox.next('ul.slide-drop-down');

                console.log(selectbox);
                if ($customSelectbox.length > 0) {
                    $customSelectbox.remove(); //
                }

                const originalSelectboxId = selectboxId.replace('_select', ''); // _select 제거
                const $originalSelectboxId = $(`#${originalSelectboxId}`);

                if ($originalSelectboxId.length) {
                    // _select가 붙지 않은 기존 input을 복원
                    $originalSelectboxId.removeClass('gi-hidden').attr('gi-selectbox-custom', '');
                }

                // 현재의 _select 요소 삭제
                $selectbox.remove();
            }
        });

        // 초기화
        this.initialize();
    }

    // 초기화
    initialize() {
        this.initSelectboxOption();   // 데이터 세팅 및 selectbox 생성
        this.addEventSelectBox();         // selectbox 이벤트 세팅
        commonTag.inputTagFocus($(".gi-input"));
    }

    // 내부 데이터 기반으로 HTML 생성
    initSelectboxOption() {
        const selectboxs = $(this.selector);

        selectboxs.each((i, selectbox) => {
            let copySelectBoxHtml = $(selectbox)[0].outerHTML;
            let id = $(selectbox).attr('id');
            let fieldValue = $(selectbox).attr('id');

            $(selectbox).addClass("gi-hidden");
            $(selectbox).removeAttr("gi-selectbox-custom");
            let copySelectBox = $(copySelectBoxHtml);

            copySelectBox.attr("id", id + "_select");
            copySelectBox.attr("readonly", "readonly");
            copySelectBox.removeAttr("data-field");
            $(selectbox).after(copySelectBox);

            // 내부 데이터 세트에서 해당 필드 값 가져오기
            const options = this.dataSet[fieldValue] || [];

            let ulElement = $('<ul class="slide-drop-down"></ul>');

            // 기본 선택 옵션 추가
            let liElement = $('<li></li>');
            liElement.html(`<button type="button" value="" style="color:#8b8b8b">선택</button>`);
            ulElement.append(liElement);

            // 데이터 세트를 기반으로 옵션 추가
            options.forEach(item => {
                let liElementOption = $('<li></li>');
                liElementOption.html(`<button type="button" value="${item.code_id}" class="gi-overflow-scroll">${item.code_name}</button>`);
                ulElement.append(liElementOption);
            });

            copySelectBox.after(ulElement);

            // selectbox를 active 할 때 가시영역에서 벗어난다면 위로 생성
            const observer2 = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if ($(mutation.target).hasClass('active')) {
                        let dropdown = $(mutation.target).next('ul');

                        // 상위 부모 중 가장가까운 .gi-overflow 또는 .gi-overflow-scroll 찾기(가시영역)
                        let closestForm = dropdown.closest('.gi-overflow');
                        if (!closestForm.length) {
                            closestForm = dropdown.closest('.gi-overflow-scroll');
                        }

                        // 부모 요소가 없으면 종료
                        if (!closestForm.length) return;

                        dropdown.removeClass('slide-drop-down');
                        dropdown.addClass('slide-drop-up');
                    }
                });
            });

            // gi-selectbox 요소 감시
            $('[gi-selectbox-custom]').each(function() {
                observer2.observe(this, { attributes: true, attributeFilter: ['class'] });
            });
        });
    }

    // SelectBox 이벤트 설정
    addEventSelectBox() {
        $(this.selector).off('click keydown2').on('click keydown2', (e) => {
            const $target = $(e.currentTarget);

            if (e.type === 'click' || (e.type === 'keydown' && e.keyCode === 13)) {
                this.toggleSelectBox($target);
                this.chooseSelectBox($target);
            }
        });

        $(document).off('click.selectbox_custom').on('click.selectbox_custom', (e) => {
            const $target = $(e.target);
            const $closestSelectBox = $target.closest(this.selector);
            const isSelect = $closestSelectBox.length > 0;

            if (isSelect) {
                return;
            }

            setTimeout(() => {
                this.closeSelectBox();
            }, 100);
        });
    }

    // 선택값 설정
    chooseSelectBox(target) {
        target.next('ul').find('li button').off('click').on('click', (e) => {
            const $selectedItem = $(e.currentTarget);
            let selectedText = $selectedItem.text();
            selectedText = (selectedText === '선택') ? '' : selectedText;

            const selectedValue = $selectedItem.attr('value');

            target.val(selectedText);

            setTimeout(() => {
                target.trigger('change');
            }, 0);

            target.prev().val(selectedValue).trigger("change");
            target.removeClass('active');

            const label = $(`label[for="${target.attr('id')}"]`);
            label.attr('data-focus-label', selectedText === "" ? 'false' : 'true');
        });
    }

    toggleSelectBox(target) {
        const openSelectBoxes = $(this.selector + '.active');
        if (openSelectBoxes.length > 0) {
            openSelectBoxes.each((_, openBox) => {
                const $openBox = $(openBox);
                if (!$openBox.is(target)) {
                    this.closeSelectBox(openBox);
                }
            });
        }

        target.toggleClass('active');

        if (!target.hasClass('active')) {
            target.blur();
        }
    }

    closeSelectBox() {
        const openSelectBoxes = $(this.selector + '.active');
        openSelectBoxes.each((_, openBox) => {
            $(openBox).removeClass('active');
        });
    }

    // id와 값을 넘겨받아 해당 옵션 선택
    selectValue(id, value) {
        let target = $(`#${id}`);
        if (!target.attr('id').includes('_select')){
            target = $(`#${id}_select`);
        }
        let selectBox = target.next('ul');

        // value가 빈 값이면 첫 번째 옵션(선택)을 선택한 처리
        if (value === '') {
            let firstOption = selectBox.find('li button').first(); 
            firstOption.trigger('click'); 
            target.val('');
            target.prev().val(''); 
            target.trigger('change'); 
            return;
        }

        // value에 해당하는 옵션을 찾아서 클릭
        selectBox.find('li button').each((i, button) => {
            if ($(button).val() === value) {
                $(button).trigger('click');
                target.val($(button).text());
                target.prev().val(value);
                target.trigger('change');
                return false;
            }
        });
    }

    addOption(id, option){
        const $selectbox = $(`#${id}`);
        const $customInput = $(`#${id}_select`);
        const $dropdown = $customInput.next('ul.slide-drop-down');

        const optionElement = $('<li></li>');
        optionElement.html(`<button type="button" value="${option.code_id}" class="gi-overflow-scroll">${option.code_name}</button>`);
        $dropdown.append(optionElement);
    }

    updateSelectboxOption(id, options) {
        const $selectbox = $(`#${id}`);
        const $customInput = $(`#${id}_select`);
        const $dropdown = $customInput.next('ul.slide-drop-down');

        if ($selectbox.length === 0 || $customInput.length === 0 || $dropdown.length === 0) {
            return;
        }

        // 기존 옵션 제거
        $dropdown.empty();

        // '선택'
        const defaultOption = $('<li></li>');
        defaultOption.html(`<button type="button" value="" style="color:#8b8b8b">선택</button>`);
        $dropdown.append(defaultOption);

        // 새 옵션 추가
        options.forEach(option => {
            const optionElement = $('<li></li>');
            optionElement.html(`<button type="button" value="${option.code_id}" class="gi-overflow-scroll">${option.code_name}</button>`);
            $dropdown.append(optionElement);
        });

        // 기존 선택값 초기화
        $customInput.val('');
        $selectbox.val('');
        const label = $(`label[for="${$customInput.attr('id')}"]`);
        label.attr('data-focus-label', 'false');

        this.chooseSelectBox($customInput);
    }

}


/**
 * @title : GiSelectBoxYear();
 * @see : input[gi-selectbox-year]
 * @text : input[gi-selectbox-year]의 selectbox를 반환.
 * @ gi-selectbox-start-year에서 gi-selectbox-end-year 까지 1씩 더하거나 빼서 셀렉트박스 옵션을 정함
 * @ 숫자 대신 'NOW'로 설정하면 현재년도로 설정됨
 * @writer : 이진주
 */
class GiSelectBoxYear {
    static defaultSelector = 'input[gi-selectbox-year]';

    constructor() {
        this.selector = GiSelectBoxYear.defaultSelector;
        this.initialize();
    }

    // promise 처리
    async initialize() {
        await this.initSelectboxOption();   // data setting
        this.initSelectBox();               // selectbox setting
        commonTag.inputTagFocus($(".gi-input"));
    }

    // 공통코드 -> html append
    async initSelectboxOption() {
        const selectboxs = $(this.selector);
        selectboxs.each(async (i, selectbox) => {
            let startYear = $(selectbox).attr('gi-selectbox-start-year') === 'NOW'
                ? new Date().getFullYear()
                : +$(selectbox).attr('gi-selectbox-start-year');

            let endYear = $(selectbox).attr('gi-selectbox-end-year') === 'NOW'
                ? new Date().getFullYear()
                : +$(selectbox).attr('gi-selectbox-end-year');

            const step = startYear > endYear ? -1 : 1;
            const years = Array.from(
                {length: Math.abs(endYear - startYear) + 1},
                (_, i) => startYear + i * step
            );

            let copySelectBoxHtml = $(selectbox)[0].outerHTML;
            let id = $(selectbox).attr('id');

            $(selectbox).addClass("gi-hidden");
            $(selectbox).removeAttr("gi-selectbox-year");
            $(selectbox).removeAttr("gi-selectbox-start-year");
            $(selectbox).removeAttr("gi-selectbox-end-year");

            let copySelectBox = $(copySelectBoxHtml);
            copySelectBox.attr("id", id + "_select");
            copySelectBox.removeAttr("data-required");  //필수 값 속성 삭제
            $(selectbox).after(copySelectBox);
            copySelectBox.attr("readonly", "readonly");

            try {
                let ulElement = $('<ul class="slide-drop-down"></ul>');

                let liElement = $('<li></li>');
                liElement.html(`<button type="button" value="" style="color:#8b8b8b">선택</button>`);
                ulElement.append(liElement);

                years.forEach(item => {
                    let liElementOption = $('<li></li>');
                    liElementOption.html(`<button type="button" value="${item}" class="gi-overflow-scroll">${item}</button>`);
                    ulElement.append(liElementOption);
                });

                copySelectBox.after(ulElement);

                //slide-drop-down MutationObserver 등록 -> dataBinding().setData() 로직에서 slide-drop-down 가 페이지에 삽입됨을 감지하기 위해서 설정해 놓은값
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.addedNodes.length > 0) {
                            let $dropDown = $(copySelectBox).next().next(".slide-drop-down");
                            if ($dropDown.length > 0) {
                                observer.disconnect();
                            }
                        }
                    });
                });
                observer.observe($(copySelectBox).parent()[0], {childList: true, subtree: true});

                // selectbox를 active 할 때 가시영역에서 벗어난다면 아래로 스크롤 내리기
                const observer2 = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if ($(mutation.target).hasClass('active')) {
                            let dropdown = $(mutation.target).next('ul');

                            // 상위 부모 중 가장가까운 .gi-overflow 또는 .gi-overflow-scroll 찾기(가시영역)
                            let closestForm = dropdown.closest('.gi-overflow');
                            if (!closestForm.length) {
                                closestForm = dropdown.closest('.gi-overflow-scroll');
                            }

                            // 부모 요소가 없으면 종료
                            if (!closestForm.length) return;

                            // 드롭다운의 위치와 가시영역 위치 잡기
                            let dropdownOffset = dropdown.offset().top;
                            let dropdownHeight = dropdown.outerHeight();
                            let dropdownBottom = dropdownOffset + dropdownHeight;

                            let scrollTop = closestForm.scrollTop();
                            let containerOffset = closestForm.offset().top;
                            let containerHeight = closestForm.height();

                            let visibleBottom = containerOffset + containerHeight;

                            // console.log(scrollTop + " 현재 스크롤 위치");
                            // console.log(dropdownBottom + " 드롭다운 하단 위치");
                            // console.log(visibleBottom + " 가시영역 하단");
                            // 드롭다운이 가시영역 외로 갈 때 스크롤 조정
                            if (dropdownBottom > visibleBottom) {
                                let targetScroll = scrollTop + (dropdownBottom - visibleBottom);
                                closestForm.animate({
                                    scrollTop: targetScroll
                                }, 300);
                            }
                        }
                    });
                });

                // gi-selectbox 요소 감시
                $('[gi-selectbox-year]').each(function() {
                    observer2.observe(this, { attributes: true, attributeFilter: ['class'] });
                });
            } catch (error) {
                formUtil.alertPopup(error + "");
            }
        });
    }

    // selectbox event
    initSelectBox() {
        // selectbox click/enter Event
        $(this.selector).off('click keydown').on('click keydown', (e) => {
            const $target = $(e.currentTarget);

            if (e.type === 'click' || (e.type === 'keydown' && e.keyCode === 13)) {
                this.toggleSelectBox($target);
                this.chooseSelectBox($target);
            }
        });

        // 다른 요소를 클릭해서 닫아야 하는 경우
        // 1. selectbox를 눌렀다면 return
        $(document).off('click.selectbox-year').on('click.selectbox-year', (e) => {
            const $target = $(e.target);
            const $closestSelectBox = $target.closest(this.selector);
            const isSelect = $closestSelectBox.length > 0;

            if (isSelect) {
                return;
            }

            // 2. 그 외 요소라면 close
            setTimeout(() => {
                this.closeSelectBox();
            }, 100);
        });

        // hidden input에 data binding되었을 때(상세 페이지), selectbox와 매칭
        this.bindingSelectBox($(this.selector));
    }


    // 데이터를 받아왔을 때 setting
    bindingSelectBox(target) {
        target.each((i, selectbox) => {
            let selectboxId = $(selectbox).attr('id');
            let hiddenInputId = selectboxId + '_hidden';
            let hiddenInputValue = $(`#${hiddenInputId}`).val();

            $('#' + selectboxId).next('ul').find('li > button').each(function () {
                if ($(this).val() === hiddenInputValue) {
                    $('#' + selectboxId).trigger('click');
                    $(this).trigger('click');
                    return false;
                }
            });
        });
    }

    // 열거나 닫기
    toggleSelectBox(target) {
        // target을 제외한 다른 selectbox가 열려있다면 닫음
        const openSelectBoxes = $(this.selector + '.active');
        if (openSelectBoxes.length > 0) {
            openSelectBoxes.each((_, openBox) => {
                const $openBox = $(openBox);
                if (!$openBox.is(target)) {
                    this.closeSelectBox(openBox);
                }
            });
        }

        // toggle
        target.toggleClass('active');

        // 닫았을 경우 포커스 제거
        if (!target.hasClass('active')) {
            target.blur();
        }

    }

    // 열린 selectbox 모두 닫기
    closeSelectBox() {
        const openSelectBoxes = $(this.selector + '.active');
        openSelectBoxes.each((_, openBox) => {
            $(openBox).removeClass('active');
        });
    }

    // 선택을 한 경우
    chooseSelectBox(target) {
        target.next('ul').find('li button').off('click').on('click', (e) => {
            const $selectedItem = $(e.currentTarget);
            let selectedText = $selectedItem.text();
            selectedText = (selectedText === '선택') ? '' : selectedText;

            const selectedValue = $selectedItem.attr('value');

            // 값 바인딩
            target.val(selectedText);

            setTimeout(function () {
                target.trigger('change');               // 셀렉박스 변경감지를 위해 trigger 수동
            }, 0);

            target.prev().val(selectedValue).trigger("change");
            target.removeClass('active');

            const label = $(`label[for="${target.attr('id')}"]`);
            label.attr('data-focus-label', selectedText === "" ? 'false' : 'true');
        });
    }
}

/**
 * @title : checkBox init Setting;
 * @see : input[type="checkBox"]
 * @text : input type = checkBox의 초기값 셋팅
 * @writer : 이경태
 */
class inputTypeCheckBoxInitSetting{
    constructor() {
        this.init();
    }
    init(){
        let checkBoxs = $("input[type=checkbox]");
        checkBoxs.map((i,item) =>{
            let id = $("#"+item.id);
            let isChecked =  id.is(":checked");
            isChecked ? id.val(1) : id.val(0);

            id.off("change").on("change",function(){
                isChecked =  id.is(":checked");
                isChecked ? id.val(1) : id.val(0);
            })
        })
    }
}
class checkInputOnlyType{
    constructor() {
        this.init();
    }
    init(){
        const inputs = $(".gi-input[inputNumberOnly]");
        const regExp = /[^0-9-]/g;
        inputs.off("keyup.inputKeyUpHandlerEvent").on("keyup.inputKeyUpHandlerEvent",inputKeyUpHandlerEvent);
        inputs.off("blur.inputKeyBlurHandlerEvent").on("blur.inputKeyBlurHandlerEvent",inputKeyBlurHandlerEvent);
        inputs.off("input.inputKeyBlurHandlerEvent").on("input.inputKeyBlurHandlerEvent",inputKeyBlurHandlerEvent);
        function inputKeyUpHandlerEvent(e){
            $(e.target).val($(e.target).val().replace(/[^0-9]/g, ''));
        }
        function inputKeyBlurHandlerEvent(e){
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
 * @title : defaultToday
 * @value : [gi-default-today]
 * @text : 태그가 붙은 input의 value값이 오늘로 입력 된다.
 * @return : ex) 2024-08-23
 * @writer : 진은영
 */
CommonTag.prototype.defaultToday = function() {
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
    static formatTypes = ['vehicle_identification_number', 'vehicle_identification_number_section', 'number', 'phone_number', 'email', 'resident_registration_number','corporation_registration_number', 'company_registration_number'];

    constructor() {
        this.initializeFormatCheck();
    }

    // defalut로 태그가 달린 input의 keyup이벤트를 발생 시킨다.
    initializeFormatCheck(){
        const formatTypes = GiFormatCheck.getFormatTypes();  // 정적 메소드 호출
        const inputs = $("input[gi-format-check]");

        inputs.each((i, input) => {
            const formatType = $(input).attr("gi-format-check");
            let that = this;
            function giFormatCheckKeyupHandlerEvent(){
                that.validateInputFormat(input);  // keyup 이벤트로 유효성 검사
            }
            function giFormatCheckBlurHandlerEvent() {
                that.validateInputFormat(input, true);  // blur 이벤트로 유효성 검사
            }
            if (formatTypes.includes(formatType)) {

                $(input).off("keyup.giFormatCheckKeyupHandlerEvent").on("keyup.giFormatCheckKeyupHandlerEvent",giFormatCheckKeyupHandlerEvent);
                $(input).off("input.giFormatCheckKeyupHandlerEvent").on("input.giFormatCheckKeyupHandlerEvent",giFormatCheckKeyupHandlerEvent);
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
                    }else{
                        flag = formUtil.checkEmptyValue(inputVal);
                    }
                }else{
                    if (regExp.test(inputVal)) {
                        inputVal = inputVal.replace(regExp, '');
                        flag = formUtil.checkEmptyValue(inputVal);
                    }else{
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
                if (emailregExp.test(inputVal)){
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
    resetToggleIcon(){
        $("input[gi-format-check]").removeClass('check_on check_off');
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

    init(){
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
        if(!value) return '';

        // 1. 첫 번째 값은 숫자만 입력 가능, "." 금지
        if(value.startsWith('.')){
            return ''; // 맨 앞에 "."이 들어오면 제거
        }

        // 2. "0." 형식 처리
        if(value.startsWith('0') && value.length > 1 && !value.startsWith('0.')){
            return '0.'; // 0 다음에는 "."만 가능
        }

        // 3. 소수점 앞자리 숫자 검증
        const parts = value.split('.');
        let integerPart = parts[0]; // 소수점 앞자리
        const decimalPart = parts[1] || ''; // 소수점 뒷자리

        // 3-1. 소수점 앞자리 값이 100 초과 시 치환
        if(parseInt(integerPart, 10) > 100){
            if (parts.length === 1) {
                // 소수점이 없을 때: 입력값을 소수점 형태로 변환
                return this.adjustToDecimal(integerPart);
            }
            // 소수점이 이미 있는 경우에는 100.0으로 강제 변환
            return '100.0';
        }

        // 4. 소수점이 두 개 이상인 경우
        if(parts.length > 2){
            // 첫 번째 소수점만 유지
            return parts[0] + '.' + parts[1];
        }

        // 5. 소수점 뒷자리 숫자 검증
        if(decimalPart.length > 1){
            return integerPart + '.' + decimalPart.substring(0, 1);
        }

        // 6. 소수점 앞자리가 100인 경우 뒷자리는 0만 입력 가능
        if(value.length === 5){
            return "100.0";
        }

        return value;
    }

    adjustToDecimal(value){
        // 세 자리 숫자를 소수점 형식으로 변환
        if(value.length <= 1) return value; // 한 자리 숫자는 그대로 반환

        let integerPart = "";
        let decimalPart = "";

        if(value.length >= 4){
            integerPart = value.substring(0, value.length - 1);
            decimalPart = "0";
        }else{
            integerPart = value.substring(0, value.length - 1);
            decimalPart = value.substring(value.length - 1);
        }

        return integerPart + '.' + decimalPart;
    }
}

/**
 * @title : inputDisabledUpdateAble
 * @value : default = undefined || input tag id
 * @text : data-gi-tag-disabled 설정 후 gi-input-update-tag-icon를 사용 하여 disabled를 해제 시킨다.
 * @writer : 이경태
 */
CommonTag.prototype.inputDisabledUpdateAble = function(tag){
    if(formUtil.checkEmptyValue(tag)){
        let inputContainer = $("#"+tag).parent(".gi-input-container");
        let html = "<div class='gi-input-update-tag-icon' data-input-editing='complete'><i class='fa-solid fa-pen'></i></div>";
        if(inputContainer.find(".gi-input-update-tag-icon").length > 0){
        }else{
            $(inputContainer).append(html);
            $(".gi-input-update-tag-icon").off("click.updateAbleClickEventHandler").on("click.updateAbleClickEventHandler",function(e){
                updateAbleClickEventHandler(e);
            })
        }
    }else{
        $(".gi-input[data-gi-tag-disabled-update-able]").map((i,item)=>{
            let flag = $(item.attributes).filter(function(){
                return $(this)[0].name === "data-gi-tag-disabled";
            }).length > 0;
            if(flag){
                let inputContainer = $(item).parent(".gi-input-container");
                let html = "<div class='gi-input-update-tag-icon' data-input-editing='complete'><i class='fa-solid fa-pen'></i></div>";
                if(inputContainer.find(".gi-input-update-tag-icon").length > 0){
                }else{
                    $(inputContainer).append(html);
                    $(".gi-input-update-tag-icon").off("click.updateAbleClickEventHandler").on("click.updateAbleClickEventHandler",function(e){
                        updateAbleClickEventHandler(e);
                    })
                }
            }else{
                formUtil.showMessage(Message.Label.Array["FAIL.NOT.EXIST.DISABLED"]);
            }

        })
    }
    function updateAbleClickEventHandler(e){
        let target = e.currentTarget;
        let iconTag = $(target).children("i")
        let targetInputId = $(target).parent(".gi-input-container").children(".gi-input")[0].id;
        if($(target).attr("data-input-editing") === "complete"){
            $(iconTag).removeClass("fa-pen");
            $(iconTag).addClass("fa-circle-check");
            $(target).attr("data-input-editing","editing");
            commonTag.tagDisabled(false,[targetInputId]);
        }else if($(target).attr("data-input-editing") === "editing"){
            $(iconTag).removeClass("fa-circle-check");
            $(iconTag).addClass("fa-pen");
            $(target).attr("data-input-editing","complete");
            commonTag.tagDisabled(true,[targetInputId]);
        }
    }
}

class GiSlider {
    id;
    slider;
    sliderWrapper;
    itemsLength;
    currentIndex = 0;

    isAutoRotated;
    rotateIntervalSec;

    constructor(id) {
        this.id = id;
        this.slider = $(`#${id}[gi-slider]`);
        this.sliderWrapper = this.slider.find('[gi-slider-wrapper]');
        this.itemsLength = this.sliderWrapper.find('[gi-slider-item]').length;

        this.isAutoRotated = this.slider.data('auto-rotated') === '1';
        this.rotateIntervalSec = Number(this.slider.data('rotate-interval-sec'));

        this.make();
        this.setInterval();
    }

    make() {
        this.slider.find('[gi-slider-prev], [gi-slider-next], [gi-slider-item-clone]').remove();
        this.slider.append(`
        <div class="slider-left" gi-slider-prev></div>
        <div class="slider-right" gi-slider-next></div>
    `);

        const firstClone = this.sliderWrapper.find('[gi-slider-item]').first().clone();
        const lastClone = this.sliderWrapper.find('[gi-slider-item]').last().clone();

        this.sliderWrapper.prepend(lastClone);
        this.sliderWrapper.append(firstClone);

        this.sliderWrapper.children(':first-child, :last-child').attr('gi-slider-item-clone', '');

        this.itemsLength = this.sliderWrapper.find('[gi-slider-item]').length;
        this.currentIndex = 1;

        this.sliderWrapper.css('transform', `translateX(-100%)`);

        this.slider.off('click.clickSliders').on('click.clickSliders', '[gi-slider-prev], [gi-slider-next]', (event) => {
            const isPrev = $(event.target).is('[gi-slider-prev]');
            const isNext = $(event.target).is('[gi-slider-next]');

            const div = $(event.target);
            div.prop('disabled', true);

            setTimeout(() => {
                div.prop('disabled', false);
            }, 500);

            if (isPrev) {
                this.currentIndex--;
            } else if (isNext) {
                this.currentIndex++;
            }

            clearInterval(window.giSliderIntervals[this.id]);

            this.move();

            this.setInterval();
        });
    }

    move() {
        this.sliderWrapper.css('transition', 'transform 0.5s ease-in-out');
        const offset = -this.currentIndex * 100;
        this.sliderWrapper.css('transform', `translateX(${offset}%)`);

        setTimeout(() => {
            if (this.currentIndex === 0) {
                this.sliderWrapper.css('transition', 'none');
                this.currentIndex = this.itemsLength - 2;
                this.sliderWrapper.css('transform', `translateX(-${this.currentIndex * 100}%)`);
            }

            if (this.currentIndex === this.itemsLength - 1) {
                this.sliderWrapper.css('transition', 'none');
                this.currentIndex = 1;
                this.sliderWrapper.css('transform', `translateX(-100%)`);
            }
        }, 500);
    }

    setInterval() {
        if (window.giSliderIntervals?.[this.id]) {
            clearInterval(window.giSliderIntervals[this.id]);
        }

        if (!this.isAutoRotated || !this.rotateIntervalSec) return;

        if (!window.giSliderIntervals) {
            window.giSliderIntervals = {};
        }

        window.giSliderIntervals[this.id] = setInterval(() => {
            if (!$(`#${this.id}[gi-slider]`).length) {
                clearInterval(window.giSliderIntervals[this.id]);
                delete window.giSliderIntervals[this.id];
                return;
            }

            this.currentIndex = (this.currentIndex + 1) % this.itemsLength;
            this.move();
        }, this.rotateIntervalSec * 1000);
    }

    reload() {
        this.itemsLength = this.sliderWrapper.find('[gi-slider-item]').length;
        this.make();
    }

    //한번 클릭 시 stopInterval
}