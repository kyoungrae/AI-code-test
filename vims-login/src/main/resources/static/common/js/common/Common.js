/**
 * @title : 페이지 초기화
 * @text : html 페이지 로딩시 최초 이벤트를 설정하기 위한 Class 입니다.
 * @writer : 이경태
 */
class PageInit {
    constructor() {
        // this.formUtilitySettings();
        this.commonTagSettings();
        this.messageLabelSettings();
        new Popup();
        setTimeout(function () {
            // new scrollAnimationInit;
        })

    }
    formUtilitySettings() {
        //페이지 이동 애니메이션 효과
        formUtil.pageReDirectAnimation();

        setTimeout(function () {
        })
    }
    commonTagSettings() {
        //input tag 효과 초기설정
        let inputTag = $(".gi-input");
        let selectTag = $(".gi-select");
        let selectYearTag = $(".gi-select-year");
        commonTag.inputTagFocus(inputTag);
        commonTag.inputTagReset(inputTag);
        commonTag.inputLabelTagFocus(inputTag.siblings("label"));
        commonTag.selectTagFocus(selectTag);
        commonTag.selectTagReset(selectTag);
        commonTag.selectLabelTagFocus(selectTag.siblings("label"));
        commonTag.selectTagFocus(selectYearTag);
        commonTag.selectTagReset(selectYearTag);
        commonTag.selectLabelTagFocus(selectYearTag.siblings("label"));
        commonTag.tagDisabled();
        commonTag.defaultToday();
        new GiResidentNumber();
        new GiCorporateNumber();
        new GiDatePicker();
        new GiAddress();
        new GiSelectBox();
        new GiSelectBoxYear();
        new GiFormatCheck();
        new GiMaxLengthCheck();
        new GiMaxLengthNumberCheck();
        new inputTypeCheckBoxInitSetting();
        new checkInputOnlyType();
        new checkPriceType();
        new OnlyNumericWithoutLeadingZero();
        new ValidDecimalInput();
    }
    messageLabelSettings() {
        // Message 객체가 로드되지 않았으면 실행하지 않음
        if (typeof Message === 'undefined' || !Message.Label || !Message.Label.Array) {
            console.warn('Message object not loaded yet');
            return;
        }

        const pattern = /\[Page\.Message\]\.Message\.Label\.Array\["([^"]+)"\]/g;

        // 텍스트 치환 함수
        const replaceText = (text) => {
            return text.replace(pattern, (match, key) => {
                return Message.Label.Array[key] || match;
            });
        };

        // 1. DOM 텍스트 노드 치환
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        let node;
        while (node = walker.nextNode()) {
            if (node.nodeValue && pattern.test(node.nodeValue)) {
                node.nodeValue = replaceText(node.nodeValue);
            }
        }

        // 2. Button value 속성 치환
        $('input[type="button"], input[type="submit"], input[type="reset"]').each(function () {
            const val = $(this).val();
            if (val && pattern.test(val)) {
                $(this).val(replaceText(val));
            }
        });

        // 3. Placeholder 속성 치환
        $('input[placeholder], textarea[placeholder]').each(function () {
            const placeholder = $(this).attr('placeholder');
            if (placeholder && pattern.test(placeholder)) {
                $(this).attr('placeholder', replaceText(placeholder));
            }
        });
    }
}

/**
 * @title : 데이터 로드 후 이벤트
 * @text : 데이터 동적생성 후 이벤트 재설정
 * @writer : 이경태
 */
class AfterLoadDataEvent {
    constructor() {
        // new scrollAnimationInit;
        this.commonTagSettings();
    }
    commonTagSettings() {
        //input tage 초기화
        commonTag.inputTagReset($(".gi-input"));
    }
}
/**
 * @title : 스크롤 애니메이션 초기화
 * @text : 컨텐츠가 overflow 됐을때 animation 효과 추가
 * @writer : 이경태
 */
