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
@RequestMapping("/cms/common/comGroup")
@RequiredArgsConstructor
public class ComGroupController extends AbstractCommonController<ComGroup> {

	private final ComGroupService comGroupService;
    private final ComGroupRepository comGroupRepository;

	@PostMapping("/findPage")
    public Map<String,List<?>> findPage(@RequestBody ComGroup reqeust) throws Exception{
        return comGroupService.findPage(reqeust);
    }

    @PostMapping("/findAll")
    protected List<ComGroup> findAll(@RequestBody ComGroup request) throws Exception{
        return comGroupRepository.findAll();
    }
    @PostMapping("/findNotExistsComAccsGroupMenu")
    protected List<ComGroup> findNotExistsComAccsGroupMenu(@RequestBody ComGroup request) throws Exception{
        return comGroupService.findNotExistsComAccsGroupMenu(request);
    }


    @PostMapping("/find")
    @Override
    protected List<ComGroup> findImpl(@RequestBody ComGroup request) throws Exception{
        return comGroupService.findImpl(request);
    }

    @PostMapping("/remove")
    @Override
    protected int removeImpl(@RequestBody ComGroup request) throws Exception {
        return comGroupService.removeImpl(request);
    }

    @PostMapping("/update")
    @Override
    protected int updateImpl(@RequestBody ComGroup request) {
        return comGroupService.updateImpl(request);
    }

    @PostMapping("/register")
    @Override
    protected int registerImpl(@RequestBody ComGroup request) {
        return comGroupService.registerImpl(request);
    }
}