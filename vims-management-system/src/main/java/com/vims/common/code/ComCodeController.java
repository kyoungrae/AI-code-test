package com.vims.common.code;

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
@RequestMapping("/cms/common/comCode")
@RequiredArgsConstructor
public class ComCodeController extends AbstractCommonController<ComCode> {
    private final ComCodeService comCodeService;
    private final ComCodeRepository comCodeRepository;

    @RequestMapping("/findComCode")
    protected List<ComCode> findComCode(@RequestBody ComCode request) throws Exception {
        return comCodeService.findComCode(request);
    }

    @PostMapping("/findPage")
    public Map<String, List<?>> findPage(@RequestBody ComCode reqeust) throws Exception {
        return comCodeService.findPage(reqeust);
    }

    @PostMapping("/findAll")
    protected List<ComCode> findAll(@RequestBody ComCode request) throws Exception {
        return comCodeRepository.findAll();
    }

    @Override
    @PostMapping("/find")
    protected List<ComCode> findImpl(@RequestBody ComCode request) throws Exception {
        return comCodeService.findImpl(request);
    }

    @Override
    @PostMapping("/remove")
    protected int removeImpl(@RequestBody ComCode request) {
        return comCodeService.removeImpl(request);
    }

    @Override
    @PostMapping("/update")
    protected int updateImpl(@RequestBody ComCode request) {
        return comCodeService.updateImpl(request);
    }

    @Override
    @PostMapping("/register")
    protected int registerImpl(@RequestBody ComCode request) {
        return comCodeService.registerImpl(request);
    }

    @PostMapping("/excelUpload")
    @Override
    protected int excelUploadImpl(MultipartFile arg0) throws Exception {
        return comCodeService.excelUploadImpl(arg0);
    }
}
