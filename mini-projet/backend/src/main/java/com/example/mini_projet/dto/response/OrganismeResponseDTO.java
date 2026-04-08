package com.example.mini_projet.dto.response;


public record OrganismeResponseDTO(
        Long id,
        String code,
        String nom,
        String adresse,
        String telephone,
        String contactNom,
        String contactEmail,
        String siteWeb,
        Integer nombreProjets
) {}