class ScrollAnimationInit {
    constructor() {
        //컨텐츠가 overflow 됐을때 animation 효과 추가
        this.initScrollAnimation();

    }
    initScrollAnimation() {
        const itemArray = $(".gi-overflow-scroll");
        const that = this;
        itemArray.map((i, item) => {
            that.defaultScrollAnimation(item);
            $(item).on("scroll", function (e) {
                that.scrollAnimation(e);
            })

        })
    }
    defaultScrollAnimation(e) {
        let flag = $(e).find(".overFlowAnimationIcon").length !== 0;
        if (!flag) {
            const $icon = $('<div class="overFlowAnimationIcon gi-flex gi-flex-justify-content-center gi-flex-align-items-center"><span class="pulsate-fwd">....</span></div>').css({
                position: 'sticky',
                bottom: '0',
                zIndex: '1',
                height: "25px",
                width: "70px",
                left: "calc(50% - 35px)",
                fontSize: '30px',
                color: '#bbbbbb'
            });
            let childrenTotalHeight = 0;
            $($(e)[0].children).map((i, item) => {
                childrenTotalHeight += $(item).outerHeight();
            })
            childrenTotalHeight = Math.ceil(childrenTotalHeight);
            // console.log($(e)[0]);
            // console.log($(e)[0].scrollHeight);
            // console.log($(e)[0].clientHeight);
            // console.log(childrenTotalHeight);
            let flag = $(e)[0].clientHeight < childrenTotalHeight;
            // console.log(flag);
            // console.log($(e)[0].scrollHeight > $(e)[0].clientHeight);
            if ($(e)[0].scrollHeight > $(e)[0].clientHeight || flag) {
                $(e).append($icon);
            }
        } else {
        }
    }
    scrollAnimation(e) {
        let event = e.target;
        let currentScrollPosition = event.scrollTop;
        let totalHeight = event.scrollHeight;
        let visibleHeight = event.clientHeight;
        let childLength = $(event).children().not(".overFlowAnimationIcon").length;
        let removeItemName = $(event).find(".overFlowAnimationIcon");
        let resultPosition = Math.ceil(visibleHeight + currentScrollPosition)
        // console.log(event)
        // console.log(childLength)
        // console.log(endPointScrollPosition)
        // console.log(currentScrollPosition)
        // console.log("visibleHeight:",visibleHeight)
        // console.log("totalHeight:",totalHeight)

        // console.log("currentScrollPosition:",currentScrollPosition)
        // console.log("visibleHeight+currentScrollPosition:",resultPosition)
        if (totalHeight <= resultPosition) {
            removeItemName.remove();
        } else {
            this.defaultScrollAnimation(event);
        }
    }
}
/**
 * @title : 데이터 바인딩
 * @text : giGrid내의 상세 버튼을 클릭하여 detail 페이지로 이동 했을때 session에 있는 DATA 값을 조회해 와서 data-field에 설정된 ID와 DATA의 key값을
 *          매칭 시켜 value 값을 할당 시킨다.
 * @param : $("#detailPage")
 * @writer : 이경태
 */
