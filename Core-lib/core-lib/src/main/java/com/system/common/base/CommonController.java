package com.system.common.base;

import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

public interface CommonController<T> {
    public List<T> find(@RequestBody T request) throws Exception;
    public int remove(@RequestBody T request) throws Exception;
    public int update(@RequestBody T request) throws Exception;
    public int register(@RequestBody T request) throws Exception;
}
