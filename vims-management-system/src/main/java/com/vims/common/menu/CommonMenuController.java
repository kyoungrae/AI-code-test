package com.vims.common.menu;

import com.system.common.base.AbstractCommonController;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/cms/common/commonMenu")
@RequiredArgsConstructor
public class CommonMenuController extends AbstractCommonController<CommonMenu> {

	private final CommonMenuService commonMenuService;
    private final CommonMenuRepository commonMenuRepository;

	@PostMapping("/findPage")
    public Map<String,List<?>> findPage(@RequestBody CommonMenu reqeust) throws Exception{
        return commonMenuService.findPage(reqeust);
    }
    @PostMapping("/findHierarchy")
    public List<CommonMenu> findHierarchy(@RequestBody CommonMenu request) throws Exception{
        return commonMenuService.findHierarchy(request);
    }

    @PostMapping("/findAccessRightGroupForMenu")
    public List<CommonMenu> findAccessRightGroupForMenu(@RequestBody CommonMenu request) throws Exception{
        return commonMenuService.findAccessRightGroupForMenu(request);
    }

    @PostMapping("/findAll")
    protected List<CommonMenu> findAll(@RequestBody CommonMenu request) throws Exception{
        return commonMenuRepository.findAll();
    }

    @PostMapping("/find")
    @Override
    protected List<CommonMenu> findImpl(@RequestBody CommonMenu request) throws Exception{
        return commonMenuService.findImpl(request);
    }
    @PostMapping("/removeMenuCode")
    public int removeMenuCode(@RequestBody CommonMenu request) throws Exception{
        return commonMenuService.removeMenuCode(request);
    }
    @PostMapping("/remove")
    @Override
    protected int removeImpl(@RequestBody CommonMenu request) {
        return commonMenuService.removeImpl(request);
    }

    @PostMapping("/update")
    @Override
    protected int updateImpl(@RequestBody CommonMenu request) {
        return commonMenuService.updateImpl(request);
    }

    @PostMapping("/register")
    @Override
    protected int registerImpl(@RequestBody CommonMenu request) throws Exception {
        return commonMenuService.registerImpl(request);
    }
}