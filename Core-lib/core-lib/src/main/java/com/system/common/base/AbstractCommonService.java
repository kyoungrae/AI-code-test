package com.system.common.base;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public abstract class AbstractCommonService<T> implements CommonService<T>{
    @Override
    public List<T> find(T request) throws Exception {
        return findImpl(request);
    }

    @Override
    public int remove(T request) throws Exception {
        return removeImpl(request);
    }

    @Override
    public int update(T request) throws Exception {
        return updateImpl(request);
    }

    @Override
    public int register(T request) throws Exception {
        return registerImpl(request);
    }
    protected abstract List<T> findImpl(T request) throws Exception;
    protected abstract int removeImpl(T request) throws Exception;
    protected abstract int updateImpl(T request) throws Exception;
    protected abstract int registerImpl(T request) throws Exception;

    protected abstract List<T> selectPage(T request) throws Exception;
    protected abstract int selectPagingTotalNumber(T request) throws Exception;

    public Map<String, List<?>> findPage(T request) throws Exception {
        List<T> list = new ArrayList<>();
        Map<String, List<?>> result = new HashMap<>();
        int pagingNum;
        try {
            list = selectPage(request);
            pagingNum = selectPagingTotalNumber(request);

            List<Integer> pagingList = new ArrayList<>();
            pagingList.add(pagingNum);

            result.put("DATA", list);
            result.put("TOTAL_PAGING", pagingList);
        } catch (Exception e) {
            throw new Exception(e);
        }
        return result;
    }
}
