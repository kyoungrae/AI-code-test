/**
 *  ++ giens Product ++
 */
package com.vims.common.siteconfiggroup;

import com.system.common.base.AbstractCommonService;
import com.system.common.exception.CustomException;
import com.vims.common.siteconfig.CommonSiteConfig;
import com.vims.common.siteconfig.CommonSiteConfigMapper;

import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommonSiteConfigGroupService extends AbstractCommonService<CommonSiteConfigGroup> {
    private final CommonSiteConfigGroupMapper commonSiteConfigGroupMapper;
    private final CommonSiteConfigGroupRepository commonSiteConfigGroupRepository;
    private final MessageSource messageSource;
    private final CommonSiteConfigMapper commonSiteConfigMapper;

    private String getMessage(String code) {
        return messageSource.getMessage(code, null, LocaleContextHolder.getLocale());
    }

    @Override
    protected List<CommonSiteConfigGroup> selectPage(CommonSiteConfigGroup request) throws Exception {
        try {
            return commonSiteConfigGroupMapper.SELECT_PAGE(request);
        } catch (Exception e) {
            throw new CustomException(getMessage(""));
        }
    }

    @Override
    protected int selectPagingTotalNumber(CommonSiteConfigGroup request) throws Exception {
        try {
            return commonSiteConfigGroupMapper.SELECT_PAGING_TOTAL_NUMBER(request);
        } catch (Exception e) {
            throw new CustomException(getMessage(""));
        }
    }

    @Override
    protected List<CommonSiteConfigGroup> findImpl(CommonSiteConfigGroup request) throws Exception {
        try {
            return commonSiteConfigGroupMapper.SELECT(request);
        } catch (Exception e) {
            throw new CustomException(getMessage(""));
        }

    }

    @Override
    protected int removeImpl(CommonSiteConfigGroup request) {
        List<CommonSiteConfig> list = null;
        try {
            var isExitParam = CommonSiteConfig.builder().config_group_id(request.getConfig_group_id()).build();
            list = commonSiteConfigMapper.SELECT(isExitParam);
            if (list.isEmpty()) {
                return commonSiteConfigGroupMapper.DELETE(request);
            } else {
                throw new CustomException(getMessage("EXCEPTION.DELETE.EXIST.SBU_DATA"));
            }
        } catch (Exception e) {
            throw e;
        }
    }

    @Override
    protected int updateImpl(CommonSiteConfigGroup request) {
        try {
            return commonSiteConfigGroupMapper.UPDATE(request);
        } catch (Exception e) {
            throw new CustomException(getMessage(""));
        }
    }

    @Override
    protected int registerImpl(CommonSiteConfigGroup request) {
        try {
            return commonSiteConfigGroupMapper.INSERT(request);
        } catch (DuplicateKeyException dke) {
            throw new CustomException(getMessage("EXCEPTION.PK.EXIST"));
        } catch (Exception e) {
            throw e;
        }

    }
}