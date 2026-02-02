-- SYS_BBS_REPLY 테이블 생성 DDL
-- 게시판 댓글 저장용 테이블

CREATE TABLE IF NOT EXISTS SYS_BBS_REPLY (
    reply_id VARCHAR(50) PRIMARY KEY,           -- 댓글 ID (UUID)
    board_id VARCHAR(50) NOT NULL,              -- 게시물 ID (SYS_BBS_BOARD FK)
    parent_reply_id VARCHAR(50) DEFAULT NULL,   -- 부모 댓글 ID (대댓글용)
    content TEXT NOT NULL,                       -- 댓글 내용
    writer_name VARCHAR(100),                   -- 작성자 이름
    system_create_userid VARCHAR(100),
    system_create_date DATETIME DEFAULT NOW(),
    system_update_userid VARCHAR(100),
    system_update_date DATETIME DEFAULT NOW(),
    FOREIGN KEY (board_id) REFERENCES SYS_BBS_BOARD(board_id) ON DELETE CASCADE,
    INDEX idx_board_id (board_id),
    INDEX idx_parent_reply_id (parent_reply_id)
);
