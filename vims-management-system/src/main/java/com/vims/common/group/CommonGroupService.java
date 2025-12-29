/**
 *  ++ giens Product ++
 */
package com.vims.common.group;

import com.system.common.base.AbstractCommonService;
import com.system.common.exception.CustomException;
import com.vims.common.usergroup.CommonUserGroup;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommonGroupService extends AbstractCommonService<CommonGroup> {
    private final CommonGroupMapper commonGroupMapper;
    private final CommonGroupRepository commonGroupRepository;
    private final MessageSource messageSource;

    private String getMessage(String code) {
        return messageSource.getMessage(code, null, LocaleContextHolder.getLocale());
    }
    @Override
    protected List<CommonGroup> selectPage(CommonGroup request) throws Exception {
        return commonGroupMapper.SELECT_PAGE(request);
    }

    @Override
    protected int selectPagingTotalNumber(CommonGroup request) throws Exception {
        return commonGroupMapper.SELECT_PAGING_TOTAL_NUMBER(request);
    }
    @Override
    protected List<CommonGroup> findImpl(CommonGroup request) throws Exception {
        return commonGroupMapper.SELECT(request);
    }
    protected List<CommonGroup> findNotExistsCommonAccessGroupMenu(CommonGroup request) throws Exception {
        return commonGroupMapper.SELECT_NOT_EXISTS_COMMON_ACCESS_GROUP_MENU(request);
    }

    @Override
    protected int removeImpl(CommonGroup request) throws Exception{
        List<CommonGroup> list = null;
        try{
            var commonGroup = CommonGroup.builder().top_group_id(request.getGroup_id()).build();
            list = commonGroupMapper.SELECT(commonGroup);
            if(list.isEmpty()){
                return commonGroupMapper.DELETE(request);
            }else{
                throw new CustomException(getMessage("EXCEPTION.DELETE.EXIST.SBU_DATA"));
            }
        }catch (CustomException e){
            throw e;
        }
    }

    @Override
    protected int updateImpl(CommonGroup request) {
        return commonGroupMapper.UPDATE(request);
    }

    @Override
    protected int registerImpl(CommonGroup request) {
        try{
            return commonGroupMapper.INSERT(request);
        }catch(DuplicateKeyException dke){
            throw new CustomException(getMessage("EXCEPTION.PK.EXIST"));
        }
    }
}