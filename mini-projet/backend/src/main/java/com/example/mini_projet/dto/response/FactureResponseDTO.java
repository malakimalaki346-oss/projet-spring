package com.example.mini_projet.dto.response;


import java.util.Date;

public record FactureResponseDTO(
        Long id,
        String numeroFacture,
        Date dateFacture,
        Date datePaiement,
        Double montant,
        Long phaseId,
        String phaseLibelle,
        String projetNom,
        String clientNom,
        boolean estPayee
) {}
