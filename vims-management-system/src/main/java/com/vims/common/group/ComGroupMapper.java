package com.vims.common.group;

import com.system.common.base.CommonMapper;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ComGroupMapper extends CommonMapper<ComGroup> {
    List<ComGroup> SELECT_NOT_EXISTS_COM_ACCS_GROUP_MENU (ComGroup request);
}