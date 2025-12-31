package com.management;

import com.system.common.util.message.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/cms/debug")
@RequiredArgsConstructor
public class DebugController {

    private final MessageService messageService;

    @GetMapping("/message-test")
    @ResponseBody
    public Map<String, Object> testMessage(
            @RequestParam(value = "key", defaultValue = "COMMON_MENU.TOP_MENU_CODE") String key) {
        Map<String, Object> result = new HashMap<>();

        // 메시지 조회 테스트
        String messageKo = messageService.getMessage(key, "ko");
        String messageEn = messageService.getMessage(key, "en");

        result.put("key", key);
        result.put("message_ko", messageKo);
        result.put("message_en", messageEn);
        result.put("isLoaded", !messageKo.equals(key)); // 치환 여부

        return result;
    }

    @GetMapping("/message-count")
    @ResponseBody
    public Map<String, Object> messageCount() {
        Map<String, Object> result = new HashMap<>();

        // 여러 키 테스트
        String[] testKeys = {
                "COMMON_MENU.TOP_MENU_CODE",
                "COMMON_MENU.MENU_NAME",
                "COMMON_ICON.ICON_CLASS",
                "REGISTER_BTN",
                "CLOSE_BTN"
        };

        Map<String, String> messages = new HashMap<>();
        int loadedCount = 0;

        for (String key : testKeys) {
            String message = messageService.getMessage(key, "ko");
            messages.put(key, message);
            if (!message.equals(key)) {
                loadedCount++;
            }
        }

        result.put("total_tested", testKeys.length);
        result.put("loaded_count", loadedCount);
        result.put("messages", messages);

        return result;
    }
}
