package com.vims.common.codegroup;

import com.system.common.base.AbstractCommonService;
import com.system.common.exception.CustomException;

import lombok.AllArgsConstructor;

import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ComCodeGroupService extends AbstractCommonService<ComCodeGroup> {
    private final ComCodeGroupMapper comCodeGroupMapper;
    private final ComCodeGroupRepository comCodeGroupRepository;
    private final MessageSource messageSource;

    private String getMessage(String code) {
        return messageSource.getMessage(code, null, LocaleContextHolder.getLocale());
    }

    protected List<ComCodeGroup> findByGroupId(ComCodeGroup request) throws Exception {
        try {
            return comCodeGroupRepository.findAll();
        } catch (Exception e) {
            throw new Exception(e);
        }
    }

    @Override
    protected List<ComCodeGroup> selectPage(ComCodeGroup request) throws Exception {
        return comCodeGroupMapper.SELECT_PAGE(request);
    }

    @Override
    protected int selectPagingTotalNumber(ComCodeGroup request) throws Exception {
        return comCodeGroupMapper.SELECT_PAGING_TOTAL_NUMBER(request);
    }

    @Override
    protected List<ComCodeGroup> findImpl(ComCodeGroup request) throws Exception {
        return comCodeGroupMapper.SELECT(request);
    }

    @Override
    protected int removeImpl(ComCodeGroup request) {
        List<ComCodeGroup> list = null;
        try {
            var comCodeGroup = ComCodeGroup.builder().group_id(request.getGroup_id()).build();
            list = comCodeGroupMapper.SELECT(comCodeGroup);
            if (list.isEmpty()) {
                return comCodeGroupMapper.DELETE(request);
            } else {
                throw new CustomException(getMessage("EXCEPTION.DELETE.EXIST.SBU_DATA"));
            }
        } catch (CustomException e) {
            throw e;
        }
    }

    @Override
    protected int updateImpl(ComCodeGroup request) {
        return comCodeGroupMapper.UPDATE(request);
    }

    @Override
    protected int registerImpl(ComCodeGroup request) {
        return comCodeGroupMapper.INSERT(request);
    }
}
