package com.fms.common;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface SysFileMapper {
    void SYS_FILE_INSERT(SysFile param) throws Exception;

    List<SysFile> SYS_FILE_SELECT(SysFile param) throws Exception;

    int SYS_FILE_DELETE(SysFile param) throws Exception;
}