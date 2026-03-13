package com.example.mini_projet.dto.response;


import java.util.Date;

public record AffectationResponseDTO(
        Long employeId,
        Long phaseId,
        String employeNom,
        String employePrenom,
        String employeMatricule,
        String phaseLibelle,
        String phaseCode,
        String projetNom,
        Date dateDebut,
        Date dateFin,
        String role
) {}
