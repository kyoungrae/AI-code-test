package com.vims.common.codegroup;

import com.system.common.base.AbstractCommonService;
import com.system.common.exception.CustomException;
import com.vims.common.code.ComCode;
import com.vims.common.code.ComCodeMapper;

import lombok.AllArgsConstructor;

import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@AllArgsConstructor
public class ComCodeGroupService extends AbstractCommonService<ComCodeGroup> {
    private final ComCodeGroupMapper comCodeGroupMapper;
    private final ComCodeGroupRepository comCodeGroupRepository;
    private final MessageSource messageSource;
    private final ComCodeMapper comCodeMapper;

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
        List<ComCode> list = null;
        try {
            var comCode = ComCode.builder().group_id(request.getGroup_id()).build();
            list = comCodeMapper.SELECT(comCode);
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

    @Override
    protected int excelUploadImpl(MultipartFile arg0) throws Exception {
        return 0;
    }
}
