package com.fms.common;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface ComFileMapper {
    void COM_FILE_INSERT(ComFile param) throws Exception;

    List<Map<String, Object>> COM_FILE_SELECT(Map<String, Object> param) throws Exception;

    int COM_FILE_DELETE(ComFile param) throws Exception;
}