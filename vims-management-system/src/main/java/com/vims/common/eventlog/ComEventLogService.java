package com.vims.common.eventlog;

import com.system.common.base.AbstractCommonService;
import com.system.common.exception.CustomException;
import com.vims.fmsClient.ExcelDataResponse;
import com.vims.fmsClient.FmsExcelClient;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ComEventLogService extends AbstractCommonService<ComEventLog> {
    private final ComEventLogMapper comEventLogMapper;
    private final ComEventLogRepository comEventLogRepository;
    private final MessageSource messageSource;
    private final FmsExcelClient fmsExcelClient; // FMS 서비스 통신용 Feign Client

    @Value("${fms.internal.api-key}")
    private String fmsInternalApiKey; // 내부 API 키 (application.yml에서 주입)

    private String getMessage(String code) {
        return messageSource.getMessage(code, null, LocaleContextHolder.getLocale());
    }

    @Override
    protected List<ComEventLog> selectPage(ComEventLog request) throws Exception {
        try {
            return comEventLogMapper.SELECT_PAGE(request);
        } catch (Exception e) {
            throw new CustomException(getMessage("EXCEPTION.SELECT"));
        }
    }

    @Override
    protected int selectPagingTotalNumber(ComEventLog request) throws Exception {
        try {
            return comEventLogMapper.SELECT_PAGING_TOTAL_NUMBER(request);
        } catch (Exception e) {
            throw new CustomException(getMessage("EXCEPTION.SELECT"));
        }
    }

    @Override
    protected List<ComEventLog> findImpl(ComEventLog request) throws Exception {
        try {
            return comEventLogMapper.SELECT(request);
        } catch (Exception e) {
            throw new CustomException(getMessage("EXCEPTION.SELECT"));
        }

    }

    @Override
    protected int removeImpl(ComEventLog request) {
        try {
            return comEventLogMapper.DELETE(request);
        } catch (Exception e) {
            throw new CustomException(getMessage("EXCEPTION.REMOVE"));
        }
    }

    @Override
    protected int updateImpl(ComEventLog request) {
        try {
            return comEventLogMapper.UPDATE(request);
        } catch (Exception e) {
            throw new CustomException(getMessage("EXCEPTION.UPDATE"));
        }
    }

    @Override
    protected int registerImpl(ComEventLog request) {
        try {
            return comEventLogMapper.INSERT(request);
        } catch (DuplicateKeyException dke) {
            throw new CustomException(getMessage("EXCEPTION.PK.EXIST"));
        }

    }

    @Override
    protected int excelUploadImpl(MultipartFile file) throws Exception {
        try {
            // FMS 서비스의 엑셀 업로드 API 호출
            ExcelDataResponse excelData = fmsExcelClient.uploadExcel(file, fmsInternalApiKey);
            System.out.println("excelData::::" + excelData);
            // 엑셀 데이터 검증
            if (excelData == null || excelData.getDataRows() == null || excelData.getDataRows().isEmpty()) {
                throw new CustomException(getMessage("EXCEPTION.FMS.NO_DATA"));
            }
            return 0;

        } catch (IllegalArgumentException e) {
            throw new CustomException(getMessage("EXCEPTION.FMS.INVALID_FILE_FORMAT"));
        } catch (SecurityException e) {
            throw new CustomException(getMessage("EXCEPTION.FMS.ACCESS_DENIED"));
        } catch (Exception e) {
            throw new CustomException(getMessage("EXCEPTION.FMS.UPLOAD_ERROR"));
        }
    }
}