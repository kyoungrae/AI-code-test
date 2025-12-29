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
@RequestMapping("/cms/common/commonSiteConfig")
@RequiredArgsConstructor
public class CommonSiteConfigController extends AbstractCommonController<CommonSiteConfig> {

    private final CommonSiteConfigService commonSiteConfigService;
    private final CommonSiteConfigRepository commonSiteConfigRepository;

    @PostMapping("/findPage")
    public Map<String, List<?>> findPage(@RequestBody CommonSiteConfig reqeust) throws Exception {
        return commonSiteConfigService.findPage(reqeust);
    }
    @PostMapping("/findAll")
    protected List<CommonSiteConfig> findAll(@RequestBody CommonSiteConfig request) throws Exception {
        return commonSiteConfigRepository.findAll();
    }

    @PostMapping("/find")
    @Override
    protected List<CommonSiteConfig> findImpl(@RequestBody CommonSiteConfig request) throws Exception {
        return commonSiteConfigService.findImpl(request);
    }

    @PostMapping("/remove")
    @Override
    protected int removeImpl(@RequestBody CommonSiteConfig request) {
        return commonSiteConfigService.removeImpl(request);
    }

    @PostMapping("/update")
    @Override
    protected int updateImpl(@RequestBody CommonSiteConfig request) {
        return commonSiteConfigService.updateImpl(request);
    }

    @PostMapping("/register")
    @Override
    protected int registerImpl(@RequestBody CommonSiteConfig request) throws Exception {
        return commonSiteConfigService.registerImpl(request);
    }
}