package com.system.auth.authuser;

import com.system.common.base.AbstractCommonController;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/common/common/sysUser")
@RequiredArgsConstructor
public class AuthUserController extends AbstractCommonController<AuthUser> {
    @Override
    protected List<AuthUser> findImpl(AuthUser request) throws Exception {
        return List.of();
    }

    @Override
    protected int removeImpl(AuthUser request) throws Exception {
        return 0;
    }

    @Override
    protected int updateImpl(AuthUser request) throws Exception {
        return 0;
    }

    @Override
    protected int registerImpl(AuthUser request) throws Exception {
        return 0;
    }

    @Override
    protected int excelUploadImpl(@RequestParam("file") MultipartFile file) throws Exception {
        return 0;
    }

}