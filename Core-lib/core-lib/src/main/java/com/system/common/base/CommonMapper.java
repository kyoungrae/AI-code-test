package com.system.common.base;

import java.util.List;

public interface CommonMapper<T> {
    List<T> SELECT_PAGE(T vo);
    int SELECT_PAGING_TOTAL_NUMBER(T vo);
    List<T> SELECT(T vo);
    int INSERT(T vo);
    int UPDATE(T vo);
    int DELETE(T vo);
}
