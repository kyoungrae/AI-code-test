# 📋 업무 시스템 로그 관리 및 테이블 설계 가이드 (MariaDB)

이 문서는 권한별 CRUD 이벤트, 접속 통계, 기기 통계 기능을 포함한 로그 시스템 설계 및 성능 관리(Partitioning) 방안을 정리합니다.

---

## 1. 데이터베이스 테이블 설계

### 1.1 이벤트 로그 테이블 (`event_logs`)
**목적:** 사용자의 생성, 조회, 수정, 삭제 행위 추적 (Audit Log)

| 컬럼명 | 타입 | 설명 |
| :--- | :--- | :--- |
| `id` | BIGINT (PK) | 로그 고유 ID (Auto Increment) |
| `user_id` | VARCHAR(50) | 행위 수행자 ID |
| `user_role` | VARCHAR(20) | 수행 당시 권한 (ADMIN, USER 등) |
| `action_type` | ENUM | 작업 유형 (CREATE, READ, UPDATE, DELETE) |
| `target_table` | VARCHAR(50) | 대상 테이블/메뉴 이름 |
| `before_data` | JSON | 변경 전 데이터 (수정/삭제 시 사용) |
| `after_data` | JSON | 변경 후 데이터 (생성/수정 시 사용) |
| `ip_address` | VARCHAR(45) | 접속 IP 주소 |
| `created_at` | DATETIME (PK) | 발생 일시 (파티셔닝 키) |

### 1.2 접속 로그 테이블 (`access_logs`)
**목적:** 접속 통계 및 기기(OS, 브라우저) 통계 분석

| 컬럼명 | 타입 | 설명 |
| :--- | :--- | :--- |
| `id` | BIGINT (PK) | 접속 고유 ID |
| `user_id` | VARCHAR(50) | 사용자 ID |
| `login_at` | DATETIME (PK) | 접속 일시 (파티셔닝 키) |
| `device_type` | ENUM | 기기 구분 (PC, MOBILE, TABLET) |
| `os_name` | VARCHAR(50) | OS 정보 (Windows, Android, iOS 등) |
| `browser_name`| VARCHAR(50) | 브라우저 정보 (Chrome, Safari 등) |
| `ip_address` | VARCHAR(45) | 접속 IP 주소 |

---

## 2. MariaDB 구축 스크립트 (파티셔닝 포함)

성능 최적화를 위해 월별 **Range Partitioning**을 적용한 스크립트입니다.

```sql
-- 1. 이벤트 로그 테이블 생성
CREATE TABLE `event_logs` (
    `id` BIGINT UNSIGNED NOT NULL,
    `user_id` VARCHAR(50) NOT NULL,
    `user_role` VARCHAR(20) NOT NULL,
    `action_type` ENUM('CREATE', 'READ', 'UPDATE', 'DELETE') NOT NULL,
    `target_table` VARCHAR(50) NOT NULL,
    `target_id` VARCHAR(100),
    `before_data` JSON,
    `after_data` JSON,
    `ip_address` VARCHAR(45) NOT NULL,
    `created_at` DATETIME NOT NULL,
    PRIMARY KEY (`id`, `created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
PARTITION BY RANGE COLUMNS(created_at) (
    PARTITION p202601 VALUES LESS THAN ('2026-02-01'),
    PARTITION p202602 VALUES LESS THAN ('2026-03-01'),
    PARTITION p202603 VALUES LESS THAN ('2026-04-01'),
    PARTITION p_max VALUES LESS THAN MAXVALUE
);

-- 2. 접속 로그 테이블 생성
CREATE TABLE `access_logs` (
    `id` BIGINT UNSIGNED NOT NULL,
    `user_id` VARCHAR(50) NOT NULL,
    `login_at` DATETIME NOT NULL,
    `device_type` ENUM('PC', 'MOBILE', 'TABLET', 'OTHER') DEFAULT 'PC',
    `os_name` VARCHAR(50),
    `browser_name` VARCHAR(50),
    `ip_address` VARCHAR(45) NOT NULL,
    PRIMARY KEY (`id`, `login_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
PARTITION BY RANGE COLUMNS(login_at) (
    PARTITION p202601 VALUES LESS THAN ('2026-02-01'),
    PARTITION p202602 VALUES LESS THAN ('2026-03-01'),
    PARTITION p_max VALUES LESS THAN MAXVALUE
);

3. 파티션 자동화 관리 (Maintenance)

파티셔닝은 미래의 공간을 미리 생성하는 것이 중요합니다. MariaDB Event Scheduler를 활용해 자동화할 수 있습니다.
3.1 파티션 생성 자동화 로직

    스케줄러 활성화: SET GLOBAL event_scheduler = ON;

    프로시저 생성: 매달 말일 실행되어 '다음 달' 파티션을 생성하는 SQL문을 실행하도록 작성합니다.

    데이터 보존 정책: 일정 기간(예: 12개월)이 지난 파티션은 DROP PARTITION 명령어로 삭제하여 디스크 용량을 관리합니다.

3.2 파티셔닝의 장점

    성능: 대량의 로그 중 특정 달의 데이터만 조회할 때 검색 범위가 획기적으로 줄어듭니다.

    관리: 수천만 건의 데이터를 DELETE로 지우면 DB 부하가 크지만, 파티션 삭제는 즉시 완료됩니다.

4. 통계 쿼리 예시
기기별 접속 비중 확인

SELECT device_type, COUNT(*) AS count
FROM access_logs
WHERE login_at BETWEEN '2026-01-01' AND '2026-01-31'
GROUP BY device_type;