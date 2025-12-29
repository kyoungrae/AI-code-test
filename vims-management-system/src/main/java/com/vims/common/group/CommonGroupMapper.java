package com.vims.common.group;

import com.system.common.base.CommonMapper;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface CommonGroupMapper extends CommonMapper<CommonGroup> {
    List<CommonGroup> SELECT_NOT_EXISTS_COMMON_ACCESS_GROUP_MENU (CommonGroup request);
}