package com.vims.common.guid;

import org.springframework.stereotype.Service;

import java.io.File;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.*;

@Service
public class CssGuidService {

    public List<Map<String, Object>> parseCssFiles(File directory) {
        List<Map<String, Object>> fileList = new ArrayList<>();

        if (directory.exists() && directory.isDirectory()) {
            File[] files = directory.listFiles((d, name) -> name.endsWith(".css"));
            if (files != null) {
                Arrays.sort(files, Comparator.comparing(File::getName));

                for (File file : files) {
                    try {
                        Map<String, Object> fileData = new HashMap<>();
                        fileData.put("fileName", file.getName());
                        fileData.put("filePath", file.getAbsolutePath());

                        String content = Files.readString(file.toPath(), StandardCharsets.UTF_8);
                        fileData.put("functions", parseCssContent(content));

                        fileList.add(fileData);
                    } catch (Exception e) {
                        System.err.println("Error reading CSS file: " + file.getName());
                        e.printStackTrace();
                    }
                }
            }
        }
        return fileList;
    }

    private List<Map<String, Object>> parseCssContent(String content) {
        List<Map<String, Object>> items = new ArrayList<>();
        String[] lines = content.split("\n");

        Map<String, Object> currentSection = null;
        StringBuilder codeBuffer = new StringBuilder();
        StringBuilder preHeaderBuffer = new StringBuilder();

        for (int i = 0; i < lines.length; i++) {
            String line = lines[i];
            String trimmedLine = line.trim();
            String sectionTitle = getSectionTitle(trimmedLine);

            if (sectionTitle != null) {
                if (currentSection != null) {
                    currentSection.put("src", codeBuffer.toString());
                    items.add(currentSection);
                }
                currentSection = new HashMap<>();
                currentSection.put("title", sectionTitle);
                currentSection.put("text", "CSS Style Group");
                currentSection.put("lineNumber", i + 1);
                currentSection.put("param", "Group");
                currentSection.put("return", "-");
                currentSection.put("writer", "-");
                currentSection.put("date", "-");

                codeBuffer = new StringBuilder();
                codeBuffer.append(line).append("\n");
            } else {
                if (currentSection != null) {
                    codeBuffer.append(line).append("\n");
                } else {
                    preHeaderBuffer.append(line).append("\n");
                }
            }
        }

        if (currentSection != null) {
            currentSection.put("src", codeBuffer.toString());
            items.add(currentSection);
        }

        if (items.isEmpty()) {
            Map<String, Object> item = new HashMap<>();
            String fullContent = preHeaderBuffer.toString();
            if (!fullContent.trim().isEmpty()) {
                item.put("title", "전체 스타일");
                item.put("text", "Full CSS Content");
                item.put("lineNumber", 1);
                item.put("src", fullContent);
                item.put("param", "File");
                item.put("return", "-");
                item.put("writer", "-");
                item.put("date", "-");
                items.add(item);
            }
        }

        return items;
    }

    private String getSectionTitle(String line) {
        if (line.startsWith("/*") && line.contains("=")) {
            String temp = line.replace("/*", "").replace("*/", "").trim();
            String title = temp.replaceAll("[=]+", "").trim();
            if (!title.isEmpty())
                return title;
        }
        return null;
    }
}
