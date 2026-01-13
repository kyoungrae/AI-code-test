package com.vims.common.code;

import com.system.common.base.AbstractCommonService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ComCodeService extends AbstractCommonService<ComCode> {

    private final ComCodeRepository comCodeRepository;
    private final ComCodeMapper comCodeMapper;

    protected List<ComCode> findComCode(ComCode request) throws Exception {
        try {
            return comCodeMapper.SELECT(request);
        } catch (Exception e) {
            throw new Exception(e);
        }

    }

    @Override
    protected List<ComCode> selectPage(ComCode request) throws Exception {
        return comCodeMapper.SELECT_PAGE(request);
    }

    @Override
    protected int selectPagingTotalNumber(ComCode request) throws Exception {
        return comCodeMapper.SELECT_PAGING_TOTAL_NUMBER(request);
    }

    @Override
    protected List<ComCode> findImpl(ComCode request) throws Exception {
        return comCodeMapper.SELECT(request);
    }

    @Override
    protected int removeImpl(ComCode request) {
        return comCodeMapper.DELETE(request);
    }

    @Override
    protected int updateImpl(ComCode request) {
        return comCodeMapper.UPDATE(request);
    }

    @Override
    protected int registerImpl(ComCode request) {
        return comCodeMapper.INSERT(request);
    }

    @Override
    protected int excelUploadImpl(MultipartFile arg0) throws Exception {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'excelUploadImpl'");
    }

}
