package com.vims.common.siteconfig;

import com.system.common.base.CommonMapper;
import com.system.common.util.passwordvalidation.PasswordPolicy;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface SysSiteConfigMapper extends CommonMapper<SysSiteConfig> {
    String[] SELECT_GROUP();

    PasswordPolicy SELECT_PASSWORD_POLICY();
}