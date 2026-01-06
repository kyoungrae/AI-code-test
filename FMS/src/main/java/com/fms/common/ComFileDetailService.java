/**
 *  ++ giens Product ++
 */
package com.fms.common;

import com.system.common.base.AbstractCommonService;
import com.system.common.exception.CustomException;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ComFileDetailService extends AbstractCommonService<ComFileDetail> {
    private final ComFileDetailMapper comFileDetailMapper;

    private final MessageSource messageSource;

    private String getMessage(String code) {
        return messageSource.getMessage(code, null, LocaleContextHolder.getLocale());
    }

    @Override
    protected List<ComFileDetail> selectPage(ComFileDetail request) throws Exception {
        return comFileDetailMapper.SELECT_PAGE(request);
    }

    @Override
    protected int selectPagingTotalNumber(ComFileDetail request) throws Exception {
        return comFileDetailMapper.SELECT_PAGING_TOTAL_NUMBER(request);
    }
    @Override
    protected List<ComFileDetail> findImpl(ComFileDetail request) throws Exception {
        return comFileDetailMapper.SELECT(request);
    }

    @Override
    protected int removeImpl(ComFileDetail request) {
        return comFileDetailMapper.DELETE(request);
    }

    @Override
    protected int updateImpl(ComFileDetail request) {
        return comFileDetailMapper.UPDATE(request);
    }

    @Override
    protected int registerImpl(ComFileDetail request) {
        return comFileDetailMapper.INSERT(request);
    }

    @Transactional(rollbackFor = Exception.class)
    protected int registerImpl(List<ComFileDetail> request) throws Exception{
        int rtn = 0;
        try {
            for(ComFileDetail map : request){
                if(map.getFile_name() != null || !map.getFile_name().equals("")){
                    rtn = comFileDetailMapper.INSERT(map);
                }
            }
        }catch (Exception e){
            throw new CustomException(getMessage("EXCEPTION.FILE.TYPE"));
        }
        return rtn;
    }

    @Transactional(rollbackFor = Exception.class)
    protected int removeByFileIdAndUuid(ComFileDetail request) throws Exception {
        int deletedRows = comFileDetailMapper.DELETE(request);
        if (deletedRows == 0) return 0;
        deleteFile(request);

        return deletedRows;
    }

    protected void deleteFile(ComFileDetail param) throws IOException {
        File file = new File(param.getFile_path());
        Files.deleteIfExists(file.toPath());
    }

    @Transactional(rollbackFor = Exception.class)
    protected int updateList(List<ComFileDetail> request) throws Exception{
        int rtn = 0;
        try {
            for(ComFileDetail map : request){
                if(map.getUuid() != null && !map.getUuid().isEmpty()){
                    rtn = comFileDetailMapper.UPDATE(map);
                }
            }
        }catch (Exception e){
            // todo 알맞은 Exception 추가 필요
            throw new CustomException(getMessage("EXCEPTION.FILE.TYPE"));
        }
        return rtn;
    }
}