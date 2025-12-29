package com.vims.common.code;

import com.system.common.base.AbstractCommonService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommonCodeService extends AbstractCommonService<CommonCode> {

    private final CommonCodeRepository commonCodeRepository;
    private final CommonCodeMapper commonCodeMapper;
    protected List<CommonCode> findCommonCode(CommonCode request) throws Exception {
        try{
            return commonCodeMapper.SELECT(request);
        }catch (Exception e){
            throw new Exception(e);
        }

    }
    @Override
    protected List<CommonCode> selectPage(CommonCode request) throws Exception {
        return commonCodeMapper.SELECT_PAGE(request);
    }

    @Override
    protected int selectPagingTotalNumber(CommonCode request) throws Exception {
        return commonCodeMapper.SELECT_PAGING_TOTAL_NUMBER(request);
    }
    @Override
    protected List<CommonCode> findImpl(CommonCode request) throws Exception {
        return commonCodeMapper.SELECT(request);
    }

    @Override
    protected int removeImpl(CommonCode request) {
        return commonCodeMapper.DELETE(request);
    }

    @Override
    protected int updateImpl(CommonCode request) {
        return commonCodeMapper.UPDATE(request);
    }

    @Override
    protected int registerImpl(CommonCode request) {
        return commonCodeMapper.INSERT(request);
    }

}
