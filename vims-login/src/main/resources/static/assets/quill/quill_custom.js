
// Quill에서 사용하는 클래스를 스타일로 변환 (text-align, font-size 등)
function applyQuillStylesToHtml(htmlContent) {
    htmlContent = htmlContent.replace(/class="ql-align-center"/g, 'style="text-align: center;"');
    htmlContent = htmlContent.replace(/class="ql-align-right"/g, 'style="text-align: right;"');
    htmlContent = htmlContent.replace(/class="ql-align-justify"/g, 'style="text-align: justify;"');

    htmlContent = htmlContent.replace(/class="ql-indent-1"/g, 'style="padding-left: 3em;"');
    htmlContent = htmlContent.replace(/class="ql-indent-2"/g, 'style="padding-left: 6em;"');
    htmlContent = htmlContent.replace(/class="ql-indent-3"/g, 'style="padding-left: 9em;"');
    htmlContent = htmlContent.replace(/class="ql-indent-4"/g, 'style="padding-left: 12em;"');
    htmlContent = htmlContent.replace(/class="ql-indent-5"/g, 'style="padding-left: 15em;"');
    htmlContent = htmlContent.replace(/class="ql-indent-6"/g, 'style="padding-left: 18em;"');
    htmlContent = htmlContent.replace(/class="ql-indent-7"/g, 'style="padding-left: 21em;"');
    htmlContent = htmlContent.replace(/class="ql-indent-8"/g, 'style="padding-left: 24em;"');

    return htmlContent;
}

