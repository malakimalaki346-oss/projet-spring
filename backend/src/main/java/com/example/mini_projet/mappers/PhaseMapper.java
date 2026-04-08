package com.example.mini_projet.mappers;

import com.example.mini_projet.dto.request.PhaseRequestDTO;
import com.example.mini_projet.dto.response.PhaseResponseDTO;
import com.example.mini_projet.dto.response.PhaseResumeDTO;
import com.example.mini_projet.entities.Phase;
import com.example.mini_projet.entities.Projet;
import com.example.mini_projet.repositories.ProjetRepository;
import org.springframework.stereotype.Component;

@Component
public class PhaseMapper {

    private final ProjetRepository projetRepository;

    public PhaseMapper(ProjetRepository projetRepository) {
        this.projetRepository = projetRepository;
    }

    public Phase toEntity(PhaseRequestDTO dto) {
        if (dto == null) return null;

        Phase phase = new Phase();
        phase.setCode(dto.code());
        phase.setLibelle(dto.libelle());
        phase.setDescription(dto.description());
        phase.setDateDebut(dto.dateDebut());
        phase.setDateFin(dto.dateFin());
        phase.setPourcentage(dto.pourcentage());

        return phase;
    }

    public PhaseResponseDTO toResponseDTO(Phase phase) {
        if (phase == null) return null;

        return new PhaseResponseDTO(
                phase.getId(),
                phase.getCode(),
                phase.getLibelle(),
                phase.getDescription(),
                phase.getDateDebut(),
                phase.getDateFin(),
                phase.getPourcentage(),
                phase.getMontant(),
                phase.isEstTerminee(),
                phase.isEstFacturee(),
                phase.isEstPayee(),
                phase.getProjet() != null ? phase.getProjet().getId() : null,
                phase.getProjet() != null ? phase.getProjet().getNom() : null,
                phase.getAffectations() != null ? phase.getAffectations().size() : 0,
                phase.getLivrables() != null ? phase.getLivrables().size() : 0
        );
    }

    public PhaseResumeDTO toResumeDTO(Phase phase) {
        if (phase == null) return null;

        String etat = "En cours";
        if (phase.isEstPayee()) etat = "Payée";
        else if (phase.isEstFacturee()) etat = "Facturée";
        else if (phase.isEstTerminee()) etat = "Terminée";

        return new PhaseResumeDTO(
                phase.getId(),
                phase.getCode(),
                phase.getLibelle(),
                phase.getDateDebut(),
                phase.getDateFin(),
                phase.getMontant(),
                etat
        );
    }

    public void updateEntity(PhaseRequestDTO dto, Phase phase) {
        if (dto == null || phase == null) return;

        phase.setCode(dto.code());
        phase.setLibelle(dto.libelle());
        phase.setDescription(dto.description());
        phase.setDateDebut(dto.dateDebut());
        phase.setDateFin(dto.dateFin());
        phase.setPourcentage(dto.pourcentage());
    }
}