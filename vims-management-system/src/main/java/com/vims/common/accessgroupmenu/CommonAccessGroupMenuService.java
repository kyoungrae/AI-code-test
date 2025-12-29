/**
 *  ++ giens Product ++
 */
package com.vims.common.accessgroupmenu;

import com.system.common.base.AbstractCommonService;
import com.system.common.exception.CustomException;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommonAccessGroupMenuService extends AbstractCommonService<CommonAccessGroupMenu> {
    private final CommonAccessGroupMenuMapper commonAccessGroupMenuMapper;
    private final CommonAccessGroupMenuRepository commonAccessGroupMenuRepository;
    private final MessageSource messageSource;

    private String getMessage(String code) {
        return messageSource.getMessage(code, null, LocaleContextHolder.getLocale());
    }
    @Override
    protected List<CommonAccessGroupMenu> selectPage(CommonAccessGroupMenu request) throws Exception {
        try{
            return commonAccessGroupMenuMapper.SELECT_PAGE(request);
        }catch (Exception e){
            throw new CustomException(getMessage("EXCEPTION.SELECT"));
        }
    }

    @Override
    protected int selectPagingTotalNumber(CommonAccessGroupMenu request) throws Exception {
        try{
          return commonAccessGroupMenuMapper.SELECT_PAGING_TOTAL_NUMBER(request);
        }catch (Exception e){
            throw new CustomException(getMessage("EXCEPTION.SELECT"));
        }
    }
    @Override
    protected List<CommonAccessGroupMenu> findImpl(CommonAccessGroupMenu request) throws Exception {
        try{
            return commonAccessGroupMenuMapper.SELECT(request);
        }catch (Exception e){
            throw new CustomException(getMessage("EXCEPTION.SELECT"));
        }

    }

    @Override
    protected int removeImpl(CommonAccessGroupMenu request) {
        try{
            return commonAccessGroupMenuMapper.DELETE(request);
        }catch (Exception e){
            throw new CustomException(getMessage("EXCEPTION.REMOVE"));
        }
    }

    @Override
    protected int updateImpl(CommonAccessGroupMenu request) {
        try{
            return commonAccessGroupMenuMapper.UPDATE(request);
        }catch (Exception e){
            throw new CustomException(getMessage("EXCEPTION.UPDATE"));
        }
    }

    @Override
    protected int registerImpl(CommonAccessGroupMenu request){
        try{
            return commonAccessGroupMenuMapper.INSERT(request);
        }catch (Exception e){
            throw new CustomException(getMessage("EXCEPTION.REGIST"));
        }

    }
}