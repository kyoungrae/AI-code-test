
class loadToScript {
    constructor() {
        const lang = localStorage.getItem("selectedLanguage") || "ko";
        const scriptsToLoad = [
            "management/SysLayoutMessage",
            "management/SysEventLogMessage",
            "login/SysMenuMessage",
            "login/SysUserGroupMessage",
            "login/SysUserMessage",
            "management/SysUserGroupMessage",
            "management/SysBbsMstMessage",
            "management/SysBbsMessage",
            "management/SysBbsBoardMessage",
            "management/SysAccsLogMessage",
            "management/SysDeptGroupMessage",
            "management/SysAccsGroupMenuListMessage",
            "management/SysAccsGroupMenuMessage",
            "management/SysCodeGroupMessage",
            "management/SysCodeMessage",
            "management/SysDeptGroupMessage",
            "management/SysIconMessage",
            "management/SysMenuMessage",
            "management/SysOfficeMessage",
            "management/SysSiteConfigGroupMessage",
            "management/SysSiteConfigMessage",
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

        // Build the list with prefixes
        const localizedScripts = scriptsToLoad.map(script => `${lang}/${script}`);

        // Special case for common Message.js
        const commonMessageScript = lang === "ko" ? "/common/js/common/Message.js" : `/common/js/common/Message.${lang}.js`;

        console.log(`[messageConfig] Loading messages for language: ${lang}`);

        const allScripts = [commonMessageScript, ...localizedScripts.map(s => `/common/js/message/${s}.js`)];
        this.loadAllScripts(allScripts);
    }

    loadAllScripts(scripts) {
        let loadedCount = 0;
        const total = scripts.length;

        const checkDone = () => {
            loadedCount++;
            if (loadedCount === total) {
                console.log("[messageConfig] All scripts handled. Triggering DOM translation.");
                if (typeof PageInit !== 'undefined') {
                    new PageInit().messageLabelSettings();
                } else {
                    console.warn("[messageConfig] PageInit not defined. Scan skipped.");
                }
            }
        };

        scripts.forEach(src => {
            const scriptElement = document.createElement('script');
            scriptElement.src = src;
            scriptElement.async = false;
            scriptElement.onload = () => {
                console.log(`[messageConfig] Loaded: ${src}`);
                checkDone();
            };
            scriptElement.onerror = () => {
                console.error(`[messageConfig] FAILED to load: ${src}`);
                checkDone(); // Proceed anyway
            };
            document.head.appendChild(scriptElement);
        });
    }
}
