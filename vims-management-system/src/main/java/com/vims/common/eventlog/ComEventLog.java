package com.vims.common.eventlog;

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
public class ComEventLog extends Common {
    @Transient
    private String keys = Arrays.toString(new String[] { "id", "user_id", "action_type", "system_create_date" });

    @Id
    /***
     * <pre>
     *  id : 로그 고유 ID
     * </pre>
     */
    private String id;

    /***
     * <pre>
     *  user_id : 행위 수행자 ID
     * </pre>
     */
    private String user_id;

    /***
     * <pre>
     *  email : 행위 수행자 email
     * </pre>
     */
    private String email;

    /***
     * <pre>
     *  role : 수행 당시 권한 (ADMIN, MANAGER, USER)
     * </pre>
     */
    private String role;

    /***
     * <pre>
     *  action_type : 작업 유형
     * </pre>
     */
    private String action_type;

    /***
     * <pre>
     *  target_table : 대상 테이블명
     * </pre>
     */
    private String target_table;

    /***
     * <pre>
     *  target_id : 대상 데이터의 PK
     * </pre>
     */
    private String target_id;

    /***
     * <pre>
     *  before_data : 변경 전 데이터
     * </pre>
     */
    private String before_data;

    /***
     * <pre>
     *  after_data : 변경 후 데이터
     * </pre>
     */
    private String after_data;

    /***
     * <pre>
     *  ip_address : IPv4 또는 IPv6 주소
     * </pre>
     */
    private String ip_address;

    /***
     * <pre>
     *  system_create_date : 로그 발생 일시
     * </pre>
     */
    private String system_create_date;

    /***
     * <pre>
     *  id : 로그 고유 ID
     * </pre>
     */
    @Transient
    private String _id;

    /***
     * <pre>
     *  user_id : 행위 수행자 ID
     * </pre>
     */
    @Transient
    private String _user_id;

    /***
     * <pre>
     *  email : 행위 수행자 email
     * </pre>
     */
    @Transient
    private String _email;

    /***
     * <pre>
     *  role : 수행 당시 권한 (ADMIN, MANAGER, USER)
     * </pre>
     */
    @Transient
    private String _role;

    /***
     * <pre>
     *  action_type : 작업 유형
     * </pre>
     */
    @Transient
    private String _action_type;

    /***
     * <pre>
     *  target_table : 대상 테이블명
     * </pre>
     */
    @Transient
    private String _target_table;

    /***
     * <pre>
     *  target_id : 대상 데이터의 PK
     * </pre>
     */
    @Transient
    private String _target_id;

    /***
     * <pre>
     *  before_data : 변경 전 데이터
     * </pre>
     */
    @Transient
    private String _before_data;

    /***
     * <pre>
     *  after_data : 변경 후 데이터
     * </pre>
     */
    @Transient
    private String _after_data;

    /***
     * <pre>
     *  ip_address : IPv4 또는 IPv6 주소
     * </pre>
     */
    @Transient
    private String _ip_address;

    /***
     * <pre>
     *  system_create_date : 로그 발생 일시
     * </pre>
     */
    @Transient
    private String _system_create_date;

}