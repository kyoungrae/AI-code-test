package com.system.common.util.guid;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * @title : DeveloperGuidService
 * @text : JavaScript 파일의 JSDoc 주석을 파싱하여 개발 가이드 데이터를 생성하는 서비스
 * @writer : AI Assistant
 */
@Service
public class DeveloperGuidService {

    public List<Map<String, Object>> parseJavaScriptFiles(String locationPattern) {
        List<Map<String, Object>> guidList = new ArrayList<>();
        System.out.println(">>> [DeveloperGuide] Parsing Start. Pattern: " + locationPattern);

        try {
            if (locationPattern.startsWith("file:") && !locationPattern.contains("*")) {
                String rootPathStr = locationPattern.substring(5);
                File rootDir = new File(rootPathStr);
                if (rootDir.exists() && rootDir.isDirectory()) {
                    recursiveScan(rootDir, guidList);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        System.out.println(">>> [DeveloperGuide] Parsing Finished. Total files found: " + guidList.size());
        return guidList;
    }

    private void recursiveScan(File directory, List<Map<String, Object>> guidList) {
        File[] files = directory.listFiles();
        if (files == null)
            return;

        for (File file : files) {
            if (file.isDirectory()) {
                String dirName = file.getName();
                if (dirName.startsWith(".") || dirName.equals("target") || dirName.equals("node_modules"))
                    continue;
                recursiveScan(file, guidList);
            } else {
                String path = file.getAbsolutePath().replace("\\", "/");
                // 수정: 요청하신대로 common/js/common 폴더 내의 파일만 스캔 (하위 폴더 포함)
                if (path.endsWith(".js") && path.contains("/common/js/common")) {
                    System.out.println(">>> [DeveloperGuide] Found JS File: " + path);
                    FileSystemResource resource = new FileSystemResource(file);
                    processResource(resource, guidList);
                }
            }
        }
    }

    private void processResource(Resource resource, List<Map<String, Object>> guidList) {
        try {
            String fileName = resource.getFilename();
            String fileContent = readFileContent(resource);
            List<Map<String, Object>> functions = parseJSDocFromString(fileContent);

            if (!functions.isEmpty() || !fileContent.isEmpty()) {
                Map<String, Object> fileInfo = new HashMap<>();
                fileInfo.put("fileName", fileName);
                try {
                    fileInfo.put("filePath", resource.getURL().getPath());
                } catch (Exception e) {
                    fileInfo.put("filePath", fileName);
                }
                fileInfo.put("src", fileContent);
                fileInfo.put("functions", functions);
                guidList.add(fileInfo);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private String readFileContent(Resource resource) {
        StringBuilder content = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {
            String line;
            while ((line = reader.readLine()) != null) {
                content.append(line).append("\n");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return content.toString();
    }

    private List<Map<String, Object>> parseJSDocFromString(String content) {
        List<Map<String, Object>> functions = new ArrayList<>();

        Pattern jsdocPattern = Pattern.compile("/\\*\\*([^*]|\\*(?!/))*\\*/", Pattern.DOTALL);
        Matcher matcher = jsdocPattern.matcher(content);

        while (matcher.find()) {
            String jsdoc = matcher.group();
            int startIdx = matcher.start();
            int endIdx = matcher.end();

            int lineNumber = 1;
            for (int i = 0; i < startIdx; i++) {
                if (content.charAt(i) == '\n')
                    lineNumber++;
            }

            Map<String, Object> functionInfo = parseJSDocComment(jsdoc);

            // @title이 없으면 대체 제목 생성
            if (!functionInfo.containsKey("title")) {
                if (functionInfo.containsKey("text")) {
                    functionInfo.put("title", functionInfo.get("text"));
                } else {
                    // 다음 줄 분석하여 함수명 추출
                    String nextCodeBlock = getNextNonEmptyLine(content, endIdx);
                    String extractedName = extractFunctionName(nextCodeBlock);
                    if (extractedName != null) {
                        functionInfo.put("title", extractedName);
                    } else {
                        functionInfo.put("title", "Anonymous Function (L" + lineNumber + ")");
                    }
                }
            }

            // 필수 정보가 없더라도 위치 정보는 저장하여 표시 (빈 JSDoc 블록이라도)
            functionInfo.put("lineNumber", lineNumber);
            functions.add(functionInfo);
        }
        return functions;
    }

    private String getNextNonEmptyLine(String content, int startIndex) {
        int length = content.length();
        int i = startIndex;
        while (i < length) {
            char c = content.charAt(i);
            if (!Character.isWhitespace(c)) {
                break;
            }
            i++;
        }

        if (i >= length)
            return "";

        int lineEnd = content.indexOf('\n', i);
        if (lineEnd == -1)
            lineEnd = length;

        return content.substring(i, lineEnd).trim();
    }

    private String extractFunctionName(String line) {
        if (line == null || line.isEmpty())
            return null;

        // Pattern 1: function myFunc()
        Pattern p1 = Pattern.compile("function\\s+([a-zA-Z0-9_$]+)");
        Matcher m1 = p1.matcher(line);
        if (m1.find())
            return m1.group(1);

        // Pattern 2: myFunc = function() or myFunc: function()
        Pattern p2 = Pattern.compile("([a-zA-Z0-9_$]+)\\s*[:=]\\s*function");
        Matcher m2 = p2.matcher(line);
        if (m2.find())
            return m2.group(1);

        // Pattern 3: Prototype like FormUtility.prototype.func = ...
        Pattern p3 = Pattern.compile("\\.([a-zA-Z0-9_$]+)\\s*=");
        Matcher m3 = p3.matcher(line);
        if (m3.find())
            return m3.group(1);

        return line; // Fallback to the line itself (cropped)
    }

    private Map<String, Object> parseJSDocComment(String jsdoc) {
        Map<String, Object> info = new HashMap<>();

        Pattern titlePattern = Pattern.compile("@title\\s*[:\\s]\\s*(.+)"); // 콜론 또는 공백 허용
        Matcher titleMatcher = titlePattern.matcher(jsdoc);
        if (titleMatcher.find())
            info.put("title", titleMatcher.group(1).trim());

        Pattern textPattern = Pattern.compile("@text\\s*[:\\s]\\s*(.+)");
        Matcher textMatcher = textPattern.matcher(jsdoc);
        if (textMatcher.find())
            info.put("text", textMatcher.group(1).trim());

        Pattern paramPattern = Pattern.compile("@param\\s*[:\\s]\\s*(.+)");
        Matcher paramMatcher = paramPattern.matcher(jsdoc);
        StringBuilder params = new StringBuilder();
        while (paramMatcher.find()) {
            if (params.length() > 0)
                params.append(", ");
            params.append(paramMatcher.group(1).trim());
        }
        if (params.length() > 0)
            info.put("param", params.toString());

        Pattern returnPattern = Pattern.compile("@return\\s*[:\\s]\\s*(.+)");
        Matcher returnMatcher = returnPattern.matcher(jsdoc);
        if (returnMatcher.find())
            info.put("return", returnMatcher.group(1).trim());

        Pattern datePattern = Pattern.compile("@date\\s*[:\\s]\\s*(.+)");
        Matcher dateMatcher = datePattern.matcher(jsdoc);
        if (dateMatcher.find())
            info.put("date", dateMatcher.group(1).trim());

        Pattern writerPattern = Pattern.compile("@writer\\s*[:\\s]\\s*(.+)");
        Matcher writerMatcher = writerPattern.matcher(jsdoc);
        if (writerMatcher.find())
            info.put("writer", writerMatcher.group(1).trim());

        return info;
    }

    public List<Map<String, Object>> getSampleGuidData() {
        return new ArrayList<>();
    }
}
