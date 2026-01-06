package com.vims.common.siteconfig;

import com.system.common.base.AbstractCommonController;
import com.system.common.exception.CustomException;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/cms/common/comSiteConfig")
@RequiredArgsConstructor
public class ComSiteConfigController extends AbstractCommonController<ComSiteConfig> {

    private final ComSiteConfigService comSiteConfigService;
    private final ComSiteConfigRepository comSiteConfigRepository;

    @PostMapping("/findPage")
    public Map<String, List<?>> findPage(@RequestBody ComSiteConfig reqeust) throws Exception {
        return comSiteConfigService.findPage(reqeust);
    }
    @PostMapping("/findAll")
    protected List<ComSiteConfig> findAll(@RequestBody ComSiteConfig request) throws Exception {
        return comSiteConfigRepository.findAll();
    }

    @PostMapping("/find")
    @Override
    protected List<ComSiteConfig> findImpl(@RequestBody ComSiteConfig request) throws Exception {
        return comSiteConfigService.findImpl(request);
    }

    @PostMapping("/remove")
    @Override
    protected int removeImpl(@RequestBody ComSiteConfig request) {
        return comSiteConfigService.removeImpl(request);
    }

    @PostMapping("/update")
    @Override
    protected int updateImpl(@RequestBody ComSiteConfig request) {
        return comSiteConfigService.updateImpl(request);
    }

    @PostMapping("/register")
    @Override
    protected int registerImpl(@RequestBody ComSiteConfig request) throws Exception {
        return comSiteConfigService.registerImpl(request);
    }
}