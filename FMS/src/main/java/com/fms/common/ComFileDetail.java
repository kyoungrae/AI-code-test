package com.fms.common;

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

@EqualsAndHashCode(callSuper = true)
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Table(name = "COM_FILE_DETAIL")
public class ComFileDetail extends Common {

	@Transient
    private String keys = Arrays.toString(new String[]{"file_id","uuid"});

    /***<pre> file_id : 파일아이디 </pre> */
    @Id
	private String file_id;

    /***<pre> uuid : 공통아이디 </pre> */
	private String uuid;

    /***<pre> file_name : 파일이름 </pre> */
	private String file_name;

    /***<pre> file_size : 파일크기 </pre> */
	private String file_size;

    /***<pre> file_extension : 파일확장자 </pre> */
	private String file_extension;

    /***<pre> file_path : 파일경로 </pre> */
	private String file_path;

    /***<pre> file_id : 파일아이디 </pre> */
	@Transient
    private String _file_id;

    /***<pre> uuid : 공통아이디 </pre> */
	@Transient
    private String _uuid;

    /***<pre> file_name : 파일이름 </pre> */
	@Transient
    private String _file_name;

    /***<pre> file_size : 파일크기 </pre> */
	@Transient
    private String _file_size;

    /***<pre> file_extension : 파일확장자 </pre> */
	@Transient
    private String _file_extension;

    /***<pre> file_path : 파일경로 </pre> */
	@Transient
    private String _file_path;

}