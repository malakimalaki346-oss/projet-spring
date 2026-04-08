package com.example.mini_projet.dto.response;


import java.util.Date;
import java.util.List;

public record ProjetResumeDTO(
        Long id,
        String code,
        String nom,
        String description,
        Date dateDebut,
        Date dateFin,
        Double montantGlobal,
        String organismeNom,
        String chefProjetNomComplet,
        Integer nombrePhases,
        Integer phasesTerminees,
        Double montantFacture,
        Double montantPaye,
        List<PhaseResumeDTO> phases,
        List<String> documentsPrincipaux
) {}
