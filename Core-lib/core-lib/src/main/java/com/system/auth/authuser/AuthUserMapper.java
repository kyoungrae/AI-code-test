package com.system.auth.authuser;

import com.system.common.base.CommonMapper;
import org.apache.ibatis.annotations.Mapper;

import java.util.Optional;

@Mapper
public interface AuthUserMapper extends CommonMapper<AuthUser> {
    Optional<AuthUser> SELECT_USER_INFO(AuthUser vo);
    int INSERT_USER_INFO(AuthUser vo);
}