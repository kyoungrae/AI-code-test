
class loadToScript {
    constructor() {
        const scriptsToLoad = [
            "management/ComEventLogMessage",
            "login/ComMenuMessage",
            "login/ComUserGroupMessage",
            "login/ComUserMessage",
            "management/ComUserGroupMessage",
            "management/ComDeptGroupMessage",
            "management/ComAccsGroupMenuListMessage",
            "management/ComAccsGroupMenuMessage",
            "management/ComCodeGroupMessage",
            "management/ComCodeMessage",
            "management/ComDeptGroupMessage",
            "management/ComIconMessage",
            "management/ComMenuMessage",
            "management/ComOfficeMessage",
            "management/ComSiteConfigGroupMessage",
            "management/ComSiteConfigMessage",
            "management/IndexMessage",
            "management/SiteBannerImageMessage",
            "management/SiteConfigHistoryMessage",
            "management/SiteConfigMessage",
            "management/SitePopupNoticeMessage",
            "management/SitePopupNoticeTargetGroupMessage",
            "management/SiteScheduledMailMessage",
            "management/SiteScheduledMailTargetGroupMessage",
            "management/SiteSentMailManagementMessage"
        ];
        this.loadScripts(scriptsToLoad)
    }
    loadScripts(scripts) {
        scripts.forEach(script => {
            const scriptElement = document.createElement('script');
            scriptElement.src = `/common/js/message/${script}.js`; // 경로 동적으로 생성
            scriptElement.async = false; // 순서대로 로드되도록 비동기 로드를 비활성화
            document.head.appendChild(scriptElement);
        });
    }
}
