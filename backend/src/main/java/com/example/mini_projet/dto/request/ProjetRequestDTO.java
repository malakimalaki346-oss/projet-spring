package com.example.mini_projet.dto.request;


import jakarta.validation.constraints.*;
import java.util.Date;

public record ProjetRequestDTO(
        @NotBlank(message = "Le code est obligatoire")
        @Size(min = 3, max = 20, message = "Le code doit contenir entre 3 et 20 caractères")
        String code,

        @NotBlank(message = "Le nom est obligatoire")
        String nom,

        String description,

        @NotNull(message = "La date de début est obligatoire")
        @FutureOrPresent(message = "La date de début doit être dans le présent ou le futur")
        Date dateDebut,

        @NotNull(message = "La date de fin est obligatoire")
        @Future(message = "La date de fin doit être dans le futur")
        Date dateFin,

        @NotNull(message = "Le montant global est obligatoire")
        @Positive(message = "Le montant doit être positif")
        Double montantGlobal,

        @NotNull(message = "L'organisme est obligatoire")
        Long organismeId,

        @NotNull(message = "Le chef de projet est obligatoire")
        Long chefProjetId
) {}
