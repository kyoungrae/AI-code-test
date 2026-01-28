/**
 * @title : Axios Global Configuration
 * @text : Add X-Language header to all outgoing axios requests based on localStorage setting.
 */
(function () {
    if (typeof axios !== 'undefined') {
        // 인터셉터 추가
        axios.interceptors.request.use(function (config) {
            const selectedLanguage = localStorage.getItem("selectedLanguage") || "ko";

            // X-Language 헤더 추가 (서버에서 인식 가능하도록)
            config.headers['X-Language'] = selectedLanguage;

            // 표준 Accept-Language 헤더도 설정 (Spring LocaleResolver 호환)
            // mn-MN, en-US, ko-KR 형태로 보내기도 하지만 여기서는 간단히 코드만 전달
            config.headers['Accept-Language'] = selectedLanguage;

            return config;
        }, function (error) {
            return Promise.reject(error);
        });

        console.log('[AxiosConfig] Global interceptor for language support initialized.');
    } else {
        console.warn('[AxiosConfig] Axios is not defined. Make sure it is loaded before this script.');
    }
})();
