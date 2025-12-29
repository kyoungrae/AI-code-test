package com.system.common.base;

import java.util.List;

public interface CommonService<T> {
    public List<T> find(T request) throws Exception;
    public int remove(T request) throws Exception;
    public int update(T request) throws Exception;
    public int register(T request) throws Exception;

}
