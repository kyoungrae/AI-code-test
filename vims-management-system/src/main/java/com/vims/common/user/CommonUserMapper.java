package com.vims.common.user;

import com.system.auth.authuser.AuthUser;
import com.system.common.base.CommonMapper;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface CommonUserMapper extends CommonMapper<CommonUser> {
    List<CommonUser> SELECT_PAGE(CommonUser vo);
    int SELECT_PAGING_TOTAL_NUMBER(CommonUser vo);
    List<CommonUser> SELECT_JOIN_COMMON_USER_GROUP_PAGE(CommonUser vo);
    int SELECT_JOIN_COMMON_USER_GROUP_PAGING_TOTAL_NUMBER(CommonUser vo);
    List<CommonUser> SELECT_JOIN_INSPECTION_STATION_INSPECTOR_PAGE(CommonUser vo);
    int SELECT_JOIN_INSPECTION_STATION_INSPECTOR__PAGING_TOTAL_NUMBER(CommonUser vo);

    int DELETE_TOKEN(AuthUser vo);

    String GET_USER_IMAGE_FILE_NAME_BY_EMAIL(String email);
}