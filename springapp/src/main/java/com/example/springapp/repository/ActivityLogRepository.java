package com.example.springapp.repository;

import com.example.springapp.model.ActivityLog;
import com.example.springapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {
    List<ActivityLog> findByUser(User user);
}
