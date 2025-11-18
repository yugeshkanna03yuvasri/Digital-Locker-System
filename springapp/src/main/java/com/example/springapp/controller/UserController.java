package com.example.springapp.controller;

import com.example.springapp.model.User;
import com.example.springapp.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest req) {
        System.out.println("Signup request received for email: " + req.email);
        try {
            // Validate admin code if admin role is requested
            if ("ADMIN".equalsIgnoreCase(req.role)) {
                if (!"SECUREVAULT2024".equals(req.adminCode)) {
                    return ResponseEntity.status(400).body(Map.of("error", "Invalid admin access code"));
                }
            }
            
            User u = new User();
            u.setName(req.name);
            u.setEmail(req.email);
            u.setPhone(req.phone);
            u.setCompany(req.company);
            u.setJobTitle(req.jobTitle);
            // Set role based on validation
            u.setRole(req.role != null && req.role.equalsIgnoreCase("ADMIN") ? "ROLE_ADMIN" : "ROLE_USER");
            User saved = userService.signup(u, req.password);
            System.out.println("User created successfully: " + saved.getEmail());
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            System.out.println("Error during signup: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Internal server error: " + e.getMessage()));
        }
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> list() { return userService.list(); }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> get(@PathVariable Long id) {
        return userService.get(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> update(@PathVariable Long id, @RequestBody User updated) {
        try {
            return ResponseEntity.ok(userService.update(id, updated));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }

    public static class SignupRequest { 
        public String name; 
        public String email; 
        public String password; 
        public String role;
        public String phone;
        public String company;
        public String jobTitle;
        public String adminCode;
    }
}
