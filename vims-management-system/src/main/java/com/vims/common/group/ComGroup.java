package com.vims.common.group;

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
public class ComGroup extends Common {
    @Transient
	private String keys = Arrays.toString(new String[]{"group_id"});

    @Id

    /***<pre> group_id :  </pre> */
	private String group_id;

    /***<pre> group_name : 그룹이름 </pre> */
	private String group_name;

    /***<pre> group_level : 그룹레벨 </pre> */
	private String group_level;

    /***<pre> top_group_id : 상위 그룹아이디 </pre> */
	private String top_group_id;

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


    /***<pre> menu_code : menu_code in common_menu </pre> */
    @Transient
    private String menu_code;

    /***<pre> group_id :  </pre> */
    @Transient
	private String _group_id;

    /***<pre> group_name : 그룹이름 </pre> */
    @Transient
	private String _group_name;

    /***<pre> group_level : 그룹레벨 </pre> */
    @Transient
	private String _group_level;

    /***<pre> top_group_id : 상위 그룹아이디 </pre> */
    @Transient
	private String _top_group_id;

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


}