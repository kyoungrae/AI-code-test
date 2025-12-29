package com.system.common.util.pageredirect;

import com.system.common.util.message.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
@Service
@RequiredArgsConstructor
public class PageRedirectService implements InterfaceOfPageRedirect{

    private final MessageService messageService;

    public String pageLoad(String param) throws Exception{
        String resourcePath = "templates/page" + param;
        try (InputStream inputStream = getClass().getClassLoader().getResourceAsStream(resourcePath)) {
            if (inputStream == null) {
                return loadErrorPage();
            }
            var content = messageMatcher(new String(inputStream.readAllBytes(), StandardCharsets.UTF_8),"ko");
            return content;
        } catch (Exception e) {
            return loadErrorPage();
        }
    }
    public String messageMatcher(String content,String lang) throws Exception{

        Pattern pattern = Pattern.compile("\\[Page\\.Message\\]\\.Message\\.Label\\.Array\\[\"(.*?)\"\\]");
        Matcher matcher = pattern.matcher(content);
        StringBuffer result = new StringBuffer();

        while (matcher.find()) {
            String key = matcher.group(1);
            String message = messageService.getMessage(key, lang);
            matcher.appendReplacement(result, message);
        }
        matcher.appendTail(result);

        return result.toString();
    }

    public String loadErrorPage() throws Exception{
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
