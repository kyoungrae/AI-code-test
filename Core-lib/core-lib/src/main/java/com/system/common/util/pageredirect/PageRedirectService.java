package com.system.common.util.pageredirect;

import com.system.common.util.message.MessageService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class PageRedirectService implements InterfaceOfPageRedirect {

    private final MessageService messageService;

    public String pageLoad(String param) throws Exception {
        String resourcePath = "templates/page" + param;
        try (InputStream inputStream = getClass().getClassLoader().getResourceAsStream(resourcePath)) {
            if (inputStream == null) {
                return loadErrorPage();
            }

            // Determine language: prioritize X-Language header, then Accept-Language, then
            // default to ko
            String lang = resolveLanguage();

            var content = messageMatcher(new String(inputStream.readAllBytes(), StandardCharsets.UTF_8), lang);
            return content;
        } catch (Exception e) {
            return loadErrorPage();
        }
    }

    private String resolveLanguage() {
        String lang = "ko"; // default
        try {
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder
                    .getRequestAttributes();
            if (attributes != null) {
                HttpServletRequest request = attributes.getRequest();

                // 1. Check X-Language header (custom)
                String xLang = request.getHeader("X-Language");
                if (xLang != null && !xLang.isEmpty()) {
                    lang = xLang.toLowerCase();
                    // System.out.println("[PageRedirectService] Resolved from X-Language: " +
                    // lang);
                } else {
                    // 2. Fallback to LocaleContextHolder (resolves from Accept-Language)
                    Locale locale = LocaleContextHolder.getLocale();
                    lang = locale.getLanguage();
                    // System.out.println("[PageRedirectService] Resolved from LocaleContextHolder:
                    // " + lang);
                }
            }
        } catch (Exception e) {
            // Fallback to default if error
        }

        // Validate supported languages
        if (lang == null || lang.isEmpty() || (!lang.equals("ko") && !lang.equals("en") && !lang.equals("mn"))) {
            lang = "ko";
        }

        return lang;
    }

    public String messageMatcher(String content, String lang) throws Exception {

        Pattern pattern = Pattern.compile("\\[Page\\.Message\\]\\.Message\\.Label\\.Array\\[\"(.*?)\"\\]");
        Matcher matcher = pattern.matcher(content);
        StringBuffer result = new StringBuffer();

        while (matcher.find()) {
            String key = matcher.group(1);
            String message = messageService.getMessage(key, lang);

            // 디버깅용으로 실패 시에만 로그 출력
            if (message.equals(key)) {
                System.err.println("✗ 치환 실패: [" + key + "] → 메시지 없음 (" + lang + ")");
            }

            matcher.appendReplacement(result, Matcher.quoteReplacement(message));
        }
        matcher.appendTail(result);

        return result.toString();
    }

    public String loadErrorPage() throws Exception {
        String errorPagePath = "templates/page/common/404.html";
        try (InputStream errorStream = getClass().getClassLoader().getResourceAsStream(errorPagePath)) {
            if (errorStream == null) {
                return "<div>404 Page Not Found</div>";
            }
            return new String(errorStream.readAllBytes(), StandardCharsets.UTF_8);
        } catch (Exception e) {
            return "<div>404 Page Not Found</div>";
        }
    }
}
