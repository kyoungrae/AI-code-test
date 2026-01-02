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
     * 지정된 경로의 JavaScript 파일들을 스캔하여 JSDoc 주석을 추출
     * 
     * @param pattern 파일 패턴 (예: "classpath:static/common/js/common/.js")
     * @return JSDoc 정보 리스트
     *
     */

    public List<Map<String, Object>> parseJavaScriptFiles(String pattern) {
        List<Map<String, Object>> guidList = new ArrayList<>();

        try {
            PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
            Resource[] resources = resolver.getResources(pattern);

            for (Resource resource : resources) {
                String fileName = resource.getFilename();
                if (fileName != null && fileName.endsWith(".js")) {
                    List<Map<String, String>> functions = parseJSDocFromFile(resource);

                    if (!functions.isEmpty()) {
                        Map<String, Object> fileInfo = new HashMap<>();
                        fileInfo.put("fileName", fileName);
                        fileInfo.put("filePath", resource.getURL().getPath());
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
     * 단일 JavaScript 파일에서 JSDoc 주석을 파싱
     * 
     * @param resource JavaScript 파일 리소스
     * @return 함수 정보 리스트
     */
    private List<Map<String, String>> parseJSDocFromFile(Resource resource) {
        List<Map<String, String>> functions = new ArrayList<>();

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {

            StringBuilder content = new StringBuilder();
            String line;

            while ((line = reader.readLine()) != null) {
                content.append(line).append("\n");
            }

            // JSDoc 패턴: /** ... */
            Pattern jsdocPattern = Pattern.compile("/\\*\\*([^*]|\\*(?!/))*\\*/", Pattern.DOTALL);
            Matcher matcher = jsdocPattern.matcher(content.toString());

            while (matcher.find()) {
                String jsdoc = matcher.group();
                Map<String, String> functionInfo = parseJSDocComment(jsdoc);

                if (functionInfo != null && !functionInfo.isEmpty()) {
                    functions.add(functionInfo);
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return functions;
    }

    /**
     * JSDoc 주석 문자열을 파싱하여 정보 추출
     * 
     * @param jsdoc JSDoc 주석 문자열
     * @return 함수 정보 맵
     */
    private Map<String, String> parseJSDocComment(String jsdoc) {
        Map<String, String> info = new HashMap<>();

        // @title 추출
        Pattern titlePattern = Pattern.compile("@title\\s*:\\s*(.+)");
        Matcher titleMatcher = titlePattern.matcher(jsdoc);
        if (titleMatcher.find()) {
            info.put("title", titleMatcher.group(1).trim());
        }

        // @text 추출
        Pattern textPattern = Pattern.compile("@text\\s*:\\s*(.+)");
        Matcher textMatcher = textPattern.matcher(jsdoc);
        if (textMatcher.find()) {
            info.put("text", textMatcher.group(1).trim());
        }

        // @param 추출 (여러 개 가능)
        Pattern paramPattern = Pattern.compile("@param\\s*:\\s*(.+)");
        Matcher paramMatcher = paramPattern.matcher(jsdoc);
        StringBuilder params = new StringBuilder();
        while (paramMatcher.find()) {
            if (params.length() > 0) {
                params.append(", ");
            }
            params.append(paramMatcher.group(1).trim());
        }
        if (params.length() > 0) {
            info.put("param", params.toString());
        }

        // @return 추출
        Pattern returnPattern = Pattern.compile("@return\\s*:\\s*(.+)");
        Matcher returnMatcher = returnPattern.matcher(jsdoc);
        if (returnMatcher.find()) {
            info.put("return", returnMatcher.group(1).trim());
        }

        // @date 추출
        Pattern datePattern = Pattern.compile("@date\\s*:\\s*(.+)");
        Matcher dateMatcher = datePattern.matcher(jsdoc);
        if (dateMatcher.find()) {
            info.put("date", dateMatcher.group(1).trim());
        }

        // @writer 추출
        Pattern writerPattern = Pattern.compile("@writer\\s*:\\s*(.+)");
        Matcher writerMatcher = writerPattern.matcher(jsdoc);
        if (writerMatcher.find()) {
            info.put("writer", writerMatcher.group(1).trim());
        }

        // title이 있는 경우만 반환 (유효한 JSDoc으로 간주)
        return info.containsKey("title") ? info : null;
    }

    /**
     * 샘플 데이터 생성 (테스트용)
     * 
     * @return 샘플 가이드 데이터
     */
    public List<Map<String, Object>> getSampleGuidData() {
        List<Map<String, Object>> guidList = new ArrayList<>();

        // CalendarUtils.js 샘플 데이터
        Map<String, Object> calendarUtils = new HashMap<>();
        calendarUtils.put("fileName", "CalendarUtils.js");
        calendarUtils.put("filePath", "/common/js/common/utils/CalendarUtils.js");

        List<Map<String, String>> functions = new ArrayList<>();

        // giCalendarSeletedDate 함수
        Map<String, String> func1 = new HashMap<>();
        func1.put("title", "giCalendarSeletedDate");
        func1.put("text", "캘린더 날짜 조회");
        func1.put("return", "YYYY-MM-DD");
        func1.put("writer", "이경태");
        functions.add(func1);

        // giCalendar 함수
        Map<String, String> func2 = new HashMap<>();
        func2.put("title", "giCalendar");
        func2.put("date", "new Date() 객체 파라미터 [new Date()]");
        func2.put("text", "<div id='gi-calendar-main'></div> 생성 후 사용(필수)");
        func2.put("writer", "이경태");
        functions.add(func2);

        // searchHoliday 함수
        Map<String, String> func3 = new HashMap<>();
        func3.put("title", "searchHoliday");
        func3.put("text", "공공포탈 API 공휴일 정보 받아오는 함수");
        func3.put("writer", "이경태");
        functions.add(func3);

        calendarUtils.put("functions", functions);
        guidList.add(calendarUtils);

        return guidList;
    }
}
