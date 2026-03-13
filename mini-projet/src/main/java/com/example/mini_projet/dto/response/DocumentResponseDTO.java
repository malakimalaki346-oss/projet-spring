package com.example.mini_projet.dto.response;


import java.util.Date;

public record DocumentResponseDTO(
        Long id,
        String code,
        String type,
        String titre,
        String description,
        String cheminFichier,
        Date dateUpload,
        Long projetId,
        String projetNom
) {}