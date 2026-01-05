/**
 * @title : 키패드 기능 설정
 * @targetId : 숫자가 입력될 태그 아이디
 * @id : 키패드 아이디 ,아이다가 false 이면 기본 key_pad 로 설정
 * @setMaxLength(int) : 최대입력 값 설정
 * @text : 키패드 설정 태그
 * @writer : 이경태
 * */
FormUtility.prototype.giKeyPad = function (id) {

    var maxLength;
    var setValuetargetId
    let keyPadId = "";
    if (formUtil.checkEmptyValue(id)) {
        keyPadId = id;
    } else {
        keyPadId = "key_pad";
    }
    let padHtml = '<div class="key_pad">' +
        '                            <div class="key_pad-number" data-key-pad-value="7"><span>7</span></div>' +
        '                            <div class="key_pad-number" data-key-pad-value="8"><span>8</span></div>' +
        '                            <div class="key_pad-number" data-key-pad-value="9"><span>9</span></div>' +
        '                            <div class="key_pad-number" data-key-pad-value="4"><span>4</span></div>' +
        '                            <div class="key_pad-number" data-key-pad-value="5"><span>5</span></div>' +
        '                            <div class="key_pad-number" data-key-pad-value="6"><span>6</span></div>' +
        '                            <div class="key_pad-number" data-key-pad-value="1"><span>1</span></div>' +
        '                            <div class="key_pad-number" data-key-pad-value="2"><span>2</span></div>' +
        '                            <div class="key_pad-number" data-key-pad-value="3"><span>3</span></div>' +
        '                            <div class="key_pad-number" data-key-pad-value="delete"><span><i class="fa-solid fa-arrow-left"></i></span></div>' +
        '                            <div class="key_pad-number" data-key-pad-value="0"><span>0</span></div>' +
        '                            <div class="key_pad-number" data-key-pad-value="cancel"><span><i class="fa-solid fa-xmark"></i></span></div>' +
        '                        </div>'
    $("#" + keyPadId).html(padHtml);
    $("#" + keyPadId + " .key_pad-number").on("click.keyPadValueClickEventHandler", function (e) {
        keyPadValueClickEventHandler(e, setValuetargetId);
    });
    return {
        setMaxLength: function (length) {
            maxLength = length;
        },
        setValueTarget: function (targetId) {
            setValuetargetId = targetId;
        }
    }

    function keyPadValueClickEventHandler(e, setValuetargetId) {
        let target = e.currentTarget;
        let keyPadValue = $(target).data("keyPadValue");
        let $targetId = $("#" + setValuetargetId);
        let $targetIdValue = $targetId.val();
        let $targetIdValueLength = $targetIdValue.length;

        if (keyPadValue === "cancel") {
            $targetId.val("");
        } else if (keyPadValue === "delete") {
            if ($targetIdValueLength !== 0) {
                let sliceValue = $targetIdValue.slice(0, $targetIdValueLength - 1);

                if ($targetId[0].hasAttribute("inputpricewithcomma")) {
                    sliceValue = sliceValue.replaceAll(/,/g, "");
                    sliceValue = Number(sliceValue).toLocaleString()
                }

                $targetId.val(sliceValue)
            }
        } else {
            let resultValue = $targetIdValue + keyPadValue;
            if ($targetId[0].hasAttribute("inputpricewithcomma")) {
                // if(resultValue.startsWith("0")){
                //     return false;
                // }
                resultValue = resultValue.replaceAll(/,/g, "");
                resultValue = Number(resultValue).toLocaleString()
            }
            if (formUtil.checkEmptyValue(maxLength)) {
                if (resultValue.length <= maxLength) {
                    $targetId.val(resultValue);
                }
            } else {
                $targetId.val(resultValue);
            }
        }
        commonTag.inputTagReset($targetId);
    }
}
