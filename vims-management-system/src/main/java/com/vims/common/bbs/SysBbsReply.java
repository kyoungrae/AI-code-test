package com.vims.common.bbs;

import com.system.common.base.Common;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Transient;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.Arrays;
import java.util.Date;

@EqualsAndHashCode(callSuper = true)
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class SysBbsReply extends Common {
    @Transient
    @Builder.Default
    private String keys = Arrays.toString(new String[] { "reply_id" });

    @Id
    private String reply_id; // 댓글 ID (UUID)
    private String board_id; // 게시물 ID (SYS_BBS_BOARD FK)
    private String parent_reply_id; // 부모 댓글 ID (대댓글용)
    private String content; // 댓글 내용
    private String writer_name; // 작성자 이름

    private String system_create_userid;
    private Date system_create_date;
    private String system_update_userid;
    private Date system_update_date;

    // 검색용 필드
    @Transient
    private String _content;
    @Transient
    private String _writer_name;
}
