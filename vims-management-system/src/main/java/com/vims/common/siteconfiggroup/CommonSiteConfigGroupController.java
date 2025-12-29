package com.vims.common.siteconfiggroup;

import com.system.common.base.AbstractCommonController;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/cms/common/commonSiteConfigGroup")
@RequiredArgsConstructor
public class CommonSiteConfigGroupController extends AbstractCommonController<CommonSiteConfigGroup> {

	private final CommonSiteConfigGroupService commonSiteConfigGroupService;
    private final CommonSiteConfigGroupRepository commonSiteConfigGroupRepository;

	@PostMapping("/findPage")
    public Map<String,List<?>> findPage(@RequestBody CommonSiteConfigGroup reqeust) throws Exception{
        return commonSiteConfigGroupService.findPage(reqeust);
    }

    @PostMapping("/findAll")
    protected List<CommonSiteConfigGroup> findAll(@RequestBody CommonSiteConfigGroup request) throws Exception{
        return commonSiteConfigGroupRepository.findAll();
    }

    @PostMapping("/find")
    @Override
    protected List<CommonSiteConfigGroup> findImpl(@RequestBody CommonSiteConfigGroup request) throws Exception{
        return commonSiteConfigGroupService.findImpl(request);
    }

    @PostMapping("/remove")
    @Override
    protected int removeImpl(@RequestBody CommonSiteConfigGroup request) {
        return commonSiteConfigGroupService.removeImpl(request);
    }

    @PostMapping("/update")
    @Override
    protected int updateImpl(@RequestBody CommonSiteConfigGroup request) {
        return commonSiteConfigGroupService.updateImpl(request);
    }

    @PostMapping("/register")
    @Override
    protected int registerImpl(@RequestBody CommonSiteConfigGroup request) {
        return commonSiteConfigGroupService.registerImpl(request);
    }
}