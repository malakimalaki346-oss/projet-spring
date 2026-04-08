package com.example.mini_projet.dto.response;

public record TableauBordDTO(
        long totalProjets,
        long projetsEnCours,
        long projetsClotures,
        long projetsFuturs,
        long totalPhases,
        long phasesTermineesNonFacturees,
        long phasesFactureesNonPayees,
        double montantTotalFacture,
        double montantTotalPaye,
        double creances
) {}