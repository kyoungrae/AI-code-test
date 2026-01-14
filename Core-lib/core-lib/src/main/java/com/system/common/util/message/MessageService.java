package com.system.common.util.message;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.stereotype.Component;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
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

    @Value("${message.gateway.url:}")
    private String gatewayUrl; // 예: http://localhost:8080

    @PostConstruct
    public void init() {
        loadAllMessages("ko");
        loadAllMessages("en");
        loadAllMessages("mo");
    }

    private void loadAllMessages(String locale) {
        List<String> jsFiles = getJsFiles();

        // 로컬에 파일이 없으면 기본 메시지 파일 목록 사용 (Gateway를 통해 로드하기 위해)
        if (jsFiles.isEmpty()) {
            System.out.println("⚠️  로컬 리소스에서 JS 파일을 찾을 수 없습니다. Gateway를 통해 기본 메시지 파일들을 시도합니다.");
            jsFiles = getDefaultMessageFiles();
        }

        for (String baseName : jsFiles) {
            String fileName = locale.equals("en") ? baseName + ".en.js" : baseName + ".js";
            loadMessagesFromFile(fileName, locale);
        }
    }

    // 기본 메시지 파일 목록 (Gateway 또는 로컬 messageConfig.js에서 동적으로 로드)
    private List<String> getDefaultMessageFiles() {
        System.out.println("🔍 messageConfig.js에서 메시지 파일 목록을 동적으로 조회를 시도합니다.");
        List<String> dynamicFiles = loadFilesFromConfig();

        if (dynamicFiles != null && !dynamicFiles.isEmpty()) {
            if (!dynamicFiles.contains("Message")) {
                dynamicFiles.add(0, "Message");
            }
            System.out.println("✅ 메시지 파일 목록 (" + dynamicFiles.size() + "개)을 구성했습니다.");
            return dynamicFiles;
        }

        // 최후의 보루: 최소한의 기본 파일만 반환 (혹은 로그 출력)
        System.err.println("⚠️  messageConfig.js 로드 실패. 최소한의 기본 설정으로 진행합니다.");
        List<String> fallback = new ArrayList<>();
        fallback.add("Message");
        return fallback;
    }

    private List<String> loadFilesFromConfig() {
        List<String> files = new ArrayList<>();
        String configPath = "static/common/js/messageConfig.js";
        String content = "";

        // 1. 로컬에서 먼저 시도
        try (InputStream is = getClass().getClassLoader().getResourceAsStream(configPath)) {
            if (is != null) {
                content = new String(is.readAllBytes(), StandardCharsets.UTF_8);
                System.out.println("  ✓ 로컬에서 messageConfig.js를 발견했습니다.");
            }
        } catch (IOException e) {
            System.err.println("  ✗ 로컬 messageConfig.js 읽기 오류");
        }

        // 2. 로컬에 없으면 Gateway에서 시도
        if (content.isEmpty() && gatewayUrl != null && !gatewayUrl.isEmpty()) {
            String fullUrl = gatewayUrl + "/common/js/messageConfig.js";
            try {
                URL url = new URL(fullUrl);
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                if (conn.getResponseCode() == 200) {
                    try (InputStream is = conn.getInputStream()) {
                        content = new String(is.readAllBytes(), StandardCharsets.UTF_8);
                        System.out.println("  ✓ Gateway에서 messageConfig.js를 로드했습니다.");
                    }
                }
            } catch (Exception e) {
                System.err.println("  ✗ Gateway에서 messageConfig.js 로드 실패: " + fullUrl);
            }
        }

        // 3. 내용이 있으면 파싱 (정규표현식으로 scriptsToLoad 배열 내부 추출)
        if (!content.isEmpty()) {
            // "management/ComMenuMessage" 또는 'management/ComMenuMessage' 형태 추출
            Pattern pattern = Pattern.compile("[\"']([^\"']+)[\"']");
            Matcher matcher = pattern.matcher(content);
            while (matcher.find()) {
                String fileName = matcher.group(1);
                // js 확장자나 경로가 포함되어 있어도 처리 가능하게 함 (기존 로직 호환)
                if (fileName.contains("Message")) {
                    files.add(fileName);
                }
            }
        }

        return files;
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

        // 로컬에서 찾지 못하면 Gateway URL을 통해 시도
        if (gatewayUrl != null && !gatewayUrl.isEmpty()) {
            System.out.println("  → Gateway를 통해 메시지 로드 시도: " + fileName);
            if (loadMessagesFromGateway(fileName, locale)) {
                return;
            }
        }

        // 파일을 찾을 수 없으면 경고 메시지 출력
        System.err.println("  ✗ 경고: " + fileName + " 파일을 어떤 경로에서도 찾을 수 없습니다.");
    }

    // Gateway URL을 통해 메시지를 로드하는 함수
    private boolean loadMessagesFromGateway(String fileName, String locale) {
        String[] gatewayPaths = {
                "/common/js/common/" + fileName,
                "/common/js/message/" + fileName,
                "/common/js/message/login/" + fileName,
                "/common/js/message/management/" + fileName,
                "/common/js/message/fms/" + fileName,
                "/common/js/message/gateway/" + fileName
        };

        for (String path : gatewayPaths) {
            String fullUrl = gatewayUrl + path;
            try {
                System.out.println("    Gateway URL 시도: " + fullUrl);
                URL url = new URL(fullUrl);
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("GET");
                conn.setConnectTimeout(5000);
                conn.setReadTimeout(5000);

                int responseCode = conn.getResponseCode();
                if (responseCode == 200) {
                    try (InputStream inputStream = conn.getInputStream()) {
                        System.out.println("  ✓ Gateway에서 파일 로드 성공: " + fullUrl);
                        parseAndCacheMessages(inputStream, locale);
                        return true;
                    }
                } else {
                    System.err.println("    ✗ HTTP " + responseCode + ": " + fullUrl);
                }
            } catch (Exception e) {
                System.err.println("    ✗ Gateway 로드 실패: " + fullUrl + " - " + e.getMessage());
            }
        }
        return false;
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