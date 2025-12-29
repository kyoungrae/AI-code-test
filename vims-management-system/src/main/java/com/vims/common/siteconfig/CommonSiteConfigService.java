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
public class CommonSiteConfigService extends AbstractCommonService<CommonSiteConfig> {
    private final CommonSiteConfigMapper commonSiteConfigMapper;
    private final CommonSiteConfigRepository commonSiteConfigRepository;
    private final MessageSource messageSource;

    private String getMessage(String code) {
        return messageSource.getMessage(code, null, LocaleContextHolder.getLocale());
    }

    @Override
    protected List<CommonSiteConfig> selectPage(CommonSiteConfig request) throws Exception {
        return commonSiteConfigMapper.SELECT_PAGE(request);
    }

    @Override
    protected int selectPagingTotalNumber(CommonSiteConfig request) throws Exception {
        return commonSiteConfigMapper.SELECT_PAGING_TOTAL_NUMBER(request);
    }

    @Override
    public List<CommonSiteConfig> findImpl(CommonSiteConfig request) throws Exception {
        return commonSiteConfigMapper.SELECT(request);
    }

    @Override
    protected int removeImpl(CommonSiteConfig request) {
        return commonSiteConfigMapper.DELETE(request);
    }

    @Override
    protected int updateImpl(CommonSiteConfig request) {
        return commonSiteConfigMapper.UPDATE(request);
    }
    @Override
    protected int registerImpl(CommonSiteConfig request) throws Exception{
        try{
            return commonSiteConfigMapper.INSERT(request);
        }catch (DuplicateKeyException dke){
            throw new CustomException(getMessage("EXCEPTION.PK.EXIST"));
        }
    }
}