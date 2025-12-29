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
public class CommonFileDetailService extends AbstractCommonService<CommonFileDetail> {
    private final CommonFileDetailMapper commonFileDetailMapper;

    private final MessageSource messageSource;

    private String getMessage(String code) {
        return messageSource.getMessage(code, null, LocaleContextHolder.getLocale());
    }

    @Override
    protected List<CommonFileDetail> selectPage(CommonFileDetail request) throws Exception {
        return commonFileDetailMapper.SELECT_PAGE(request);
    }

    @Override
    protected int selectPagingTotalNumber(CommonFileDetail request) throws Exception {
        return commonFileDetailMapper.SELECT_PAGING_TOTAL_NUMBER(request);
    }
    @Override
    protected List<CommonFileDetail> findImpl(CommonFileDetail request) throws Exception {
        return commonFileDetailMapper.SELECT(request);
    }

    @Override
    protected int removeImpl(CommonFileDetail request) {
        return commonFileDetailMapper.DELETE(request);
    }

    @Override
    protected int updateImpl(CommonFileDetail request) {
        return commonFileDetailMapper.UPDATE(request);
    }

    @Override
    protected int registerImpl(CommonFileDetail request) {
        return commonFileDetailMapper.INSERT(request);
    }

    @Transactional(rollbackFor = Exception.class)
    protected int registerImpl(List<CommonFileDetail> request) throws Exception{
        int rtn = 0;
        try {
            for(CommonFileDetail map : request){
                if(map.getFile_name() != null || !map.getFile_name().equals("")){
                    rtn = commonFileDetailMapper.INSERT(map);
                }
            }
        }catch (Exception e){
            throw new CustomException(getMessage("EXCEPTION.FILE.TYPE"));
        }
        return rtn;
    }

    @Transactional(rollbackFor = Exception.class)
    protected int removeByFileIdAndUuid(CommonFileDetail request) throws Exception {
        int deletedRows = commonFileDetailMapper.DELETE(request);
        if (deletedRows == 0) return 0;
        deleteFile(request);

        return deletedRows;
    }

    protected void deleteFile(CommonFileDetail param) throws IOException {
        File file = new File(param.getFile_path());
        Files.deleteIfExists(file.toPath());
    }

    @Transactional(rollbackFor = Exception.class)
    protected int updateList(List<CommonFileDetail> request) throws Exception{
        int rtn = 0;
        try {
            for(CommonFileDetail map : request){
                if(map.getUuid() != null && !map.getUuid().isEmpty()){
                    rtn = commonFileDetailMapper.UPDATE(map);
                }
            }
        }catch (Exception e){
            // todo 알맞은 Exception 추가 필요
            throw new CustomException(getMessage("EXCEPTION.FILE.TYPE"));
        }
        return rtn;
    }
}