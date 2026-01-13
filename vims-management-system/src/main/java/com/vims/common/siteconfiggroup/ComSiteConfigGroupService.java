/**
 *  ++ giens Product ++
 */
package com.vims.common.siteconfiggroup;

import com.system.common.base.AbstractCommonService;
import com.system.common.exception.CustomException;
import com.vims.common.siteconfig.ComSiteConfig;
import com.vims.common.siteconfig.ComSiteConfigMapper;

import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ComSiteConfigGroupService extends AbstractCommonService<ComSiteConfigGroup> {
    private final ComSiteConfigGroupMapper comSiteConfigGroupMapper;
    private final ComSiteConfigGroupRepository comSiteConfigGroupRepository;
    private final MessageSource messageSource;
    private final ComSiteConfigMapper comSiteConfigMapper;

    private String getMessage(String code) {
        return messageSource.getMessage(code, null, LocaleContextHolder.getLocale());
    }

    @Override
    protected List<ComSiteConfigGroup> selectPage(ComSiteConfigGroup request) throws Exception {
        try {
            return comSiteConfigGroupMapper.SELECT_PAGE(request);
        } catch (Exception e) {
            throw new CustomException(getMessage(""));
        }
    }

    @Override
    protected int selectPagingTotalNumber(ComSiteConfigGroup request) throws Exception {
        try {
            return comSiteConfigGroupMapper.SELECT_PAGING_TOTAL_NUMBER(request);
        } catch (Exception e) {
            throw new CustomException(getMessage(""));
        }
    }

    @Override
    protected List<ComSiteConfigGroup> findImpl(ComSiteConfigGroup request) throws Exception {
        try {
            return comSiteConfigGroupMapper.SELECT(request);
        } catch (Exception e) {
            throw new CustomException(getMessage(""));
        }

    }

    @Override
    protected int removeImpl(ComSiteConfigGroup request) {
        List<ComSiteConfig> list = null;
        try {
            var isExitParam = ComSiteConfig.builder().config_group_id(request.getConfig_group_id()).build();
            list = comSiteConfigMapper.SELECT(isExitParam);
            if (list.isEmpty()) {
                return comSiteConfigGroupMapper.DELETE(request);
            } else {
                throw new CustomException(getMessage("EXCEPTION.DELETE.EXIST.SBU_DATA"));
            }
        } catch (Exception e) {
            throw e;
        }
    }

    @Override
    protected int updateImpl(ComSiteConfigGroup request) {
        try {
            return comSiteConfigGroupMapper.UPDATE(request);
        } catch (Exception e) {
            throw new CustomException(getMessage(""));
        }
    }

    @Override
    protected int registerImpl(ComSiteConfigGroup request) {
        try {
            return comSiteConfigGroupMapper.INSERT(request);
        } catch (DuplicateKeyException dke) {
            throw new CustomException(getMessage("EXCEPTION.PK.EXIST"));
        } catch (Exception e) {
            throw e;
        }

    }

    @Override
    protected int excelUploadImpl(MultipartFile file) throws Exception {
        return 0;
    }
}