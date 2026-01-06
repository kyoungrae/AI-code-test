package com.vims.common.group;

import com.system.common.base.CommonMapper;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ComDeptGroupMapper extends CommonMapper<ComDeptGroup> {
    List<ComDeptGroup> SELECT_NOT_EXISTS_COM_ACCS_GROUP_MENU (ComDeptGroup request);
}