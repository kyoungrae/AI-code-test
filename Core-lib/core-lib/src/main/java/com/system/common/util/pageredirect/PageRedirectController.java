package com.system.common.util.pageredirect;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/common/redirectPage")
public class PageRedirectController {
    private PageRedirectService pageRedirectService;

    @GetMapping("/redirect")
    @ResponseBody
    public String redirectToNewPage(@RequestParam("url") String param) throws Exception{
        return pageRedirectService.pageLoad(param);
    }

}