/**
 * @title : TabUtils
 * @text : 탭 관련 함수 모음
 */

/**
 * @title : tab 기능 설정
 * @SECTION_TAB : .gi-tab이 작성되어 있는 부모 태그
 * @fn : tab click 이벤트 발생시 동작하는 함수명
 * @data : tab click 이벤트 발생시 동작하는 함수에 할당되는 데이터
 * @text : .gi-tab 설정시 자동으로 data-tab-value 가 순차적으로 설정 되고 returnData에 자동 할당
 * @writer : 이경태
 * */
FormUtility.prototype.giTab = function (SECTION_TAB, fn = false, data = false) {

    tabDataSetting(SECTION_TAB);

    $("#" + SECTION_TAB + " > " + ".gi-tab").off("click.giTabClickEventHandler").on("click.giTabClickEventHandler", function (e) {
        giTabClickEventHandler(e);
    });
    function giTabClickEventHandler(e) {
        let target = e.currentTarget;

        $(target).addClass("gi-tab-active");
        $("#" + SECTION_TAB + " > " + ".gi-tab").not(target).removeClass("gi-tab-active");

        let returnData = {
            tab_value: $(target).data("tabValue")
        };
        if (fn) {
            if (data) {
                for (let key in data) {
                    returnData[key] = data[key];
                }
                fn(returnData);
            } else {
                fn(returnData);
            }
        }
    }
    function tabDataSetting(SECTION_TAB) {
        let target = $("#" + SECTION_TAB + " > " + ".gi-tab");
        let giTabLength = target.length;
        if (giTabLength > 0) {
            target.map((i, item) => {
                $(item).attr("data-tab-value", i);
            })
        }
    }
}
