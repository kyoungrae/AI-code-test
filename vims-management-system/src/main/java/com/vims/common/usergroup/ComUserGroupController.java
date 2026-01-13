package com.vims.common.usergroup;

import com.system.auth.authuser.AuthUser;
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
@RequestMapping("/cms/common/comUserGroup")
@RequiredArgsConstructor
public class ComUserGroupController extends AbstractCommonController<ComUserGroup> {

    private final ComUserGroupService comUserGroupService;
    private final ComUserGroupRepository comUserGroupRepository;

    @PostMapping("/findPage")
    public Map<String, List<?>> findPage(@RequestBody ComUserGroup reqeust) throws Exception {
        System.out.println(reqeust);
        return comUserGroupService.findPage(reqeust);
    }

    @PostMapping("/findAll")
    protected List<ComUserGroup> findAll(@RequestBody ComUserGroup request) throws Exception {
        return comUserGroupRepository.findAll();
    }

    @PostMapping("/find")
    @Override
    protected List<ComUserGroup> findImpl(@RequestBody ComUserGroup request) throws Exception {
        return comUserGroupService.findImpl(request);
    }

    @PostMapping("/remove")
    @Override
    protected int removeImpl(@RequestBody ComUserGroup request) {
        return comUserGroupService.removeImpl(request);
    }

    @PostMapping("/update")
    @Override
    protected int updateImpl(@RequestBody ComUserGroup request) {
        return comUserGroupService.updateImpl(request);
    }

    @PostMapping("/register")
    @Override
    protected int registerImpl(@RequestBody ComUserGroup request) throws Exception {
        return comUserGroupService.registerImpl(request);
    }

    @PostMapping("/findJoinComUserGroupPage")
    public Map<String, List<?>> findJoinComUserGroupPage(@RequestBody ComUserGroup reqeust) throws Exception {
        return comUserGroupService.findJoinComUserGroupPage(reqeust);
    }

    @PostMapping("/excelUpload")
    @Override
    protected int excelUploadImpl(MultipartFile arg0) throws Exception {
        return comUserGroupService.excelUploadImpl(arg0);
    }
}