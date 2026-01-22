/**
 * @title : 입력 태그 포커스
 * @text : CommonTag Input Utility Functions (Focus, Reset, Disabled, CheckBox)
 * @value : true, false
 * @return : input line status event and label status event
 * @see : .gi-input-container[data-focus-line="false"]::after, .gi-input-container[data-focus-line="true"]::after
 * @writer : 이경태
 */
CommonTag.prototype.inputTagFocus = function (input) {
    input.map((i, item) => {
        if ("checkbox" === item.type) {
            $(item).off("click.giInputCheckBoxHandlerEvent").on("click.giInputCheckBoxHandlerEvent", giInputCheckBoxHandlerEvent);
        }
        if ("radio" === item.type) {
            let dataFields = $(item).data("field");
            if (dataFields.length > 1) {
                if ($(item).is(":checked")) {
                    $(item).attr("data-required", true);
                } else {
                    $(item).attr("data-required", false);
                }
            }
        }
    })

    input.off("focus.giInputFocusHandlerEvent").on("focus.giInputFocusHandlerEvent", giInputFocusHandlerEvent);
    input.off("blur.giInputBlurHandlerEvent").on("blur.giInputBlurHandlerEvent", giInputBlurHandlerEvent);
    input.off("change.giInputChangeHandlerEvent").on("change.giInputChangeHandlerEvent", giInputChangeHandlerEvent);


    function giInputFocusHandlerEvent(e) {
        if ("radio" !== this.type && "checkbox" !== this.type) {
            let flag = $(this).parent(".gi-input-container").data("focusLine");
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
    }
    function giInputChangeHandlerEvent(e) {
        if ("radio" !== this.type && "checkbox" !== this.type) {
            if (!formUtil.checkEmptyValue(e.target.value)) {
                $(this).parent().attr('data-focus-line', false);
                $(this).parent().children("label").attr('data-focus-label', false);
            } else {
                $(this).parent().attr('data-focus-line', false);
                $(this).parent().children("label").attr('data-focus-label', true);
            }
        } else {
            let volumeName = e.target.name;
            let volume = "";

            volume = $("[data-field=" + volumeName + "]");
            if (volume.length > 1) {
                volume.map((i, item) => {
                    $(item).attr("data-required", false);
                })

                $(e.target).attr("data-required", true);
            }

        }
    }
    function giInputBlurHandlerEvent(e) {
        if ("radio" !== this.type && "checkbox" !== this.type) {
            if (!formUtil.checkEmptyValue(e.target.value)) {
                $(this).parent().attr('data-focus-line', false);
                $(this).parent().children("label").attr('data-focus-label', false);
            } else {
                $(this).parent().attr('data-focus-line', false);
                $(this).parent().children("label").attr('data-focus-label', true);
            }
        }
    }
    function giInputCheckBoxHandlerEvent(e) {
        $(this).is(":checked") ? $(this).val("1") : $(this).val("0");
    }

}
/**
 * @title : 입력 태그 라벨 포커스
 * @writer : 이경태
 */
CommonTag.prototype.inputLabelTagFocus = function (label) {
    label.on("click", function (e) {
        let inputId = $(this).attr("for");
        if (!inputId) return;

        // 브라우저 기본 동작(for 대상 클릭) 방지
        e.preventDefault();

        let $target = $("#" + inputId);
        let $surrogate = $("#" + inputId + "_select");

        // 셀렉트박스로 변환된 경우 대용 태그를 기본 타겟으로 설정
        let $actualTarget = $surrogate.length > 0 ? $surrogate : $target;

        if ($actualTarget.length === 0) return;

        let disabledFlag = $actualTarget.attr("data-disabled");
        let isDisabled = $actualTarget.prop("disabled") || (disabledFlag !== undefined && disabledFlag !== "false" && disabledFlag !== "undefined");

        if (!isDisabled) {
            let inputType = $actualTarget.attr("type");

            if ("radio" === inputType) {
                if (!$actualTarget.prop("checked")) {
                    $actualTarget.prop("checked", true).trigger("change");
                }
                $actualTarget.focus();
            } else if ("checkbox" === inputType) {
                // 체크박스 토글
                $actualTarget.prop("checked", !$actualTarget.prop("checked")).trigger("change");
                $actualTarget.focus();
            } else {
                $actualTarget.focus();
                // 셀렉트박스 대용 태그인 경우나 클릭 이벤트가 필요한 경우 트리거
                $actualTarget.trigger("click");
            }
        }
    });

    function giInputBlurHandlerEvent(e) {
        $(this).parent().attr('data-focus-line', false);
        if (!formUtil.checkEmptyValue($(this).val())) {
            $(this).parent().children("label").attr('data-focus-label', false);
        }
    }
    function giInputFocusHandlerEvent(e) {
        if ("radio" !== this.type && "checkbox" !== this.type) {
            let flag = $(this).parent(".gi-input-container").data("focusLine");
            if (!flag) {
                $(this).parent().attr('data-focus-line', true);
                $(this).parent().children("label").attr('data-focus-label', true);
            } else {
            }
        }
    }
}
/**
 * @title : 입력 태그 초기화
 * @value : form tag contain input
 * @return : input status
 * @see : .gi-input-container[data-focus-line="false"]::after, .gi-input-container[data-focus-line="true"]::after
 * @writer : 이경태
 */
CommonTag.prototype.inputTagReset = function (input) {

    input.map((i, e) => {
        if ("radio" === e.type || "checkbox" === e.type) {

        } else {
            if (formUtil.checkEmptyValue($(e).val())) {
                $(e).parent().attr('data-focus-line', false);
                $(e).parent().children("label").attr('data-focus-label', true);
            } else {
                $(e).parent().attr('data-focus-line', false);
                $(e).parent().children("label").attr('data-focus-label', false);
            }
        }
    });
}

/**
 * @title : 입력 태그 비활성화
 * @writer : 문상혁
 */
CommonTag.prototype.tagDisabled = function (disabled, tagIdArray) {
    disabled = !formUtil.checkEmptyValue(disabled) ? true : disabled;

    if (disabled) {
        if (formUtil.checkEmptyValue(tagIdArray)) {
            for (let i = 0; i < tagIdArray.length; i++) {
                let target = $('#' + tagIdArray[i]);
                target
                    .attr('disabled', true);

                if (target.is('input') || target.is('span')) {
                    target
                        .css('color', '#888888')
                        .closest('.gi-input-container').css('background-color', '#f5f5f5');
                } else if (target.is('button')) {
                    target
                        .addClass('formUtil-btn-disabled')
                        .parent().siblings().css('background-color', '#f5f5f5');
                }
            }
        } else {
            $('[data-disabled]').each(function () {
                $(this).attr('disabled', true);

                if ($(this).is('input') || $(this).is('span')) {
                    $(this)
                        .css('color', '#888888')
                        .closest('.gi-input-container').css('background-color', '#f5f5f5');
                } else if ($(this).is('button')) {
                    $(this)
                        .addClass('formUtil-btn-disabled')
                        .parent().siblings().css('background-color', '#f5f5f5');
                }
            });
        }
    } else {
        if (formUtil.checkEmptyValue(tagIdArray)) {
            // 특정 태그만 disabled 해제
            for (let i = 0; i < tagIdArray.length; i++) {
                let target = $('#' + tagIdArray[i]);
                target
                    .attr('disabled', false)
                    .removeAttr('data-disabled');

                if (target.is('input') || target.is('span')) {
                    target
                        .css('color', '#000000')
                        .closest('.gi-input-container').css('background-color', '#ffffff');
                } else if (target.is('button')) {
                    target
                        .removeClass('formUtil-btn-disabled')
                        .parent().siblings().css('background-color', '#ffffff')
                }
            }
        } else {
            $('[data-disabled]').each(function () {
                $(this)
                    .attr('disabled', false)
                    .removeAttr('data-disabled');

                if ($(this).is('input') || $(this).is('span')) {
                    $(this)
                        .css('color', '#000000')
                        .closest('.gi-input-container').css('background-color', '#ffffff');
                } else if ($(this).is('button')) {
                    $(this)
                        .removeClass('formUtil-btn-disabled')
                        .parent().siblings().css('background-color', '#ffffff');
                }
            });
        }
    }
}

/**
 * @title : 체크박스 초기값 설정
 * @see : input[type="checkBox"]
 * @text : input type = checkBox의 초기값 셋팅
 * @writer : 이경태
 */
class inputTypeCheckBoxInitSetting {
    constructor() {
        this.init();
    }
    init() {
        let checkBoxs = $("input[type=checkbox]");
        checkBoxs.map((i, item) => {
            let id = $("#" + item.id);
            let isChecked = id.is(":checked");
            isChecked ? id.val(1) : id.val(0);

            id.off("change").on("change", function () {
                isChecked = id.is(":checked");
                isChecked ? id.val(1) : id.val(0);
            })
        })
    }
}

/**
 * @title : 입력 태그 수정 아이콘 설정
 * @value : default = undefined || input tag id
 * @text : data-disabled 설정 후 gi-input-update-tag-icon를 사용 하여 disabled를 해제 시킨다.
 * @writer : 이경태
 */
CommonTag.prototype.inputDisabledUpdateAble = function (tag) {
    if (formUtil.checkEmptyValue(tag)) {
        let inputContainer = $("#" + tag).parent(".gi-input-container");
        let html = "<div class='gi-input-update-tag-icon' data-input-editing='complete'><i class='fa-solid fa-pen'></i></div>";
        if (inputContainer.find(".gi-input-update-tag-icon").length > 0) {
        } else {
            $(inputContainer).append(html);
            $(".gi-input-update-tag-icon").off("click.updateAbleClickEventHandler").on("click.updateAbleClickEventHandler", function (e) {
                updateAbleClickEventHandler(e);
            })
        }
    } else {
        $(".gi-input[data-disabled-update-able]").map((i, item) => {
            let flag = $(item.attributes).filter(function () {
                return $(this)[0].name === "data-disabled";
            }).length > 0;
            if (flag) {
                let inputContainer = $(item).parent(".gi-input-container");
                let html = "<div class='gi-input-update-tag-icon' data-input-editing='complete'><i class='fa-solid fa-pen'></i></div>";
                if (inputContainer.find(".gi-input-update-tag-icon").length > 0) {
                } else {
                    $(inputContainer).append(html);
                    $(".gi-input-update-tag-icon").off("click.updateAbleClickEventHandler").on("click.updateAbleClickEventHandler", function (e) {
                        updateAbleClickEventHandler(e);
                    })
                }
            } else {
                formUtil.showMessage(Message.Label.Array["FAIL.NOT.EXIST.DISABLED"]);
            }

        })
    }
    function updateAbleClickEventHandler(e) {
        let target = e.currentTarget;
        let iconTag = $(target).children("i")
        let targetInputId = $(target).parent(".gi-input-container").children(".gi-input")[0].id;
        if ($(target).attr("data-input-editing") === "complete") {
            $(iconTag).removeClass("fa-pen");
            $(iconTag).addClass("fa-circle-check");
            $(target).attr("data-input-editing", "editing");
            commonTag.tagDisabled(false, [targetInputId]);
        } else if ($(target).attr("data-input-editing") === "editing") {
            $(iconTag).removeClass("fa-circle-check");
            $(iconTag).addClass("fa-pen");
            $(target).attr("data-input-editing", "complete");
            commonTag.tagDisabled(true, [targetInputId]);
        }
    }
}
