package com.vims.common.bbs;

import com.system.common.base.AbstractCommonController;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/cms/common/sysBbsBoard")
@RequiredArgsConstructor
public class SysBbsBoardController extends AbstractCommonController<SysBbsBoard> {
    private final SysBbsBoardService sysBbsBoardService;

    @PostMapping("/findPage")
    public Map<String, List<?>> findPage(@RequestBody SysBbsBoard request) throws Exception {
        return sysBbsBoardService.findPage(request);
    }

    @PostMapping("/find")
    @Override
    protected List<SysBbsBoard> findImpl(@RequestBody SysBbsBoard request) throws Exception {
        return sysBbsBoardService.findImpl(request);
    }

    @PostMapping("/remove")
    @Override
    protected int removeImpl(@RequestBody SysBbsBoard request) {
        return sysBbsBoardService.removeImpl(request);
    }

    @PostMapping("/update")
    @Override
    protected int updateImpl(@RequestBody SysBbsBoard request) {
        return sysBbsBoardService.updateImpl(request);
    }

    @PostMapping("/register")
    @Override
    protected int registerImpl(@RequestBody SysBbsBoard request) {
        return sysBbsBoardService.registerImpl(request);
    }

    @PostMapping("/excelUpload")
    @Override
    protected int excelUploadImpl(@RequestParam("file") MultipartFile file) throws Exception {
        return sysBbsBoardService.excelUploadImpl(file);
    }
}
