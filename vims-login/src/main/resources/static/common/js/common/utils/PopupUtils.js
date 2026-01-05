/**
 * @title : 알림 팝업
 * @message : validation check message parameter (String)
 * @writer: 이경태
 */
FormUtility.prototype.alertPopup = function (message) {
    if (formUtil.checkEmptyValue(message)) {
        message = message + "";
        if (message.includes('\n')) {
            message = message.replaceAll('\n', '</br>');
        }
    } else {
        message = "메세지가 없습니다.";
    }

    let initAlertPopupDiv = '<div id="alertPopup">'
        + '<div class="alertPopup_content">'
        + '<div class="alertPopup_text">'
        + '<span>' + message + '</span>'
        + '</div>'
        + '<div class="gi-padding-10px">'
        + '<button type="button" class="gi-btn gi-col-30px subbtn alertPopup_success_btn">확인</button>'
        + '</div>'
        + '</div>'
        + '</div>';

    $(".alertPopupBody").html(initAlertPopupDiv);

    $(".alertPopup_success_btn").click(function () {
        $(this).closest("#alertPopup").remove();
    })
}

/**
 * @title : 확인 취소 팝업 (confirm)
 * @text : JS 에서 사용하는 confirm과 기능은 같으나 비동기적으로 동작.
 * @async
 * @param {string} message 출력할 메세지
 * @returns {Promise<Boolean>} 확인을 누른 경우에는 true / 취소를 누른 경우에는 false
 * @writer: 이진주
 */
FormUtility.prototype.confirm = async function (message) {
    return new Promise((resolve, reject) => {
        const key = Date.now();
        const popupHtml = `
            <div id="confirm_${key}" class="prompt">
                <div class="popup_content">
                    <div class="popup_text">
                        <span> ${message} </span>
                    </div>
                    <div class="gi-btn-section gi-row-30 gi-col-40px gi-padding-left-right-20px gi-flex gi-flex-justify-content-center gi-flex-align-items-center">
                        <button type="button" class="gi-btn-blue popup_success_btn">확인</button>
                        <button type="button" class="gi-btn popup_cancel_btn">취소</button>
                    </div>
                </div>
            </div>
        `;

        $(".PopupBody").empty();
        $(".PopupBody").append(popupHtml);

        $(`#confirm_${key} .popup_success_btn`).click(function () {
            $(`#confirm_${key}`).remove();
            resolve(true);
        });

        $(`#confirm_${key} .popup_cancel_btn`).click(function () {
            $(`#confirm_${key}`).remove();
            resolve(false);
        });
    });
}

/**
 * @title : 확인 취소 팝업
 * @message : 팝업에 출력될 메세지 [String]
 * @btnId : 확인 버튼 click event를 위한 아이디 부여 [String]
 * @func : 확인 버튼 click event function [function]
 * @funcParam : func 함수에 전달될 Parameters ex)func(funcParam)
 * @text : 팝업창
 * @writer: 이경태
 */
FormUtility.prototype.popup = function (btnId, message, func, funcParam) {
    let Popup = '<div id="popup">'
        + '<div class="popup_content">'
        + '<div class="popup_text">'
        + '<span>' + message + '</span>'
        + '</div>'
        + '<div class="gi-btn-section gi-row-30 gi-col-30px gi-padding-left-right-20px gi-flex gi-flex-justify-content-center gi-flex-align-items-center">'
        + '<button type="button" id="' + btnId + '"' + ' class="gi-btn-blue popup_success_btn">확인</button>'
        + '<button type="button" class="gi-btn  popup_cancel_btn">취소</button>'
        + '</div>'
        + '</div>'
        + '</div>';

    if (!(formUtil.checkEmptyValue(btnId) && formUtil.checkEmptyValue(func))) {
        formUtil.alertPopup(Message.Label.Array["FAIL.FUNCTION.POPUP"]);
    } else {
        $(".PopupBody").append(Popup);

        $(".popup_cancel_btn").click(function () {
            $(this).closest("#popup").remove();
        })

        $("#" + btnId).click(function () {
            if (funcParam !== undefined) {
                if (Array.isArray(funcParam)) {
                    func.call(null, funcParam);
                } else {
                    func.call(null, funcParam);
                }
                $(this).closest("#popup").remove();
            } else {
                func();
                $(this).closest("#popup").remove();
            }
        });
    }
}

/**
 * @title : 입력 팝업
 * @message : 팝업에 출력될 메세지 [String]
 * @btnId : 확인 버튼 click event를 위한 아이디 부여 [String]
 * @popupInputId : popup의 input id [String]
 * @inputLabel : input의 label [String]
 * @func : 확인 버튼 click event function [function]
 * @funcParam : func 함수에 전달될 Parameters ex)func(funcParam)
 * @text : 팝업창
 * @writer: 이경태
 */
