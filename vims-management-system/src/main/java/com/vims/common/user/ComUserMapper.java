package com.vims.common.user;

import com.system.auth.authuser.AuthUser;
import com.system.common.base.CommonMapper;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ComUserMapper extends CommonMapper<ComUser> {
    List<ComUser> SELECT_PAGE(ComUser vo);
    int SELECT_PAGING_TOTAL_NUMBER(ComUser vo);
    List<ComUser> SELECT_JOIN_COM_USER_GROUP_PAGE(ComUser vo);
    int SELECT_JOIN_COM_USER_GROUP_PAGING_TOTAL_NUMBER(ComUser vo);
    List<ComUser> SELECT_JOIN_INSPECTION_STATION_INSPECTOR_PAGE(ComUser vo);
    int SELECT_JOIN_INSPECTION_STATION_INSPECTOR__PAGING_TOTAL_NUMBER(ComUser vo);

    int DELETE_TOKEN(AuthUser vo);

    String GET_USER_IMAGE_FILE_NAME_BY_EMAIL(String email);
}