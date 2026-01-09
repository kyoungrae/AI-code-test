package com.vims.common.guid;

import org.springframework.stereotype.Service;
import java.io.File;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * @title : MarkdownGuidService
 * @text : Markdown 파일을 파싱하여 개발 가이드 데이터를 생성하는 서비스
 * @writer : 이경태
 */
@Service
public class MarkdownGuidService {

    public List<Map<String, Object>> parseMarkdownFiles(File directory) {
        List<Map<String, Object>> fileList = new ArrayList<>();
        if (directory.exists() && directory.isDirectory()) {
            recursiveScan(directory, fileList);
        }
        return fileList;
    }

    private void recursiveScan(File directory, List<Map<String, Object>> fileList) {
        File[] files = directory.listFiles();
        if (files == null)
            return;

        for (File file : files) {
            if (file.isDirectory()) {
                String name = file.getName();
                if (name.startsWith(".") || name.equals("target") || name.equals("node_modules")
                        || name.equals("bin")) {
                    continue;
                }
                recursiveScan(file, fileList);
            } else {
                String name = file.getName();
                if (name.startsWith("WEB_") && name.endsWith(".md")) {
                    try {
                        Map<String, Object> fileData = new HashMap<>();
                        fileData.put("fileName", name);
                        fileData.put("filePath", file.getAbsolutePath());

                        String content = Files.readString(file.toPath(), StandardCharsets.UTF_8);
                        fileData.put("examples", parseMarkdownContent(content));

                        fileList.add(fileData);
                    } catch (Exception e) {
                        System.err.println("Error reading Markdown file: " + file.getName());
                        e.printStackTrace();
                    }
                }
            }
        }
    }

    private List<Map<String, Object>> parseMarkdownContent(String content) {
        List<Map<String, Object>> examples = new ArrayList<>();

        // Split by "## @title" to separate different examples
        String[] blocks = content.split("(?=## @title)");

        for (String block : blocks) {
            if (block.trim().isEmpty())
                continue;

            Map<String, Object> example = new HashMap<>();

            // Extract metadata
            example.put("title", extractMetadata(block, "title"));
            example.put("type", extractMetadata(block, "type"));
            example.put("date", extractMetadata(block, "date"));
            example.put("author", extractMetadata(block, "author"));
            example.put("extend", extractMetadata(block, "extend"));
            example.put("call", extractMetadata(block, "call"));

            // Extract example content
            String exampleContent = "";
            Pattern p = Pattern.compile("\\*\\*example start\\*\\*(.*?)\\*\\*example end\\*\\*", Pattern.DOTALL);
            Matcher m = p.matcher(block);
            if (m.find()) {
                exampleContent = m.group(1).trim();
            }
            example.put("content", exampleContent);

            if (example.get("title") != null) {
                examples.add(example);
            }
        }

        return examples;
    }

    private String extractMetadata(String block, String key) {
        Pattern p = Pattern.compile("## @" + key + "\\s*:\\s*(.*)");
        Matcher m = p.matcher(block);
        if (m.find()) {
            return m.group(1).trim();
        }
        return null;
    }
}
