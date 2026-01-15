package com.vims.common.user;

import com.system.common.base.AbstractCommonController;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/cms/common/comUser")
@RequiredArgsConstructor
public class ComUserController extends AbstractCommonController<ComUser> {

    private final ComUserService comUserService;
    private final ComUserRepository comUserRepository;

    @PostMapping("/findPage")
    public Map<String, List<?>> findPage(@RequestBody ComUser reqeust) throws Exception {
        return comUserService.findPage(reqeust);
    }

    @PostMapping("/findAll")
    protected List<ComUser> findAll(@RequestBody ComUser request) throws Exception {
        return comUserRepository.findAll();
    }

    @PostMapping("/find")
    @Override
    protected List<ComUser> findImpl(@RequestBody ComUser request) throws Exception {
        return comUserService.findImpl(request);
    }

    @PostMapping("/remove")
    @Override
    public int removeImpl(@RequestBody ComUser request) {
        return comUserService.removeImpl(request);
    }

    @PostMapping("/update")
    @Override
    public int updateImpl(@RequestBody ComUser request) throws Exception {
        return comUserService.updateImpl(request);
    }

    @PostMapping("/register")
    @Override
    public int registerImpl(@RequestBody ComUser request) throws Exception {
        return comUserService.registerImpl(request);
    }

    @PostMapping("/changePassword")
    public int changePassword(@RequestBody ComUser request) throws Exception {
        return comUserService.changePassword(request);
    }

    @PostMapping("/excelUpload")
    @Override
    protected int excelUploadImpl(@RequestParam("file") MultipartFile arg0) throws Exception {
        return comUserService.excelUploadImpl(arg0);
    }
}