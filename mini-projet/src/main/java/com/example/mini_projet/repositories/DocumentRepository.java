package com.example.mini_projet.repositories;

import com.example.mini_projet.entities.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByProjetId(Long projetId);
    List<Document> findByType(String type);
    List<Document> findByProjetIdAndType(Long projetId, String type);
}