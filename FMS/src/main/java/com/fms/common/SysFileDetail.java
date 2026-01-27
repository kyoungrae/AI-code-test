package com.fms.common;

import com.system.common.base.Common;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Builder;
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
@Table(name = "SYS_FILE_DETAIL")
public class SysFileDetail extends Common {

    @Transient
    @Builder.Default
    private String keys = Arrays.toString(new String[] { "file_id", "file_uuid" });

    /***
     * <pre>
     *  file_id : 파일아이디
     * </pre>
     */
    @Id
    private String file_id;

    /***
     * <pre>
     *  file_uuid : 공통아이디
     * </pre>
     */
    private String file_uuid;

    /***
     * <pre>
     *  file_name : 파일이름
     * </pre>
     */
    private String file_name;

    /***
     * <pre>
     *  file_size : 파일크기
     * </pre>
     */
    private String file_size;

    /***
     * <pre>
     *  file_extension : 파일확장자
     * </pre>
     */
    private String file_extension;

    /***
     * <pre>
     *  file_path : 파일경로
     * </pre>
     */
    private String file_path;

    /***
     * <pre>
     *  system_create_date : 작성일
     * </pre>
     */
    private Date system_create_date;
    private Date _system_create_date;

    /***
     * <pre>
     *  system_create_userid : 작성자 아이디
     * </pre>
     */
    private String system_create_userid;
    private String _system_create_userid;

    /***
     * <pre>
     *  system_update_date : 수정일자
     * </pre>
     */
    private Date system_update_date;
    private Date _system_update_date;

    /***
     * <pre>
     *  system_update_userid : 수정자 아이디
     * </pre>
     */
    private String system_update_userid;
    private String _system_update_userid;

    /***
     * <pre>
     *  menu_code : 메뉴코드
     * </pre>
     */
    private String menu_code;

    /***
     * <pre>
     *  file_id : 파일아이디
     * </pre>
     */
    @Transient
    private String _file_id;

    /***
     * <pre>
     *  file_uuid : 공통아이디
     * </pre>
     */
    @Transient
    private String _file_uuid;

    /***
     * <pre>
     *  file_name : 파일이름
     * </pre>
     */
    @Transient
    private String _file_name;

    /***
     * <pre>
     *  file_size : 파일크기
     * </pre>
     */
    @Transient
    private String _file_size;

    /***
     * <pre>
     *  file_extension : 파일확장자
     * </pre>
     */
    @Transient
    private String _file_extension;

    /***
     * <pre>
     *  file_path : 파일경로
     * </pre>
     */
    @Transient
    private String _file_path;

}