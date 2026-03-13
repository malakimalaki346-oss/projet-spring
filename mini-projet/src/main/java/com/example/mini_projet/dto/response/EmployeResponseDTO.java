package com.example.mini_projet.dto.response;


public record EmployeResponseDTO(
        Long id,
        String matricule,
        String nom,
        String prenom,
        String telephone,
        String email,
        String login,
        String profilCode,
        String profilLibelle,
        Integer nombreProjetsDiriges,
        Integer nombreAffectations
) {}