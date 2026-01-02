/**
 * @title : CommonUtils
 * @text : 공통 코드 조회 및 전역 설정 관련 함수
 */

/**
 * @title : 공통코드 조회
 * @text : group_id로 공통코드 조회
 * @writer : 이경태
 */
async function findCommonCode(param) {
    let result = {};
    let url = '/cms/common/commonCode/findCommonCode';

    try {
        return new Promise((resolve, reject) => {
            axios.post(url, param).then(response => {
                result = response.data;
                resolve(result);
            }).catch(error => {
                formUtil.alertPopup(error + "");
            });
        });
    } catch (error) {
        formUtil.alertPopup(error + "");
    }
}

FormUtility.prototype.findByCommonCodeGroup = function (group_id) {
    let url = "/api/commonCode/findByCommonCodeGroup";
    let param = group_id.split(",");
    axios.post(url, param).then(response => {
        let data = response.data;
        sessionStorage.setItem("commonCodeGroup", JSON.stringify(data));
    });
}

FormUtility.prototype.findCommonCode = function (group_id) {
    let commonCodeGroup = JSON.parse(sessionStorage.getItem("commonCodeGroup"));
    let returnData = [];
    if (this.checkEmptyValue(commonCodeGroup)) {
        commonCodeGroup.forEach(item => {
            if (item.group_code_id === group_id) {
                returnData.push(item);
            }
        });
    }
    return returnData;
}

FormUtility.prototype.resetFormUtilityValue = function () {
    if (this.gridSortManager) {
        this.gridSortManager.resetSort();
    }
}
FormUtility.prototype.setCommonCodeName = async function (fieldName, groupId, cont) {
    let codeId = cont[fieldName];
    let param = {
        group_id: groupId,
        code_id: codeId
    }
    let data = await findCommonCode(param);
    if (data.length > 0) {
        let value = data[0].code_name;
        $("[data-field=" + fieldName + "]").text(value);
    }
}
FormUtility.prototype.setClassVariables = function (type) {
    let sessionInit = new session();
    let dataBindingInit = new dataBinding();
    let popupInit = new popup();

    if (type === "session") {
        return sessionInit;
    } else if (type === "dataBinding") {
        return dataBindingInit;
    } else if (type === "popup") {
        return popupInit;
    }
}
