package com.system.accslog;

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
public class SysAccsLog extends Common {
    @Transient
    private String keys = Arrays
            .toString(new String[] { "id", "user_id", "system_login_date", "device_type", "os_name" });

    @Id
    /***
     * <pre>
     *  id : 접속 고유 ID
     * </pre>
     */
    private String id;

    /***
     * <pre>
     *  user_id : 접속 사용자 ID
     * </pre>
     */
    private String user_id;

    /***
     * <pre>
     *  email : 접속 사용자 Email
     * </pre>
     */
    private String email;

    /***
     * <pre>
     *  system_login_date : 로그인 일시
     * </pre>
     */
    private Date system_login_date;

    /***
     * <pre>
     *  system_logout_date : 로그아웃 일시
     * </pre>
     */
    private Date system_logout_date;

    /***
     * <pre>
     *  ip_address : 접속 IP
     * </pre>
     */
    private String ip_address;

    /***
     * <pre>
     *  device_type : 기기 유형
     * </pre>
     */
    private String device_type;

    /***
     * <pre>
     *  os_name : 운영체제 (Windows, Android 등)
     * </pre>
     */
    private String os_name;

    /***
     * <pre>
     *  browser_name : 브라우저 (Chrome, Safari 등)
     * </pre>
     */
    private String browser_name;

    /***
     * <pre>
     *  id : 접속 고유 ID
     * </pre>
     */
    @Transient
    private String _id;

    /***
     * <pre>
     *  user_id : 접속 사용자 ID
     * </pre>
     */
    @Transient
    private String _user_id;

    /***
     * <pre>
     *  email : 접속 사용자 Email
     * </pre>
     */
    @Transient
    private String _email;

    /***
     * <pre>
     *  system_login_date : 로그인 일시
     * </pre>
     */
    @Transient
    private Date _system_login_date;

    /***
     * <pre>
     *  system_logout_date : 로그아웃 일시
     * </pre>
     */
    @Transient
    private Date _system_logout_date;

    /***
     * <pre>
     *  ip_address : 접속 IP
     * </pre>
     */
    @Transient
    private String _ip_address;

    /***
     * <pre>
     *  device_type : 기기 유형
     * </pre>
     */
    @Transient
    private String _device_type;

    /***
     * <pre>
     *  os_name : 운영체제 (Windows, Android 등)
     * </pre>
     */
    @Transient
    private String _os_name;

    /***
     * <pre>
     *  browser_name : 브라우저 (Chrome, Safari 등)
     * </pre>
     */
    @Transient
    private String _browser_name;

}