package com.vims.common.guid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @title : DeveloperGuidController
 * @text : 개발 가이드 페이지 컨트롤러
 * @writer : 이경태
 */
@Controller
@RequestMapping("/cms/common/guid")
public class DeveloperGuidController {

    @Autowired
    private DeveloperGuidService developerGuidService;

    @Autowired
    private CssGuidService cssGuidService;

    @Autowired
    private MarkdownGuidService markdownGuidService;

    /**
     * 개발 가이드 페이지 이동 (JS)
     */
    @GetMapping("")
    public String guidPage(Model model) {
        return "page/guid/guid";
    }

    /**
     * 개발 가이드 페이지 이동 (CSS)
     */
    @GetMapping("/css")
    public String cssGuidPage() {
        return "page/guid/cssGuid";
    }

    /**
     * 웹 입력 가이드 페이지 이동 (Markdown)
     */
    @GetMapping("/jsDevGuid")
    public String jsDevGuidPage() {
        return "page/guid/jsDevGuid";
    }

    /**
     * JavaScript 가이드 데이터 조회 (샘플 - 사용 안 함)
     */
    @GetMapping("/api/sample")
    @ResponseBody
    public Map<String, Object> getSampleGuidData() {
        return new HashMap<>();
    }

    /**
     * JavaScript 파일 스캔 및 가이드 데이터 조회 (실제)
     */
    @GetMapping("/api/scan")
    @ResponseBody
    public Map<String, Object> scanJavaScriptFiles() {
        Map<String, Object> result = new HashMap<>();

        try {
            String userDir = getWorkspaceRoot();
            userDir = userDir.replace("\\", "/");
            String targetPath = userDir + "/vims-login/src/main/resources/static/common/js/common";

            System.out.println(">>> [DeveloperGuide] Search Target Path: " + targetPath);
            String rootPath = "file:" + targetPath;

            List<Map<String, Object>> guidList = developerGuidService.parseJavaScriptFiles(rootPath);

            result.put("success", true);
            result.put("data", guidList);
            result.put("count", guidList.size());
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
            e.printStackTrace();
        }

        return result;
    }

    /**
     * CSS 파일 스캔 API
     */
    @GetMapping("/api/scanCss")
    @ResponseBody
    public Map<String, Object> scanCssFiles() {
        Map<String, Object> result = new HashMap<>();

        try {
            String userDir = getWorkspaceRoot();
            userDir = userDir.replace("\\", "/");
            String targetPath = userDir + "/vims-login/src/main/resources/static/common/css/common";

            System.out.println(">>> [DeveloperGuide] CSS Search Target Path: " + targetPath);
            File dir = new File(targetPath);

            List<Map<String, Object>> fileList;
            if (dir.exists() && dir.isDirectory()) {
                fileList = cssGuidService.parseCssFiles(dir);
            } else {
                fileList = new ArrayList<>();
                result.put("message", "Path not found: " + targetPath);
            }

            result.put("success", true);
            result.put("data", fileList);
            result.put("count", fileList.size());

        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "Exception: " + e.getClass().getName() + " - " + e.getMessage());
            if (e.getStackTrace().length > 0) {
                result.put("trace", e.getStackTrace()[0].toString());
            }
            e.printStackTrace();
        }

        return result;
    }

    /**
     * Markdown 파일 스캔 API
     */
    @GetMapping("/api/scanWebGuid")
    @ResponseBody
    public Map<String, Object> scanWebGuidFiles() {
        Map<String, Object> result = new HashMap<>();

        try {
            String userDir = getWorkspaceRoot();
            userDir = userDir.replace("\\", "/");
            File dir = new File(userDir);

            List<Map<String, Object>> fileList = markdownGuidService.parseMarkdownFiles(dir);

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

    private String getWorkspaceRoot() {
        String userDir = System.getProperty("user.dir");
        File currentDir = new File(userDir);
        if (currentDir.getName().startsWith("vims-")) {
            userDir = currentDir.getParent();
        }
        return userDir;
    }
}
