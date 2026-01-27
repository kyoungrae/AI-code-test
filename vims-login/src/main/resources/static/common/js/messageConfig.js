
class loadToScript {
    constructor() {
        const scriptsToLoad = [
            "ko/management/SysEventLogMessage",
            "ko/login/SysMenuMessage",
            "ko/login/SysUserGroupMessage",
            "ko/login/SysUserMessage",
            "ko/management/SysUserGroupMessage",
            "ko/management/SysBbsMstMessage",
            "ko/management/SysBbsMessage",
            "ko/management/SysBbsBoardMessage",
            "ko/management/SysAccsLogMessage",
            "ko/management/SysDeptGroupMessage",
            "ko/management/SysAccsGroupMenuListMessage",
            "ko/management/SysAccsGroupMenuMessage",
            "ko/management/SysCodeGroupMessage",
            "ko/management/SysCodeMessage",
            "ko/management/SysDeptGroupMessage",
            "ko/management/SysIconMessage",
            "ko/management/SysMenuMessage",
            "ko/management/SysOfficeMessage",
            "ko/management/SysSiteConfigGroupMessage",
            "ko/management/SysSiteConfigMessage",
            "ko/management/IndexMessage",
            "ko/management/SiteBannerImageMessage",
            "ko/management/SiteConfigHistoryMessage",
            "ko/management/SiteConfigMessage",
            "ko/management/SitePopupNoticeMessage",
            "ko/management/SitePopupNoticeTargetGroupMessage",
            "ko/management/SiteScheduledMailMessage",
            "ko/management/SiteScheduledMailTargetGroupMessage",
            "ko/management/SiteSentMailManagementMessage"
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
