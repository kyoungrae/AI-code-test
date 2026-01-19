package com.vims.common.group;

import com.system.common.base.CommonMapper;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface SysDeptGroupMapper extends CommonMapper<SysDeptGroup> {
    List<SysDeptGroup> SELECT_NOT_EXISTS_SYS_ACCS_GROUP_MENU (SysDeptGroup request);
}