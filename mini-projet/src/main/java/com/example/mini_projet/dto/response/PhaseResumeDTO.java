package com.example.mini_projet.dto.response;


import java.util.Date;

public record PhaseResumeDTO(
        Long id,
        String code,
        String libelle,
        Date dateDebut,
        Date dateFin,
        Double montant,
        String etat
) {}