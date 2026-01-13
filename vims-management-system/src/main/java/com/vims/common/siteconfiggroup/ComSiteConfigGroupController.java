package com.vims.common.siteconfiggroup;

import com.system.common.base.AbstractCommonController;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/cms/common/comSiteConfigGroup")
@RequiredArgsConstructor
public class ComSiteConfigGroupController extends AbstractCommonController<ComSiteConfigGroup> {

    private final ComSiteConfigGroupService comSiteConfigGroupService;
    private final ComSiteConfigGroupRepository comSiteConfigGroupRepository;

    @PostMapping("/findPage")
    public Map<String, List<?>> findPage(@RequestBody ComSiteConfigGroup reqeust) throws Exception {
        return comSiteConfigGroupService.findPage(reqeust);
    }

    @PostMapping("/findAll")
    protected List<ComSiteConfigGroup> findAll(@RequestBody ComSiteConfigGroup request) throws Exception {
        return comSiteConfigGroupRepository.findAll();
    }

    @PostMapping("/find")
    @Override
    protected List<ComSiteConfigGroup> findImpl(@RequestBody ComSiteConfigGroup request) throws Exception {
        return comSiteConfigGroupService.findImpl(request);
    }

    @PostMapping("/remove")
    @Override
    protected int removeImpl(@RequestBody ComSiteConfigGroup request) {
        return comSiteConfigGroupService.removeImpl(request);
    }

    @PostMapping("/update")
    @Override
    protected int updateImpl(@RequestBody ComSiteConfigGroup request) {
        return comSiteConfigGroupService.updateImpl(request);
    }

    @PostMapping("/register")
    @Override
    protected int registerImpl(@RequestBody ComSiteConfigGroup request) {
        return comSiteConfigGroupService.registerImpl(request);
    }

    @PostMapping("/excelUpload")
    @Override
    protected int excelUploadImpl(MultipartFile arg0) throws Exception {
        return comSiteConfigGroupService.excelUploadImpl(arg0);
    }
}