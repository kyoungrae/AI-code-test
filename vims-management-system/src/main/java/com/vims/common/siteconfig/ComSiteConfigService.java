/**
 * ++ giens Product ++
 */
package com.vims.common.siteconfig;

import com.system.common.base.AbstractCommonService;
import com.system.common.exception.CustomException;
import com.system.common.util.passwordvalidation.PasswordPolicy;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
public class ComSiteConfigService extends AbstractCommonService<ComSiteConfig> {
    private final ComSiteConfigMapper comSiteConfigMapper;
    private final ComSiteConfigRepository comSiteConfigRepository;
    private final MessageSource messageSource;

    private String getMessage(String code) {
        return messageSource.getMessage(code, null, LocaleContextHolder.getLocale());
    }

    @Override
    protected List<ComSiteConfig> selectPage(ComSiteConfig request) throws Exception {
        return comSiteConfigMapper.SELECT_PAGE(request);
    }

    @Override
    protected int selectPagingTotalNumber(ComSiteConfig request) throws Exception {
        return comSiteConfigMapper.SELECT_PAGING_TOTAL_NUMBER(request);
    }

    @Override
    public List<ComSiteConfig> findImpl(ComSiteConfig request) throws Exception {
        return comSiteConfigMapper.SELECT(request);
    }

    @Override
    protected int removeImpl(ComSiteConfig request) {
        return comSiteConfigMapper.DELETE(request);
    }

    @Override
    protected int updateImpl(ComSiteConfig request) {
        return comSiteConfigMapper.UPDATE(request);
    }
    @Override
    protected int registerImpl(ComSiteConfig request) throws Exception{
        try{
            return comSiteConfigMapper.INSERT(request);
        }catch (DuplicateKeyException dke){
            throw new CustomException(getMessage("EXCEPTION.PK.EXIST"));
        }
    }
}