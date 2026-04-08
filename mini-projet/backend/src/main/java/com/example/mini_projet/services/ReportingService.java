package com.example.mini_projet.services;

import com.example.mini_projet.dto.response.PhaseResponseDTO;
import com.example.mini_projet.dto.response.ProjetResponseDTO;
import com.example.mini_projet.dto.response.TableauBordDTO;
import com.example.mini_projet.entities.Phase;
import com.example.mini_projet.entities.Projet;
import com.example.mini_projet.mappers.PhaseMapper;
import com.example.mini_projet.mappers.ProjetMapper;
import com.example.mini_projet.repositories.PhaseRepository;
import com.example.mini_projet.repositories.ProjetRepository;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReportingService {

    private final PhaseRepository phaseRepository;
    private final ProjetRepository projetRepository;
    private final PhaseMapper phaseMapper;
    private final ProjetMapper projetMapper;

    public ReportingService(PhaseRepository phaseRepository,
                            ProjetRepository projetRepository,
                            PhaseMapper phaseMapper,
                            ProjetMapper projetMapper) {
        this.phaseRepository = phaseRepository;
        this.projetRepository = projetRepository;
        this.phaseMapper = phaseMapper;
        this.projetMapper = projetMapper;
    }

    
    public List<PhaseResponseDTO> getPhasesPayees() {
        return phaseRepository.findByEstPayeeAndEstFacturee(true, true).stream()
                .map(phaseMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    
    public List<ProjetResponseDTO> getProjetsEnCours() {
        Date today = new Date();
        return projetRepository.findAll().stream()
                .filter(p -> p.getDateDebut().before(today) && p.getDateFin().after(today))
                .map(projetMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    
    public List<ProjetResponseDTO> getProjetsClotures() {
        Date today = new Date();
        return projetRepository.findAll().stream()
                .filter(p -> p.getDateFin().before(today))
                .map(projetMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    
    public TableauBordDTO getTableauDeBord() {
        Date today = new Date();

        List<Projet> tousProjets = projetRepository.findAll();
        List<Phase> toutesPhases = phaseRepository.findAll();

        long projetsEnCours = tousProjets.stream()
                .filter(p -> p.getDateDebut().before(today) && p.getDateFin().after(today))
                .count();

        long projetsClotures = tousProjets.stream()
                .filter(p -> p.getDateFin().before(today))
                .count();

        long projetsFuturs = tousProjets.stream()
                .filter(p -> p.getDateDebut().after(today))
                .count();

        double montantTotalFacture = toutesPhases.stream()
                .filter(Phase::isEstFacturee)
                .mapToDouble(Phase::getMontant)
                .sum();

        double montantTotalPaye = toutesPhases.stream()
                .filter(Phase::isEstPayee)
                .mapToDouble(Phase::getMontant)
                .sum();

        long phasesTermineesNonFacturees = phaseRepository.findTermineesNonFacturees().size();
        long phasesFactureesNonPayees = phaseRepository.findFactureesNonPayees().size();

        return new TableauBordDTO(
                tousProjets.size(),
                projetsEnCours,
                projetsClotures,
                projetsFuturs,
                toutesPhases.size(),
                phasesTermineesNonFacturees,
                phasesFactureesNonPayees,
                montantTotalFacture,
                montantTotalPaye,
                montantTotalFacture - montantTotalPaye 
        );
    }
}