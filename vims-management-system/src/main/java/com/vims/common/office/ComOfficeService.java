package com.vims.common.office;

import com.system.common.base.AbstractCommonService;
import com.system.common.exception.CustomException;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ComOfficeService extends AbstractCommonService<ComOffice> {
    private final ComOfficeMapper comOfficeMapper;
    private final ComOfficeRepository comOfficeRepository;
    private final MessageSource messageSource;

    private String getMessage(String code) {
        return messageSource.getMessage(code, null, LocaleContextHolder.getLocale());
    }

    @Override
    protected List<ComOffice> selectPage(ComOffice request) throws Exception {
        try {
            return comOfficeMapper.SELECT_PAGE(request);
        } catch (Exception e) {
            throw new CustomException(getMessage("EXCEPTION.SELECT"));
        }
    }

    @Override
    protected int selectPagingTotalNumber(ComOffice request) throws Exception {
        try {
            return comOfficeMapper.SELECT_PAGING_TOTAL_NUMBER(request);
        } catch (Exception e) {
            throw new CustomException(getMessage("EXCEPTION.SELECT"));
        }
    }

    @Override
    protected List<ComOffice> findImpl(ComOffice request) throws Exception {
        try {
            return comOfficeMapper.SELECT(request);
        } catch (Exception e) {
            throw new CustomException(getMessage("EXCEPTION.SELECT"));
        }

    }

    @Override
    protected int removeImpl(ComOffice request) {
        try {
            return comOfficeMapper.DELETE(request);
        } catch (Exception e) {
            throw new CustomException(getMessage("EXCEPTION.REMOVE"));
        }
    }

    @Override
    protected int updateImpl(ComOffice request) {
        try {
            return comOfficeMapper.UPDATE(request);
        } catch (Exception e) {
            throw new CustomException(getMessage("EXCEPTION.UPDATE"));
        }
    }

    @Override
    protected int registerImpl(ComOffice request) {
        try {
            return comOfficeMapper.INSERT(request);
        } catch (DuplicateKeyException dke) {
            throw new CustomException(getMessage("EXCEPTION.PK.EXIST"));
        }

    }
}