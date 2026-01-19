package com.system.common.eventlog;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SysEventLogRepository extends JpaRepository<SysEventLog, String> {
}