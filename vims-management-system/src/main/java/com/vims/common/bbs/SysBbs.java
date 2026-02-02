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
    private String bbs_type; // 게시판 타입 (GALLERY, NOTICE, etc.)

    /***
     * <pre>
     *  bbs_nm : 게시판 이름
     * </pre>
     */
    private String bbs_nm;

    /***
     * <pre>
     *  bbs_manager : 게시판 관리자
     * </pre>
     */
    private String bbs_manager;

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
     *  p_menu_code : 상위 메뉴 코드
     * </pre>
     */
    private String p_menu_code;

    /***
     * <pre>
     *  access_group_count : 권한 그룹 개수
     * </pre>
     */
    @Transient
    private int access_group_count;

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
     *  bbs_manager : 게시판 관리자
     * </pre>
     */
    @Transient
    private String _bbs_manager;

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