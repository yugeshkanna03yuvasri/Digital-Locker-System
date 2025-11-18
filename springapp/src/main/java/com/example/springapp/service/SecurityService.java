package com.example.springapp.service;

import com.example.springapp.model.User;
import com.example.springapp.repository.AccessLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class SecurityService {
    @Autowired
    private AccessLogRepository accessLogRepository;
    
    // In-memory storage for failed attempts (use Redis in production)
    private final ConcurrentHashMap<String, AtomicInteger> failedAttempts = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, LocalDateTime> lockoutTimes = new ConcurrentHashMap<>();
    
    private static final int MAX_FAILED_ATTEMPTS = 5;
    private static final int LOCKOUT_DURATION_MINUTES = 30;

    public boolean isAccountLocked(String userEmail) {
        LocalDateTime lockoutTime = lockoutTimes.get(userEmail);
        if (lockoutTime == null) return false;
        
        if (LocalDateTime.now().isAfter(lockoutTime.plusMinutes(LOCKOUT_DURATION_MINUTES))) {
            // Lockout expired, reset
            lockoutTimes.remove(userEmail);
            failedAttempts.remove(userEmail);
            return false;
        }
        return true;
    }

    public void recordFailedAttempt(String userEmail) {
        AtomicInteger attempts = failedAttempts.computeIfAbsent(userEmail, k -> new AtomicInteger(0));
        int currentAttempts = attempts.incrementAndGet();
        
        if (currentAttempts >= MAX_FAILED_ATTEMPTS) {
            lockoutTimes.put(userEmail, LocalDateTime.now());
        }
    }

    public void resetFailedAttempts(String userEmail) {
        failedAttempts.remove(userEmail);
        lockoutTimes.remove(userEmail);
    }

    public int getFailedAttemptCount(String userEmail) {
        AtomicInteger attempts = failedAttempts.get(userEmail);
        return attempts != null ? attempts.get() : 0;
    }

    public LocalDateTime getLockoutTime(String userEmail) {
        return lockoutTimes.get(userEmail);
    }

    // Future: 2FA implementation placeholder
    public boolean verify2FA(User user, String code) {
        // TODO: Implement TOTP verification
        // For now, return true for demo purposes
        return true;
    }

    // Future: Generate 2FA QR code
    public String generate2FASecret(User user) {
        // TODO: Generate TOTP secret and QR code
        return "DEMO_SECRET_" + user.getId();
    }

    // Future: IP-based restrictions
    public boolean isIpAllowed(String ipAddress, User user) {
        // TODO: Check against user's allowed IP list
        return true;
    }

    // Future: Device fingerprinting
    public boolean isDeviceTrusted(String deviceFingerprint, User user) {
        // TODO: Check against user's trusted devices
        return true;
    }
}