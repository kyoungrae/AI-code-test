package com.fms.common;

import com.system.common.base.CommonMapper;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface SysFileDetailMapper extends CommonMapper<SysFileDetail> {
    int INSERT(SysFileDetail param);
    List<SysFileDetail> SELECT(SysFileDetail param);
    int UPDATE(SysFileDetail param);
}