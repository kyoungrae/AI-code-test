/**
 *  ++ giens Product ++
 */
package com.vims.common.group;

import com.system.common.base.AbstractCommonService;
import com.system.common.exception.CustomException;
import com.vims.common.usergroup.ComUserGroup;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ComGroupService extends AbstractCommonService<ComGroup> {
    private final ComGroupMapper comGroupMapper;
    private final ComGroupRepository comGroupRepository;
    private final MessageSource messageSource;

    private String getMessage(String code) {
        return messageSource.getMessage(code, null, LocaleContextHolder.getLocale());
    }

    @Override
    protected List<ComGroup> selectPage(ComGroup request) throws Exception {
        return comGroupMapper.SELECT_PAGE(request);
    }

    @Override
    protected int selectPagingTotalNumber(ComGroup request) throws Exception {
        return comGroupMapper.SELECT_PAGING_TOTAL_NUMBER(request);
    }

    @Override
    protected List<ComGroup> findImpl(ComGroup request) throws Exception {
        return comGroupMapper.SELECT(request);
    }

    protected List<ComGroup> findNotExistsComAccsGroupMenu(ComGroup request) throws Exception {
        return comGroupMapper.SELECT_NOT_EXISTS_COM_ACCS_GROUP_MENU(request);
    }

    @Override
    protected int removeImpl(ComGroup request) throws Exception {
        List<ComGroup> list = null;
        try {
            var comGroup = ComGroup.builder().top_group_id(request.getGroup_id()).build();
            list = comGroupMapper.SELECT(comGroup);
            if (list.isEmpty()) {
                return comGroupMapper.DELETE(request);
            } else {
                throw new CustomException(getMessage("EXCEPTION.DELETE.EXIST.SBU_DATA"));
            }
        } catch (CustomException e) {
            throw e;
        }
    }

    @Override
    protected int updateImpl(ComGroup request) {
        return comGroupMapper.UPDATE(request);
    }

    @Override
    protected int registerImpl(ComGroup request) {
        try {
            return comGroupMapper.INSERT(request);
        } catch (DuplicateKeyException dke) {
            throw new CustomException(getMessage("EXCEPTION.PK.EXIST"));
        }
    }
}