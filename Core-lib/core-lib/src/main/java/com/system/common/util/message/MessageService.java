package com.system.common.util.message;

import jakarta.annotation.PostConstruct;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.stereotype.Component;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class MessageService {
    private final Map<String, Map<String, String>> messageCache = new HashMap<>();

    @PostConstruct
    public void init() {
        loadAllMessages("ko");
        loadAllMessages("en");
        loadAllMessages("mo");
    }

    private void loadAllMessages(String locale) {
        for (String baseName : getJsFiles()) {
            String fileName = locale.equals("en") ? baseName + ".en.js" : baseName + ".js";
            loadMessagesFromFile(fileName, locale);
        }
    }

    // JS 파일 목록을 동적으로 조회
    public static List<String> getJsFiles() {
        List<String> jsFiles = new ArrayList<>();
        PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();

        // 두 경로에서 JS 파일 목록을 동적으로 추가
        addJsFilesFromResources(jsFiles, resolver, "classpath:/static/common/js/common/*.js");
        addJsFilesFromResources(jsFiles, resolver, "classpath:/static/common/js/message/*.js");

        return jsFiles;
    }

    // 리소스에서 JS 파일 목록 추가하는 함수
    private static void addJsFilesFromResources(List<String> jsFiles, PathMatchingResourcePatternResolver resolver, String path) {
        try {
//            System.out.println("JS 파일 경로 탐색:");
//            Resource[] resources1= resolver.getResources("classpath*:**/*.js");
//            for (Resource r : resources1) {
//                System.out.println(" - " + r.getURI());
//            }
            Resource[] resources = resolver.getResources(path);
            for (Resource resource : resources) {
                String fileName = resource.getFilename();
                if (fileName != null && fileName.endsWith(".js")) {
                    jsFiles.add(fileName.replace(".js", "")); // 확장자 제거 후 추가
                }
            }
        } catch (FileNotFoundException e) {
//            System.err.println("파일 경로가 없습니다");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // 메시지를 파일에서 읽어 캐시하는 함수
    private void loadMessagesFromFile(String fileName, String locale) {
        // 두 경로에서 파일을 찾는다
        List<String> resourcePaths = getResourcePaths(fileName);

        // 두 경로 중 하나라도 존재하면 파일을 로드
        for (String resourcePath : resourcePaths) {
            try (InputStream inputStream = getClass().getClassLoader().getResourceAsStream(resourcePath)) {
                if (inputStream == null) {
//                    System.err.println(resourcePath + " 파일을 찾을 수 없습니다.");
                    continue;  // 다음 경로로 시도
                }
                parseAndCacheMessages(inputStream, locale);
                return;  // 첫 번째 파일을 찾으면 더 이상 검색하지 않음
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        // 파일을 찾을 수 없으면 경고 메시지 출력
//        System.err.println(fileName + " 파일을 찾을 수 없습니다. 경로를 확인해주세요.");
    }

    // 리소스 경로 반환
    private List<String> getResourcePaths(String fileName) {
        List<String> paths = new ArrayList<>();

        // 두 경로에서 모두 찾기
        String commonPath = "static/common/js/common/" + fileName;
        String messagePath = "static/common/js/message/" + fileName;

        // 각 경로가 존재하면 paths 리스트에 추가
        if (getClass().getClassLoader().getResource(commonPath) != null) {
            paths.add(commonPath);
        }
        if (getClass().getClassLoader().getResource(messagePath) != null) {
            paths.add(messagePath);
        }

        return paths;  // 두 경로 중 존재하는 경로들을 반환
    }

    // 메시지 파일을 파싱하고 캐시하는 함수
    private void parseAndCacheMessages(InputStream inputStream, String locale) {
        try {
            String content = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
            Pattern pattern = Pattern.compile("Message\\.Label\\.Array\\[\"(.*?)\"\\]\\s*=\\s*\"(.*?)\";");
            Matcher matcher = pattern.matcher(content);

            messageCache.putIfAbsent(locale, new HashMap<>());
            Map<String, String> localeMessages = messageCache.get(locale);

            while (matcher.find()) {
                String key = matcher.group(1);
                String value = matcher.group(2);
                localeMessages.put(key, value);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // 키에 해당하는 메시지를 반환, 없으면 키를 그대로 반환
    public String getMessage(String key, String locale) {
        return messageCache.getOrDefault(locale, new HashMap<>()).getOrDefault(key, key);
    }
}