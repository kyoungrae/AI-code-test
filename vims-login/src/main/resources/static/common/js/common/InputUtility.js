class InputUtility {
    constructor() {

    }

    async setSelectOption(selector, url, mapper) {
        let $target = $(selector);
        if ($target.length === 0) return;

        let id = $target.attr('id');
        // 이미 생성된 경우 중복 생성 방지: 기존 요소 제거 후 재생성
        if ($(`#${id}_select`).length > 0) {
            $(`#${id}_select`).next('ul.slide-drop-down').remove();
            $(`#${id}_select`).remove();
            $target.removeClass("gi-hidden");
        }

        let data = [];
        try {
            const response = await axios.post(url, {});
            data = response.data;
        } catch (error) {
            console.error("setSelectOption data load failed:", error);
        }

        let copySelectBoxHtml = $target[0].outerHTML;
        $target.addClass("gi-hidden");

        let $copySelectBox = $(copySelectBoxHtml);
        $copySelectBox.attr("id", id + "_select");
        $copySelectBox.attr("readonly", "readonly");
        $copySelectBox.removeAttr("data-field");
        $copySelectBox.removeAttr("data-required");
        $target.after($copySelectBox);

        // 옵션 목록 생성
        let $ulElement = $('<ul class="slide-drop-down"></ul>');
        $ulElement.css({
            "position": "absolute",
            "top": "100%",
            "left": "0",
            "width": "100%",
            "background-color": "#ffffff",
            "border": "1px solid #E2E8F0",
            "border-radius": "0 0 5px 5px",
            "z-index": "1000",
            "list-style": "none",
            "padding": "0",
            "margin": "0",
            "max-height": "200px",
            "overflow-y": "auto",
            "box-shadow": "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            "display": "none" // 초기에는 숨김 처리
        });

        // 기본 '선택' 옵션
        let $defaultLi = $('<li></li>');
        $defaultLi.css({ "padding": "5px 10px", "cursor": "pointer" });
        $defaultLi.html(`<button type="button" value="" style="width:100%; text-align:left; border:none; background:transparent; cursor:pointer; color:#8b8b8b; padding: 5px;">선택</button>`);
        $ulElement.append($defaultLi);

        if (Array.isArray(data)) {
            data.forEach(item => {
                let code = item[mapper.code];
                let name = item[mapper.name];
                let $li = $('<li></li>');
                $li.css({ "padding": "0", "margin": "0" });
                $li.html(`<button type="button" value="${code}" class="gi-overflow-scroll" style="width:100%; text-align:left; border:none; background:transparent; cursor:pointer; padding: 10px; font-size:14px;">${name}</button>`);

                $li.find('button').hover(
                    function () { $(this).css("background-color", "#f7fafc"); },
                    function () { $(this).css("background-color", "transparent"); }
                );

                $ulElement.append($li);
            });
        }

        $copySelectBox.after($ulElement);

        if ($target.parent().css('position') === 'static') {
            $target.parent().css('position', 'relative');
        }

        // 이벤트 핸들러: 클릭 시 열고 닫기 (slideDown/Up 적용)
        $copySelectBox.off('click keydown').on('click keydown', (e) => {
            if (e.type === 'click' || (e.type === 'keydown' && e.keyCode === 13)) {

                // 다른 열린 셀렉트 박스 닫기
                $('input[id$="_select"].active').not($copySelectBox).each(function () {
                    $(this).removeClass('active');
                    $(this).next('ul.slide-drop-down').slideUp(200);
                });

                if ($copySelectBox.hasClass('active')) {
                    // 닫기
                    $copySelectBox.removeClass('active');
                    $ulElement.slideUp(200);
                    $copySelectBox.blur();
                } else {
                    // 열기
                    $copySelectBox.addClass('active');
                    $ulElement.slideDown(200);
                }
            }
        });

        // 외부 클릭 시 닫기
        $(document).off(`click.selectbox_${id}`).on(`click.selectbox_${id}`, (e) => {
            if ($(e.target).closest(`#${id}_select`).length === 0 && $(e.target).closest($ulElement).length === 0) {
                if ($copySelectBox.hasClass('active')) {
                    $copySelectBox.removeClass('active');
                    $ulElement.slideUp(200);
                }
            }
        });

        // 옵션 선택 시
        $ulElement.find('li button').off('click').on('click', (e) => {
            const $selectedItem = $(e.currentTarget);
            let selectedText = $selectedItem.text();
            let selectedValue = $selectedItem.attr('value');

            selectedText = (selectedText === '선택') ? '' : selectedText;

            $copySelectBox.val(selectedText);
            $target.val(selectedValue).trigger('change');

            // 닫기
            $copySelectBox.removeClass('active');
            $ulElement.slideUp(200);

            const $label = $(`label[for="${id}"]`);
            $label.attr('data-focus-label', selectedText === "" ? 'false' : 'true');
        });

        // 초기값 설정
        if ($target.val()) {
            let initVal = $target.val();
            let initText = "";
            $ulElement.find('li button').each(function () {
                if ($(this).attr('value') == initVal) {
                    initText = $(this).text();
                }
            });
            if (initText) {
                $copySelectBox.val(initText);
                $(`label[for="${id}"]`).attr('data-focus-label', 'true');
            }
        }
    }
}
