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
public class ComUserGroupService extends AbstractCommonService<ComUserGroup> {
    private final ComUserGroupMapper comUserGroupMapper;
    private final ComUserGroupRepository comUserGroupRepository;
    private final MessageSource messageSource;

    private String getMessage(String code) {
        return messageSource.getMessage(code, null, LocaleContextHolder.getLocale());
    }

    @Override
    protected List<ComUserGroup> selectPage(ComUserGroup request) throws Exception {
        return comUserGroupMapper.SELECT_PAGE(request);
    }

    @Override
    protected int selectPagingTotalNumber(ComUserGroup request) throws Exception {
        return comUserGroupMapper.SELECT_PAGING_TOTAL_NUMBER(request);
    }

    @Override
    protected List<ComUserGroup> findImpl(ComUserGroup request) throws Exception {
        return comUserGroupMapper.SELECT(request);
    }

    @Override
    public int removeImpl(ComUserGroup request) {
        return comUserGroupMapper.DELETE(request);
    }

    @Override
    protected int updateImpl(ComUserGroup request) {
        return comUserGroupMapper.UPDATE(request);
    }

    @Override
    protected int registerImpl(ComUserGroup request) throws Exception {
        int rtn = 0;
        try {
            rtn = comUserGroupMapper.INSERT(request);
        } catch (DuplicateKeyException dke) {
            throw new CustomException(getMessage("EXCEPTION.PK.EXIST.USER"));
        }
        return rtn;
    }

    public Map<String, List<?>> findJoinComUserGroupPage(ComUserGroup request) throws Exception {
        List<ComUserGroup> list = new ArrayList<>();
        Map<String, List<?>> result = new HashMap<>();
        int pagingNum;
        try {
            list = selectJoinComUserGroupPage(request);
            pagingNum = selectJoinComUserGroupPagingTotalNumber(request);

            List<Integer> pagingList = new ArrayList<>();
            pagingList.add(pagingNum);

            result.put("DATA", list);
            result.put("TOTAL_PAGING", pagingList);
        } catch (Exception e) {
            throw new Exception(e);
        }
        return result;
    }

    protected List<ComUserGroup> selectJoinComUserGroupPage(ComUserGroup request) throws Exception {
        try {
            return comUserGroupMapper.SELECT_JOIN_COM_USER_GROUP_PAGE(request);
        } catch (Exception e) {
            e.printStackTrace();
            ;
        }
        return null;
    }

    protected int selectJoinComUserGroupPagingTotalNumber(ComUserGroup request) throws Exception {
        return comUserGroupMapper.SELECT_JOIN_COM_USER_GROUP_PAGING_TOTAL_NUMBER(request);
    }
}