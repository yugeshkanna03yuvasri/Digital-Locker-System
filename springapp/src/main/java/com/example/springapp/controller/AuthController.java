package com.example.springapp.controller;

import com.example.springapp.model.RefreshToken;
import com.example.springapp.model.User;
import com.example.springapp.repository.UserRepository;
import com.example.springapp.security.JwtUtil;
import com.example.springapp.service.RefreshTokenService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final RefreshTokenService refreshTokenService;

    public AuthController(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder, JwtUtil jwtUtil, RefreshTokenService refreshTokenService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.refreshTokenService = refreshTokenService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        System.out.println("Login attempt for email: " + req.email);
        return userRepository.findByEmail(req.email).map(user -> {
            System.out.println("User found: " + user.getEmail() + ", Role: " + user.getRole());
            System.out.println("Password hash from DB: " + user.getPasswordHash());
            System.out.println("Raw password provided: " + req.password);
            
            if (passwordEncoder.matches(req.password, user.getPasswordHash())) {
                System.out.println("Password matches! Generating tokens...");
                String accessToken = jwtUtil.generateToken(user.getEmail(), user.getRole());
                RefreshToken refresh = refreshTokenService.create(user, 60L * 60L * 24L * 30L); // 30 days
                return ResponseEntity.ok(Map.of(
                        "accessToken", accessToken,
                        "refreshToken", refresh.getToken(),
                        "accessTokenExpiresAt", Instant.now().plusMillis(3600000).toString()
                ));
            }
            System.out.println("Password does not match!");
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }).orElseGet(() -> {
            System.out.println("User not found for email: " + req.email);
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        });
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody RefreshRequest req) {
        return refreshTokenService.findByToken(req.refreshToken).map(rt -> {
            if (rt.getExpiresAt().isBefore(Instant.now())) {
                refreshTokenService.revokeToken(rt);
                return ResponseEntity.status(401).body(Map.of("error", "Refresh token expired"));
            }
            // rotate: revoke old and create a new one
            RefreshToken newRt = refreshTokenService.rotate(rt, 60L * 60L * 24L * 30L);
            User user = rt.getUser();
            String accessToken = jwtUtil.generateToken(user.getEmail(), user.getRole());
            return ResponseEntity.ok(Map.of("accessToken", accessToken, "refreshToken", newRt.getToken()));
        }).orElse(ResponseEntity.status(401).body(Map.of("error", "Invalid refresh token")));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody LogoutRequest req) {
        if (req.revokeAll && req.refreshToken == null) {
            // revoke all for the current authenticated user
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated()) return ResponseEntity.status(401).build();
            String username = auth.getName();
            userRepository.findByEmail(username).ifPresent(u -> { refreshTokenService.revokeByUser(u); });
            return ResponseEntity.ok(Map.of("status", "all_revoked"));
        }

        if (req.refreshToken != null) {
            refreshTokenService.findByToken(req.refreshToken).ifPresent(rt -> refreshTokenService.revokeToken(rt));
        }
        return ResponseEntity.ok(Map.of("status", "ok"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) return ResponseEntity.status(401).build();
        String username = auth.getName();
        return userRepository.findByEmail(username)
                .map(u -> ResponseEntity.ok(Map.of(
                    "email", u.getEmail(), 
                    "role", u.getRole(), 
                    "name", u.getName(),
                    "twoFactorEnabled", u.getTwoFactorEnabled() != null ? u.getTwoFactorEnabled() : false,
                    "securityPreference", u.getSecurityPreference() != null ? u.getSecurityPreference() : "PASSWORD_ONLY"
                )))
                .orElse(ResponseEntity.notFound().build());
    }

    public static class LoginRequest { public String email; public String password; }
    public static class RefreshRequest { public String refreshToken; }
    public static class LogoutRequest { public String refreshToken; public boolean revokeAll = false; }
}
