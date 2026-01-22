/**
 * @title : Select 태그 포커스 이벤트
 * @value : true, false
 * @return : select line status event and label status event
 * @see : .gi-select-container[data-focus-line="false"]::after, .gi-select-container[data-focus-line="true"]::after
 * @writer : 이경태
 */
CommonTag.prototype.selectTagFocus = function (select) {
    select.map((i, item) => {
        if ("checkbox" === item.type) {
            $(item).off("click.giSelectCheckBoxHandlerEvent").on("click.giSelectCheckBoxHandlerEvent", giSelectCheckBoxHandlerEvent);
        }
    })

    select.off("focus.giSelectFocusHandlerEvent").on("focus.giSelectFocusHandlerEvent", giSelectFocusHandlerEvent);
    select.off("blur.giSelectHandlerEvent").on("blur.giSelectHandlerEvent", giSelectHandlerEvent);
    select.off("change.giSelectHandlerEvent").on("change.giSelectHandlerEvent", giSelectHandlerEvent);


    function giSelectFocusHandlerEvent(e) {
        let flag = $(this).parent(".gi-select-container").data("focusLine");
        if (!flag) {
            $(this).parent().attr('data-focus-line', true);
            $(this).parent().children("label").attr('data-focus-label', true);
        } else {
            $(this).parent().attr('data-focus-line', false);
            $(this).parent().children("label").attr('data-focus-label', false);
        }
        if (!formUtil.checkEmptyValue($(this).val())) {
            $(this).parent().attr('data-focus-line', true);
            $(this).parent().children("label").attr('data-focus-label', true);
        } else {
            $(this).parent().attr('data-focus-line', false);
            $(this).parent().children("label").attr('data-focus-label', true);
        }
    }
    function giSelectHandlerEvent(e) {
        if (!formUtil.checkEmptyValue(e.target.value)) {
            $(this).parent().attr('data-focus-line', false);
            $(this).parent().children("label").attr('data-focus-label', false);
        } else {
            $(this).parent().attr('data-focus-line', false);
            $(this).parent().children("label").attr('data-focus-label', true);
        }
    }
    function giSelectCheckBoxHandlerEvent(e) {
        $(this).is(":checked") ? $(this).val("1") : $(this).val("0");
    }

}
/**
 * @title : Select 라벨 포커스 이벤트
 */
CommonTag.prototype.selectLabelTagFocus = function (label) {
    label.on("click", function (e) {
        let selectId = $(this).attr("for");
        if (!selectId) return;

        let $select = $("#" + selectId);
        if ($select.length === 0) return;

        let disabledFlag = $select.attr("data-disabled");
        let isDisabled = $select.prop("disabled") || (disabledFlag !== undefined && disabledFlag !== "false" && disabledFlag !== "undefined");

        if (!isDisabled) {
            $select.focus();
        }
    });

    function giSelectBlurHandlerEvent(e) {
        $(this).parent().attr('data-focus-line', false);
        if (!formUtil.checkEmptyValue($(this).val())) {
            $(this).parent().children("label").attr('data-focus-label', false);
        }
    }
    function giSelectFocusHandlerEvent(e) {
        let flag = $(this).parent(".gi-select-container").data("focusLine");
        if (!flag) {
            $(this).parent().attr('data-focus-line', true);
            $(this).parent().children("label").attr('data-focus-label', true);
        } else {
        }
    }
}
/**
 * @title : Select 태그 리셋 이벤트
 * @value : form tag contain input
 * @return : select status
 * @see : .gi-select-container[data-focus-line="false"]::after, .gi-select-container[data-focus-line="true"]::after
 * @writer : 이경태
 */
CommonTag.prototype.selectTagReset = function (select) {
    select.map((i, e) => {
        if (formUtil.checkEmptyValue($(e).val())) {
            $(e).parent().attr('data-focus-line', false);
            $(e).parent().children("label").attr('data-focus-label', true);
        } else {
            $(e).parent().attr('data-focus-line', false);
            $(e).parent().children("label").attr('data-focus-label', false);
        }
        commonTag.selectTagFocus(select);
    });
}

/**
 * @title : 공통 코드 기반 Select Box 생성
 * @see : input[gi-selectbox]
 * @text : input[gi-selectbox]의 data-selectbox-field 속성을 가져와 SYS_CODE의 GROUP_ID와 매칭시켜 selectbox를 반환
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

    async initSelectboxOption() {
        const selectboxs = $(this.selector);
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
            copySelectBox.attr("readonly", "readonly");

            let url = '/cms/common/sysCode/findSysCode';
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
                $('[gi-selectbox]').each(function () {
                    observer2.observe(this, { attributes: true, attributeFilter: ['class'] });
                });

            } catch (error) {
                formUtil.alertPopup(error + "");
            }
        });
    }
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
 * @title : 사용자 정의 데이터 기반 Select Box 생성
 * @text : 데이터를 직접 넘겨주고 만드는 selectbox
 */
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
    initialize() {
        this.initSelectboxOption();   // 데이터 세팅 및 selectbox 생성
        this.addEventSelectBox();         // selectbox 이벤트 세팅
        commonTag.inputTagFocus($(".gi-input"));
    }
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
            $('[gi-selectbox-custom]').each(function () {
                observer2.observe(this, { attributes: true, attributeFilter: ['class'] });
            });
        });
    }
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
    selectValue(id, value) {
        let target = $(`#${id}`);
        if (!target.attr('id').includes('_select')) {
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

    addOption(id, option) {
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
 * @title : 연도 선택 Select Box 생성
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
                { length: Math.abs(endYear - startYear) + 1 },
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
                $('[gi-selectbox-year]').each(function () {
                    observer2.observe(this, { attributes: true, attributeFilter: ['class'] });
                });
            } catch (error) {
                formUtil.alertPopup(error + "");
            }
        });
    }

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