class DataBinding {
    constructor() {
    }
    async setData(dataFieldList) {
        return new Promise((resolve, reject) => {
            dataFieldList = $("#" + dataFieldList);
            setTimeout(() => {
                let data = new Session().getItem("DATA");
                let elements = dataFieldList.find("[data-field]");
                elements.map((i, items) => {
                    let nodeName = items.nodeName === "SPAN";
                    let field = $(items).data("field");
                    if (formUtil.checkEmptyValue(data[field])) {
                        if ("radio" === items.type) {
                            if (items.value === data[field]) {
                                $(items).attr("checked", true);
                                $(items).attr("data-required", true);
                            } else {
                                $(items).attr("data-required", false);
                            }
                        } else if ("checkbox" === items.type) {
                            if ("1" === data[field]) {
                                $(items).attr("checked", true);
                                $(items).val("1");
                            }
                        } else {
                            nodeName ? $(items).text(data[field]) : $(items).val(data[field]);
                            // selectBox setting 영역
                            let selectBox = $(items).next().attr("data-selectbox-field");
                            let isSelectBox = formUtil.checkEmptyValue(selectBox);
                            if (isSelectBox) {
                                let $dropDown = $(items).next().next(".slide-drop-down");
                                if ($dropDown.length > 0) {
                                    // If slide-drop-down already exists
                                    let elements = $dropDown.children("li").children("button");
                                    let selectText = "";
                                    elements.each((i, item) => {
                                        if (data[field] === $(item).val()) {
                                            selectText = $(item).text();
                                        }
                                    });
                                    $(items).next().val(selectText);
                                    resolve();
                                    new AfterLoadDataEvent();
                                } else {
                                    // Set up MutationObserver to wait for slide-drop-down
                                    const observer = new MutationObserver((mutations) => {
                                        mutations.forEach((mutation) => {
                                            if (mutation.addedNodes.length > 0) {
                                                let $dropDown = $(items).next().next(".slide-drop-down");
                                                if ($dropDown.length > 0) {
                                                    let elements = $dropDown.children("li").children("button");
                                                    let selectText = "";
                                                    elements.each((i, item) => {
                                                        if (data[field] === $(item).val()) {
                                                            selectText = $(item).text();
                                                        }
                                                    });
                                                    $(items).next().val(selectText);
                                                    observer.disconnect(); // Stop observing
                                                    resolve();
                                                    new AfterLoadDataEvent();
                                                }
                                            }
                                        });
                                    });

                                    // Observe the parent element of the slide-drop-down
                                    observer.observe($(items).parent()[0], { childList: true, subtree: true });
                                }
                            }
                            //selectBox setting 영역 끝
                        }
                    }
                });
                new AfterLoadDataEvent();
                resolve();
            })
        })
    }
    getData(dataFieldList) {
        dataFieldList = $("#" + dataFieldList);
        let elements = dataFieldList.find("[data-field]");
        let elementsList = [];
        let list = {};
        elements.map((i, item) => {
            let fieldId = $(item).data("field");
            let nodeName = item.nodeName === "SPAN";
            let fieldValue = "";

            if (nodeName) {
                fieldValue = $(item).text();
            } else if ($(item).is(':radio')) {
                fieldValue = $(`[name=${fieldId}]:checked`).val();
            } else if ($(item).is(':checkbox') && $(item).hasClass('multipleCheckbox')) {   // multipleCheckbox의 경우 배열로 값 반환
                fieldValue = $(`[name=${fieldId}]:checked`).map(function () {
                    let checkboxId = $(this).attr('id');
                    return checkboxId.replace(fieldId, '');
                }).get();
            } else {
                fieldValue = $(item).val();
            }

            list[fieldId] = fieldValue;
        })
        elementsList.push(list);
        return elementsList[0];
    }
    setDataSelectBox(ID, VALUE) {
        console.log(ID, VALUE)
        let target = $("#" + ID);
        let target_select = $("#" + ID + "_select");
        const targetNode = target.closest("div")[0];
        // 감시할 대상 요소
        const config = {
            childList: true, // 자식 노드의 추가/제거 감시
            subtree: true // 하위 트리의 모든 노드 감시
        };
        console.log(!formUtil.checkEmptyValue(target_select))
        if (!formUtil.checkEmptyValue(target_select)) {
            if (target_select[0].hasAttribute("gi-selectbox") && target.closest("div").hasClass("gi-input-container")) {
                // MutationObserver 생성
                const observer = new MutationObserver((mutationsList, observer) => {
                    for (let mutation of mutationsList) {
                        if (mutation.type === 'childList') {
                            for (let addedNode of mutation.addedNodes) {
                                if (addedNode.classList && addedNode.classList.contains('slide-drop-down')) {
                                    $(addedNode).children().map((i, item) => {
                                        let _selectBoxValue = $(item).children().val();
                                        if (VALUE === _selectBoxValue) {
                                            let _selectBoxText = $(item).children().text();
                                            target.val(_selectBoxValue);
                                            target.next().val(_selectBoxText);

                                            observer.disconnect();
                                        }
                                    })
                                }
                            }
                        }
                    }
                });
                observer.observe(targetNode, config);
            } else {
                formUtil.alertPopup(Message.Label.Array["CHECK.DATA_ATTRIBUTE"]);
            }
        } else {
            const observer = new MutationObserver((mutationsList, observer) => {
                for (let mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        for (let addedNode of mutation.addedNodes) {
                            if (addedNode.classList && addedNode.classList.contains('slide-drop-down')) {
                                $(addedNode).children().map((i, item) => {
                                    let _selectBoxValue = $(item).children().val();
                                    if (VALUE === _selectBoxValue) {
                                        let _selectBoxText = $(item).children().text();
                                        target.val(_selectBoxValue);
                                        target.next().val(_selectBoxText);

                                        observer.disconnect();
                                        commonTag.inputTagReset($(".gi-input"));
                                    }
                                })
                            }
                        }
                    }
                }
            });
            observer.observe(targetNode, config);
            let elements = $(targetNode).children(".slide-drop-down").children("li").children("button");
            elements.map((i, item) => {
                let _selectBoxValue = $(item).val();
                let _selectBoxText = $(item).text();
                if (_selectBoxValue === VALUE) {
                    target.val(VALUE);
                    target.next().val(_selectBoxText);
                }
            })

        }
        commonTag.inputTagReset($(".gi-input"));
    }
    setDataBoxList(id, setBoxList) {
        let $container = $("#" + id);
        let boxList = JSON.parse('[' + setBoxList + ']');

        function renderBoxList() {
            $container.empty();
            let listHtml = "";
            boxList.forEach(function (obj) {
                listHtml += `<ul class='gi-row-100'>
                <li class='gi-row-75 gi-margin-left-2px' data-part-code='${obj.group_id}${obj.group_name}'>${obj.group_name}</li>
                <li class='gi-row-10 formUtil-file_close_image formUtil-btn-delete' data-close-button></li>
            </ul>`;
            });
            $container.append(listHtml);
            boxListDeleteButtonClick();
        }

        function boxListDeleteButtonClick() {
            $container.find("[data-close-button]").on("click", function () {
                let targetCode = $(this).siblings("li").data("part-code");
                boxList = boxList.filter(item => item.group_id + item.group_name !== targetCode);
                setChangedBoxList();
            });
        }

        function setChangedBoxList() {
            renderBoxList();
            if (boxList.length === 0) {
                let selectedRadioType = $("input[data-structure-device-classification-radio-type]:checked").data("structure-device-classification-radio-type");
                let target = selectedRadioType === "structure_device_change" ? $("#load_calculation_form") : $("#specification_comparison_form");
                target.toggleClass("gi-hidden");
            }
        }

        renderBoxList();
    }

    setDataForm(dataFieldList, setItemList) {
        let $dataFieldList = $("#" + dataFieldList);
        let elements = $dataFieldList.find("[data-field]");
        let elementsList = [];
        let list = {};

        elements.map((i, item) => {
            let fieldId = $(item).data("field");
            for (let key in setItemList) {
                if (key === fieldId) {
                    let value = setItemList[key];
                    if (item.nodeName === "SPAN") {
                        $(item).text(value);
                    } else if (item.nodeName === "INPUT") {
                        let $input = $(item);
                        $input.val(value);

                        // setSelectOption/Com 으로 생성된 동적 셀렉트 박스 처리
                        let id = $input.attr("id");
                        const updateDisplay = () => {
                            let $selectDisplay = $("#" + id + "_select");
                            if ($selectDisplay.length > 0) {
                                let $dropDown = $selectDisplay.next(".slide-drop-down");
                                if ($dropDown.length > 0) {
                                    let selectText = "";
                                    $dropDown.find("li button").each(function () {
                                        if ($(this).val() == value) {
                                            selectText = $(this).text();
                                        }
                                    });
                                    if (selectText) {
                                        $selectDisplay.val(selectText);
                                        $(`label[for="${id}"]`).attr('data-focus-label', 'true');
                                        return true; // 성공
                                    }
                                }
                            }
                            return false;
                        };

                        // 1. 이미 드롭다운이 있는 경우 즉시 업데이트
                        if (!updateDisplay()) {
                            // 2. 드롭다운이 비동기로 생성될 수 있으므로 MutationObserver로 감시
                            const observer = new MutationObserver((mutations, obs) => {
                                if (updateDisplay()) {
                                    obs.disconnect(); // 성공하면 중단
                                }
                            });

                            const parent = $input.parent()[0];
                            if (parent) {
                                observer.observe(parent, { childList: true, subtree: true });
                                // 일정 시간이 지나도 안 나오면 포기 (메모리 누수 방지용)
                                setTimeout(() => observer.disconnect(), 5000);
                            }
                        }
                    }
                }
            }
        });
        commonTag.inputTagReset($("#" + dataFieldList + " input"));
    }

    getBirthYmdFromResidentRegistrationNumber(residentRegistrationNumber) {
        if (!residentRegistrationNumber || residentRegistrationNumber.toString().replaceAll('-', '').length != 13) {
            return '';
        }

        residentRegistrationNumber = residentRegistrationNumber.toString().replaceAll('-', '');

        const centuryIndicator = residentRegistrationNumber.charAt(6);
        let yearPrefix;
        if (['1', '2', '5', '6'].includes(centuryIndicator)) {
            yearPrefix = '19';
        } else if (['3', '4', '7', '8'].includes(centuryIndicator)) {
            yearPrefix = '20';
        } else {
            return '';
        }

        const year = yearPrefix + residentRegistrationNumber.slice(0, 2);
        const month = residentRegistrationNumber.slice(2, 4);
        const day = residentRegistrationNumber.slice(4, 6);

        return `${year}-${month}-${day}`;
    }
}

