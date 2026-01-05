/**
 * @title : 메뉴 활성화
 * @reqUrl : 요청 URL [String]
 * @text : 현재 페이지에 맞는 메뉴를 활성화하고 세션에 저장
 */
FormUtility.prototype.activatedMenu = function (reqUrl) {
    let sessionUrl = JSON.parse(sessionStorage.getItem("recentPage")).url;

    if (sessionUrl !== "/index/index" && sessionUrl !== "/" && sessionUrl !== "/common/myinfo" && (!reqUrl.includes("Register") || !reqUrl.includes("Modify"))) {
        if (sessionUrl.startsWith('/safety/safetyInspection')) sessionUrl = sessionUrl.replaceAll('New', '').replaceAll('Continuous', '');
        let refineRecentPage = sessionUrl.replaceAll("Detail", "List").replaceAll("Register", "List").replaceAll("Modify", "List").replaceAll("_2", "");
        let refineRecentPageInfo = {
            url: refineRecentPage
        };
        sessionStorage.setItem("recentPage", JSON.stringify(refineRecentPageInfo));
    }

    if (reqUrl.slice(-6) !== "Detail" && reqUrl.slice(-6) !== "Modify" && reqUrl !== "/index/index" && reqUrl !== "/common/myinfo") {
        let activatedMenuInfo = {
            url: reqUrl
        }
        sessionStorage.setItem("activatedMenu", JSON.stringify(activatedMenuInfo));

        // 모든 버튼 닫기 처리 후
        let allLiButtonList = $("#side_nav_menu > li");

        allLiButtonList.each(function () {
            let $button = $(this);
            $button.find("a:not(.sideNavPageLoad)").removeClass("active").addClass("collapsed");
            $button.find("a.sideNavPageLoad").removeClass("active page");
            $button.find("ul").stop(true, true).slideUp(150);
        });

        if (formUtil.checkEmptyValue(reqUrl) && reqUrl !== "/index/index" && reqUrl !== "/common/myinfo") {
            let $activatedMenu = $("[data-page-name='" + reqUrl.toString() + "']");
            let menuLevel1 = $activatedMenu.parents("li").last().children("a");
            let menuLevel2 = $activatedMenu.closest("ul").closest("li").children("a");

            menuLevel1.trigger("click");
            menuLevel2.trigger("click");
            $activatedMenu.addClass("active page");
        }
    }
}

/**
 * @title : 컨텐츠 로드
 * @reqUrl : 요청 URL [String]
 * @DATA : 전달할 데이터 [Object]
 * @text : 페이지 컨텐츠를 로드하고 세션에 데이터 저장
 */
FormUtility.prototype.loadContent = function (reqUrl, DATA) {
    let cont = JSON.stringify(DATA);
    let url = `/common/redirectPage/redirect?url=${encodeURIComponent(reqUrl + ".html")}`;

    axios.get(url).then(response => {
        formUtil.resetFormUtilityValue();
        let pageSources = response.data;

        $("#gi-road-content").empty().html(pageSources);

        if (!formUtil.checkEmptyValue(sessionStorage.getItem("DATA"))) {
            sessionStorage.removeItem("DATA");
            sessionStorage.setItem("DATA", cont);
        } else {
            sessionStorage.removeItem("DATA");
            sessionStorage.setItem("DATA", cont);
        }

        if (typeof changedHomeType !== "undefined" && formUtil.checkEmptyValue(changedHomeType)) {
            $("#gi-road-content article:first").each(function () {
                this.style.setProperty("width", "100%", "important");
                if (!$(this).hasClass("gi-col-99") && !$(this).hasClass("gi-col-100")) {
                    this.style.setProperty("height", "98%", "important");
                }
            });

            $("#gi-road-content article#gi-search-popup").addClass("gi-row-84-important");
        }

        formUtil.activatedMenu(reqUrl);
    })
        .catch(error => {
            formUtil.alertPopup('Failed to load content:', error);
        });
}
/**
 * @title : API Gateway를 통한 컨텐츠 로드
 * @text : API Gateway를 통한 loadContent
 * @param prefixUrl : API 프리픽스 URL [String]
 * @param reqUrl : 요청 URL [String]
 * @param DATA : 전달할 데이터 [Object]
 */
FormUtility.prototype.apiLoadContent = function (prefixUrl, reqUrl, DATA) {
    let cont = JSON.stringify(DATA);
    let url = prefixUrl + `/page/load` + `?url=${encodeURIComponent(reqUrl + ".html")}`;

    axios.get(url).then(response => {
        formUtil.resetFormUtilityValue();
        let pageSources = response.data;

        $("#gi-road-content").empty().html(pageSources);

        if (!formUtil.checkEmptyValue(sessionStorage.getItem("DATA"))) {
            sessionStorage.removeItem("DATA");
            sessionStorage.setItem("DATA", cont);
        } else {
            sessionStorage.removeItem("DATA");
            sessionStorage.setItem("DATA", cont);
        }
    }).catch(error => {
        formUtil.alertPopup('Failed to load content:', error);
    });
}
/**
 * @title : HTML 파일 로드
 * @cont :[url:url,data:data]
 * @text : html코드를 사입 하기 위한 함수 함수앞에 awaite 추가  ex) awaite formUtil.loadToHtml(cont)
 * @writer : 이경태
 */
FormUtility.prototype.loadToHtml = async function (cont) {
    return new Promise(resolve => {
        let url = `/common/redirectPage/redirect?url=${encodeURIComponent(cont.url + ".html")}`;
        let data = JSON.stringify(cont.data);

        axios.get(url).then(response => {
            if (formUtil.checkEmptyValue(response)) {
                if (!formUtil.checkEmptyValue(sessionStorage.getItem("DATA"))) {
                    sessionStorage.removeItem("DATA");
                    sessionStorage.setItem("DATA", data);
                } else {
                    sessionStorage.removeItem("DATA");
                    sessionStorage.setItem("DATA", data);
                }

                return resolve(response.data);
            }
        }).catch(error => {
            formUtil.alertPopup('Failed to load content:', error);
        });
    })
}
/**
 * @title : 페이지 이동 애니메이션
 * @text : 페이지 이동시 애니메이션 설정
 * @writer : 이경태
 */
FormUtility.prototype.pageReDirectAnimation = function () {
    if ($("#gi-road-content").data("animation")) {
        $(".gi-article-content").addClass("animate-content-start");
    } else {
        $(".gi-article-content").addClass("animate-content-end");
        $("#gi-road-content").data("animation", true);
    }
}

/**
 * @title : 페이지 제목 설정
 * @text : 페이지 이동시 애니메이션 설정
 * @writer : 이경태
 */
FormUtility.prototype.setTitle = function () {
    if (formUtil.checkEmptyValue(sessionStorage.getItem("DATA"))) {
        let data = JSON.parse(sessionStorage.getItem("DATA"));
        $(".gi-page-title").html(data.title)
    }
}
/**
 * @title : 툴팁 처리
 * @writer : 문상혁
 */
FormUtility.prototype.handleToolTip = function () {
    $(".gi-tooltip-info-icon").hover(
        function () {
            $(this).siblings(".gi-tooltip-info-text").removeClass("gi-hidden");
        },
        function () {
            $(this).siblings(".gi-tooltip-info-text").addClass("gi-hidden");
        },
    );
}
