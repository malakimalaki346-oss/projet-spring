package com.example.mini_projet.dto.request;


import jakarta.validation.constraints.NotBlank;

public record LivrableRequestDTO(
        @NotBlank(message = "Le code est obligatoire")
        String code,

        @NotBlank(message = "Le libellé est obligatoire")
        String libelle,

        String description,

        String cheminFichier
) {}