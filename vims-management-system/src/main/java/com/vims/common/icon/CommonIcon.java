package com.vims.common.icon;

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
public class CommonIcon extends Common {
    @Transient
	private String keys = Arrays.toString(new String[]{});

    @Id
    /***<pre> icon_code : 아이콘 코드 </pre> */
	private String icon_code;

    /***<pre> icon_name : 아이콘 이름 </pre> */
	private String icon_name;

    /***<pre> icon_class : 클래스명 </pre> */
	private String icon_class;



    /***<pre> icon_code : 아이콘 코드 </pre> */
    @Transient
	private String _icon_code;

    /***<pre> icon_name : 아이콘 이름 </pre> */
    @Transient
	private String _icon_name;

    /***<pre> icon_class : 클래스명 </pre> */
    @Transient
	private String _icon_class;


}