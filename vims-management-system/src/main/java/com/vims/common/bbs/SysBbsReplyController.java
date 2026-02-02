package com.vims.common.bbs;

import com.system.common.base.AbstractCommonController;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/cms/common/sysBbsReply")
@RequiredArgsConstructor
public class SysBbsReplyController extends AbstractCommonController<SysBbsReply> {
    private final SysBbsReplyService sysBbsReplyService;

    @PostMapping("/findPage")
    public Map<String, List<?>> findPage(@RequestBody SysBbsReply request) throws Exception {
        return sysBbsReplyService.findPage(request);
    }

    @PostMapping("/find")
    @Override
    protected List<SysBbsReply> findImpl(@RequestBody SysBbsReply request) throws Exception {
        return sysBbsReplyService.findImpl(request);
    }

    @PostMapping("/findByBoardId")
    public List<SysBbsReply> findByBoardId(@RequestBody SysBbsReply request) throws Exception {
        return sysBbsReplyService.findByBoardId(request);
    }

    @PostMapping("/countByBoardId")
    public int countByBoardId(@RequestBody SysBbsReply request) {
        return sysBbsReplyService.countByBoardId(request);
    }

    @PostMapping("/remove")
    @Override
    protected int removeImpl(@RequestBody SysBbsReply request) {
        return sysBbsReplyService.removeImpl(request);
    }

    @PostMapping("/update")
    @Override
    protected int updateImpl(@RequestBody SysBbsReply request) {
        return sysBbsReplyService.updateImpl(request);
    }

    @PostMapping("/register")
    @Override
    protected int registerImpl(@RequestBody SysBbsReply request) {
        return sysBbsReplyService.registerImpl(request);
    }

    @PostMapping("/excelUpload")
    @Override
    protected int excelUploadImpl(@RequestParam("file") MultipartFile file) throws Exception {
        return sysBbsReplyService.excelUploadImpl(file);
    }
}
