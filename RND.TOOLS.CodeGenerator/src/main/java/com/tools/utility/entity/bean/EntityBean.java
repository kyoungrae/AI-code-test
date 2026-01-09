package com.tools.utility.entity.bean;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EntityBean {
    private String name;
    private String service;
    private Field[] fields;

    class Field{
        boolean keyField = false;
        String name;
        String desc;
        int type = 0;
        int length = 0;
    }
}
