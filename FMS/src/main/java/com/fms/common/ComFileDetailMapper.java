package com.fms.common;

import com.system.common.base.CommonMapper;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ComFileDetailMapper extends CommonMapper<ComFileDetail> {
    int INSERT(ComFileDetail param);
    List<ComFileDetail> SELECT(ComFileDetail param);
    int UPDATE(ComFileDetail param);
}