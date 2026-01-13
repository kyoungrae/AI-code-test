package com.vims.common.codegroup;

import com.system.common.base.AbstractCommonController;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/cms/common/comCodeGroup")
@RequiredArgsConstructor
public class ComCodeGroupController extends AbstractCommonController<ComCodeGroup> {
    private final ComCodeGroupService comCodeGroupService;
    private final ComCodeGroupRepository comCodeGroupRepository;

    @RequestMapping("/findByGroupId")
    protected List<ComCodeGroup> findByGroupId(@RequestBody ComCodeGroup request) throws Exception {
        return comCodeGroupService.findByGroupId(request);
    }

    @PostMapping("/findPage")
    public Map<String, List<?>> findPage(@RequestBody ComCodeGroup reqeust) throws Exception {
        return comCodeGroupService.findPage(reqeust);
    }

    @PostMapping("/findAll")
    protected List<ComCodeGroup> findAll(@RequestBody ComCodeGroup request) throws Exception {
        return comCodeGroupRepository.findAll();
    }

    @Override
    @PostMapping("/find")
    protected List<ComCodeGroup> findImpl(@RequestBody ComCodeGroup request) throws Exception {
        return comCodeGroupService.findImpl(request);
    }

    @Override
    @PostMapping("/remove")
    protected int removeImpl(@RequestBody ComCodeGroup request) {
        return comCodeGroupService.removeImpl(request);
    }

    @Override
    @PostMapping("/update")
    protected int updateImpl(@RequestBody ComCodeGroup request) {
        return comCodeGroupService.updateImpl(request);
    }

    @Override
    @PostMapping("/register")
    protected int registerImpl(@RequestBody ComCodeGroup request) {
        return comCodeGroupService.registerImpl(request);
    }

    @PostMapping("/excelUpload")
    @Override
    protected int excelUploadImpl(@RequestParam("file") MultipartFile file) throws Exception {
        return comCodeGroupService.excelUploadImpl(file);
    }
}
