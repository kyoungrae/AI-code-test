package com.vims.common.group;

import com.system.common.base.AbstractCommonController;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/cms/common/comDeptGroup")
@RequiredArgsConstructor
public class ComDeptGroupController extends AbstractCommonController<ComDeptGroup> {

	private final ComDeptGroupService comDeptGroupService;
    private final ComDeptGroupRepository comDeptGroupRepository;

	@PostMapping("/findPage")
    public Map<String,List<?>> findPage(@RequestBody ComDeptGroup reqeust) throws Exception{
        return comDeptGroupService.findPage(reqeust);
    }

    @PostMapping("/findAll")
    protected List<ComDeptGroup> findAll(@RequestBody ComDeptGroup request) throws Exception{
        return comDeptGroupRepository.findAll();
    }
    @PostMapping("/findNotExistsComAccsGroupMenu")
    protected List<ComDeptGroup> findNotExistsComAccsGroupMenu(@RequestBody ComDeptGroup request) throws Exception{
        return comDeptGroupService.findNotExistsComAccsGroupMenu(request);
    }


    @PostMapping("/find")
    @Override
    protected List<ComDeptGroup> findImpl(@RequestBody ComDeptGroup request) throws Exception{
        return comDeptGroupService.findImpl(request);
    }

    @PostMapping("/remove")
    @Override
    protected int removeImpl(@RequestBody ComDeptGroup request) throws Exception {
        return comDeptGroupService.removeImpl(request);
    }

    @PostMapping("/update")
    @Override
    protected int updateImpl(@RequestBody ComDeptGroup request) {
        return comDeptGroupService.updateImpl(request);
    }

    @PostMapping("/register")
    @Override
    protected int registerImpl(@RequestBody ComDeptGroup request) {
        return comDeptGroupService.registerImpl(request);
    }
}