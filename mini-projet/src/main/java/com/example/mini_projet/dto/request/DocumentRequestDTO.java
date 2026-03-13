package com.example.mini_projet.dto.request;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record DocumentRequestDTO(
        @NotBlank(message = "Le code est obligatoire")
        String code,

        @NotBlank(message = "Le type est obligatoire")
        String type,

        @NotBlank(message = "Le titre est obligatoire")
        String titre,

        String description,

        String cheminFichier,

        @NotNull(message = "L'ID du projet est obligatoire")
        Long projetId
) {}
