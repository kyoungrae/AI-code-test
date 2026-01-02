package com.system.common.util.guid;

import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
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

    /**
     * 지정된 경로의 JavaScript 파일들을 스캔하여 JSDoc 주석 및 소스 코드를 추출
     * 
     * @param pattern 파일 패턴 (예: "classpath:static/common/js/common/.js")
     * @return JSDoc 정보
     *         리스트 및
     *         전체 파일 내용
     */

    public List<Map<String, Object>> parseJavaScriptFiles(String pattern) {
        List<Map<String, Object>> guidList = new ArrayList<>();

        try {
            PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
            Resource[] resources = resolver.getResources(pattern);

            for (Resource resource : resources) {
                String fileName = resource.getFilename();
                if (fileName != null && fileName.endsWith(".js")) {
                    String fileContent = readFileContent(resource);
                    List<Map<String, Object>> functions = parseJSDocFromString(fileContent);

                    if (!functions.isEmpty() || !fileContent.isEmpty()) {
                        Map<String, Object> fileInfo = new HashMap<>();
                        fileInfo.put("fileName", fileName);
                        fileInfo.put("filePath", resource.getURL().getPath());
                        fileInfo.put("src", fileContent);
                        fileInfo.put("functions", functions);
                        guidList.add(fileInfo);
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return guidList;
    }

    /**
     * 리소스에서 파일 내용을 문자열로 읽어옴
     */
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

    /**
     * 문자열 컨텐츠에서 JSDoc 주석을 파싱하고 라인 번호 추출
     */
    private List<Map<String, Object>> parseJSDocFromString(String content) {
        List<Map<String, Object>> functions = new ArrayList<>();

        // JSDoc 패턴: /** ... */
        Pattern jsdocPattern = Pattern.compile("/\\*\\*([^*]|\\*(?!/))*\\*/", Pattern.DOTALL);
        Matcher matcher = jsdocPattern.matcher(content);

        while (matcher.find()) {
            String jsdoc = matcher.group();
            int startFilter = matcher.start();

            // 라인 번호 계산 (1-based)
            int lineNumber = 1;
            for (int i = 0; i < startFilter; i++) {
                if (content.charAt(i) == '\n') {
                    lineNumber++;
                }
            }

            Map<String, Object> functionInfo = parseJSDocComment(jsdoc);

            if (functionInfo != null && !functionInfo.isEmpty()) {
                functionInfo.put("lineNumber", lineNumber);
                functions.add(functionInfo);
            }
        }
        return functions;
    }

    /**
     * JSDoc 주석 문자열을 파싱하여 정보 추출
     */
    private Map<String, Object> parseJSDocComment(String jsdoc) {
        Map<String, Object> info = new HashMap<>();

        Pattern titlePattern = Pattern.compile("@title\\s*:\\s*(.+)");
        Matcher titleMatcher = titlePattern.matcher(jsdoc);
        if (titleMatcher.find())
            info.put("title", titleMatcher.group(1).trim());

        Pattern textPattern = Pattern.compile("@text\\s*:\\s*(.+)");
        Matcher textMatcher = textPattern.matcher(jsdoc);
        if (textMatcher.find())
            info.put("text", textMatcher.group(1).trim());

        Pattern paramPattern = Pattern.compile("@param\\s*:\\s*(.+)");
        Matcher paramMatcher = paramPattern.matcher(jsdoc);
        StringBuilder params = new StringBuilder();
        while (paramMatcher.find()) {
            if (params.length() > 0)
                params.append(", ");
            params.append(paramMatcher.group(1).trim());
        }
        if (params.length() > 0)
            info.put("param", params.toString());

        Pattern returnPattern = Pattern.compile("@return\\s*:\\s*(.+)");
        Matcher returnMatcher = returnPattern.matcher(jsdoc);
        if (returnMatcher.find())
            info.put("return", returnMatcher.group(1).trim());

        Pattern datePattern = Pattern.compile("@date\\s*:\\s*(.+)");
        Matcher dateMatcher = datePattern.matcher(jsdoc);
        if (dateMatcher.find())
            info.put("date", dateMatcher.group(1).trim());

        Pattern writerPattern = Pattern.compile("@writer\\s*:\\s*(.+)");
        Matcher writerMatcher = writerPattern.matcher(jsdoc);
        if (writerMatcher.find())
            info.put("writer", writerMatcher.group(1).trim());

        return info.containsKey("title") ? info : null;
    }

    /**
     * 샘플 데이터 생성 (테스트용)
     */
    public List<Map<String, Object>> getSampleGuidData() {
        List<Map<String, Object>> guidList = new ArrayList<>();

        Map<String, Object> calendarUtils = new HashMap<>();
        calendarUtils.put("fileName", "CalendarUtils.js");
        calendarUtils.put("filePath", "/common/js/common/utils/CalendarUtils.js");

        String sampleSrc = "/**\n" +
                " * @title : giCalendarSeletedDate\n" +
                " * @text : 캘린더 날짜 조회\n" +
                " * @return : YYYY-MM-DD\n" +
                " * @writer : 이경태\n" +
                " * */\n" +
                "FormUtility.prototype.giCalendarSeletedDate = function () {\n" +
                "    return giCalendarSeletedDateList;\n" +
                "}\n" +
                "\n" +
                "/**\n" +
                " * @title : giCalendar\n" +
                " * @date : new Date() 객체 파라미터 [new Date()]\n" +
                " * @text : < div id='gi-calendar-main'> < /div> \" 생성 후 사용(필수)\n" +
                " * @writer : 이경태\n" +
                " * */\n" +
                "FormUtility.prototype.giCalendar = function (e) {\n" +
                "    // ... implementation \n" +
                "}";

        calendarUtils.put("src", sampleSrc);

        List<Map<String, Object>> functions = new ArrayList<>();

        Map<String, Object> func1 = new HashMap<>();
        func1.put("title", "giCalendarSeletedDate");
        func1.put("text", "캘린더 날짜 조회");
        func1.put("return", "YYYY-MM-DD");
        func1.put("writer", "이경태");
        func1.put("lineNumber", 1);
        functions.add(func1);

        Map<String, Object> func2 = new HashMap<>();
        func2.put("title", "giCalendar");
        func2.put("date", "new Date() 객체 파라미터 [new Date()]");
        func2.put("text", "<div id='gi-calendar-main'></div> 생성 후 사용(필수)");
        func2.put("writer", "이경태");
        func2.put("lineNumber", 10);
        functions.add(func2);

        calendarUtils.put("functions", functions);
        guidList.add(calendarUtils);

        return guidList;
    }
}