class Session {
    constructor() {

    }
    getItem(itemName) {
        if (formUtil.checkEmptyValue(sessionStorage.getItem(itemName))) {
            return JSON.parse(sessionStorage.getItem(itemName));
        } else {
            return false;
        }
    }
    setItem(itemName, cont) {
        let item = JSON.stringify(cont);
        sessionStorage.setItem(itemName, item);
    }

}

class Popup {
    dataList = "";
    constructor() {
        this.initialize();
    }
    initialize() {
        this.popupOpenIdBtnClickEvent();
        this.popupCloseBtnClickEvent();
        commonTag.inputTagFocus($(".gi-input"));
        commonTag.inputLabelTagFocus($(".gi-input").siblings("label"));
    }
    popupOpenIdBtnClickEvent() {
        let that = this;
        let tagAttribute = $("[gi-popup-open-id]");
        tagAttribute.on("click", function (e) {
            let popupId = $(e.target).attr("gi-popup-open-id");
            $("#" + popupId).attr("data-popup-open", true);
            that.popupSetData(popupId, that.dataList);
        })
    }
    popupSetData(formId, dataList) {
        this.dataList = dataList;
        let $dataFieldList = $("#" + formId);
        let elements = $dataFieldList.find("[data-field]");

        elements.map((i, item) => {
            let fieldId = $(item).data("field");
            for (let key in dataList) {
                if (key === fieldId) {
                    $("#" + formId + " input[data-field='" + fieldId + "']").val(dataList[key]);
                }
            }
        });
        commonTag.inputTagReset($("#" + formId + " input"));
    }
    popupCloseBtnClickEvent() {
        $(".gi-popup-close-btn").off("click.popupCloseBtnClickEventHandler").on("click.popupCloseBtnClickEventHandler", function (e) {
            popupCloseBtnClickEventHandler(e)
        });
        function popupCloseBtnClickEventHandler(e) {
            let $button = $(e.target);
            let $parent = $button.closest(".gi-popup");

            $parent.attr("data-popup-open", "false");

            //폼 필드 초기화
            $parent.find("input").not("[type='radio']").val("");
            $parent.find("select option:eq(0)").prop("selected", true);

            //라인 초기화
            let p = $parent.find("div[data-focus-line]");
            p.map((i, item) => {
                $(item).attr("data-focus-line", "true");
            });

            //라벨 초기화
            let k = $parent.find("label[data-focus-label]");
            k.map((i, item) => {
                $(item).attr("data-focus-label", "true");
            });

            //사이드 그리드 초기화
            let t = $($parent).find("div[data-side-grid-open]");
            t.map((i, item) => {
                $(item).attr("data-side-grid-open", "false");
                $(item).empty();
            });

            //input editing 리셋 설정
            let g = $($parent).find("div[data-input-editing]");
            if (g.length > 0) {
                g.each((i, item) => {
                    if ($(item).data("inputEditing") === "editing") {
                        $(item).attr("data-input-editing", "complete");
                        $(item).children("i").removeClass("fa-circle-check");
                        $(item).children("i").addClass("fa-pen");
                    }
                })
            }
        }
    }
    close(id) {
        let popupId = $("#" + id);
        popupId.attr("data-popup-open", "false");
        popupId.data("popupOpen", "false");
        //라인 초기화
        let p = popupId.find("div[data-focus-line]");
        p.map((i, item) => {
            $(item).attr("data-focus-line", "true");
        });

        //라벨 초기화
        let k = popupId.find("label[data-focus-label]");
        k.map((i, item) => {
            $(item).attr("data-focus-label", "true");
        });

        // 폼 필드 초기화
        popupId.find("input").not("[type='radio']").val("");
        popupId.find("select option:eq(0)").prop("selected", true);

        let t = $(popupId).find("div[data-side-grid-open]");
        t.map((i, item) => {
            $(item).attr("data-side-grid-open", "false");
            $(item).empty();
        });

    }
    open(id) {
        let popupId = $("#" + id);
        popupId.attr("data-popup-open", "true");
        popupId.data("popupOpen", "true");
    }
    getPopupList(popupIds) {
        let url = "/common/common/commonPopup/findCommonPopup"
        let param = {
            popup_ids: popupIds
        }

        axios.post(url, param).then(response => {
            let status = response.status;
            if (status === 200) {
                let list = response.data;
                if (formUtil.checkEmptyValue(list) && list.length > 0) {
                    sessionStorage.removeItem("recentPopupList");
                    sessionStorage.setItem("recentPopupList", JSON.stringify(list));
                }
            } else {
                formUtil.alertPopup("response status is :" + status);
            }
        }).catch(error => {
            formUtil.alertPopup(error);
        });
    }

