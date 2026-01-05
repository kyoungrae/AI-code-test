package com.vims.common.guid;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.*;

@RestController
@RequestMapping("/cms/common/guid")
public class CssGuidController {

    @GetMapping("/css")
    public String cssGuidPage() {
        return "page/guid/cssGuid";
    }

    @GetMapping("/api/scanCss")
    public Map<String, Object> scanCssFiles() {
        Map<String, Object> result = new HashMap<>();
        List<Map<String, Object>> fileList = new ArrayList<>();

        try {
            String userDir = System.getProperty("user.dir");
            File currentDir = new File(userDir);

            // vims-management-system 등 하위 폴더에서 실행된 경우 상위로 이동
            if (currentDir.getName().startsWith("vims-")) {
                userDir = currentDir.getParent();
            }
            userDir = userDir.replace("\\", "/");

            // CSS 파일 경로 설정
            String targetPath = userDir + "/vims-login/src/main/resources/static/common/css/common";

            File dir = new File(targetPath);
            if (dir.exists() && dir.isDirectory()) {
                File[] files = dir.listFiles((d, name) -> name.endsWith(".css"));
                if (files != null) {
                    // 파일명 순 정렬
                    Arrays.sort(files, Comparator.comparing(File::getName));

                    for (File file : files) {
                        Map<String, Object> fileData = new HashMap<>();
                        fileData.put("fileName", file.getName());
                        fileData.put("filePath", file.getAbsolutePath());

                        // 파일 내용 읽기
                        String content = Files.readString(file.toPath(), StandardCharsets.UTF_8);
                        fileData.put("src", content);

                        // CSS 파싱 (Class 목록 추출)
                        List<Map<String, Object>> items = parseCssContent(content);
                        fileData.put("functions", items); // UI 트리 구조 호환을 위해 'functions' 키 사용

                        fileList.add(fileData);
                    }
                }
            }

            result.put("success", true);
            result.put("data", fileList);
            result.put("count", fileList.size());

        } catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
            e.printStackTrace();
        }

        return result;
    }

    private List<Map<String, Object>> parseCssContent(String content) {
        List<Map<String, Object>> items = new ArrayList<>();
        String[] lines = content.split("\n");

        for (int i = 0; i < lines.length; i++) {
            String line = lines[i].trim();

            // CSS Class definition (.class-name {) pattern
            if (line.startsWith(".") && line.contains("{")) {
                String title = line.replace("{", "").trim();

                // 콤마로 나열된 경우 너무 길면 자르기
                if (title.length() > 50) {
                    title = title.substring(0, 47) + "...";
                }

                Map<String, Object> item = new HashMap<>();
                item.put("title", title);
                item.put("text", "CSS Class Selector");
                item.put("lineNumber", i + 1);

                // JSDoc 필드 호환성을 위해 더미 데이터
                item.put("param", "-");
                item.put("return", "-");
                item.put("writer", "-");
                item.put("date", "-");

                items.add(item);
            }
            // Header Comment (/* ==== Title ==== */) pattern
            else if (line.startsWith("/*") && line.contains("=")) {
                String title = line.replace("/*", "").replace("*/", "").replace("=", "").trim();
                if (!title.isEmpty()) {
                    Map<String, Object> item = new HashMap<>();
                    item.put("title", "[Section] " + title);
                    item.put("text", "Section Header");
                    item.put("lineNumber", i + 1);
                    items.add(item);
                }
            }
        }
        return items;
    }
}
