/**
 *  ++ giens Product ++
 */
package com.vims.common.icon;

import com.system.common.base.AbstractCommonService;
import com.system.common.exception.CustomException;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ComIconService extends AbstractCommonService<ComIcon> {
    private final ComIconMapper comIconMapper;
    private final ComIconRepository comIconRepository;
    private final MessageSource messageSource;

    private String getMessage(String code) {
        return messageSource.getMessage(code, null, LocaleContextHolder.getLocale());
    }

    @Override
    protected List<ComIcon> selectPage(ComIcon request) throws Exception {
        try {
            return comIconMapper.SELECT_PAGE(request);
        } catch (Exception e) {
            throw new CustomException(getMessage("EXCEPTION.SELECT"));
        }
    }

    @Override
    protected int selectPagingTotalNumber(ComIcon request) throws Exception {
        try {
            return comIconMapper.SELECT_PAGING_TOTAL_NUMBER(request);
        } catch (Exception e) {
            throw new CustomException(getMessage("EXCEPTION.SELECT"));
        }
    }

    @Override
    protected List<ComIcon> findImpl(ComIcon request) throws Exception {
        try {
            return comIconMapper.SELECT(request);
        } catch (Exception e) {
            throw new CustomException(getMessage("EXCEPTION.SELECT"));
        }

    }

    @Override
    protected int removeImpl(ComIcon request) {
        try {
            return comIconMapper.DELETE(request);
        } catch (Exception e) {
            throw new CustomException(getMessage("EXCEPTION.REMOVE"));
        }
    }

    @Override
    protected int updateImpl(ComIcon request) {
        try {
            return comIconMapper.UPDATE(request);
        } catch (Exception e) {
            throw new CustomException(getMessage("EXCEPTION.UPDATE"));
        }
    }

    @Override
    protected int registerImpl(ComIcon request) {
        try {
            return comIconMapper.INSERT(request);
        } catch (Exception e) {
            throw new CustomException(getMessage("EXCEPTION.REGIST"));
        }

    }

    @Override
    protected int excelUploadImpl(MultipartFile arg0) throws Exception {
        return 0;
    }
}