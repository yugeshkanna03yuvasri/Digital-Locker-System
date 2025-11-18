package com.example.springapp.service;

import com.example.springapp.model.Folder;
import com.example.springapp.model.User;
import com.example.springapp.repository.FolderRepository;
import com.example.springapp.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FolderService {
    private final FolderRepository folderRepository;
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public FolderService(FolderRepository folderRepository, UserRepository userRepository) {
        this.folderRepository = folderRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public Folder createFolder(String name, Long parentId, User owner) {
        Folder folder = new Folder();
        folder.setName(name);
        folder.setOwner(owner);
        
        if (parentId != null) {
            Folder parentFolder = folderRepository.findById(parentId)
                    .orElseThrow(() -> new RuntimeException("Parent folder not found"));
            
            // Check if user owns the parent folder
            if (!parentFolder.getOwner().getId().equals(owner.getId()) && !"ADMIN".equals(owner.getRole())) {
                throw new RuntimeException("Access denied to parent folder");
            }
            
            folder.setParentFolder(parentFolder);
        }
        
        return folderRepository.save(folder);
    }

    public List<Folder> getUserFolders(Long userId) {
        return folderRepository.findByOwnerId(userId);
    }

    public Folder get(Long id) { 
        return folderRepository.findById(id).orElseThrow(() -> new RuntimeException("Folder not found")); 
    }

    public void deleteFolder(Long id, User user) {
        Folder folder = folderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Folder not found"));
        
        // Check if user owns the folder or is admin
        if (!folder.getOwner().getId().equals(user.getId()) && !"ADMIN".equals(user.getRole())) {
            throw new RuntimeException("Access denied");
        }
        
        folderRepository.deleteById(id);
    }

    public Folder setPassword(Long folderId, String password, User user) {
        Folder folder = folderRepository.findById(folderId)
                .orElseThrow(() -> new RuntimeException("Folder not found"));
        
        // Check if user owns the folder or is admin
        if (!folder.getOwner().getId().equals(user.getId()) && !"ADMIN".equals(user.getRole())) {
            throw new RuntimeException("Access denied");
        }
        
        // Hash password and set protection
        String hashedPassword = passwordEncoder.encode(password);
        folder.setPasswordHash(hashedPassword);
        folder.setIsPasswordProtected(true);
        
        return folderRepository.save(folder);
    }

    public Folder removePassword(Long folderId, User user) {
        Folder folder = folderRepository.findById(folderId)
                .orElseThrow(() -> new RuntimeException("Folder not found"));
        
        // Check if user owns the folder or is admin
        if (!folder.getOwner().getId().equals(user.getId()) && !"ADMIN".equals(user.getRole())) {
            throw new RuntimeException("Access denied");
        }
        
        // Remove password protection
        folder.setPasswordHash(null);
        folder.setIsPasswordProtected(false);
        
        return folderRepository.save(folder);
    }

    public boolean verifyPassword(Long folderId, String password, User user) {
        Folder folder = folderRepository.findById(folderId)
                .orElseThrow(() -> new RuntimeException("Folder not found"));
        
        // Check if user owns the folder or is admin
        if (!folder.getOwner().getId().equals(user.getId()) && !"ADMIN".equals(user.getRole())) {
            throw new RuntimeException("Access denied");
        }
        
        // Check if folder is password protected
        if (!folder.getIsPasswordProtected() || folder.getPasswordHash() == null) {
            return false;
        }
        
        // Verify password
        return passwordEncoder.matches(password, folder.getPasswordHash());
    }
}
