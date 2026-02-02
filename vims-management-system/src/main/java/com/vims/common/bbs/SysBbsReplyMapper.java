package com.vims.common.bbs;

import com.system.common.base.CommonMapper;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface SysBbsReplyMapper extends CommonMapper<SysBbsReply> {
    List<SysBbsReply> SELECT_BY_BOARD_ID(SysBbsReply request);

    int COUNT_BY_BOARD_ID(SysBbsReply request);
}
