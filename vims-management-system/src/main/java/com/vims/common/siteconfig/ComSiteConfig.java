package com.vims.common.siteconfig;

import com.system.common.base.Common;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.Date;
import java.util.Arrays;

@EqualsAndHashCode(callSuper = true)
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class ComSiteConfig extends Common {
    @Transient
    private String keys = Arrays.toString(new String[]{"config_key"});


    /***<pre> config_group_id : 설정그룹ID </pre> */
    @Id
    private String config_group_id;

    /***<pre> config_key : 설정 키 </pre> */
    private String config_key;

    /***<pre> config_value : 설정 값 </pre> */
    private String config_value;

    /***<pre> description : 설명 </pre> */
    private String description;

    /***<pre> use_yn : 사용여부 </pre> */
    private String use_yn;

    /***<pre> system_create_date : 작성일자 </pre> */
    private Date system_create_date;

    /***<pre> system_create_userid : 작성자ID </pre> */
    private String system_create_userid;

    /***<pre> system_update_date : 수정일자 </pre> */
    private Date system_update_date;

    /***<pre> system_update_userid : 수정자ID </pre> */
    private String system_update_userid;

    /***<pre> config_group_id : 설정그룹ID </pre> */
    @Transient
    private String _config_group_id;

    /***<pre> config_key : 설정 키 </pre> */
    @Transient
    private String _config_key;

    /***<pre> config_value : 설정 값 </pre> */
    @Transient
    private String _config_value;

    /***<pre> description : 설명 </pre> */
    @Transient
    private String _description;

    /***<pre> use_yn : 사용여부 </pre> */
    @Transient
    private String _use_yn;

    /***<pre> system_create_date : 작성일자 </pre> */
    @Transient
    private Date _system_create_date;

    /***<pre> system_create_userid : 작성자ID </pre> */
    @Transient
    private String _system_create_userid;

    /***<pre> system_update_date : 수정일자 </pre> */
    @Transient
    private Date _system_update_date;

    /***<pre> system_update_userid : 수정자ID </pre> */
    @Transient
    private String _system_update_userid;

    @Transient
    private String use_yn_name;

}