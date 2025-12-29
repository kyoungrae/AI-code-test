package com.fms.common;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface CommonFileMapper {
    void COMMON_FILE_INSERT(CommonFile param ) throws Exception;
    List<Map<String,Object>> COMMON_FILE_SELECT(Map<String,Object> param) throws Exception;
}