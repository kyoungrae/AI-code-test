package com.vims.common.usergroup;

import com.system.auth.authuser.AuthUser;
import com.system.common.base.CommonMapper;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface CommonUserGroupMapper extends CommonMapper<CommonUserGroup> {
    int INSERT_OR_UPDATE(CommonUserGroup vo) throws Exception;
    List<CommonUserGroup> SELECT_BY_GROUP_ID_LIST(List<String> targetGroups) throws Exception;
    List<CommonUserGroup> SELECT_JOIN_COMMON_USER_GROUP_PAGE(CommonUserGroup vo);
    int SELECT_JOIN_COMMON_USER_GROUP_PAGING_TOTAL_NUMBER(CommonUserGroup vo);
}