    changePopupFrame(popupId) {
        let list = new Session().getItem("recentPopupList");
        if (formUtil.checkEmptyValue(list)) {
            $("#gi-search-popup").empty();

            let inputGroups = {};
            let popup_name = "";

            for (let i = 0; i < list.length; i++) {
                let item = list[i];
                if (item.popup_id === popupId) {
                    if (!inputGroups[item.popup_input_index]) {
                        inputGroups[item.popup_input_index] = {
                            popup_input_id: item.popup_input_id,
                            popup_label_name: item.popup_label_name,
                            popup_id: item.popup_id
                        };
                    }

                    if (popup_name.length === 0) {
                        popup_name = item.popup_name;
                    }
                }
            }

            let popupHtml =
                "<div class='gi-popup-body'>"
                + "<div class='gi-popup-header'>"
                + "<span>" + popup_name + "</span>"
                + "</div>"

                //      팝업내용 삽입 영역 시작
                + "<div class='gi-popup-contents'>"
                //      검색기능 영역 시작
                + "<div id='search-area' class='gi-col-35px gi-padding-left-right-20px gi-flex'>"
                + "<div class='gi-row-100 gi-flex'>";

            for (let idx in inputGroups) {
                let group = inputGroups[idx];
                popupHtml +=
                    //      검색설정 영역 시작(여기 input 개수 확인해서 추가로 넣어줘야 함
                    "<div class='gi-row-20 gi-margin-right-2'>"
                    + "<div class='gi-input-container gi-col-100 gi-input-container-box-shadow gi-flex gi-flex-center' data-focus-line='false'>"
                    + "<label for='" + group.popup_input_id + "' class='gi-input-label' data-focus-label='false' data-focus-label-text-align='center' data-required='false' >" + group.popup_label_name + "</label>"
                    + "<input class='gi-input gi-margin-1px' data-required='false' type='text' id='" + group.popup_input_id + "' name='" + group.popup_input_id + "' data-focus-input-text-align='center' autocomplete='off'/>"
                    + "</div>"
                    + "</div>"    //      검색설정 영역 끝
            }

            popupHtml +=
                //      초기화 버튼 영역 시작
                "<div class='gi-flex gi-row-15 gi-flex-align-items-center'>"
                + "<div class='gi-btn-section gi-col-100 gi-flex gi-flex-justify-content-space-evenly'>"
                + "<button id='reset-btn' class='gi-btn-reset gi-input-container-box-shadow' type='button' data-search-target='" + popupId + "'><i class='fa-solid fa-rotate-right gi-row-30px'></i>초기화</button>"
                + "</div>"
                + "</div>"    //      초기화 버튼 영역 끝

                //      조회 버튼 영역 시작
                + "<div class='gi-row-45 gi-flex gi-flex-align-items-center gi-flex-justify-content-flex-end'>"
                + "<div class='gi-btn-section gi-row-40 gi-col-100 gi-flex  gi-flex-justify-content-flex-end'>"
                + "<button id='search-btn' class='gi-btn-search gi-row-40px gi-input-container-box-shadow' type='button' data-search-target='" + popupId + "'>조회</button>"
                + "</div>"
                + "</div>"    //      조회 버튼 영역 끝
                + "</div>"        //      검색설정 영역 끝
                + "</div>"            //      검색기능 영역 끝

                // 타입에 따라 그리드/솔리드 타입 적용 필요
                + "<div class='gi-row-100 gi-col-90'>"
                + "<div id='gi-Grid'></div>"
                + "</div>"
                + "</div>"                //      팝업내용 삽입 영역 끝

                //      팝업 footer 영역 시작
                + "<div class='gi-popup-footer gi-scroll'>"
                + "<div class='gi-btn-section gi-row-30 gi-col-30px gi-padding-left-right-20px gi-flex gi-flex-justify-content-center gi-flex-align-items-center'>"
                + "<button id='gi-popup-close-btn' class='gi-popup-close-btn' type='button'>닫기</button>"
                + "</div>"
                + "</div>"                //      팝업 footer 영역 끝

                + "</div>";                   //      팝업 body 영역 끝

            $("#gi-search-popup").append(popupHtml);
            this.initialize();
        }
    }
}
class windowOnbeforeUnload {
    constructor() {
        this.isReloadConfirmed = false; // 새로고침 확인 여부
    }

