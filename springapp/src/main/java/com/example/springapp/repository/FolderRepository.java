package com.example.springapp.repository;

import com.example.springapp.model.Folder;
import com.example.springapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FolderRepository extends JpaRepository<Folder, Long> {
    List<Folder> findByOwner(User owner);
    List<Folder> findByOwnerId(Long ownerId);
}
