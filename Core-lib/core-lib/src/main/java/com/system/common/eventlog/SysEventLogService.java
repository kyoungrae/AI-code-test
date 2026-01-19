package com.system.common.eventlog;

import com.system.common.base.AbstractCommonService;
import com.system.common.exception.CustomException;
import lombok.RequiredArgsConstructor;

import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SysEventLogService extends AbstractCommonService<SysEventLog> {
    private final SysEventLogMapper sysEventLogMapper;
    private final SysEventLogRepository sysEventLogRepository;
    private final MessageSource messageSource;

    private String getMessage(String code) {
        return messageSource.getMessage(code, null, LocaleContextHolder.getLocale());
    }

    @Override
    protected List<SysEventLog> selectPage(SysEventLog request) throws Exception {
        try {
            return sysEventLogMapper.SELECT_PAGE(request);
        } catch (Exception e) {
            e.printStackTrace();
            throw new CustomException(getMessage("EXCEPTION.SELECT"));
        }
    }

    @Override
    protected int selectPagingTotalNumber(SysEventLog request) throws Exception {
        try {
            return sysEventLogMapper.SELECT_PAGING_TOTAL_NUMBER(request);
        } catch (Exception e) {
            throw new CustomException(getMessage("EXCEPTION.SELECT"));
        }
    }

    @Override
    protected List<SysEventLog> findImpl(SysEventLog request) throws Exception {
        try {
            return sysEventLogMapper.SELECT(request);
        } catch (Exception e) {
            throw new CustomException(getMessage("EXCEPTION.SELECT"));
        }

    }

    @Override
    protected int removeImpl(SysEventLog request) {
        try {
            return sysEventLogMapper.DELETE(request);
        } catch (Exception e) {
            throw new CustomException(getMessage("EXCEPTION.REMOVE"));
        }
    }

    @Override
    protected int updateImpl(SysEventLog request) {
        try {
            return sysEventLogMapper.UPDATE(request);
        } catch (Exception e) {
            throw new CustomException(getMessage("EXCEPTION.UPDATE"));
        }
    }

    @Override
    protected int registerImpl(SysEventLog request) {
        try {
            return sysEventLogMapper.INSERT(request);
        } catch (DuplicateKeyException dke) {
            throw new CustomException(getMessage("EXCEPTION.PK.EXIST"));
        }

    }

    @Override
    protected int excelUploadImpl(MultipartFile file) throws Exception {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'excelUploadImpl'");
    }

}