package com.example.springapp.service;

import com.example.springapp.model.Document;
import com.example.springapp.model.Folder;
import com.example.springapp.model.User;
import com.example.springapp.repository.DocumentRepository;
import com.example.springapp.repository.FolderRepository;
import com.example.springapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
public class DocumentService {
    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;
    private final FolderRepository folderRepository;
    private final Path fileStorageLocation;
    private final BCryptPasswordEncoder passwordEncoder;
    private final EncryptionService encryptionService;
    private final AccessLogService accessLogService;

    public DocumentService(DocumentRepository documentRepository, 
                          UserRepository userRepository, 
                          FolderRepository folderRepository,
                          EncryptionService encryptionService,
                          AccessLogService accessLogService,
                          @Value("${app.file.upload-dir:./uploads}") String uploadDir) {
        this.documentRepository = documentRepository;
        this.userRepository = userRepository;
        this.folderRepository = folderRepository;
        this.encryptionService = encryptionService;
        this.accessLogService = accessLogService;
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        this.passwordEncoder = new BCryptPasswordEncoder();
        
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    public Document uploadDocument(MultipartFile file, String fileName, String fileType, Long folderId, User owner) {
        try {
            // Create user-specific directory
            Path userDir = this.fileStorageLocation.resolve("user_" + owner.getId());
            Files.createDirectories(userDir);
            
            // Generate unique filename to avoid conflicts
            String uniqueFileName = UUID.randomUUID().toString() + "_" + fileName;
            Path targetLocation = userDir.resolve(uniqueFileName);
            
            // Copy file to target location
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            
            // Create document record
            Document document = new Document();
            document.setName(fileName);
            document.setFileType(fileType);
            document.setFileUrl(targetLocation.toString());
            document.setSize(file.getSize());
            document.setOwner(owner);
            
            if (folderId != null) {
                Folder folder = folderRepository.findById(folderId).orElse(null);
                document.setParentFolder(folder);
            }
            
            return documentRepository.save(document);
            
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + fileName + ". Please try again!", ex);
        }
    }

    public Resource downloadDocument(Long documentId, User user, jakarta.servlet.http.HttpServletRequest request) {
        try {
            Document document = documentRepository.findById(documentId)
                    .orElseThrow(() -> new RuntimeException("Document not found"));
            
            // Check if user owns the document or is admin
            if (!document.getOwner().getId().equals(user.getId()) && !"ADMIN".equals(user.getRole())) {
                accessLogService.logAccess(user, document, "DOWNLOAD", false, request, "Access denied");
                throw new RuntimeException("Access denied");
            }
            
            Path filePath = Paths.get(document.getFileUrl()).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists()) {
                accessLogService.logAccess(user, document, "DOWNLOAD", true, request, "File downloaded successfully");
                return resource;
            } else {
                accessLogService.logAccess(user, document, "DOWNLOAD", false, request, "File not found on disk");
                throw new RuntimeException("File not found " + document.getName());
            }
        } catch (Exception ex) {
            throw new RuntimeException("File not found", ex);
        }
    }

    public void deleteDocument(Long documentId, User user) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));
        
        // Check if user owns the document or is admin
        if (!document.getOwner().getId().equals(user.getId()) && !"ADMIN".equals(user.getRole())) {
            throw new RuntimeException("Access denied");
        }
        
        try {
            // Delete physical file
            Path filePath = Paths.get(document.getFileUrl());
            Files.deleteIfExists(filePath);
        } catch (IOException ex) {
            // Log error but continue with database deletion
            System.err.println("Could not delete physical file: " + ex.getMessage());
        }
        
        // Delete database record
        documentRepository.deleteById(documentId);
    }

    public List<Document> getUserDocuments(Long userId) {
        return documentRepository.findByOwnerIdAndIsArchivedFalse(userId);
    }

    public Document get(Long id) { 
        return documentRepository.findById(id).orElseThrow(() -> new RuntimeException("Document not found")); 
    }

    public Document renameDocument(Long documentId, String newName, User user) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));
        
        // Check if user owns the document or is admin
        if (!document.getOwner().getId().equals(user.getId()) && !"ADMIN".equals(user.getRole())) {
            throw new RuntimeException("Access denied");
        }
        
        // Update document name
        document.setName(newName);
        return documentRepository.save(document);
    }

    public Document setPassword(Long documentId, String password, User user) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));
        
        // Check if user owns the document or is admin
        if (!document.getOwner().getId().equals(user.getId()) && !"ADMIN".equals(user.getRole())) {
            throw new RuntimeException("Access denied");
        }
        
        // Hash password and set protection
        String hashedPassword = passwordEncoder.encode(password);
        document.setPasswordHash(hashedPassword);
        document.setIsPasswordProtected(true);
        
        return documentRepository.save(document);
    }

    public Document removePassword(Long documentId, User user) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));
        
        // Check if user owns the document or is admin
        if (!document.getOwner().getId().equals(user.getId()) && !"ADMIN".equals(user.getRole())) {
            throw new RuntimeException("Access denied");
        }
        
        // Remove password protection
        document.setPasswordHash(null);
        document.setIsPasswordProtected(false);
        
        return documentRepository.save(document);
    }

    public boolean verifyPassword(Long documentId, String password, User user, jakarta.servlet.http.HttpServletRequest request) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));
        
        // Check if user owns the document or is admin
        if (!document.getOwner().getId().equals(user.getId()) && !"ADMIN".equals(user.getRole())) {
            accessLogService.logAccess(user, document, "PASSWORD_ATTEMPT", false, request, "Access denied");
            throw new RuntimeException("Access denied");
        }
        
        // Check if document is password protected
        if (!document.getIsPasswordProtected() || document.getPasswordHash() == null) {
            accessLogService.logAccess(user, document, "PASSWORD_ATTEMPT", false, request, "Document not password protected");
            return false;
        }
        
        // Verify password
        boolean isValid = passwordEncoder.matches(password, document.getPasswordHash());
        accessLogService.logAccess(user, document, "PASSWORD_ATTEMPT", isValid, request, 
            isValid ? "Password verified successfully" : "Invalid password provided");
        
        return isValid;
    }
}
