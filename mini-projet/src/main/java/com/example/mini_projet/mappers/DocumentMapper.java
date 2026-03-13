package com.example.mini_projet.mappers;

import com.example.mini_projet.dto.request.DocumentRequestDTO;
import com.example.mini_projet.dto.response.DocumentResponseDTO;
import com.example.mini_projet.entities.Document;
import com.example.mini_projet.entities.Projet;
import com.example.mini_projet.repositories.ProjetRepository;
import org.springframework.stereotype.Component;
import java.util.Date;

@Component
public class DocumentMapper {

    private final ProjetRepository projetRepository;

    public DocumentMapper(ProjetRepository projetRepository) {
        this.projetRepository = projetRepository;
    }

    public Document toEntity(DocumentRequestDTO dto) {
        if (dto == null) return null;

        Document document = new Document();
        document.setCode(dto.code());
        document.setType(dto.type());
        document.setTitre(dto.titre());
        document.setDescription(dto.description());
        document.setCheminFichier(dto.cheminFichier());
        document.setDateUpload(new Date());

        return document;
    }

    public DocumentResponseDTO toResponseDTO(Document document) {
        if (document == null) return null;

        return new DocumentResponseDTO(
                document.getId(),
                document.getCode(),
                document.getType(),
                document.getTitre(),
                document.getDescription(),
                document.getCheminFichier(),
                document.getDateUpload(),
                document.getProjet() != null ? document.getProjet().getId() : null,
                document.getProjet() != null ? document.getProjet().getNom() : null
        );
    }

    public void updateEntity(DocumentRequestDTO dto, Document document) {
        if (dto == null || document == null) return;

        document.setCode(dto.code());
        document.setType(dto.type());
        document.setTitre(dto.titre());
        document.setDescription(dto.description());
        document.setCheminFichier(dto.cheminFichier());
    }
}