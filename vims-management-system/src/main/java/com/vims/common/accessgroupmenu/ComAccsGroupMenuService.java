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
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ComAccsGroupMenuService extends AbstractCommonService<ComAccsGroupMenu> {
    private final ComAccsGroupMenuMapper comAccsGroupMenuMapper;
    private final ComAccsGroupMenuRepository comAccsGroupMenuRepository;
    private final MessageSource messageSource;

    private String getMessage(String code) {
        return messageSource.getMessage(code, null, LocaleContextHolder.getLocale());
    }

    @Override
    protected List<ComAccsGroupMenu> selectPage(ComAccsGroupMenu request) throws Exception {
        try {
            return comAccsGroupMenuMapper.SELECT_PAGE(request);
        } catch (Exception e) {
            throw new CustomException(getMessage("EXCEPTION.SELECT"));
        }
    }

    @Override
    protected int selectPagingTotalNumber(ComAccsGroupMenu request) throws Exception {
        try {
            return comAccsGroupMenuMapper.SELECT_PAGING_TOTAL_NUMBER(request);
        } catch (Exception e) {
            throw new CustomException(getMessage("EXCEPTION.SELECT"));
        }
    }

    @Override
    protected List<ComAccsGroupMenu> findImpl(ComAccsGroupMenu request) throws Exception {
        try {
            return comAccsGroupMenuMapper.SELECT(request);
        } catch (Exception e) {
            throw new CustomException(getMessage("EXCEPTION.SELECT"));
        }

    }

    @Override
    protected int removeImpl(ComAccsGroupMenu request) {
        try {
            return comAccsGroupMenuMapper.DELETE(request);
        } catch (Exception e) {
            throw new CustomException(getMessage("EXCEPTION.REMOVE"));
        }
    }

    @Override
    protected int updateImpl(ComAccsGroupMenu request) {
        try {
            return comAccsGroupMenuMapper.UPDATE(request);
        } catch (Exception e) {
            throw new CustomException(getMessage("EXCEPTION.UPDATE"));
        }
    }

    @Override
    protected int registerImpl(ComAccsGroupMenu request) {
        try {
            return comAccsGroupMenuMapper.INSERT(request);
        } catch (Exception e) {
            throw new CustomException(getMessage("EXCEPTION.REGIST"));
        }

    }

    @Override
    protected int excelUploadImpl(MultipartFile file) throws Exception {
        return 0;
    }
}