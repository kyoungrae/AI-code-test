package com.vims.common.bbs;

import com.system.common.base.AbstractCommonService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SysBbsReplyService extends AbstractCommonService<SysBbsReply> {
    private final SysBbsReplyMapper sysBbsReplyMapper;

    @Override
    public Map<String, List<?>> findPage(SysBbsReply request) throws Exception {
        List<SysBbsReply> list = new ArrayList<>();
        Map<String, List<?>> result = new HashMap<>();
        try {
            list = selectPage(request);
            result.put("DATA", list);
        } catch (Exception e) {
            throw new Exception(e);
        }
        return result;
    }

    @Override
    protected List<SysBbsReply> selectPage(SysBbsReply request) throws Exception {
        return sysBbsReplyMapper.SELECT_PAGE(request);
    }

    @Override
    protected int selectPagingTotalNumber(SysBbsReply request) throws Exception {
        return sysBbsReplyMapper.SELECT_PAGING_TOTAL_NUMBER(request);
    }

    @Override
    protected List<SysBbsReply> findImpl(SysBbsReply request) throws Exception {
        return sysBbsReplyMapper.SELECT(request);
    }

    /**
     * 게시물 ID로 댓글 목록 조회 (계층 구조 정렬)
     */
    public List<SysBbsReply> findByBoardId(SysBbsReply request) throws Exception {
        return sysBbsReplyMapper.SELECT_BY_BOARD_ID(request);
    }

    /**
     * 게시물 ID로 댓글 수 조회
     */
    public int countByBoardId(SysBbsReply request) {
        return sysBbsReplyMapper.COUNT_BY_BOARD_ID(request);
    }

    @Override
    protected int removeImpl(SysBbsReply request) {
        return sysBbsReplyMapper.DELETE(request);
    }

    @Override
    protected int updateImpl(SysBbsReply request) {
        return sysBbsReplyMapper.UPDATE(request);
    }

    @Override
    protected int registerImpl(SysBbsReply request) {
        if (request.getReply_id() == null || request.getReply_id().isEmpty()) {
            request.setReply_id(UUID.randomUUID().toString());
        }
        return sysBbsReplyMapper.INSERT(request);
    }

    @Override
    protected int excelUploadImpl(MultipartFile file) throws Exception {
        return 0;
    }
}
