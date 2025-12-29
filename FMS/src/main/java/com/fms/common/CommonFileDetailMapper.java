package com.fms.common;

import com.system.common.base.CommonMapper;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface CommonFileDetailMapper extends CommonMapper<CommonFileDetail> {
    int INSERT(CommonFileDetail param);
    List<CommonFileDetail> SELECT(CommonFileDetail param);
    int UPDATE(CommonFileDetail param);
}