package com.example.springapp.repository;

import com.example.springapp.model.AccessLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AccessLogRepository extends JpaRepository<AccessLog, Long> {
    List<AccessLog> findByUserIdOrderByTimestampDesc(Long userId);
    List<AccessLog> findByDocumentIdOrderByTimestampDesc(Long documentId);
    List<AccessLog> findByUserIdAndSuccessFalseOrderByTimestampDesc(Long userId);
}