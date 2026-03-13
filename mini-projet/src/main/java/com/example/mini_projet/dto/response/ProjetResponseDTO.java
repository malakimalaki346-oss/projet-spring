package com.example.mini_projet.dto.response;


import java.util.Date;

public record ProjetResponseDTO(
        Long id,
        String code,
        String nom,
        String description,
        Date dateDebut,
        Date dateFin,
        Double montantGlobal,
        String organismeNom,
        String organismeCode,
        String chefProjetNom,
        String chefProjetPrenom,
        Long chefProjetId,
        Integer nombrePhases,
        Double montantTotalPhases,
        Double pourcentageRealisation
) {}