    setResetEvent(param, type) {

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length > 0) {
                    let test = $(".license_plate_number_select");
                    if (test.length > 0) {
                        observer.disconnect();
                    }
                    let vehicleNumberArray = [];
                    $(".license_plate_number_select[data-field]").map((i, item) => {
                        vehicleNumberArray.push($(item).text());
                    });
                    param["vehicle_number_array"] = vehicleNumberArray;
                }
            });
        });

        // Observe the parent element of the slide-drop-down
        if (type === "manual") {
            observer.observe($("#manual_vehicle_number_layout")[0], { childList: true, subtree: true });
        } else if (type === "auto") {
            observer.observe($("#auto_vehicle_number_layout")[0], { childList: true, subtree: true });
        }



        let that = this;
        window.onbeforeunload = function (event) {
            const confirmationMessage = "Are you sure you want to leave this page? Changes you made may not be saved.";

            // 새로고침을 진행할지 취소할지 확인
            that.isReloadConfirmed = false; // 처음엔 확인이 안 된 상태

            // 사용자 확인 메시지 설정 (브라우저에 따라 무시될 수 있음)
            event.returnValue = confirmationMessage; // 표준 방식
            return confirmationMessage; // 일부 브라우저용
        };

        // 페이지가 언로드 될 때 실행될 코드
        window.addEventListener('unload', function () {
            if (that.isReloadConfirmed) {
                // 확인이 눌렸을 경우에만 서버 요청을 실행
                that.eventProcess(param);
            }
        });
    }

    eventProcess(param) {
        let url = "/licenseplate/master/licensePlateMaster/resetLicensePlateState";

        axios.post(url, param).then(response => {
            if (response.status === 200) {
            }
        }).catch(error => {
            formUtil.alertPopup(error + "");
        })
    }

    // 사용자가 새로고침을 확인했을 때만 요청을 보내도록 설정
    onUnloadConfirmed() {
        this.isReloadConfirmed = true;
    }
}
class giPrint {
    constructor() {

    }
    setPrint() {
        $('.print-btn').on('click', function (e) {

            var printContents = $('div[gi-print]').html();
            var originalContents = $('body').html();

            $('div[gi-print]').html(printContents);
            // $('body').html(printContents);
            window.print();
            // $('#'+printFormId).html(printContents);
            // $('body').html(originalContents);

            // 재적용이 필요한 스크립트가 있다면 이곳에서 재호출합니다.
            // location.reload();  // 페이지를 새로고침하여 초기 상태로 되돌립니다.
        });
    }
}