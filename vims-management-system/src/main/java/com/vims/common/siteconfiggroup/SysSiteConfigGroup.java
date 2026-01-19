package com.vims.common.siteconfiggroup;

import com.system.common.base.Common;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Transient;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.Arrays;
import java.util.Date;

@EqualsAndHashCode(callSuper = true)
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class SysSiteConfigGroup extends Common {
    @Transient
	private String keys = Arrays.toString(new String[]{"config_group_id"});

    @Id
    /***<pre> config_group_id : 설정그룹아이디 </pre> */
	private String config_group_id;

    /***<pre> config_group_name : 설정그룹이름 </pre> */
	private String config_group_name;

    /***<pre> use_yn : 사용여부 </pre> */
	private String use_yn;

    /***<pre> system_create_date : 등록일자 </pre> */
	private Date system_create_date;

    /***<pre> system_create_userid : 작성자ID </pre> */
	private String system_create_userid;

    /***<pre> system_update_date : 수정일자 </pre> */
	private Date system_update_date;

    /***<pre> system_update_userid : 수정자ID </pre> */
	private String system_update_userid;



    /***<pre> config_group_id : 설정그룹아이디 </pre> */
    @Transient
	private String _config_group_id;

    /***<pre> config_group_name : 설정그룹이름 </pre> */
    @Transient
	private String _config_group_name;

    /***<pre> use_yn : 사용여부 </pre> */
    @Transient
	private String _use_yn;

    /***<pre> system_create_date : 등록일자 </pre> */
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


}