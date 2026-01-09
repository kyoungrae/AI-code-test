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

            // [Filtering Logic]
            // 사용자 요청: "@title을 기준으로 Dev Guide System 목록에 나와야 하며 title이 없는 그냥 주석은 목록에 나오면
            // 안돼"
            // 따라서 @title 키가 없으면 무조건 제외합니다. (Description이나 Code 분석으로 제목을 만들지 않음)
            if (!functionInfo.containsKey("title")) {
                continue;
            }

            // 추가 정보: 코드 라인 분석 (타이틀이 있는 경우 함수 이름을 보조 정보로 활용할 수는 있음)
            // String nextCodeBlock = getNextNonEmptyLine(content, endIdx);
            // String extractedName = extractFunctionName(nextCodeBlock);

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

        // 1. Class definition: "class ClassName"
        Pattern pClass = Pattern.compile("class\\s+([a-zA-Z0-9_$]+)");
        Matcher mClass = pClass.matcher(line);
        if (mClass.find())
            return "class " + mClass.group(1);

        // 2. Prototype assignment: "ClassName.prototype.methodName = ..." -> returns
        // fully qualified name
        Pattern pProto = Pattern.compile("([a-zA-Z0-9_$]+\\.prototype\\.[a-zA-Z0-9_$]+)\\s*=");
        Matcher mProto = pProto.matcher(line);
        if (mProto.find())
            return mProto.group(1);

        // 3. Simple function: "function myFunc()"
        Pattern pFunc = Pattern.compile("function\\s+([a-zA-Z0-9_$]+)");
        Matcher mFunc = pFunc.matcher(line);
        if (mFunc.find())
            return mFunc.group(1);

        // 4. Variable assignment: "const myFunc = ..." or "myFunc: function"
        Pattern pVar = Pattern.compile("([a-zA-Z0-9_$]+)\\s*[:=]\\s*(function|\\(|new|class)");
        Matcher mVar = pVar.matcher(line);
        if (mVar.find())
            return mVar.group(1);

        // 5. Prototype method direct match (fallback): ".methodName ="
        Pattern pProtoSimple = Pattern.compile("\\.([a-zA-Z0-9_$]+)\\s*=");
        Matcher mProtoSimple = pProtoSimple.matcher(line);
        if (mProtoSimple.find())
            return mProtoSimple.group(1);

        // 6. jQuery Event Handler ($(...) or jQuery(...))
        if (line.startsWith("$(") || line.startsWith("jQuery(")) {
            return "Event Handler / Script";
        }

        // [중요] 그 외 일반 코드는 null 반환 (함수 정의 아님)
        return null;
    }

    private Map<String, Object> parseJSDocComment(String jsdoc) {
        Map<String, Object> info = new HashMap<>();

        String cleanContent = jsdoc.replaceAll("^/\\*+|\\*+/$", "");
        StringBuilder desc = new StringBuilder();
        String[] lines = cleanContent.split("\n");

        extractTag(jsdoc, "title", info);
        extractTag(jsdoc, "text", info);
        extractTag(jsdoc, "param", info);
        extractTag(jsdoc, "return", info);
        extractTag(jsdoc, "writer", info);
        extractTag(jsdoc, "date", info);

        for (String line : lines) {
            String trimmed = line.trim();
            if (trimmed.startsWith("*"))
                trimmed = trimmed.substring(1).trim();

            if (!trimmed.isEmpty() && !trimmed.startsWith("@")) {
                if (desc.length() > 0)
                    desc.append(" ");
                desc.append(trimmed);
            }
            if (trimmed.startsWith("@"))
                break;
        }

        if (desc.length() > 0) {
            info.put("description", desc.toString());
        }

        return info;
    }

    private void extractTag(String text, String tagName, Map<String, Object> info) {
        Pattern p = Pattern.compile("@" + tagName + "\\s*[:\\s]\\s*(.+)");
        Matcher m = p.matcher(text);
        if (m.find()) {
            info.put(tagName, m.group(1).trim());
        }
    }

    public List<Map<String, Object>> getSampleGuidData() {
        return new ArrayList<>();
    }
}
