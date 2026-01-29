package com.vims.common.bbs;

import com.system.common.base.AbstractCommonService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SysBbsBoardService extends AbstractCommonService<SysBbsBoard> {
    private final SysBbsBoardMapper sysBbsBoardMapper;
    private final com.vims.fmsClient.FmsClient fmsClient;

    @Override
    protected List<SysBbsBoard> selectPage(SysBbsBoard request) throws Exception {
        return sysBbsBoardMapper.SELECT_PAGE(request);
    }

    @Override
    protected int selectPagingTotalNumber(SysBbsBoard request) throws Exception {
        return sysBbsBoardMapper.SELECT_PAGING_TOTAL_NUMBER(request);
    }

    @Override
    protected List<SysBbsBoard> findImpl(SysBbsBoard request) throws Exception {
        if (request.getBoard_id() != null && !request.getBoard_id().isEmpty()) {
            sysBbsBoardMapper.INCREMENT_HIT_COUNT(request);
        }
        return sysBbsBoardMapper.SELECT(request);
    }

    @Override
    protected int removeImpl(SysBbsBoard request) {
        // 1. 게시글 정보 조회 (File UUID 확인 목적)
        List<SysBbsBoard> boardList = sysBbsBoardMapper.SELECT(request);
        if (boardList != null && !boardList.isEmpty()) {
            SysBbsBoard board = boardList.get(0);
            String fileUuid = board.getFile_uuid();

            // 2. 파일이 존재하면 FMS를 통해 삭제 요청
            if (fileUuid != null && !fileUuid.isEmpty()) {
                try {
                    java.util.Map<String, Object> fileParam = new java.util.HashMap<>();
                    fileParam.put("file_uuid", fileUuid);
                    fmsClient.removeByFileUuid(fileParam);
                } catch (Exception e) {
                    e.printStackTrace();
                    // 파일 삭제 실패해도 게시글 삭제는 진행할지 여부 결정.
                    // 일반적으로는 게시글 삭제 진행. 로그만 남김.
                }
            }
        }
        return sysBbsBoardMapper.DELETE(request);
    }

    @Override
    protected int updateImpl(SysBbsBoard request) {
        return sysBbsBoardMapper.UPDATE(request);
    }

    @Override
    protected int registerImpl(SysBbsBoard request) {
        if (request.getBoard_id() == null || request.getBoard_id().isEmpty()) {
            request.setBoard_id(UUID.randomUUID().toString());
        }
        return sysBbsBoardMapper.INSERT(request);
    }

    @Override
    protected int excelUploadImpl(MultipartFile file) throws Exception {
        return 0;
    }
}
