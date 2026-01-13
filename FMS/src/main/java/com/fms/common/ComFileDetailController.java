package com.fms.common;

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
@RequestMapping("/fms/common/file/comFileDetail")
@RequiredArgsConstructor
public class ComFileDetailController extends AbstractCommonController<ComFileDetail> {

    private final ComFileDetailService comFileDetailService;
    private final ComFileDetailRepository comFileDetailRepository;

    @PostMapping("/findPage")
    public Map<String, List<?>> findPage(@RequestBody ComFileDetail reqeust) throws Exception {
        return comFileDetailService.findPage(reqeust);
    }

    @PostMapping("/findAll")
    protected List<ComFileDetail> findAll(@RequestBody ComFileDetail request) throws Exception {
        return comFileDetailRepository.findAll();
    }

    @PostMapping("/find")
    @Override
    protected List<ComFileDetail> findImpl(@RequestBody ComFileDetail request) throws Exception {
        return comFileDetailService.findImpl(request);
    }

    @PostMapping("/remove")
    @Override
    protected int removeImpl(@RequestBody ComFileDetail request) {
        return comFileDetailService.removeImpl(request);
    }

    @PostMapping("/update")
    @Override
    protected int updateImpl(@RequestBody ComFileDetail request) {
        return comFileDetailService.updateImpl(request);
    }

    @Override
    protected int registerImpl(ComFileDetail request) {
        return 0;
    }

    @PostMapping("/register")
    protected int registerImpl(@RequestBody List<ComFileDetail> fileList) throws Exception {
        return comFileDetailService.registerImpl(fileList);
    }

    @PostMapping("/removeByFileIdAndUuid")
    protected int removeByFileIdAndUuid(@RequestBody ComFileDetail request) throws Exception {
        return comFileDetailService.removeByFileIdAndUuid(request);
    }

    @PostMapping("/updateList")
    protected int updateList(@RequestBody List<ComFileDetail> fileList) throws Exception {
        return comFileDetailService.updateList(fileList);
    }

    @Override
    protected int excelUploadImpl(@RequestParam("file") MultipartFile arg0) throws Exception {
        return 0;
    }

}