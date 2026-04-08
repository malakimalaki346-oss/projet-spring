package com.example.mini_projet.dto.request;


import jakarta.validation.constraints.NotNull;
import java.util.Date;

public record AffectationRequestDTO(
        @NotNull(message = "La date de début est obligatoire")
        Date dateDebut,

        @NotNull(message = "La date de fin est obligatoire")
        Date dateFin,

        String role
) {}