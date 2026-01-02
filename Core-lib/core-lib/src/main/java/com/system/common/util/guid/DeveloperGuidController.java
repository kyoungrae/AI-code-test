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
import java.io.File;

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
            // 현재 실행 경로를 기준으로 Workspace 루트 찾기
            String userDir = System.getProperty("user.dir");

            // vims-management-system 등 하위 폴더에서 실행된 경우 상위로 이동하여 workspace 루트를 잡음
            File currentDir = new File(userDir);
            if (currentDir.getName().startsWith("vims-")) {
                userDir = currentDir.getParent();
            }

            userDir = userDir.replace("\\", "/");

            // vims-login 내의 특정 경로만 스캔하도록 설정
            String targetPath = userDir + "/vims-login/src/main/resources/static/common/js/common";

            System.out.println(">>> [DeveloperGuide] Search Target Path: " + targetPath);

            // "file:" 접두사로 시작하면 Service에서 해당 디렉토리 하위를 재귀 스캔함
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
}
