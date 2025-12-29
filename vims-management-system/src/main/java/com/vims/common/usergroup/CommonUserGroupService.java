/**
 *  ++ giens Product ++
 */
package com.vims.common.usergroup;

import com.system.auth.authuser.AuthUser;
import com.system.common.base.AbstractCommonService;
import com.system.common.exception.CustomException;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CommonUserGroupService extends AbstractCommonService<CommonUserGroup> {
    private final CommonUserGroupMapper commonUserGroupMapper;
    private final CommonUserGroupRepository commonUserGroupRepository;
    private final MessageSource messageSource;

    private String getMessage(String code) {
        return messageSource.getMessage(code, null, LocaleContextHolder.getLocale());
    }
    @Override
    protected List<CommonUserGroup> selectPage(CommonUserGroup request) throws Exception {
        return commonUserGroupMapper.SELECT_PAGE(request);
    }

    @Override
    protected int selectPagingTotalNumber(CommonUserGroup request) throws Exception {
        return commonUserGroupMapper.SELECT_PAGING_TOTAL_NUMBER(request);
    }
    @Override
    protected List<CommonUserGroup> findImpl(CommonUserGroup request) throws Exception {
        return commonUserGroupMapper.SELECT(request);
    }

    @Override
    protected int removeImpl(CommonUserGroup request) {
        return commonUserGroupMapper.DELETE(request);
    }

    @Override
    protected int updateImpl(CommonUserGroup request) {
        return commonUserGroupMapper.UPDATE(request);
    }

    @Override
    protected int registerImpl(CommonUserGroup request) throws Exception{
        int rtn = 0;
        try {
            rtn = commonUserGroupMapper.INSERT(request);
        }catch (DuplicateKeyException dke){
            throw new CustomException(getMessage("EXCEPTION.PK.EXIST.USER"));
        }
        return rtn;
    }
    public Map<String, List<?>> findJoinCommonUserGroupPage(CommonUserGroup request) throws Exception {
        List<CommonUserGroup> list = new ArrayList<>();
        Map<String, List<?>> result = new HashMap<>();
        int pagingNum;
        try {
            list = selectJoinCommonUserGroupPage(request);
            pagingNum = selectJoinCommonUserGroupPagingTotalNumber(request);

            List<Integer> pagingList = new ArrayList<>();
            pagingList.add(pagingNum);

            result.put("DATA", list);
            result.put("TOTAL_PAGING", pagingList);
        } catch (Exception e) {
            throw new Exception(e);
        }
        return result;
    }
    protected List<CommonUserGroup> selectJoinCommonUserGroupPage(CommonUserGroup request) throws Exception {
        try{
            return commonUserGroupMapper.SELECT_JOIN_COMMON_USER_GROUP_PAGE(request);
        }catch (Exception e){
            e.printStackTrace();;
        }
        return null;
    }
    protected int selectJoinCommonUserGroupPagingTotalNumber(CommonUserGroup request) throws Exception {
        return commonUserGroupMapper.SELECT_JOIN_COMMON_USER_GROUP_PAGING_TOTAL_NUMBER(request);
    }
}