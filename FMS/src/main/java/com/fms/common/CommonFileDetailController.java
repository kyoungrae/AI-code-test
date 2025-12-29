package com.fms.common;

import com.system.common.base.AbstractCommonController;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/common/file/commonFileDetail")
@RequiredArgsConstructor
public class CommonFileDetailController extends AbstractCommonController<CommonFileDetail> {

	private final CommonFileDetailService commonFileDetailService;
    private final CommonFileDetailRepository commonFileDetailRepository;

	@PostMapping("/findPage")
    public Map<String,List<?>> findPage(@RequestBody CommonFileDetail reqeust) throws Exception{
        return commonFileDetailService.findPage(reqeust);
    }

    @PostMapping("/findAll")
    protected List<CommonFileDetail> findAll(@RequestBody CommonFileDetail request) throws Exception{
        return commonFileDetailRepository.findAll();
    }

    @PostMapping("/find")
    @Override
    protected List<CommonFileDetail> findImpl(@RequestBody CommonFileDetail request) throws Exception{
        return commonFileDetailService.findImpl(request);
    }

    @PostMapping("/remove")
    @Override
    protected int removeImpl(@RequestBody CommonFileDetail request) {
        return commonFileDetailService.removeImpl(request);
    }

    @PostMapping("/update")
    @Override
    protected int updateImpl(@RequestBody CommonFileDetail request) {
        return commonFileDetailService.updateImpl(request);
    }

    @Override
    protected int registerImpl(CommonFileDetail request) {
        return 0;
    }

    @PostMapping("/register")
    protected int registerImpl(@RequestBody List<CommonFileDetail> fileList) throws Exception {
        return commonFileDetailService.registerImpl(fileList);
    }

    @PostMapping("/removeByFileIdAndUuid")
    protected int removeByFileIdAndUuid(@RequestBody CommonFileDetail request) throws Exception {
        return commonFileDetailService.removeByFileIdAndUuid(request);
    }

    @PostMapping("/updateList")
    protected int updateList(@RequestBody List<CommonFileDetail> fileList) throws Exception {
        return commonFileDetailService.updateList(fileList);
    }
}