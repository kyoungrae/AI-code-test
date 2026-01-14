package com.system.common.eventlog;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ComEventLogRepository extends JpaRepository<ComEventLog, String> {
}