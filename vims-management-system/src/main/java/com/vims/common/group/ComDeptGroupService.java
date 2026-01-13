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
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ComDeptGroupService extends AbstractCommonService<ComDeptGroup> {
    private final ComDeptGroupMapper comDeptGroupMapper;
    private final ComDeptGroupRepository comDeptGroupRepository;
    private final MessageSource messageSource;

    private String getMessage(String code) {
        return messageSource.getMessage(code, null, LocaleContextHolder.getLocale());
    }

    @Override
    protected List<ComDeptGroup> selectPage(ComDeptGroup request) throws Exception {
        return comDeptGroupMapper.SELECT_PAGE(request);
    }

    @Override
    protected int selectPagingTotalNumber(ComDeptGroup request) throws Exception {
        return comDeptGroupMapper.SELECT_PAGING_TOTAL_NUMBER(request);
    }

    @Override
    protected List<ComDeptGroup> findImpl(ComDeptGroup request) throws Exception {
        return comDeptGroupMapper.SELECT(request);
    }

    protected List<ComDeptGroup> findNotExistsComAccsGroupMenu(ComDeptGroup request) throws Exception {
        return comDeptGroupMapper.SELECT_NOT_EXISTS_COM_ACCS_GROUP_MENU(request);
    }

    @Override
    protected int removeImpl(ComDeptGroup request) throws Exception {
        List<ComDeptGroup> list = null;
        try {
            var comDeptGroup = ComDeptGroup.builder().top_group_id(request.getGroup_id()).build();
            list = comDeptGroupMapper.SELECT(comDeptGroup);
            if (list.isEmpty()) {
                return comDeptGroupMapper.DELETE(request);
            } else {
                throw new CustomException(getMessage("EXCEPTION.DELETE.EXIST.SBU_DATA"));
            }
        } catch (CustomException e) {
            throw e;
        }
    }

    @Override
    protected int updateImpl(ComDeptGroup request) {
        return comDeptGroupMapper.UPDATE(request);
    }

    @Override
    protected int registerImpl(ComDeptGroup request) {
        try {
            return comDeptGroupMapper.INSERT(request);
        } catch (DuplicateKeyException dke) {
            throw new CustomException(getMessage("EXCEPTION.PK.EXIST"));
        }
    }

    @Override
    protected int excelUploadImpl(MultipartFile file) throws Exception {
        return 0;
    }
}