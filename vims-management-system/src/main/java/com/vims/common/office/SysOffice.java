package com.vims.common.office;

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
public class SysOffice extends Common {
    @Transient
    private String keys = Arrays.toString(new String[] { "office_code" });

    @Id
    /***
     * <pre>
     *  top_office_code : 최상위 코드
     * </pre>
     */
    private String top_office_code;

    /***
     * <pre>
     *  office_name : 기관명
     * </pre>
     */
    private String office_name;

    /***
     * <pre>
     *  office_code : 기관코드
     * </pre>
     */
    private String office_code;

    /***
     * <pre>
     *  office_type : 기관유형
     * </pre>
     */
    private String office_type;

    /***
     * <pre>
     *  office_type_code : 등록관청 구분부호
     * </pre>
     */
    private String office_type_code;

    /***
     * <pre>
     *  system_create_userid : 생성자ID
     * </pre>
     */
    private String system_create_userid;

    /***
     * <pre>
     *  system_create_date : 생성일자
     * </pre>
     */
    private Date system_create_date;

    /***
     * <pre>
     *  system_update_userid : 수정자ID
     * </pre>
     */
    private String system_update_userid;

    /***
     * <pre>
     *  system_update_date : 수정일자
     * </pre>
     */
    private Date system_update_date;

    /***
     * <pre>
     *  top_office_code : 최상위 코드
     * </pre>
     */
    @Transient
    private String _top_office_code;

    /***
     * <pre>
     *  office_name : 기관명
     * </pre>
     */
    @Transient
    private String _office_name;

    /***
     * <pre>
     *  office_code : 기관코드
     * </pre>
     */
    @Transient
    private String _office_code;

    /***
     * <pre>
     *  office_type : 기관유형
     * </pre>
     */
    @Transient
    private String _office_type;

    /***
     * <pre>
     *  office_type_code : 등록관청 구분부호
     * </pre>
     */
    @Transient
    private String _office_type_code;

    /***
     * <pre>
     *  system_create_userid : 생성자ID
     * </pre>
     */
    @Transient
    private String _system_create_userid;

    /***
     * <pre>
     *  system_create_date : 생성일자
     * </pre>
     */
    @Transient
    private Date _system_create_date;

    /***
     * <pre>
     *  system_update_userid : 수정자ID
     * </pre>
     */
    @Transient
    private String _system_update_userid;

    /***
     * <pre>
     *  system_update_date : 수정일자
     * </pre>
     */
    @Transient
    private Date _system_update_date;

}