package com.example.mini_projet.dto.request;


import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.util.Date;

public record FactureRequestDTO(
        @NotNull(message = "Le numéro de facture est obligatoire")
        String numeroFacture,

        @NotNull(message = "La date de facture est obligatoire")
        Date dateFacture,

        Date datePaiement,

        @NotNull(message = "Le montant est obligatoire")
        @Positive(message = "Le montant doit être positif")
        Double montant,

        @NotNull(message = "L'ID de la phase est obligatoire")
        Long phaseId
) {}