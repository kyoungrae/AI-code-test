package com.vims.common.menu;

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
public class ComMenu extends Common {
    @Transient
	private String keys = Arrays.toString(new String[]{"menu_code","menu_sequence"});

    @Id
    /***<pre> menu_code : 메뉴코드 </pre> */
	private String menu_code;

    /***<pre> menu_name_kr : 메뉴명_한국어 </pre> */
	private String menu_name_kr;

    /***<pre> menu_name_en : 메뉴명_영어 </pre> */
	private String menu_name_en;

    /***<pre> menu_name_mn : 메뉴명_몽어 </pre> */
	private String menu_name_mn;

    /***<pre> menu_number : 메뉴순서 </pre> */
	private String menu_number;

    /***<pre> menu_level : 메뉴레벨 </pre> */
	private String menu_level;

    /***<pre> top_menu_code : 상위 메뉴코드 </pre> */
	private String top_menu_code;

    /***<pre> url : URL </pre> */
	private String url;

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

    /***<pre> menu_sequence : 메뉴노출순서 </pre> */
	private String menu_sequence;

    /***<pre> menu_icon :  </pre> */
	private String menu_icon;

    /***<pre> prgm_url :  </pre> */
	private String prgm_url;


    /***<pre> user_email : 사용자 이메일 </pre> */
    @Transient
    private String user_email;
    /***<pre> menu_code : 메뉴코드 </pre> */
    @Transient
	private String _menu_code;

    /***<pre> menu_name_kr : 메뉴명_한국어 </pre> */
    @Transient
	private String _menu_name_kr;

    /***<pre> menu_name_en : 메뉴명_영어 </pre> */
    @Transient
	private String _menu_name_en;

    /***<pre> menu_name_mn : 메뉴명_몽어 </pre> */
    @Transient
	private String _menu_name_mn;

    /***<pre> menu_number : 메뉴순서 </pre> */
    @Transient
	private String _menu_number;

    /***<pre> menu_level : 메뉴레벨 </pre> */
    @Transient
	private String _menu_level;

    /***<pre> top_menu_code : 상위 메뉴코드 </pre> */
    @Transient
	private String _top_menu_code;

    /***<pre> url : URL </pre> */
    @Transient
	private String _url;

    /***<pre> use_yn : 사용여부 </pre> */
    @Transient
	private String _use_yn;

    /***<pre> system_create_date : 작성일자 </pre> */
    @Transient
	private String _system_create_date;

    /***<pre> system_create_userid : 작성자ID </pre> */
    @Transient
	private String _system_create_userid;

    /***<pre> system_update_date : 수정일자 </pre> */
    @Transient
	private String _system_update_date;

    /***<pre> system_update_userid : 수정자ID </pre> */
    @Transient
	private String _system_update_userid;

    /***<pre> menu_sequence : 메뉴노출순서 </pre> */
    @Transient
	private String _menu_sequence;

    /***<pre> menu_icon :  </pre> */
    @Transient
	private String _menu_icon;

    /***<pre> prgm_url :  </pre> */
    @Transient
	private String _prgm_url;


}