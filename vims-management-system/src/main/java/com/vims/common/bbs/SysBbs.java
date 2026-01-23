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
public class SysBbs extends Common {
    @Transient
    private String keys = Arrays.toString(new String[] { "bbs_id" });

    @Id
    /***
     * <pre>
     *  bbs_mst_id : 게시판 마스터 ID
     * </pre>
     */
    private String bbs_mst_id;

    /***
     * <pre>
     *  bbs_id : 게시판 ID
     * </pre>
     */
    private String bbs_id;

    /***
     * <pre>
     *  bbs_nm : 게시판 이름
     * </pre>
     */
    private String bbs_nm;

    /***
     * <pre>
     *  crud_auth : 권한
     * </pre>
     */
    private String crud_auth;

    /***
     * <pre>
     *  file_yn : 파일첨부 가능 여부
     * </pre>
     */
    private String file_yn;

    /***
     * <pre>
     *  reply_yn : 댓글 가능 여부
     * </pre>
     */
    private String reply_yn;

    /***
     * <pre>
     *  system_create_userid : 시스템 작성자ID
     * </pre>
     */
    private String system_create_userid;

    /***
     * <pre>
     *  system_create_date : 시스템 등록 일시
     * </pre>
     */
    private Date system_create_date;

    /***
     * <pre>
     *  system_update_userid : 시스템 수정자ID
     * </pre>
     */
    private String system_update_userid;

    /***
     * <pre>
     *  system_update_date : 시스템 수정 일시
     * </pre>
     */
    private Date system_update_date;

    /***
     * <pre>
     *  bbs_mst_id : 게시판 마스터 ID
     * </pre>
     */
    @Transient
    private String _bbs_mst_id;

    /***
     * <pre>
     *  bbs_id : 게시판 ID
     * </pre>
     */
    @Transient
    private String _bbs_id;

    /***
     * <pre>
     *  bbs_nm : 게시판 이름
     * </pre>
     */
    @Transient
    private String _bbs_nm;

    /***
     * <pre>
     *  crud_auth : 권한
     * </pre>
     */
    @Transient
    private String _crud_auth;

    /***
     * <pre>
     *  file_yn : 파일첨부 가능 여부
     * </pre>
     */
    @Transient
    private String _file_yn;

    /***
     * <pre>
     *  reply_yn : 댓글 가능 여부
     * </pre>
     */
    @Transient
    private String _reply_yn;

    /***
     * <pre>
     *  system_create_userid : 시스템 작성자ID
     * </pre>
     */
    @Transient
    private String _system_create_userid;

    /***
     * <pre>
     *  system_create_date : 시스템 등록 일시
     * </pre>
     */
    @Transient
    private Date _system_create_date;

    /***
     * <pre>
     *  system_update_userid : 시스템 수정자ID
     * </pre>
     */
    @Transient
    private String _system_update_userid;

    /***
     * <pre>
     *  system_update_date : 시스템 수정 일시
     * </pre>
     */
    @Transient
    private Date _system_update_date;

}