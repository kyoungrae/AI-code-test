package com.vims.common.bbs;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SysBbsReplyRepository extends JpaRepository<SysBbsReply, String> {
}
