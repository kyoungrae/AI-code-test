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
        return sysBbsBoardMapper.SELECT(request);
    }

    @Override
    protected int removeImpl(SysBbsBoard request) {
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
