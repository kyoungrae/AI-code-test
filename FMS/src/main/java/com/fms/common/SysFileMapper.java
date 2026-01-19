package com.fms.common;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface SysFileMapper {
    void SYS_FILE_INSERT(SysFile param) throws Exception;

    List<Map<String, Object>> SYS_FILE_SELECT(Map<String, Object> param) throws Exception;

    int SYS_FILE_DELETE(SysFile param) throws Exception;
}