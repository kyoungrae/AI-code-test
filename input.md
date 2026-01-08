## @title : input 태그 disabled 설정
## @type : data-tag
## @date : 2026-01-08
## @author : 이경태
## @extend : CommonTag.prototype.tagDisabled
## @call : 
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

<javascript>
    //Users/ikyoungtae/Documents/coding/AI-code-test/vims-login/src/main/resources/templates/layout/home.html 
    let input = new Input(); // login.html
    
    input.setSelectOption("#register_office_code", "/cms/common/comOffice/find", { code: "office_code", name: "office_name" });
</javascript>

**example end**