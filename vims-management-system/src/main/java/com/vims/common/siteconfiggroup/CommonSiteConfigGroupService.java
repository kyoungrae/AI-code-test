/**
 *  ++ giens Product ++
 */
package com.vims.common.siteconfiggroup;

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
public class CommonSiteConfigGroupService extends AbstractCommonService<CommonSiteConfigGroup> {
    private final CommonSiteConfigGroupMapper commonSiteConfigGroupMapper;
    private final CommonSiteConfigGroupRepository commonSiteConfigGroupRepository;
    private final MessageSource messageSource;

    private String getMessage(String code) {
        return messageSource.getMessage(code, null, LocaleContextHolder.getLocale());
    }
    @Override
    protected List<CommonSiteConfigGroup> selectPage(CommonSiteConfigGroup request) throws Exception {
        try{
            return commonSiteConfigGroupMapper.SELECT_PAGE(request);
        }catch (Exception e){
            throw new CustomException(getMessage(""));
        }
    }

    @Override
    protected int selectPagingTotalNumber(CommonSiteConfigGroup request) throws Exception {
        try{
          return commonSiteConfigGroupMapper.SELECT_PAGING_TOTAL_NUMBER(request);
        }catch (Exception e){
            throw new CustomException(getMessage(""));
        }
    }
    @Override
    protected List<CommonSiteConfigGroup> findImpl(CommonSiteConfigGroup request) throws Exception {
        try{
            return commonSiteConfigGroupMapper.SELECT(request);
        }catch (Exception e){
            throw new CustomException(getMessage(""));
        }

    }

    @Override
    protected int removeImpl(CommonSiteConfigGroup request) {
        try{
            return commonSiteConfigGroupMapper.DELETE(request);
        }catch (Exception e){
            throw new CustomException(getMessage(""));
        }
    }

    @Override
    protected int updateImpl(CommonSiteConfigGroup request) {
        try{
            return commonSiteConfigGroupMapper.UPDATE(request);
        }catch (Exception e){
            throw new CustomException(getMessage(""));
        }
    }

    @Override
    protected int registerImpl(CommonSiteConfigGroup request){
        try{
            return commonSiteConfigGroupMapper.INSERT(request);
        }catch (DuplicateKeyException dke){
            throw new CustomException(getMessage("EXCEPTION.PK.EXIST"));
        }catch (Exception e){
            throw e;
        }

    }
}