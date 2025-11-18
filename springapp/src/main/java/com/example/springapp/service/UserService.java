package com.example.springapp.service;

import com.example.springapp.model.User;
import com.example.springapp.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import com.example.springapp.security.RoleUtil;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User signup(User user, String rawPassword) {
        user.setPasswordHash(passwordEncoder.encode(rawPassword));
        user.setRole(RoleUtil.normalize(user.getRole()));
        return userRepository.save(user);
    }

    public List<User> list() { return userRepository.findAll(); }

    public Optional<User> get(Long id) { return userRepository.findById(id); }

    public User update(Long id, User updated) {
        return userRepository.findById(id).map(u -> {
            u.setName(updated.getName());
            u.setRole(RoleUtil.normalize(updated.getRole()));
            u.setStorageUsed(updated.getStorageUsed());
            u.setPhone(updated.getPhone());
            u.setCompany(updated.getCompany());
            u.setJobTitle(updated.getJobTitle());
            return userRepository.save(u);
        }).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public void delete(Long id) { userRepository.deleteById(id); }
}
