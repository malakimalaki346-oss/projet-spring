package com.example.mini_projet.dto.response;


public record LivrableResponseDTO(
        Long id,
        String code,
        String libelle,
        String description,
        String cheminFichier,
        Long phaseId,
        String phaseLibelle,
        String projetNom
) {}