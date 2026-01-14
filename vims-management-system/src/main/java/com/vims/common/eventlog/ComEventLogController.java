package com.vims.common.eventlog;

import com.system.common.base.AbstractCommonController;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/cms/common/comEventLog")
@RequiredArgsConstructor
public class ComEventLogController extends AbstractCommonController<ComEventLog> {

    private final ComEventLogService comEventLogService;
    private final ComEventLogRepository comEventLogRepository;

    @PostMapping("/findPage")
    public Map<String, List<?>> findPage(@RequestBody ComEventLog reqeust) throws Exception {
        return comEventLogService.findPage(reqeust);
    }

    @PostMapping("/findAll")
    protected List<ComEventLog> findAll(@RequestBody ComEventLog request) throws Exception {
        return comEventLogRepository.findAll();
    }

    @PostMapping("/find")
    @Override
    protected List<ComEventLog> findImpl(@RequestBody ComEventLog request) throws Exception {
        return comEventLogService.findImpl(request);
    }

    @PostMapping("/remove")
    @Override
    protected int removeImpl(@RequestBody ComEventLog request) {
        return comEventLogService.removeImpl(request);
    }

    @PostMapping("/update")
    @Override
    protected int updateImpl(@RequestBody ComEventLog request) {
        return comEventLogService.updateImpl(request);
    }

    @PostMapping("/register")
    @Override
    protected int registerImpl(@RequestBody ComEventLog request) {
        return comEventLogService.registerImpl(request);
    }

    @PostMapping("/excelUpload")
    @Override
    protected int excelUploadImpl(@RequestParam("file") MultipartFile file) throws Exception {
        return comEventLogService.excelUploadImpl(file);
    }
}