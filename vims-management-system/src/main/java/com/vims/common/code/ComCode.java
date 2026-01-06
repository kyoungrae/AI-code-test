package com.vims.common.code;

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

import java.util.Arrays;
import java.util.Date;

@EqualsAndHashCode(callSuper = true)
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class ComCode extends Common {
    @Transient
    private String keys = Arrays.toString(new String[]{"code_id","group_id"});

    @Id

    /***<pre> code_id : 코드ID </pre> */
    private String code_id;

    /***<pre> group_id : 그룹ID </pre> */
    private String group_id;

    /***<pre> code_name : 그룹명 </pre> */
    private String code_name;

    /***<pre> code_number : 노출순서 </pre> */
    private String code_number;

    /***<pre> use_yn : 사용여부 </pre> */
    private String use_yn;


    /***<pre> code_id : 코드ID </pre> */
    @Transient
    private String _code_id;

    /***<pre> group_id : 그룹ID </pre> */
    @Transient
    private String _group_id;

    /***<pre> code_name : 그룹명 </pre> */
    @Transient
    private String _code_name;

    /***<pre> code_number : 노출순서 </pre> */
    @Transient
    private String _code_number;

    /***<pre> use_yn : 사용여부 </pre> */
    @Transient
    private String _use_yn;

    @Transient
    private Date system_create_date;
    @Transient
    private String system_create_userid;
    @Transient
    private Date system_update_date;
    @Transient
    private String system_update_userid;

    /***<pre> system_create_date : 작성일자 </pre> */
    @Transient
    private java.sql.Date _system_create_date;

    /***<pre> system_create_userid : 작성자ID </pre> */
    @Transient
    private String _system_create_userid;

    /***<pre> system_update_date : 수정일자 </pre> */
    @Transient
    private java.sql.Date _system_update_date;

    /***<pre> system_update_userid : 수정자ID </pre> */
    @Transient
    private String _system_update_userid;
}