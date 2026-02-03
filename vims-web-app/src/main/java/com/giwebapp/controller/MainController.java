package com.giwebapp.controller;

import com.system.common.util.pageredirect.PageRedirectService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequiredArgsConstructor
public class MainController {

    private final PageRedirectService pageRedirectService;

    @GetMapping("/")
    @ResponseBody
    public String index() throws Exception {
        return pageRedirectService.pageLoad("/index/index.html");
    }
}
