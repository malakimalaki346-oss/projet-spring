package com.example.mini_projet.mappers;

import com.example.mini_projet.dto.request.AffectationRequestDTO;
import com.example.mini_projet.dto.response.AffectationResponseDTO;
import com.example.mini_projet.entities.Affectation;
import org.springframework.stereotype.Component;

@Component
public class AffectationMapper {

    public Affectation toEntity(AffectationRequestDTO dto) {
        if (dto == null) return null;

        Affectation affectation = new Affectation();
        affectation.setDateDebut(dto.dateDebut());
        affectation.setDateFin(dto.dateFin());
        affectation.setRole(dto.role());

        return affectation;
    }

    public AffectationResponseDTO toResponseDTO(Affectation affectation) {
        if (affectation == null) return null;

        return new AffectationResponseDTO(
                affectation.getEmploye() != null ? affectation.getEmploye().getId() : null,
                affectation.getPhase() != null ? affectation.getPhase().getId() : null,
                affectation.getEmploye() != null ? affectation.getEmploye().getNom() : null,
                affectation.getEmploye() != null ? affectation.getEmploye().getPrenom() : null,
                affectation.getEmploye() != null ? affectation.getEmploye().getMatricule() : null,
                affectation.getPhase() != null ? affectation.getPhase().getLibelle() : null,
                affectation.getPhase() != null ? affectation.getPhase().getCode() : null,
                affectation.getPhase() != null && affectation.getPhase().getProjet() != null ?
                        affectation.getPhase().getProjet().getNom() : null,
                affectation.getDateDebut(),
                affectation.getDateFin(),
                affectation.getRole()
        );
    }

    public void updateEntity(AffectationRequestDTO dto, Affectation affectation) {
        if (dto == null || affectation == null) return;

        affectation.setDateDebut(dto.dateDebut());
        affectation.setDateFin(dto.dateFin());
        affectation.setRole(dto.role());
    }
}