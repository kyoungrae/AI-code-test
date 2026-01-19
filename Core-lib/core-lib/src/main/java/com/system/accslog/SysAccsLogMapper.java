package com.system.accslog;

import com.system.common.base.CommonMapper;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface SysAccsLogMapper extends CommonMapper<SysAccsLog> {
    int UPDATE_LOGOUT_BY_USER(SysAccsLog request);
}