package com.vims.common.user;

import com.system.auth.authuser.AuthUser;
import com.system.common.base.CommonMapper;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface SysUserMapper extends CommonMapper<SysUser> {
    List<SysUser> SELECT_PAGE(SysUser vo);

    int SELECT_PAGING_TOTAL_NUMBER(SysUser vo);

    List<SysUser> SELECT_JOIN_SYS_USER_GROUP_PAGE(SysUser vo);

    int SELECT_JOIN_SYS_USER_GROUP_PAGING_TOTAL_NUMBER(SysUser vo);

    List<SysUser> SELECT_JOIN_INSPECTION_STATION_INSPECTOR_PAGE(SysUser vo);

    int SELECT_JOIN_INSPECTION_STATION_INSPECTOR__PAGING_TOTAL_NUMBER(SysUser vo);

    int INSERT(SysUser vo);

    int DELETE_TOKEN(AuthUser vo);

    String GET_USER_IMAGE_FILE_NAME_BY_EMAIL(String email);

}