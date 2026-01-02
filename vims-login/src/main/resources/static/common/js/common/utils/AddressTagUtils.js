/**
 * @title : AddressTagUtils
 * @text : CommonTag Address Utility Classes
 */

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

        id_parts.forEach(function (part) {
            if (!isNaN(part)) {
                index = part; // 숫자인 부분을 index로 저장
            } else if (part !== 'btn') {
                id = part;
            }
        });
        let input_address, input_address_detail, input_postal_code;

        if (index) {
            input_address = $('#' + id + '-' + index);                                    //transferee_use_address-2
            input_address_detail = $('#' + id + '_detail' + '-' + index);                  //transferee_use_address_detail-2
            input_postal_code = $('#' + id.replace(/_address$/, '') + '_postal_code' + '-' + index);  //transferee_use_postal_code-2
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
