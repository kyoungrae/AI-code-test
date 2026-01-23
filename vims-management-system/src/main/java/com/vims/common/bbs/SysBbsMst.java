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
    private String keys = Arrays.toString(new String[] { "bbs_mst_id" });

    @Id
    /***
     * <pre>
     *  bbs_mst_id : 게시판 고유 코드
     * </pre>
     */
    private String bbs_mst_id;

    /***
     * <pre>
     *  bbs_nm : 게시판 명칭
     * </pre>
     */
    private String bbs_nm;

    /***
     * <pre>
     *  bbs_type : 게시판 유형
     * </pre>
     */
    private String bbs_type;

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
     *  bbs_mst_id : 게시판 고유 코드
     * </pre>
     */
    @Transient
    private String _bbs_mst_id;

    /***
     * <pre>
     *  bbs_nm : 게시판 명칭
     * </pre>
     */
    @Transient
    private String _bbs_nm;

    /***
     * <pre>
     *  bbs_type : 게시판 유형
     * </pre>
     */
    @Transient
    private String _bbs_type;

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