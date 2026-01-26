package com.vims.common.bbs;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SysBbsBoardRepository extends JpaRepository<SysBbsBoard, String> {
}
