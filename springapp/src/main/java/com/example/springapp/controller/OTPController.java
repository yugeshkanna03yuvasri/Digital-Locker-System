package com.example.springapp.controller;

import com.example.springapp.model.User;
import com.example.springapp.repository.UserRepository;
import com.example.springapp.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/otp")
public class OTPController {
    private final EmailService emailService;
    private final UserRepository userRepository;

    public OTPController(EmailService emailService, UserRepository userRepository) {
        this.emailService = emailService;
        this.userRepository = userRepository;
    }

    @PostMapping("/send")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> sendOTP() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            User currentUser = userRepository.findByEmail(auth.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            String otp = emailService.generateAndSendOTP(currentUser.getEmail());
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "OTP sent to " + currentUser.getEmail()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Failed to send OTP: " + e.getMessage()
            ));
        }
    }

    @PostMapping("/verify")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> verifyOTP(@RequestBody Map<String, String> request) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            User currentUser = userRepository.findByEmail(auth.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            String otp = request.get("otp");
            if (otp == null || otp.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "OTP is required"));
            }
            
            boolean isValid = emailService.verifyOTP(currentUser.getEmail(), otp);
            
            if (isValid) {
                return ResponseEntity.ok(Map.of("success", true));
            } else {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid or expired OTP"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}