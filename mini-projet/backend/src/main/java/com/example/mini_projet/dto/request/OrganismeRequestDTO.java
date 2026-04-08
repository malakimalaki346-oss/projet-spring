package com.example.mini_projet.dto.request;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record OrganismeRequestDTO(
        @NotBlank(message = "Le code est obligatoire")
        @Size(min = 3, max = 20, message = "Le code doit contenir entre 3 et 20 caractères")
        String code,

        @NotBlank(message = "Le nom est obligatoire")
        @Size(min = 2, max = 100, message = "Le nom doit contenir entre 2 et 100 caractères")
        String nom,

        String adresse,

        String telephone,

        String contactNom,

        @Email(message = "L'email doit être valide")
        String contactEmail,

        String siteWeb
) {}
