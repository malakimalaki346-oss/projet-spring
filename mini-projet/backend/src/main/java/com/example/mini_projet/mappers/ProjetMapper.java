package com.example.mini_projet.mappers;

import com.example.mini_projet.dto.request.ProjetRequestDTO;
import com.example.mini_projet.dto.response.ProjetResponseDTO;
import com.example.mini_projet.dto.response.ProjetResumeDTO;
import com.example.mini_projet.dto.response.PhaseResumeDTO;
import com.example.mini_projet.entities.Employe;
import com.example.mini_projet.entities.Organisme;
import com.example.mini_projet.entities.Projet;
import com.example.mini_projet.entities.Phase;
import com.example.mini_projet.repositories.EmployeRepository;
import com.example.mini_projet.repositories.OrganismeRepository;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class ProjetMapper {

    private final OrganismeRepository organismeRepository;
    private final EmployeRepository employeRepository;
    private final PhaseMapper phaseMapper;

    public ProjetMapper(OrganismeRepository organismeRepository,
                        EmployeRepository employeRepository,
                        PhaseMapper phaseMapper) {
        this.organismeRepository = organismeRepository;
        this.employeRepository = employeRepository;
        this.phaseMapper = phaseMapper;
    }

    public Projet toEntity(ProjetRequestDTO dto) {
        if (dto == null) return null;

        Projet projet = new Projet();
        projet.setCode(dto.code());
        projet.setNom(dto.nom());
        projet.setDescription(dto.description());
        projet.setDateDebut(dto.dateDebut());
        projet.setDateFin(dto.dateFin());
        projet.setMontantGlobal(dto.montantGlobal());

        return projet;
    }

    public ProjetResponseDTO toResponseDTO(Projet projet) {
        if (projet == null) return null;

        Double montantTotalPhases = 0.0;
        Integer nombrePhases = 0;

        if (projet.getPhases() != null) {
            nombrePhases = projet.getPhases().size();
            montantTotalPhases = projet.getPhases().stream()
                    .mapToDouble(p -> p.getMontant() != null ? p.getMontant() : 0.0)
                    .sum();
        }

        Double pourcentageRealisation = 0.0;
        if (nombrePhases > 0 && projet.getPhases() != null) {
            long phasesTerminees = projet.getPhases().stream()
                    .filter(Phase::isEstTerminee)
                    .count();
            pourcentageRealisation = (phasesTerminees * 100.0) / nombrePhases;
        }

        return new ProjetResponseDTO(
                projet.getId(),
                projet.getCode(),
                projet.getNom(),
                projet.getDescription(),
                projet.getDateDebut(),
                projet.getDateFin(),
                projet.getMontantGlobal(),
                projet.getOrganisme() != null ? projet.getOrganisme().getNom() : null,
                projet.getOrganisme() != null ? projet.getOrganisme().getCode() : null,
                projet.getChefProjet() != null ? projet.getChefProjet().getNom() : null,
                projet.getChefProjet() != null ? projet.getChefProjet().getPrenom() : null,
                projet.getChefProjet() != null ? projet.getChefProjet().getId() : null,
                nombrePhases,
                montantTotalPhases,
                pourcentageRealisation
        );
    }

    public ProjetResumeDTO toResumeDTO(Projet projet) {
        if (projet == null) return null;

        Integer nombrePhases = projet.getPhases() != null ? projet.getPhases().size() : 0;
        Integer phasesTerminees = 0;
        Double montantFacture = 0.0;
        Double montantPaye = 0.0;

        if (projet.getPhases() != null) {
            phasesTerminees = (int) projet.getPhases().stream()
                    .filter(Phase::isEstTerminee)
                    .count();

            montantFacture = projet.getPhases().stream()
                    .filter(Phase::isEstFacturee)
                    .mapToDouble(p -> p.getMontant() != null ? p.getMontant() : 0.0)
                    .sum();

            montantPaye = projet.getPhases().stream()
                    .filter(Phase::isEstPayee)
                    .mapToDouble(p -> p.getMontant() != null ? p.getMontant() : 0.0)
                    .sum();
        }

        return new ProjetResumeDTO(
                projet.getId(),
                projet.getCode(),
                projet.getNom(),
                projet.getDescription(),
                projet.getDateDebut(),
                projet.getDateFin(),
                projet.getMontantGlobal(),
                projet.getOrganisme() != null ? projet.getOrganisme().getNom() : null,
                projet.getChefProjet() != null ?
                        projet.getChefProjet().getPrenom() + " " + projet.getChefProjet().getNom() : null,
                nombrePhases,
                phasesTerminees,
                montantFacture,
                montantPaye,
                projet.getPhases() != null ?
                        projet.getPhases().stream()
                                .map(phaseMapper::toResumeDTO)
                                .collect(Collectors.toList()) : null,
                projet.getDocuments() != null ?
                        projet.getDocuments().stream()
                                .limit(5)
                                .map(d -> d.getTitre())
                                .collect(Collectors.toList()) : null
        );
    }

    public void updateEntity(ProjetRequestDTO dto, Projet projet) {
        if (dto == null || projet == null) return;

        projet.setCode(dto.code());
        projet.setNom(dto.nom());
        projet.setDescription(dto.description());
        projet.setDateDebut(dto.dateDebut());
        projet.setDateFin(dto.dateFin());
        projet.setMontantGlobal(dto.montantGlobal());
    }
}