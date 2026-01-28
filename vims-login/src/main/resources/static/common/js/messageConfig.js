
class loadToScript {
    constructor() {
        const lang = localStorage.getItem("selectedLanguage") || "ko";
        const scriptsToLoad = [
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

        this.loadScripts([commonMessageScript], true); // true means absolute path
        this.loadScripts(localizedScripts);
    }

    loadScripts(scripts, isAbsolutePath = false) {
        scripts.forEach((script, index) => {
            const scriptElement = document.createElement('script');
            scriptElement.src = isAbsolutePath ? script : `/common/js/message/${script}.js`;
            scriptElement.async = false; // Execute in order

            // If it's the last script of the localized batch, trigger DOM translation scan
            if (!isAbsolutePath && index === scripts.length - 1) {
                scriptElement.onload = () => {
                    console.log("All message scripts loaded. Triggering DOM translation scan.");
                    if (typeof PageInit !== 'undefined') {
                        new PageInit().messageLabelSettings();
                    }
                };
            }

            document.head.appendChild(scriptElement);
        });
    }
}
