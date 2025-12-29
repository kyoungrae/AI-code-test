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

        // 모든 하위 디렉토리를 포함하여 JS 파일 목록을 동적으로 추가
        addJsFilesFromResources(jsFiles, resolver, "classpath*:/static/common/js/common/*.js");
        addJsFilesFromResources(jsFiles, resolver, "classpath*:/static/common/js/message/**/*.js");

        System.out.println("=== MessageService: 로드된 JS 파일 목록 ===");
        for (String file : jsFiles) {
            System.out.println(" - " + file);
        }
        System.out.println("=== 총 " + jsFiles.size() + "개 파일 발견 ===");

        return jsFiles;
    }

    // 리소스에서 JS 파일 목록 추가하는 함수
    private static void addJsFilesFromResources(List<String> jsFiles, PathMatchingResourcePatternResolver resolver,
            String path) {
        try {
            System.out.println("JS 파일 경로 탐색: " + path);
            Resource[] resources = resolver.getResources(path);
            System.out.println("발견된 리소스 수: " + resources.length);

            for (Resource resource : resources) {
                String fileName = resource.getFilename();
                if (fileName != null && fileName.endsWith(".js")) {
                    jsFiles.add(fileName.replace(".js", "")); // 확장자 제거 후 추가
                    System.out.println("  ✓ 추가: " + fileName + " (URI: " + resource.getURI() + ")");
                }
            }
        } catch (FileNotFoundException e) {
            System.err.println("파일 경로가 없습니다: " + path);
        } catch (IOException e) {
            System.err.println("파일 로드 오류: " + path);
            e.printStackTrace();
        }
    }

    // 메시지를 파일에서 읽어 캐시하는 함수
    private void loadMessagesFromFile(String fileName, String locale) {
        // 두 경로에서 파일을 찾는다
        List<String> resourcePaths = getResourcePaths(fileName);
        System.out.println("메시지 파일 로드 시도: " + fileName + " (locale: " + locale + ")");

        // 두 경로 중 하나라도 존재하면 파일을 로드
        for (String resourcePath : resourcePaths) {
            try (InputStream inputStream = getClass().getClassLoader().getResourceAsStream(resourcePath)) {
                if (inputStream == null) {
                    System.err.println("  ✗ 파일을 찾을 수 없음: " + resourcePath);
                    continue; // 다음 경로로 시도
                }
                System.out.println("  ✓ 파일 로드 성공: " + resourcePath);
                parseAndCacheMessages(inputStream, locale);
                return; // 첫 번째 파일을 찾으면 더 이상 검색하지 않음
            } catch (IOException e) {
                System.err.println("  ✗ 파일 로드 중 오류: " + resourcePath);
                e.printStackTrace();
            }
        }

        // 파일을 찾을 수 없으면 경고 메시지 출력
        System.err.println("  ✗ 경고: " + fileName + " 파일을 어떤 경로에서도 찾을 수 없습니다.");
    }

    // 리소스 경로 반환
    private List<String> getResourcePaths(String fileName) {
        List<String> paths = new ArrayList<>();

        // 여러 경로에서 찾기
        String[] searchPaths = {
                "static/common/js/common/" + fileName,
                "static/common/js/message/" + fileName,
                "static/common/js/message/login/" + fileName,
                "static/common/js/message/management/" + fileName,
                "static/common/js/message/fms/" + fileName,
                "static/common/js/message/gateway/" + fileName
        };

        // 각 경로가 존재하면 paths 리스트에 추가
        for (String searchPath : searchPaths) {
            if (getClass().getClassLoader().getResource(searchPath) != null) {
                paths.add(searchPath);
                System.out.println("    찾은 경로: " + searchPath);
            }
        }

        return paths;
    }

    // 메시지 파일을 파싱하고 캐시하는 함수
    private void parseAndCacheMessages(InputStream inputStream, String locale) {
        try {
            String content = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
            Pattern pattern = Pattern.compile("Message\\.Label\\.Array\\[\"(.*?)\"\\]\\s*=\\s*\"(.*?)\";");
            Matcher matcher = pattern.matcher(content);

            messageCache.putIfAbsent(locale, new HashMap<>());
            Map<String, String> localeMessages = messageCache.get(locale);

            int messageCount = 0;
            while (matcher.find()) {
                String key = matcher.group(1);
                String value = matcher.group(2);
                localeMessages.put(key, value);
                messageCount++;
            }
            System.out.println("    → 파싱된 메시지 수: " + messageCount);
        } catch (IOException e) {
            System.err.println("    ✗ 파싱 중 오류 발생");
            e.printStackTrace();
        }
    }

    // 키에 해당하는 메시지를 반환, 없으면 키를 그대로 반환
    public String getMessage(String key, String locale) {
        return messageCache.getOrDefault(locale, new HashMap<>()).getOrDefault(key, key);
    }
}