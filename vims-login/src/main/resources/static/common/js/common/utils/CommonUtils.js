/**
 * @title : 공통코드 조회
 * @text : group_id로 공통코드 조회
 * @writer : 이경태
 */
async function findComCode(param) {
    let result = {};
    let url = '/cms/common/comCode/findComCode';

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

/**
 * @title : 공통 코드 그룹 조회
 * @text : 그룹 ID 목록으로 공통코드 조회 및 세션 저장
 */
FormUtility.prototype.findByComCodeGroup = function (group_id) {
    let url = "/api/comCode/findByComCodeGroup";
    let param = group_id.split(",");
    axios.post(url, param).then(response => {
        let data = response.data;
        sessionStorage.setItem("comCodeGroup", JSON.stringify(data));
    });
}

/**
 * @title : 세션 내 공통코드 조회
 * @text : 세션에 저장된 공통코드 중 특정 그룹 코드 조회
 */
FormUtility.prototype.findComCode = function (group_id) {
    let comCodeGroup = JSON.parse(sessionStorage.getItem("comCodeGroup"));
    let returnData = [];
    if (formUtil.checkEmptyValue(comCodeGroup)) {
        comCodeGroup.forEach(item => {
            if (item.group_code_id === group_id) {
                returnData.push(item);
            }
        });
    }
    return returnData;
}

/**
 * @title : Form 유틸리티 값 초기화
 * @text : GridSortManager 등 초기화
 */
FormUtility.prototype.resetFormUtilityValue = function () {
    if (formUtil.gridSortManager) {
        formUtil.gridSortManager.resetSort();
    }
}
/**
 * @title : 공통 코드명 설정
 * @text : 필드명과 그룹 ID를 이용해 공통코드 명칭 설정
 */
FormUtility.prototype.setComCodeName = async function (fieldName, groupId, cont) {
    let codeId = cont[fieldName];
    let param = {
        group_id: groupId,
        code_id: codeId
    }
    let data = await findComCode(param);
    if (data.length > 0) {
        let value = data[0].code_name;
        $("[data-field=" + fieldName + "]").text(value);
    }
}
/**
 * @title : 클래스 변수 설정
 * @text : 세션, 데이터바인딩, 팝업 클래스 인스턴스 반환
 */
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
