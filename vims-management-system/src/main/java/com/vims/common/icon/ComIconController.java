package com.vims.common.icon;

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
@RequestMapping("/cms/common/comIcon")
@RequiredArgsConstructor
public class ComIconController extends AbstractCommonController<ComIcon> {

    private final ComIconService comIconService;
    private final ComIconRepository comIconRepository;

    @PostMapping("/findPage")
    public Map<String, List<?>> findPage(@RequestBody ComIcon reqeust) throws Exception {
        return comIconService.findPage(reqeust);
    }

    @PostMapping("/findAll")
    protected List<ComIcon> findAll(@RequestBody ComIcon request) throws Exception {
        return comIconRepository.findAll();
    }

    @PostMapping("/find")
    @Override
    protected List<ComIcon> findImpl(@RequestBody ComIcon request) throws Exception {
        return comIconService.findImpl(request);
    }

    @PostMapping("/remove")
    @Override
    protected int removeImpl(@RequestBody ComIcon request) {
        return comIconService.removeImpl(request);
    }

    @PostMapping("/update")
    @Override
    protected int updateImpl(@RequestBody ComIcon request) {
        return comIconService.updateImpl(request);
    }

    @PostMapping("/register")
    @Override
    protected int registerImpl(@RequestBody ComIcon request) {
        return comIconService.registerImpl(request);
    }

    @PostMapping("/excelUpload")
    @Override
    protected int excelUploadImpl(MultipartFile arg0) throws Exception {
        return comIconService.excelUploadImpl(arg0);
    }
}