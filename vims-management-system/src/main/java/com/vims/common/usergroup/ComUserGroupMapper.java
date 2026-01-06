package com.vims.common.usergroup;

import com.system.auth.authuser.AuthUser;
import com.system.common.base.CommonMapper;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ComUserGroupMapper extends CommonMapper<ComUserGroup> {
    int INSERT_OR_UPDATE(ComUserGroup vo) throws Exception;
    List<ComUserGroup> SELECT_BY_GROUP_ID_LIST(List<String> targetGroups) throws Exception;
    List<ComUserGroup> SELECT_JOIN_COM_USER_GROUP_PAGE(ComUserGroup vo);
    int SELECT_JOIN_COM_USER_GROUP_PAGING_TOTAL_NUMBER(ComUserGroup vo);
}