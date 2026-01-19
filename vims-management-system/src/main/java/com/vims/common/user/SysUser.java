package com.vims.common.user;

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
public class SysUser extends Common {
    @Transient
    private String keys = Arrays.toString(new String[] { "id" });

    @Id
    /***
     * <pre>
     *  id : 시퀀스 아이디
     * </pre>
     */
    private Integer id;

    /***
     * <pre>
     *  email : 이메일
     * </pre>
     */
    private String email;

    /***
     * <pre>
     *  password : 비밀번호
     * </pre>
     */
    private String password;

    /***
     * <pre>
     *  role : 역할
     * </pre>
     */
    private String role;

    /***
     * <pre>
     *  user_id : 유저아이디
     * </pre>
     */
    private String user_id;

    /***
     * <pre>
     *  office_code : 소속코드
     * </pre>
     */
    private String office_code;

    /***
     * <pre>
     *  system_create_userid : 작성자ID
     * </pre>
     */
    private String system_create_userid;

    /***
     * <pre>
     *  system_create_date : 작성일자
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
     *  user_name : 사용자이름
     * </pre>
     */
    private String user_name;

    /***
     * <pre>
     *  tel : 전화번호
     * </pre>
     */
    private String tel;

    /***
     * <pre>
     *  address : 주소
     * </pre>
     */
    private String address;

    /***
     * <pre>
     *  address_detail : 주소상세
     * </pre>
     */
    private String address_detail;

    /***
     * <pre>
     *  postal_code : 우편번호
     * </pre>
     */
    private String postal_code;

    /***
     * <pre>
     *  uuid : 파일ID
     * </pre>
     */
    private String uuid;
    /***
     * <pre>
     *  before_password : 기존비밀번호
     * </pre>
     */
    private String before_password;
    /***
     * <pre>
     *  before_password : 비밀번호 확인
     * </pre>
     */
    @Transient
    private String password_confirm;

    /***
     * <pre>
     *  office_name : 소속명
     * </pre>
     */
    @Transient
    private String office_name;

    /***
     * <pre>
     *  id : 시퀀스 아이디
     * </pre>
     */
    @Transient
    private String _id;

    /***
     * <pre>
     *  email : 이메일
     * </pre>
     */
    @Transient
    private String _email;

    /***
     * <pre>
     *  password : 비밀번호
     * </pre>
     */
    @Transient
    private String _password;

    /***
     * <pre>
     *  role : 역할
     * </pre>
     */
    @Transient
    private String _role;

    /***
     * <pre>
     *  user_id : 유저아이디
     * </pre>
     */
    @Transient
    private String _user_id;

    /***
     * <pre>
     *  office_code : 소속코드
     * </pre>
     */
    @Transient
    private String _office_code;

    /***
     * <pre>
     *  system_create_userid : 작성자ID
     * </pre>
     */
    @Transient
    private String _system_create_userid;

    /***
     * <pre>
     *  system_create_date : 작성일자
     * </pre>
     */
    @Transient
    private String _system_create_date;

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
    private String _system_update_date;

    /***
     * <pre>
     *  user_name : 사용자이름
     * </pre>
     */
    @Transient
    private String _user_name;

    /***
     * <pre>
     *  tel : 전화번호
     * </pre>
     */
    @Transient
    private String _tel;

    /***
     * <pre>
     *  address : 주소
     * </pre>
     */
    @Transient
    private String _address;

    /***
     * <pre>
     *  address_detail : 주소상세
     * </pre>
     */
    @Transient
    private String _address_detail;

    /***
     * <pre>
     *  postal_code : 우편번호
     * </pre>
     */
    @Transient
    private String _postal_code;

    /***
     * <pre>
     *  uuid : 파일ID
     * </pre>
     */
    @Transient
    private String _uuid;

}