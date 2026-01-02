/**
 * @title : PopupUtils
 * @text : 팝업 및 알림 관련 함수 모음
 */

// @title : validation Check alertPopup
// @message : validation check message parameter (String)
// @writer: 이경태
FormUtility.prototype.alertPopup = function (message) {
    let messageBox =
        '<div class="gi-popup-body">' +
        '<div class="gi-popup slide-in-blurred-top">' +
        '<div class="gi-popup-title-box">' +
        '<span class="gi-popup-title">알림</span>' +
        '</div>' +
        '<div class="gi-popup-message-box">' +
        '<span class="gi-popup-message">' + message + '</span>' +
        '</div>' +
        '<div class="gi-popup-button-box">' +
        '<button class="gi-popup-button" onclick="$(\'.gi-popup-body\').remove()">확인</button>' +
        '</div>' +
        '</div>' +
        '</div>';
    $("body").append(messageBox);
    $(".gi-popup-button").focus();
}

// JS 에서 사용하는 confirm과 기능은 같으나 비동기적으로 동작.
// @async
// @function confirm
// @param {string} message 출력할 메시지
// @returns {Promise<Boolean>} 확인을 누른 경우에는 true / 취소를 누른 경우에는 false
// @writer: 이진주
FormUtility.prototype.confirm = function (message) {
    return new Promise(function (resolve) {
        let messageBox =
            '<div class="gi-popup-body">' +
            '<div class="gi-popup slide-in-blurred-top">' +
            '<div class="gi-popup-title-box">' +
            '<span class="gi-popup-title">알림</span>' +
            '</div>' +
            '<div class="gi-popup-message-box">' +
            '<span class="gi-popup-message">' + message + '</span>' +
            '</div>' +
            '<div class="gi-popup-button-box">' +
            '<button class="gi-popup-button gi-popup-confirm" id="confirm-ok">확인</button>' +
            '<button class="gi-popup-button gi-popup-cancel" id="confirm-cancel">취소</button>' +
            '</div>' +
            '</div>' +
            '</div>';
        $("body").append(messageBox);
        $("#confirm-ok").focus();

        $("#confirm-ok").on("click", function () {
            $(".gi-popup-body").remove();
            resolve(true);
        });

        $("#confirm-cancel").on("click", function () {
            $(".gi-popup-body").remove();
            resolve(false);
        });
    });
}

// @title : popup
// @message : 팝업에 출력될 메세지 [String]
// @btnId : 확인 버튼 click event를 위한 아이디 부여 [String]
// @func : 확인 버튼 click event function [function]
// @funcParam : func 함수에 전달될 Parameters ex)func(funcParam)
// @text : 팝업창
// @writer: 이경태
FormUtility.prototype.popup = function (btnId, message, func, funcParam) {
    let messageBox =
        '<div class="gi-popup-body">' +
        '<div class="gi-popup slide-in-blurred-top">' +
        '<div class="gi-popup-title-box">' +
        '<span class="gi-popup-title">알림</span>' +
        '</div>' +
        '<div class="gi-popup-message-box">' +
        '<span class="gi-popup-message">' + message + '</span>' +
        '</div>' +
        '<div class="gi-popup-button-box">' +
        '<button id=' + btnId + ' class="gi-popup-button">확인</button>' +
        '<button id="popup_cancel_btn" class="gi-popup-button" >취소</button>' +
        '</div>' +
        '</div>' +
        '</div>';
    $("body").append(messageBox);
    $("#" + btnId).focus();

    $("#popup_cancel_btn").off("click").on("click", function () {
        $(".gi-popup-body").remove();
        return false;
    })
    $("#" + btnId).off("click").on("click", function () {
        $(".gi-popup-body").remove();
        func(funcParam);
    })
}

// @title : popup
// @message : 팝업에 출력될 메세지 [String]
// @btnId : 확인 버튼 click event를 위한 아이디 부여 [String]
// @popupTitle : popup의 title [String]
// @func : 확인 버튼 click event function [function]
// @funcParam : func 함수에 전달될 Parameters ex)func(funcParam)
// @text : 팝업창
// @writer: 이경태
FormUtility.prototype.popupInput = function (btnId, popupInputId, message, inputLabel, func, funcParam) {
    let messageBox =
        '<div class="gi-popup-body">' +
        '<div class="gi-popup slide-in-blurred-top">' +
        '<div class="gi-popup-title-box">' +
        '<span class="gi-popup-title">알림</span>' +
        '</div>' +
        '<div class="gi-popup-message-box">' +
        '<span class="gi-popup-message">' + message + '</span>' +
        '<div class="gi-input-container gi-margin-top-10px">' +
        '<label for="' + popupInputId + '" class="gi-input-label" data-focus-label="false" data-focus-label-text-align="default" data-required="false">' + inputLabel + '</label>' +
        '<input type="text" class="gi-input" data-focus-span-text-align="center" id="' + popupInputId + '" name="' + popupInputId + '" autocomplete="off" />' +
        '</div>' +
        '</div>' +
        '<div class="gi-popup-button-box">' +
        '<button id=' + btnId + ' class="gi-popup-button">확인</button>' +
        '<button id="popup_cancel_btn" class="gi-popup-button" >취소</button>' +
        '</div>' +
        '</div>' +
        '</div>';
    $("body").append(messageBox);
    commonTag.inputTagReset($(".gi-popup-body .gi-input"));
    $("#" + popupInputId).focus();

    $("#popup_cancel_btn").off("click").on("click", function () {
        $(".gi-popup-body").remove();
        return false;
    })
    $("#" + btnId).off("click").on("click", function () {
        if (formUtil.checkEmptyValue($("#" + popupInputId).val())) {
            $(".gi-popup-body").remove();
            funcParam[popupInputId] = $("#" + popupInputId).val();
            func(funcParam);
        } else {
            formUtil.alertPopup("값을 입력해주세요");
            return false;
        }
    })
}

