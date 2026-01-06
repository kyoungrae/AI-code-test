package com.vims.common.accessgroupmenu;

import com.system.common.base.AbstractCommonController;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/cms/common/comAccsGroupMenu")
@RequiredArgsConstructor
public class ComAccsGroupMenuController extends AbstractCommonController<ComAccsGroupMenu> {

	private final ComAccsGroupMenuService comAccsGroupMenuService;
    private final ComAccsGroupMenuRepository comAccsGroupMenuRepository;

	@PostMapping("/findPage")
    public Map<String,List<?>> findPage(@RequestBody ComAccsGroupMenu reqeust) throws Exception{
        return comAccsGroupMenuService.findPage(reqeust);
    }

    @PostMapping("/findAll")
    protected List<ComAccsGroupMenu> findAll(@RequestBody ComAccsGroupMenu request) throws Exception{
        return comAccsGroupMenuRepository.findAll();
    }

    @PostMapping("/find")
    @Override
    protected List<ComAccsGroupMenu> findImpl(@RequestBody ComAccsGroupMenu request) throws Exception{
        return comAccsGroupMenuService.findImpl(request);
    }

    @PostMapping("/remove")
    @Override
    protected int removeImpl(@RequestBody ComAccsGroupMenu request) {
        return comAccsGroupMenuService.removeImpl(request);
    }

    @PostMapping("/update")
    @Override
    protected int updateImpl(@RequestBody ComAccsGroupMenu request) {
        return comAccsGroupMenuService.updateImpl(request);
    }

    @PostMapping("/register")
    @Override
    protected int registerImpl(@RequestBody ComAccsGroupMenu request) {
        return comAccsGroupMenuService.registerImpl(request);
    }
}