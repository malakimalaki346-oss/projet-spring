package com.example.mini_projet.mappers;

import com.example.mini_projet.dto.request.DocumentRequestDTO;
import com.example.mini_projet.dto.response.DocumentResponseDTO;
import com.example.mini_projet.entities.Document;
import org.springframework.stereotype.Component;

@Component
public class DocumentMapper {

    public Document toEntity(DocumentRequestDTO dto) {
        if (dto == null) return null;

        Document document = new Document();
        document.setCode(dto.getCode());
        document.setType(dto.getType());
        document.setTitre(dto.getTitre());
        document.setDescription(dto.getDescription());
        document.setCheminFichier(dto.getCheminFichier());

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

        document.setCode(dto.getCode());
        document.setType(dto.getType());
        document.setTitre(dto.getTitre());
        document.setDescription(dto.getDescription());
        document.setCheminFichier(dto.getCheminFichier());
    }
}