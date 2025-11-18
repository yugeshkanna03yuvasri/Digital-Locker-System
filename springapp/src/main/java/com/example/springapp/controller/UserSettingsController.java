package com.example.springapp.controller;

import com.example.springapp.model.User;
import com.example.springapp.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user/settings")
public class UserSettingsController {
    private final UserRepository userRepository;

    public UserSettingsController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PutMapping("/security-preference")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateSecurityPreference(@RequestBody Map<String, Object> request) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            User currentUser = userRepository.findByEmail(auth.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            String securityPreference = (String) request.get("securityPreference");
            Boolean twoFactorEnabled = (Boolean) request.get("twoFactorEnabled");

            if (securityPreference != null) {
                if (!securityPreference.equals("PASSWORD_ONLY") && !securityPreference.equals("PASSWORD_OTP")) {
                    return ResponseEntity.badRequest().body(Map.of("error", "Invalid security preference"));
                }
                currentUser.setSecurityPreference(securityPreference);
                currentUser.setTwoFactorEnabled("PASSWORD_OTP".equals(securityPreference));
            }

            if (twoFactorEnabled != null) {
                currentUser.setTwoFactorEnabled(twoFactorEnabled);
                currentUser.setSecurityPreference(twoFactorEnabled ? "PASSWORD_OTP" : "PASSWORD_ONLY");
            }

            userRepository.save(currentUser);

            return ResponseEntity.ok(Map.of(
                "success", true,
                "securityPreference", currentUser.getSecurityPreference(),
                "twoFactorEnabled", currentUser.getTwoFactorEnabled()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/security-preference")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getSecurityPreference() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            User currentUser = userRepository.findByEmail(auth.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            return ResponseEntity.ok(Map.of(
                "securityPreference", currentUser.getSecurityPreference() != null ? currentUser.getSecurityPreference() : "PASSWORD_ONLY",
                "twoFactorEnabled", currentUser.getTwoFactorEnabled() != null ? currentUser.getTwoFactorEnabled() : false
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}