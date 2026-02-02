-- 1. 게시판 마스터 테이블 (BBS 유형 정의: BASIC, NOTICE, GALLERY 등)
CREATE TABLE SYS_BBS_MST (
    bbs_mst_id           VARCHAR(50)   NOT NULL COMMENT '게시판 유형 코드',
    bbs_nm               VARCHAR(100)  NOT NULL COMMENT '게시판 유형 명칭',
    bbs_type             VARCHAR(20)   NOT NULL COMMENT 'UI 레이아웃 타입 (BASIC, NOTICE, GALLERY)',
    system_create_userid VARCHAR(50)   NULL     COMMENT '시스템 등록자 ID',
    system_create_date   DATETIME      NULL     COMMENT '시스템 등록 일시',
    system_update_userid VARCHAR(50)   NULL     COMMENT '시스템 수정자 ID',
    system_update_date   DATETIME      NULL     COMMENT '시스템 수정 일시',
    PRIMARY KEY (bbs_mst_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='게시판 마스터';

-- 2. 게시판 설정 테이블 (실제 생성된 각 게시판 정보)
CREATE TABLE SYS_BBS (
    bbs_id               VARCHAR(50)   NOT NULL COMMENT '게시판 고유 ID (UUID)',
    bbs_mst_id           VARCHAR(50)   NOT NULL COMMENT '게시판 마스터 ID (FK)',
    bbs_nm               VARCHAR(100)  NOT NULL COMMENT '게시판 이름',
    p_menu_code          VARCHAR(50)   NULL     COMMENT '상위 메뉴 코드 (매핑용)',
    bbs_manager          VARCHAR(255)  NULL     COMMENT '게시판 관리자',
    file_yn              CHAR(1)       DEFAULT '0' COMMENT '파일 첨부 여부 (1:Y, 0:N)',
    reply_yn             CHAR(1)       DEFAULT '0' COMMENT '댓글 사용 여부 (1:Y, 0:N)',
    system_create_userid VARCHAR(50)   NULL     COMMENT '시스템 등록자 ID',
    system_create_date   DATETIME      NULL     COMMENT '시스템 등록 일시',
    system_update_userid VARCHAR(50)   NULL     COMMENT '시스템 수정자 ID',
    system_update_date   DATETIME      NULL     COMMENT '시스템 수정 일시',
    PRIMARY KEY (bbs_id),
    CONSTRAINT FK_SYS_BBS_MST FOREIGN KEY (bbs_mst_id) REFERENCES SYS_BBS_MST (bbs_mst_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='게시판 설정';

-- 3. 게시판 콘텐츠 테이블 (실제 게시물 데이터)
CREATE TABLE SYS_BBS_BOARD (
    board_id             VARCHAR(50)   NOT NULL COMMENT '게시물 고유 ID (UUID)',
    bbs_id               VARCHAR(50)   NOT NULL COMMENT '소속 게시판 ID (FK)',
    title                VARCHAR(200)  NOT NULL COMMENT '글 제목',
    content              LONGTEXT      NULL     COMMENT '글 내용',
    writer_name          VARCHAR(50)   NULL     COMMENT '작성자 이름',
    hit_count            INT           DEFAULT 0 COMMENT '조회수',
    file_uuid            VARCHAR(50)   NULL     COMMENT '파일 UUID',
    thumbnail            VARCHAR(255)  NULL     COMMENT '갤러리용 썸네일 경로',
    system_create_userid VARCHAR(50)   NULL     COMMENT '시스템 등록자 ID',
    system_create_date   DATETIME      NULL     COMMENT '시스템 등록 일시',
    system_update_userid VARCHAR(50)   NULL     COMMENT '시스템 수정자 ID',
    system_update_date   DATETIME      NULL     COMMENT '시스템 수정 일시',
    PRIMARY KEY (board_id),
    CONSTRAINT FK_SYS_BBS_ID FOREIGN KEY (bbs_id) REFERENCES SYS_BBS (bbs_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='게시판 게시물 정보';
-- 4. 게시판 댓글 (SYS_BBS_REPLY)
CREATE TABLE SYS_BBS_REPLY (
                               REPLY_ID VARCHAR(50) PRIMARY KEY COMMENT '댓글 ID',
                               BOARD_ID VARCHAR(50) NOT NULL COMMENT '게시물 ID',
                               PARENT_REPLY_ID VARCHAR(50) DEFAULT NULL COMMENT '부모 댓글 ID',
                               CONTENT TEXT NOT NULL COMMENT '댓글 내용',
                               WRITER_NAME VARCHAR(100) COMMENT '작성자 이름',
                               SYSTEM_CREATE_USERID VARCHAR(100) COMMENT '시스템 작성자ID',
                               SYSTEM_CREATE_DATE DATETIME COMMENT '시슷템 등록 일시',
                               SYSTEM_UPDATE_USERID VARCHAR(100) COMMENT '시스템 수정자ID',
                               SYSTEM_UPDATE_DATE DATETIME COMMENT '시스템 수정 일시',
                               FOREIGN KEY (BOARD_ID) REFERENCES SYS_BBS_BOARD(BOARD_ID) ON DELETE CASCADE
);
