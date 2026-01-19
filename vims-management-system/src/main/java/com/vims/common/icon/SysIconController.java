package com.vims.common.icon;

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
@RequestMapping("/cms/common/sysIcon")
@RequiredArgsConstructor
public class SysIconController extends AbstractCommonController<SysIcon> {

    private final SysIconService sysIconService;
    private final SysIconRepository sysIconRepository;

    @PostMapping("/findPage")
    public Map<String, List<?>> findPage(@RequestBody SysIcon reqeust) throws Exception {
        return sysIconService.findPage(reqeust);
    }

    @PostMapping("/findAll")
    protected List<SysIcon> findAll(@RequestBody SysIcon request) throws Exception {
        return sysIconRepository.findAll();
    }

    @PostMapping("/find")
    @Override
    protected List<SysIcon> findImpl(@RequestBody SysIcon request) throws Exception {
        return sysIconService.findImpl(request);
    }

    @PostMapping("/remove")
    @Override
    protected int removeImpl(@RequestBody SysIcon request) {
        return sysIconService.removeImpl(request);
    }

    @PostMapping("/update")
    @Override
    protected int updateImpl(@RequestBody SysIcon request) {
        return sysIconService.updateImpl(request);
    }

    @PostMapping("/register")
    @Override
    protected int registerImpl(@RequestBody SysIcon request) {
        return sysIconService.registerImpl(request);
    }

    @PostMapping("/excelUpload")
    @Override
    protected int excelUploadImpl(@RequestParam("file") MultipartFile file) throws Exception {
        return sysIconService.excelUploadImpl(file);
    }
}