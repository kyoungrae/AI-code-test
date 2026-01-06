package com.vims.common.menu;

import com.system.common.base.CommonMapper;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ComMenuMapper extends CommonMapper<ComMenu> {
    List<ComMenu> SELECT_HIERARCHY(ComMenu request);
    List<ComMenu> SELECT_ACCESS_RIGHTS_GROUP_FOR_MENU(ComMenu request);
}