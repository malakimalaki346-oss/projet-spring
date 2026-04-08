package com.example.mini_projet.dto.response;


import java.util.Date;

public record PhaseResponseDTO(
        Long id,
        String code,
        String libelle,
        String description,
        Date dateDebut,
        Date dateFin,
        Double pourcentage,
        Double montant,
        boolean estTerminee,
        boolean estFacturee,
        boolean estPayee,
        Long projetId,
        String projetNom,
        Integer nombreEmployes,
        Integer nombreLivrables
) {}