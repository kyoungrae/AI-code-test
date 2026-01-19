package com.vims.common.accessgroupmenu;

import com.system.common.base.Common;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.Date;
import java.util.Arrays;

@EqualsAndHashCode(callSuper = true)
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class SysAccsGroupMenu extends Common {
    @Transient
	private String keys = Arrays.toString(new String[]{"menu_code","access_rights_group_id"});

    /***<pre> menu_code : 메뉴코드 </pre> */
    @Id
	private String menu_code;

    /***<pre> access_rights_group_id : 권한그룹 아이디 </pre> */
	private String access_rights_group_id;

    /***<pre> system_create_date : 작성일자 </pre> */
	private Date system_create_date;

    /***<pre> system_create_userid : 작성자ID </pre> */
	private String system_create_userid;

    /***<pre> system_update_date : 수정일자 </pre> */
	private Date system_update_date;

    /***<pre> system_update_userid : 수정자ID </pre> */
	private String system_update_userid;



    /***<pre> menu_code : 메뉴코드 </pre> */
    @Transient
	private String _menu_code;

    /***<pre> access_rights_group_id : 권한그룹 아이디 </pre> */
    @Transient
	private String _access_rights_group_id;

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