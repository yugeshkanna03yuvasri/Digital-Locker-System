package com.example.springapp.service;

import com.example.springapp.model.User;
import com.example.springapp.model.Document;
import com.example.springapp.repository.UserRepository;
import com.example.springapp.repository.DocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DocumentRepository documentRepository;

    public List<Map<String, Object>> getAllUsersWithStorageInfo() {
        List<User> users = userRepository.findAll();
        
        return users.stream().map(user -> {
            // Calculate total storage used by user
            List<Document> userDocuments = documentRepository.findByOwnerId(user.getId());
            long totalStorageBytes = userDocuments.stream()
                .mapToLong(doc -> doc.getSize() != null ? doc.getSize() : 0L)
                .sum();
            
            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("id", user.getId());
            userInfo.put("name", user.getName());
            userInfo.put("username", user.getUsername());
            userInfo.put("email", user.getEmail());
            userInfo.put("createdAt", user.getCreatedAt());
            userInfo.put("storageUsed", totalStorageBytes); // in bytes
            userInfo.put("fileCount", userDocuments.size());
            userInfo.put("role", user.getRole() != null ? user.getRole() : "User"); // Use actual role or default to User
            
            return userInfo;
        }).collect(Collectors.toList());
    }

    public Map<String, Object> getDashboardStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        // Total users
        long totalUsers = userRepository.count();
        stats.put("totalUsers", totalUsers);
        
        // Total files
        long totalFiles = documentRepository.count();
        stats.put("totalFiles", totalFiles);
        
        // Total storage used (in bytes)
        List<Document> allDocuments = documentRepository.findAll();
        long totalStorageBytes = allDocuments.stream()
            .mapToLong(doc -> doc.getSize() != null ? doc.getSize() : 0L)
            .sum();
        stats.put("totalStorage", totalStorageBytes);
        
        // File type breakdown
        Map<String, Long> fileTypeBreakdown = allDocuments.stream()
            .collect(Collectors.groupingBy(
                doc -> doc.getFileType() != null ? doc.getFileType() : "Unknown",
                Collectors.counting()
            ));
        stats.put("fileTypeBreakdown", fileTypeBreakdown);
        
        // Storage by file type
        Map<String, Long> storageByType = allDocuments.stream()
            .collect(Collectors.groupingBy(
                doc -> doc.getFileType() != null ? doc.getFileType() : "Unknown",
                Collectors.summingLong(doc -> doc.getSize() != null ? doc.getSize() : 0L)
            ));
        stats.put("storageByType", storageByType);
        
        return stats;
    }

    public Map<String, Object> getUserStorageDetails(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (!userOpt.isPresent()) {
            throw new RuntimeException("User not found");
        }
        
        User user = userOpt.get();
        List<Document> userDocuments = documentRepository.findByOwnerId(userId);
        
        Map<String, Object> details = new HashMap<>();
        details.put("userId", userId);
        details.put("username", user.getName());
        details.put("email", user.getEmail());
        details.put("totalFiles", userDocuments.size());
        
        long totalStorageBytes = userDocuments.stream()
            .mapToLong(doc -> doc.getSize() != null ? doc.getSize() : 0L)
            .sum();
        details.put("totalStorageBytes", totalStorageBytes);
        details.put("totalStorageGB", totalStorageBytes / (1024.0 * 1024.0 * 1024.0));
        
        // Storage limit (1TB in bytes)
        long storageLimitBytes = 1024L * 1024L * 1024L * 1024L; // 1TB
        details.put("storageLimitBytes", storageLimitBytes);
        details.put("storageUsagePercentage", (double) totalStorageBytes / storageLimitBytes * 100);
        
        // File type breakdown for this user
        Map<String, Long> userFileTypeBreakdown = userDocuments.stream()
            .collect(Collectors.groupingBy(
                doc -> doc.getFileType() != null ? doc.getFileType() : "Unknown",
                Collectors.counting()
            ));
        details.put("fileTypeBreakdown", userFileTypeBreakdown);
        
        return details;
    }
}