## @title : input 태그 disabled 설정
## @type : data-tag
## @date : 2026-01-08
## @author : 이경태
## @extend : CommonTag.prototype.tagDisabled
## @call : ""
**example start**

<input type="text" data-disabled/>

**example end**

## @title : input 태그 select 설정
## @type : function
## @date : 2026-01-08
## @author : 이경태
## @extend : input = new Input(); 
## @call : input.tagSelect("#ID", "url", {code:"", name : ""});
**example start**

<script>
    //Users/ikyoungtae/Documents/coding/AI-code-test/vims-login/src/main/resources/templates/layout/home.html 
    let input = new Input(); // login.html
    
    input.setSelectOption("#register_office_code", "/cms/common/comOffice/find", { code: "office_code", name: "office_name" });
</script>

**example end**

## @title : input 태그 calendar 설정
## @type : data-tag
## @date : 2026-01-08
## @author : 이경태
## @extend : ""
## @call : new GiCalendar();
**example start**

<script>
    ///Users/ikyoungtae/Documents/coding/AI-code-test/vims-login/src/main/resources/static/common/js/common/Common.js
    new GiCalendar(); //Common.js -> commonTagSettings(); 

    ///Users/ikyoungtae/Documents/coding/AI-code-test/vims-login/src/main/resources/templates/layout/home.html
    var commonTag = new CommonTag();
</script>
<html>
    <input data-datepicker type="" data-field="" id="" name="" class="gi-input" data-focus-span-text-align="default" data-required="true" autocomplete="off"/>
</html>

**example end**

## @title : input 태그 fileUpload 설정
## @type : data-tag
## @date : 2026-01-09
## @author : 이경태
## @extend : ""
## @call : new FileUtil();
**example start**

<script>
    let fileUtil = new FileUtil();
    fileUtil.createFileUpload("/fms/common/file/comFileDetail", "sample_file_uuid", "sampleFolder");
</script>
<html>
<!-- [파일 첨부 카드] -->
        <div class="gi-article-content gi-margin-bottom-30px">
          <h2 class="gi-title-section">파일 첨부</h2>
          <div class="gi-flex gi-flex-column gi-grid-gap-10px">
            <div class="gi-flex gi-flex-align-items-center gi-grid-gap-20px">
              <!-- UUID 입력창은 숨김 처리 -->
              <input data-field="file_uuid" id="sample_file_uuid" name="file_uuid" class="gi-hidden" readonly />

              <div class="gi-flex-1">
                <p class="gi-text-secondary gi-font-size-14px">
                  첨부된 파일 목록을 아래에서 확인할 수 있습니다.
                </p>
              </div>
              <button id="file-upload-btn" class="gi-btn-blue" type="button" data-file-upload-btn>파일 업로드</button>
            </div>

            <!-- 파일 목록 표시 영역 -->
            <div id="attached-file-list" class="gi-margin-top-10px"
              style="min-height: 50px; border: 1px solid #f0f1f7; border-radius: 12px; padding: 16px; background: #f8f9fc;">
              <p class="gi-text-center gi-text-secondary gi-font-size-13px gi-padding-24px" id="no-file-msg">
                첨부된 파일이 없습니다.
              </p>
            </div>
          </div>
        </div>
</html>

**example end**