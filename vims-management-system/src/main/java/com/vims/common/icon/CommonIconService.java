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

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommonIconService extends AbstractCommonService<CommonIcon> {
    private final CommonIconMapper commonIconMapper;
    private final CommonIconRepository commonIconRepository;
    private final MessageSource messageSource;

    private String getMessage(String code) {
        return messageSource.getMessage(code, null, LocaleContextHolder.getLocale());
    }
    @Override
    protected List<CommonIcon> selectPage(CommonIcon request) throws Exception {
        try{
            return commonIconMapper.SELECT_PAGE(request);
        }catch (Exception e){
            throw new CustomException(getMessage("EXCEPTION.SELECT"));
        }
    }

    @Override
    protected int selectPagingTotalNumber(CommonIcon request) throws Exception {
        try{
          return commonIconMapper.SELECT_PAGING_TOTAL_NUMBER(request);
        }catch (Exception e){
            throw new CustomException(getMessage("EXCEPTION.SELECT"));
        }
    }
    @Override
    protected List<CommonIcon> findImpl(CommonIcon request) throws Exception {
        try{
            return commonIconMapper.SELECT(request);
        }catch (Exception e){
            throw new CustomException(getMessage("EXCEPTION.SELECT"));
        }

    }

    @Override
    protected int removeImpl(CommonIcon request) {
        try{
            return commonIconMapper.DELETE(request);
        }catch (Exception e){
            throw new CustomException(getMessage("EXCEPTION.REMOVE"));
        }
    }

    @Override
    protected int updateImpl(CommonIcon request) {
        try{
            return commonIconMapper.UPDATE(request);
        }catch (Exception e){
            throw new CustomException(getMessage("EXCEPTION.UPDATE"));
        }
    }

    @Override
    protected int registerImpl(CommonIcon request){
        try{
            return commonIconMapper.INSERT(request);
        }catch (Exception e){
            throw new CustomException(getMessage("EXCEPTION.REGIST"));
        }

    }
}