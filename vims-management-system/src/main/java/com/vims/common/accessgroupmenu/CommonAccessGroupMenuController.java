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
@RequestMapping("/cms/common/commonAccessGroupMenu")
@RequiredArgsConstructor
public class CommonAccessGroupMenuController extends AbstractCommonController<CommonAccessGroupMenu> {

	private final CommonAccessGroupMenuService commonAccessGroupMenuService;
    private final CommonAccessGroupMenuRepository commonAccessGroupMenuRepository;

	@PostMapping("/findPage")
    public Map<String,List<?>> findPage(@RequestBody CommonAccessGroupMenu reqeust) throws Exception{
        return commonAccessGroupMenuService.findPage(reqeust);
    }

    @PostMapping("/findAll")
    protected List<CommonAccessGroupMenu> findAll(@RequestBody CommonAccessGroupMenu request) throws Exception{
        return commonAccessGroupMenuRepository.findAll();
    }

    @PostMapping("/find")
    @Override
    protected List<CommonAccessGroupMenu> findImpl(@RequestBody CommonAccessGroupMenu request) throws Exception{
        return commonAccessGroupMenuService.findImpl(request);
    }

    @PostMapping("/remove")
    @Override
    protected int removeImpl(@RequestBody CommonAccessGroupMenu request) {
        return commonAccessGroupMenuService.removeImpl(request);
    }

    @PostMapping("/update")
    @Override
    protected int updateImpl(@RequestBody CommonAccessGroupMenu request) {
        return commonAccessGroupMenuService.updateImpl(request);
    }

    @PostMapping("/register")
    @Override
    protected int registerImpl(@RequestBody CommonAccessGroupMenu request) {
        return commonAccessGroupMenuService.registerImpl(request);
    }
}