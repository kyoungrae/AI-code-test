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
@RequestMapping("/cms/common/commonGroup")
@RequiredArgsConstructor
public class CommonGroupController extends AbstractCommonController<CommonGroup> {

	private final CommonGroupService commonGroupService;
    private final CommonGroupRepository commonGroupRepository;

	@PostMapping("/findPage")
    public Map<String,List<?>> findPage(@RequestBody CommonGroup reqeust) throws Exception{
        return commonGroupService.findPage(reqeust);
    }

    @PostMapping("/findAll")
    protected List<CommonGroup> findAll(@RequestBody CommonGroup request) throws Exception{
        return commonGroupRepository.findAll();
    }
    @PostMapping("/findNotExistsCommonAccessGroupMenu")
    protected List<CommonGroup> findNotExistsCommonAccessGroupMenu(@RequestBody CommonGroup request) throws Exception{
        return commonGroupService.findNotExistsCommonAccessGroupMenu(request);
    }


    @PostMapping("/find")
    @Override
    protected List<CommonGroup> findImpl(@RequestBody CommonGroup request) throws Exception{
        return commonGroupService.findImpl(request);
    }

    @PostMapping("/remove")
    @Override
    protected int removeImpl(@RequestBody CommonGroup request) throws Exception {
        return commonGroupService.removeImpl(request);
    }

    @PostMapping("/update")
    @Override
    protected int updateImpl(@RequestBody CommonGroup request) {
        return commonGroupService.updateImpl(request);
    }

    @PostMapping("/register")
    @Override
    protected int registerImpl(@RequestBody CommonGroup request) {
        return commonGroupService.registerImpl(request);
    }
}