package com.example.mini_projet.dto.request;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record EmployeRequestDTO(
        @NotBlank(message = "Le matricule est obligatoire")
        @Size(min = 3, max = 20, message = "Le matricule doit contenir entre 3 et 20 caractères")
        String matricule,

        @NotBlank(message = "Le nom est obligatoire")
        String nom,

        @NotBlank(message = "Le prénom est obligatoire")
        String prenom,

        String telephone,

        @NotBlank(message = "L'email est obligatoire")
        @Email(message = "L'email doit être valide")
        String email,

        @NotBlank(message = "Le login est obligatoire")
        String login,

        @NotBlank(message = "Le mot de passe est obligatoire")
        @Size(min = 6, message = "Le mot de passe doit contenir au moins 6 caractères")
        String password,

        @NotNull(message = "Le profil est obligatoire")
        Long profilId
) {}
