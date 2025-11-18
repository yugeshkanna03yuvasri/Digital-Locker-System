package com.example.springapp.controller;

import com.example.springapp.model.ActivityLog;
import com.example.springapp.model.User;
import com.example.springapp.repository.UserRepository;
import com.example.springapp.service.ActivityLogService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activity")
public class ActivityLogController {
    private final ActivityLogService activityLogService;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    public ActivityLogController(ActivityLogService activityLogService, UserRepository userRepository, ObjectMapper objectMapper) { 
        this.activityLogService = activityLogService;
        this.userRepository = userRepository;
        this.objectMapper = objectMapper;
    }


    @PostMapping("/record")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ActivityLog> recordActivity(@RequestBody RecordRequest req) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            User currentUser = userRepository.findByEmail(auth.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            String detailsJson = null;
            if (req.details != null) {
                detailsJson = objectMapper.writeValueAsString(req.details);
            }
            
            ActivityLog log = activityLogService.record(currentUser.getId(), null, req.action, detailsJson);
            return ResponseEntity.ok(log);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/user")
    @PreAuthorize("isAuthenticated()")
    public List<ActivityLog> getUserLogs() {
        return activityLogService.list();
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<ActivityLog> list() { return activityLogService.list(); }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ActivityLog> get(@PathVariable Long id) {
        try { return ResponseEntity.ok(activityLogService.get(id)); } catch (RuntimeException e) { return ResponseEntity.notFound().build(); }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) { activityLogService.delete(id); return ResponseEntity.noContent().build(); }

    public static class RecordRequest { 
        public Long userId; 
        public Long documentId; 
        public String action;
        public Object details;
    }
}
