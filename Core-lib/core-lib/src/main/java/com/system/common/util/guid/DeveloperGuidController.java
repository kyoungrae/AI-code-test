package com.system.common.util.guid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @title : DeveloperGuidController
 * @text : 개발 가이드 페이지 컨트롤러
 * @writer : AI Assistant
 */
@Controller
@RequestMapping("/cms/common/guid")
public class DeveloperGuidController {

    @Autowired
    private DeveloperGuidService developerGuidService;

    /**
     * 개발 가이드 페이지 이동
     */
    @GetMapping("")
    public String guidPage(Model model) {
        return "page/guid/guid";
    }

    /**
     * JavaScript 가이드 데이터 조회 (샘플)
     */
    @GetMapping("/api/sample")
    @ResponseBody
    public Map<String, Object> getSampleGuidData() {
        Map<String, Object> result = new HashMap<>();

        try {
            List<Map<String, Object>> guidList = developerGuidService.getSampleGuidData();
            result.put("success", true);
            result.put("data", guidList);
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }

        return result;
    }

    /**
     * JavaScript 파일 스캔 및 가이드 데이터 조회 (실제)
     */
    @GetMapping("/api/scan")
    @ResponseBody
    public Map<String, Object> scanJavaScriptFiles() {
        Map<String, Object> result = new HashMap<>();

        try {
            // common/js/common 하위의 모든 JS 파일 스캔
            String pattern = "classpath:static/common/js/common/**/*.js";
            List<Map<String, Object>> guidList = developerGuidService.parseJavaScriptFiles(pattern);

            result.put("success", true);
            result.put("data", guidList);
            result.put("count", guidList.size());
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }

        return result;
    }
}
