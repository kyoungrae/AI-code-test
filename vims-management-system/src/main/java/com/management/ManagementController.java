package com.management;

import com.system.common.util.pageredirect.PageRedirectService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cms")
@RequiredArgsConstructor
public class ManagementController{
    final PageRedirectService pageRedirectService;

    @GetMapping("/page/load")
    @ResponseBody
    public String loadPage(@RequestParam("url") String url) throws Exception{
        return pageRedirectService.pageLoad(url);
    }

}