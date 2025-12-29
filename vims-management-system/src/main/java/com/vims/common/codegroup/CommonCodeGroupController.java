package com.vims.common.codegroup;

import com.system.common.base.AbstractCommonController;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/cms/common/commonCodeGroup")
@RequiredArgsConstructor
public class CommonCodeGroupController extends AbstractCommonController<CommonCodeGroup> {
    private final CommonCodeGroupService commonCodeGroupService;
    private final CommonCodeGroupRepository commonCodeGroupRepository;

    @RequestMapping("/findByGroupId")
    protected List<CommonCodeGroup> findByGroupId(@RequestBody CommonCodeGroup request) throws Exception {
        return commonCodeGroupService.findByGroupId(request);
    }

    @PostMapping("/findPage")
    public Map<String,List<?>> findPage(@RequestBody CommonCodeGroup reqeust) throws Exception{
        return commonCodeGroupService.findPage(reqeust);
    }

    @PostMapping("/findAll")
    protected List<CommonCodeGroup> findAll(@RequestBody CommonCodeGroup request) throws Exception{
        return commonCodeGroupRepository.findAll();
    }

    @Override
    @PostMapping("/find")
    protected List<CommonCodeGroup> findImpl(@RequestBody CommonCodeGroup request) throws Exception{
        return commonCodeGroupService.findImpl(request);
    }

    @Override
    @PostMapping("/remove")
    protected int removeImpl(@RequestBody CommonCodeGroup request) {
        return commonCodeGroupService.removeImpl(request);
    }

    @Override
    @PostMapping("/update")
    protected int updateImpl(@RequestBody CommonCodeGroup request) {
        return commonCodeGroupService.updateImpl(request);
    }

    @Override
    @PostMapping("/register")
    protected int registerImpl(@RequestBody CommonCodeGroup request) {
        return commonCodeGroupService.registerImpl(request);
    }
}
