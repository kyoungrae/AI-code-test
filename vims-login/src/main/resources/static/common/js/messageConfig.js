
class loadToScript {
    constructor() {
        const scriptsToLoad = [
            "login/CommonUserMessage",
            "login/CommonMenuMessage",
            "login/CommonUserGroupMessage",
            "management/CommonGroupMessage",
            "management/CommonAccessGroupMenuListMessage",
            "management/CommonAccessGroupMenuMessage",
            "management/CommonCodeGroupMessage",
            "management/CommonCodeMessage",
            "management/CommonGroupMessage",
            "management/CommonIconMessage",
            "management/CommonMenuMessage",
            "management/CommonOfficeMessage",
            "management/CommonSiteConfigGroupMessage",
            "management/CommonSiteConfigMessage",
            "management/CommonUserGroupMessage",
            "management/CommonUserMessage",
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