FormUtility.prototype.popupInput = function (btnId, popupInputId, message, inputLabel, func, funcParam) {
    let Popup = '<div id="popup">'
        + '<div class="popup_content">'
        + '<div class="popup_text">'
        + '<span>' + message + '</span>'
        + '</div>'
        + '<div class="gi-row-100 gi-col-50">'
        + '<div class="gi-row-100 gi-input-container gi-flex gi-flex-center ">'
        + '<label for="popup_input" class="gi-input-label" data-focus-label="false" data-focus-label-text-align="center" data-required="true">' + inputLabel + '</label>'
        + '<input data-field="popup_input" id="popup_input" name="popup_input" class="gi-input" data-focus-input-text-align="center" data-required="true" autoComplete="off"/>'
        + '</div>'
        + '</div>'
        + '<div class="gi-btn-section gi-row-30 gi-col-40px gi-padding-left-right-20px gi-flex gi-flex-justify-content-center gi-flex-align-items-center">'
        + '<button type="button" id="' + btnId + '"' + ' class="gi-btn-blue popup_success_btn">확인</button>'
        + '<button type="button" class="gi-btn  popup_cancel_btn">취소</button>'
        + '</div>'
        + '</div>'
        + '</div>';

    if (!(formUtil.checkEmptyValue(btnId) && formUtil.checkEmptyValue(func))) {
        formUtil.alertPopup(Message.Label.Array["FAIL.FUNCTION.POPUP"]);
    } else {
        $(".PopupBody").append(Popup);
        commonTag.inputTagFocus($("#popup_input"));

        $(".popup_cancel_btn").click(function () {
            $(this).closest("#popup").remove();
        })

        $("#" + btnId).click(function () {
            if (funcParam !== undefined) {
                funcParam[popupInputId] = $("#popup_input").val();
                let MESSAGE = message;
                let validation = [];
                validation.formId = "popup";
                validation[0] = { id: "popup_input", message: MESSAGE };

                if (formUtil.validationCheck(validation)) {
                    if (Array.isArray(funcParam)) {
                        func.apply(null, funcParam);
                    } else {
                        func.call(null, funcParam);
                    }
                    $(this).closest("#popup").remove();
                } else {
                    return false;
                }
            } else {
                func();
                $(this).closest("#popup").remove();
            }
        })
    }
}

/**
 * @title : popup - radio 선택
 * @btnId : 확인 버튼 click event를 위한 아이디 부여 [String]
 * @popupInputId : radio data-field값 [String]
 * @message : 팝업에 출력될 메세지 [String]
 * @radioOptions : 라디오버튼 밸류와 라벨 [value, label]
 * @func : 확인 버튼 click event function [function]
 * @funcParam : func 함수에 전달될 Parameters ex)func(funcParam)
 * @writer: 배수연
 */
FormUtility.prototype.popupRadio = function (btnId, popupInputId, message, radioOptions, func, funcParam) {
    let Popup = '<div id="popup">'
        + '<div class="popup_content">'
        + '<div class="popup_text">'
        + '<span>' + message + '</span>'
        + '</div>'
        + '<div class="gi-row-100 gi-col-50">';

    Popup += '<div class="gi-row-100 gi-col-100 gi-flex">';

    radioOptions.forEach(function (option, index) {
        Popup += '<div class="gi-row-100 gi-input-container gi-flex gi-flex-center">'
            + '<input data-field="' + popupInputId + '" type="radio" id="' + popupInputId + index + '" name="' + popupInputId + '" class="gi-input" data-focus-span-text-align="center" data-required="true" value="' + option.value + '">'
            + '<label for="' + popupInputId + index + '" class="gi-input-radio-label" data-focus-label="true" data-focus-label-text-align="default">' + option.label + '</label>'
            + '</div>';
    });

    Popup += '</div>';

    Popup += '</div>'
        + '<div class="gi-btn-section gi-row-30 gi-col-40px gi-padding-left-right-20px gi-flex gi-flex-justify-content-center gi-flex-align-items-center">'
        + '<button type="button" id="' + btnId + '" class="gi-btn-blue popup_success_btn">확인</button>'
        + '<button type="button" class="gi-btn popup_cancel_btn">취소</button>'
        + '</div>'
        + '</div>'
        + '</div>';

    if (!(formUtil.checkEmptyValue(btnId) && formUtil.checkEmptyValue(func))) {
        formUtil.alertPopup(Message.Label.Array["FAIL.FUNCTION.POPUP"]);
    } else {
        $(".PopupBody").append(Popup);

        $(".popup_cancel_btn").click(function () {
            $(this).closest("#popup").remove();
        });

        $("#" + btnId).click(function () {
            // 선택된 radio 버튼의 값을 가져오기
            let selectedValue = $("input[name='" + popupInputId + "']:checked").val();

            if (!selectedValue) {
                formUtil.alertPopup('입력 값이 없습니다.');
                return false;
            }

            if (funcParam !== undefined) {
                funcParam[popupInputId] = selectedValue;

                let messageId = popupInputId.toUpperCase();
                let message = Message.Label.Array["COMPLETE.INSERT"];
                let validation = [];
                validation.formId = "popup";
                validation[0] = { id: "popup_radio", message: message };

                if (formUtil.validationCheck(validation)) {
                    if (Array.isArray(funcParam)) {
                        func.apply(null, funcParam);
                    } else {
                        func.call(null, funcParam);
                    }
                    $(this).closest("#popup").remove();
                } else {
                    return false;
                }
            } else {
                func();
                $(this).closest("#popup").remove();
            }
        });
    }
};

