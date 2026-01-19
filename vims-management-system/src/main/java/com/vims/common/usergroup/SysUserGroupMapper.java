package com.vims.common.usergroup;

import com.system.auth.authuser.AuthUser;
import com.system.common.base.CommonMapper;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface SysUserGroupMapper extends CommonMapper<SysUserGroup> {
    int INSERT_OR_UPDATE(SysUserGroup vo) throws Exception;
    List<SysUserGroup> SELECT_BY_GROUP_ID_LIST(List<String> targetGroups) throws Exception;
    List<SysUserGroup> SELECT_JOIN_SYS_USER_GROUP_PAGE(SysUserGroup vo);
    int SELECT_JOIN_SYS_USER_GROUP_PAGING_TOTAL_NUMBER(SysUserGroup vo);
}