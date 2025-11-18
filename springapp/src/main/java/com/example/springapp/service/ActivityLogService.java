package com.example.springapp.service;

import com.example.springapp.model.ActivityLog;
import com.example.springapp.model.Document;
import com.example.springapp.model.User;
import com.example.springapp.repository.ActivityLogRepository;
import com.example.springapp.repository.DocumentRepository;
import com.example.springapp.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ActivityLogService {
    private final ActivityLogRepository activityLogRepository;
    private final UserRepository userRepository;
    private final DocumentRepository documentRepository;

    public ActivityLogService(ActivityLogRepository activityLogRepository, UserRepository userRepository, DocumentRepository documentRepository) {
        this.activityLogRepository = activityLogRepository;
        this.userRepository = userRepository;
        this.documentRepository = documentRepository;
    }

    public ActivityLog record(Long userId, Long documentId, String action) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Document doc = null;
        if (documentId != null) doc = documentRepository.findById(documentId).orElse(null);
        ActivityLog log = new ActivityLog();
        log.setUser(user);
        log.setDocument(doc);
        log.setAction(action);
        return activityLogRepository.save(log);
    }
    
    public ActivityLog record(Long userId, Long documentId, String action, String details) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Document doc = null;
        if (documentId != null) doc = documentRepository.findById(documentId).orElse(null);
        ActivityLog log = new ActivityLog();
        log.setUser(user);
        log.setDocument(doc);
        log.setAction(action);
        log.setDetails(details);
        return activityLogRepository.save(log);
    }

    public List<ActivityLog> list() { return activityLogRepository.findAll(); }

    public ActivityLog get(Long id) { return activityLogRepository.findById(id).orElseThrow(() -> new RuntimeException("Not found")); }

    public void delete(Long id) { activityLogRepository.deleteById(id); }
}
