package com.example.springapp.service;

import com.example.springapp.model.AccessLog;
import com.example.springapp.model.Document;
import com.example.springapp.model.User;
import com.example.springapp.repository.AccessLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@Service
public class AccessLogService {
    @Autowired
    private AccessLogRepository accessLogRepository;

    public void logAccess(User user, Document document, String action, boolean success, HttpServletRequest request, String details) {
        AccessLog log = new AccessLog();
        log.setUser(user);
        log.setDocument(document);
        log.setAction(action);
        log.setSuccess(success);
        log.setIpAddress(getClientIpAddress(request));
        log.setUserAgent(request.getHeader("User-Agent"));
        log.setDetails(details);
        accessLogRepository.save(log);
    }

    public List<AccessLog> getUserAccessLogs(Long userId) {
        return accessLogRepository.findByUserIdOrderByTimestampDesc(userId);
    }

    public List<AccessLog> getDocumentAccessLogs(Long documentId) {
        return accessLogRepository.findByDocumentIdOrderByTimestampDesc(documentId);
    }

    public List<AccessLog> getFailedAttempts(Long userId) {
        return accessLogRepository.findByUserIdAndSuccessFalseOrderByTimestampDesc(userId);
    }

    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedForHeader = request.getHeader("X-Forwarded-For");
        if (xForwardedForHeader == null) {
            return request.getRemoteAddr();
        } else {
            return xForwardedForHeader.split(",")[0];
        }
    }
}