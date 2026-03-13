package com.example.mini_projet.dto.request;


import jakarta.validation.constraints.*;
import java.util.Date;

public record PhaseRequestDTO(
        @NotBlank(message = "Le code est obligatoire")
        String code,

        @NotBlank(message = "Le libellé est obligatoire")
        String libelle,

        String description,

        @NotNull(message = "La date de début est obligatoire")
        Date dateDebut,

        @NotNull(message = "La date de fin est obligatoire")
        Date dateFin,

        @NotNull(message = "Le pourcentage est obligatoire")
        @Min(value = 0, message = "Le pourcentage doit être entre 0 et 100")
        @Max(value = 100, message = "Le pourcentage doit être entre 0 et 100")
        Double pourcentage
) {}
