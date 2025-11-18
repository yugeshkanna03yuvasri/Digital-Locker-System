package com.example.springapp.repository;

import com.example.springapp.model.Document;
import com.example.springapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByOwner(User owner);
    List<Document> findByOwnerIdAndIsArchivedFalse(Long ownerId);
    List<Document> findByOwnerId(Long ownerId);
}
