package com.vims.common.menu;

import com.system.common.base.AbstractCommonController;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/cms/common/comMenu")
@RequiredArgsConstructor
public class ComMenuController extends AbstractCommonController<ComMenu> {

    private final ComMenuService comMenuService;
    private final ComMenuRepository comMenuRepository;

    @PostMapping("/findPage")
    public Map<String, List<?>> findPage(@RequestBody ComMenu reqeust) throws Exception {
        return comMenuService.findPage(reqeust);
    }

    @PostMapping("/findHierarchy")
    public List<ComMenu> findHierarchy(@RequestBody ComMenu request) throws Exception {
        return comMenuService.findHierarchy(request);
    }

    @PostMapping("/findAccessRightGroupForMenu")
    public List<ComMenu> findAccessRightGroupForMenu(@RequestBody ComMenu request) throws Exception {
        return comMenuService.findAccessRightGroupForMenu(request);
    }

    @PostMapping("/findAll")
    protected List<ComMenu> findAll(@RequestBody ComMenu request) throws Exception {
        return comMenuRepository.findAll();
    }

    @PostMapping("/find")
    @Override
    protected List<ComMenu> findImpl(@RequestBody ComMenu request) throws Exception {
        return comMenuService.findImpl(request);
    }

    @PostMapping("/removeMenuCode")
    public int removeMenuCode(@RequestBody ComMenu request) throws Exception {
        return comMenuService.removeMenuCode(request);
    }

    @PostMapping("/remove")
    @Override
    protected int removeImpl(@RequestBody ComMenu request) {
        return comMenuService.removeImpl(request);
    }

    @PostMapping("/update")
    @Override
    protected int updateImpl(@RequestBody ComMenu request) {
        return comMenuService.updateImpl(request);
    }

    @PostMapping("/register")
    @Override
    protected int registerImpl(@RequestBody ComMenu request) throws Exception {
        return comMenuService.registerImpl(request);
    }

    @PostMapping("/excelUpload")
    @Override
    protected int excelUploadImpl(MultipartFile arg0) throws Exception {
        return comMenuService.excelUploadImpl(arg0);
    }
}