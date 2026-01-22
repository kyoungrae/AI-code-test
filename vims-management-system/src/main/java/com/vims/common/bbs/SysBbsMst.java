package com.vims.common.bbs;

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
public class SysBbsMst extends Common {
    @Transient
    private String keys = Arrays.toString(new String[] { "bbs_id" });

    @Id
    /***
     * <pre>
     *  bbs_id : 게시판 고유 코드 (예: FREE_01)
     * </pre>
     */
    private String bbs_id;

    /***
     * <pre>
     *  bbs_nm : 게시판 명칭
     * </pre>
     */
    private String bbs_nm;

    /***
     * <pre>
     *  bbs_type : 유형 (BASIC, IMG, COMMENT, NOTICE)
     * </pre>
     */
    private String bbs_type;

    /***
     * <pre>
     *  read_auth : 읽기 권한 등급
     * </pre>
     */
    private String read_auth;

    /***
     * <pre>
     *  write_auth : 쓰기 권한 등급
     * </pre>
     */
    private String write_auth;

    /***
     * <pre>
     *  modify_auth : 수정 권한 등급
     * </pre>
     */
    private String modify_auth;

    /***
     * <pre>
     *  delete_auth : 삭제 권한 등급
     * </pre>
     */
    private String delete_auth;

    /***
     * <pre>
     *  reply_auth : 댓글/답글 권한 등급
     * </pre>
     */
    private String reply_auth;

    /***
     * <pre>
     *  file_yn : 파일 사용 여부 (Y=1/N=0)
     * </pre>
     */
    private String file_yn;

    /***
     * <pre>
     *  reply_yn : 댓글 사용 여부 (Y=1/N=0)
     * </pre>
     */
    private String reply_yn;

    /***
     * <pre>
     *  system_create_date : 시스템 등록 일시
     * </pre>
     */
    private Date system_create_date;

    /***
     * <pre>
     *  system_update_date : 시스템 수정 일시
     * </pre>
     */
    private Date system_update_date;

    /***
     * <pre>
     *  bbs_id : 게시판 고유 코드 (예: FREE_01)
     * </pre>
     */
    @Transient
    private String _bbs_id;

    /***
     * <pre>
     *  bbs_nm : 게시판 명칭
     * </pre>
     */
    @Transient
    private String _bbs_nm;

    /***
     * <pre>
     *  bbs_type : 유형 (BASIC, IMG, COMMENT, NOTICE)
     * </pre>
     */
    @Transient
    private String _bbs_type;

    /***
     * <pre>
     *  read_auth : 읽기 권한 등급
     * </pre>
     */
    @Transient
    private String _read_auth;

    /***
     * <pre>
     *  write_auth : 쓰기 권한 등급
     * </pre>
     */
    @Transient
    private String _write_auth;

    /***
     * <pre>
     *  modify_auth : 수정 권한 등급
     * </pre>
     */
    @Transient
    private String _modify_auth;

    /***
     * <pre>
     *  delete_auth : 삭제 권한 등급
     * </pre>
     */
    @Transient
    private String _delete_auth;

    /***
     * <pre>
     *  reply_auth : 댓글/답글 권한 등급
     * </pre>
     */
    @Transient
    private String _reply_auth;

    /***
     * <pre>
     *  file_yn : 파일 사용 여부 (Y=1/N=0)
     * </pre>
     */
    @Transient
    private String _file_yn;

    /***
     * <pre>
     *  reply_yn : 댓글 사용 여부 (Y=1/N=0)
     * </pre>
     */
    @Transient
    private String _reply_yn;

    /***
     * <pre>
     *  system_create_date : 시스템 등록 일시
     * </pre>
     */
    @Transient
    private Date _system_create_date;

    /***
     * <pre>
     *  system_update_date : 시스템 수정 일시
     * </pre>
     */
    @Transient
    private Date _system_update_date;

}