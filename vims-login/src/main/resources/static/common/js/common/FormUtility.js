/**
 * @title : 폼 유틸리티
 * @text : Form 요소 관련 유틸리티 (Facade)
 *         실제 구현은 utils/ 폴더 내로 분리됨.
 */
function FormUtility() {
}

$(document).ready(function () {
    // formUtil은 home.html 등에서 전역으로 생성됨.
    if (typeof GridSortManager !== 'undefined' && typeof formUtil !== 'undefined' && formUtil) {
        formUtil.gridSortManager = new GridSortManager();
    }
});