/**
 * @title : 프롬프트 입력 (비동기)
 * JS 에서 사용하는 prompt와 기능은 같으나 비동기적으로 동작.
 * @async
 * @function prompt
 * @param {string} message 출력할 메세지
 * @returns {Promise<Object>} 사용자가 입력한 문자열. 사용자가 취소를 누른 경우에는 null
 * @writer: 이진주
 */
FormUtility.prototype.prompt = async function (message, maxlength) {
    return new Promise((resolve, reject) => {
        const key = Date.now();
        const popupHtml = `
            <div id="prompt_${key}" class="prompt">
                <div class="popup_content">
                    <div class="popup_text">
                        <span>${message}</span>
                    </div>
                    <div class="gi-row-100 gi-col-50">
                        <div class="gi-row-100 gi-input-container gi-flex gi-flex-center ">
                            <label for="popup_input" class="gi-input-label" data-focus-label="false" data-focus-label-text-align="center" data-required="true">입력 값</label>
                            <input data-field="popup_input" id="popup_input" name="popup_input" class="gi-input popup_input" data-focus-input-text-align="center" data-required="true" autoComplete="off" 
                                ${maxlength ? `gi-maxlength="${maxlength}"` : ""}  
                            />
                        </div>
                    </div>
                    <div class="gi-btn-section gi-row-30 gi-col-40px gi-padding-left-right-20px gi-flex gi-flex-justify-content-center gi-flex-align-items-center">
                        <button type="button" class="gi-btn-blue popup_success_btn">확인</button>
                        <button type="button" class="gi-btn popup_cancel_btn">취소</button>
                    </div>
                </div>
            </div>
        `;

        $(".PopupBody").append(popupHtml);
        commonTag.inputTagFocus($("#popup_input"));
        if (maxlength) new GiMaxLengthCheck();

        $(`#prompt_${key} .popup_success_btn`).click(function () {
            const inputValue = $(`#prompt_${key} .popup_input`).val();

            if (!inputValue) {
                formUtil.alertPopup('입력 값이 없습니다.');
                return;
            }

            $(`#prompt_${key}`).remove();
            return resolve(inputValue);
        });

        $(`#prompt_${key} .popup_cancel_btn`).click(function () {
            $(`#prompt_${key}`).remove();
            resolve(null);
        });
    });
}

/**
 * @title : 메세지 보기 (자동 사라짐)
 * @mgs : 출력 메세지 [String]
 * @text : 메세지가 나타났다가 자동으로 사라지는 기능
 * @writer : 이경태
 * */
FormUtility.prototype.showMessage = function (msg) {
    let thisData = $(".showMessage");
    let message = msg;
    let html = "<div class='formUtil-showMessageBox'>"
        + "<div class='showMessageText'>" + message + "</div>"
        + "</div>";

    if (thisData.children().length === 0) {
        let sec = 2000;
        let millsec = sec / 1000;

        thisData.append(html);
        thisData.children().css("animation", "fadeout " + millsec + "s");

        setTimeout(function () {
            thisData.children().remove();
        }, sec);
    }
}

/**
 * @title : 토스트 메세지
 * @msg : 출력 메세지 [String]
 * @type : 메세지 타입 ('info', 'success', 'error', 'warning') [String]
 * @duration : 지속 시간 (ms) [Number]
 * @writer : 이경태
 */
FormUtility.prototype.toast = function (msg, type = 'info', duration = 3000) {
    let container = $("#gi-toast-container");
    if (container.length === 0) {
        $("body").append('<div id="gi-toast-container"></div>');
        container = $("#gi-toast-container");
    }

    let toastId = 'toast-' + Date.now();
    let typeClass = type || 'info';

    let html = `<div id="${toastId}" class="gi-toast-message ${typeClass}">
                    <span>${msg}</span>
                </div>`;

    let $toast = $(html);
    container.append($toast);

    setTimeout(() => {
        $toast.css('animation', 'toast-fade-out 0.4s forwards');
        $toast.one('animationend', function () {
            $(this).remove();
            if (container.children().length === 0) {
                container.remove();
            }
        });
    }, duration);
};