// @title : popup - radio 선택
// @btnId : 확인 버튼 click event를 위한 아이디 부여 [String]
// @popupInputId : radio data-field값 [String]
// @message : 팝업에 출력될 메세지 [String]
// @radioOptions : 라디오버튼 밸류와 라벨 [value, label]
// @func : 확인 버튼 click event function [function]
// @funcParam : func 함수에 전달될 Parameters ex)func(funcParam)
// @writer: 배수연
FormUtility.prototype.popupRadio = function (btnId, popupInputId, message, radioOptions, func, funcParam) {
    let radioHtml = "";
    radioOptions.forEach((option, index) => {
        let isChecked = index === 0 ? "checked" : "";
        radioHtml += `
            <div class="gi-radio-container">
            <input type="radio" id="${popupInputId}_${index}" name="${popupInputId}" value="${option.value}" class="gi-radio" ${isChecked}>
            <label for="${popupInputId}_${index}" class="gi-radio-label">${option.label}</label>
            </div>
            `;
    });

    let messageBox =
        '<div class="gi-popup-body">' +
        '<div class="gi-popup slide-in-blurred-top">' +
        '<div class="gi-popup-title-box">' +
        '<span class="gi-popup-title">알림</span>' +
        '</div>' +
        '<div class="gi-popup-message-box">' +
        '<span class="gi-popup-message">' + message + '</span>' +
        '<div class="gi-radio-group gi-margin-top-10px">' +
        radioHtml +
        '</div>' +
        '</div>' +
        '<div class="gi-popup-button-box">' +
        '<button id="' + btnId + '" class="gi-popup-button">확인</button>' +
        '<button id="popup_cancel_btn" class="gi-popup-button">취소</button>' +
        '</div>' +
        '</div>' +
        '</div>';

    $("body").append(messageBox);
    $("#" + btnId).focus();

    $("#popup_cancel_btn").off("click").on("click", function () {
        $(".gi-popup-body").remove();
        return false;
    });

    $("#" + btnId).off("click").on("click", function () {
        let selectedValue = $("input[name='" + popupInputId + "']:checked").val();
        if (selectedValue) {
            $(".gi-popup-body").remove();
            funcParam[popupInputId] = selectedValue;
            func(funcParam);
        } else {
            formUtil.alertPopup("항목을 선택해주세요");
            return false;
        }
    });
}

// JS 에서 사용하는 prompt와 기능은 같으나 비동기적으로 동작.
// @async
// @function prompt
// @param {string} message 출력할 메시지
// @returns {Promise<Object>} 사용자가 입력한 문자열. 사용자가 취소를 누른 경우에는 null
// @writer: 이진주
FormUtility.prototype.prompt = function (message, maxlength) {
    return new Promise(function (resolve) {
        let messageBox =
            '<div class="gi-popup-body">' +
            '<div class="gi-popup slide-in-blurred-top">' +
            '<div class="gi-popup-title-box">' +
            '<span class="gi-popup-title">알림</span>' +
            '</div>' +
            '<div class="gi-popup-message-box">' +
            '<span class="gi-popup-message">' + message + '</span>' +
            '<div class="gi-input-container gi-margin-top-10px">' +
            '<input type="text" class="gi-input" data-focus-span-text-align="center" id="prompt-input" autocomplete="off" maxlength="' + maxlength + '"/>' +
            '</div>' +
            '</div>' +
            '<div class="gi-popup-button-box">' +
            '<button class="gi-popup-button gi-popup-confirm" id="prompt-ok">확인</button>' +
            '<button class="gi-popup-button gi-popup-cancel" id="prompt-cancel">취소</button>' +
            '</div>' +
            '</div>' +
            '</div>';
        $("body").append(messageBox);
        $("#prompt-input").focus();

        $("#prompt-ok").on("click", function () {
            let input = $("#prompt-input").val();
            $(".gi-popup-body").remove();
            resolve(input);
        });

        $("#prompt-cancel").on("click", function () {
            $(".gi-popup-body").remove();
            resolve(null);
        });

        $("#prompt-input").on("keydown", function (e) {
            if (e.key === 'Enter') {
                let input = $("#prompt-input").val();
                $(".gi-popup-body").remove();
                resolve(input);
            }
        });
    });
}

/**
 * @title : showMessage
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
