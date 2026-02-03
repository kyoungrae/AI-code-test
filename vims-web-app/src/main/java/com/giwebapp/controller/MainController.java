package com.giwebapp.controller;

import com.system.common.util.pageredirect.PageRedirectService;

import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Controller;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.nio.charset.StandardCharsets;

@Controller
@RequiredArgsConstructor
public class MainController {

    private final PageRedirectService pageRedirectService;
    private final ResourceLoader resourceLoader;

    /**
     * [Step 1] 루트 접속 시 서버 번역을 거치지 않은 '순수 껍데기(home.html)'를 반환합니다.
     * 이렇게 하면 브라우저에서 클라이언트 JS가 실행될 기회를 얻게 됩니다.
     */
    @GetMapping("/")
    @ResponseBody
    public String index() throws Exception {
        Resource resource = resourceLoader.getResource("classpath:templates/layout/home.html");
        return StreamUtils.copyToString(resource.getInputStream(), StandardCharsets.UTF_8);
    }

    /**
     * [Step 2] 브라우저에서 Ajax로 컨텐츠를 요청할 때 사용합니다.
     * 이때는 브라우저가 보낸 X-Language 헤더를 PageRedirectService가 인식하여 서버 사이드 번역을 수행합니다.
     */
    @GetMapping("/page/load")
    @ResponseBody
    public String loadPage(@RequestParam("url") String url) throws Exception {
        return pageRedirectService.pageLoad(url);
    }
}
