package com.example.mini_projet.services;


import com.example.mini_projet.dto.request.PhaseRequestDTO;
import com.example.mini_projet.dto.response.PhaseResponseDTO;
import com.example.mini_projet.entities.Phase;
import com.example.mini_projet.entities.Projet;
import com.example.mini_projet.exceptions.ResourceNotFoundException;
import com.example.mini_projet.exceptions.ValidationException;
import com.example.mini_projet.mappers.PhaseMapper;
import com.example.mini_projet.repositories.PhaseRepository;
import com.example.mini_projet.repositories.ProjetRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class PhaseService {

    private final PhaseRepository phaseRepository;
    private final ProjetRepository projetRepository;
    private final PhaseMapper phaseMapper;

    public PhaseService(PhaseRepository phaseRepository,
                        ProjetRepository projetRepository,
                        PhaseMapper phaseMapper) {
        this.phaseRepository = phaseRepository;
        this.projetRepository = projetRepository;
        this.phaseMapper = phaseMapper;
    }

    public PhaseResponseDTO create(Long projetId, PhaseRequestDTO requestDTO) {
        Projet projet = projetRepository.findById(projetId)
                .orElseThrow(() -> new ResourceNotFoundException("Projet non trouvé avec l'id: " + projetId));

        
        if (requestDTO.dateDebut().before(projet.getDateDebut()) ||
                requestDTO.dateFin().after(projet.getDateFin())) {
            throw new ValidationException("Les dates de la phase doivent être comprises dans les dates du projet");
        }

        
        Double montantPhase = (requestDTO.pourcentage() / 100.0) * projet.getMontantGlobal();

        
        Double montantTotalPhases = calculerMontantTotalPhases(projet);
        if (montantTotalPhases + montantPhase > projet.getMontantGlobal()) {
            throw new ValidationException("Le montant total des phases ne peut pas dépasser le montant du projet");
        }

        Phase phase = phaseMapper.toEntity(requestDTO);
        phase.setProjet(projet);
        phase.setMontant(montantPhase);

        Phase saved = phaseRepository.save(phase);
        return phaseMapper.toResponseDTO(saved);
    }

    public PhaseResponseDTO update(Long id, PhaseRequestDTO requestDTO) {
        Phase phase = phaseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Phase non trouvée avec l'id: " + id));

        Projet projet = phase.getProjet();

        
        if (requestDTO.dateDebut().before(projet.getDateDebut()) ||
                requestDTO.dateFin().after(projet.getDateFin())) {
            throw new ValidationException("Les dates de la phase doivent être comprises dans les dates du projet");
        }

        
        Double nouveauMontant = (requestDTO.pourcentage() / 100.0) * projet.getMontantGlobal();

        
        Double montantAutresPhases = phaseRepository.sumMontantPhasesByProjet(projet.getId()) - phase.getMontant();
        if (montantAutresPhases + nouveauMontant > projet.getMontantGlobal()) {
            throw new ValidationException("Le montant total des phases ne peut pas dépasser le montant du projet");
        }

        phaseMapper.updateEntity(requestDTO, phase);
        phase.setMontant(nouveauMontant);

        Phase saved = phaseRepository.save(phase);
        return phaseMapper.toResponseDTO(saved);
    }

    public PhaseResponseDTO findById(Long id) {
        Phase phase = phaseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Phase non trouvée avec l'id: " + id));
        return phaseMapper.toResponseDTO(phase);
    }

    public List<PhaseResponseDTO> findByProjet(Long projetId) {
        return phaseRepository.findByProjetId(projetId).stream()
                .map(phaseMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public PhaseResponseDTO updateEtatRealisation(Long id, boolean terminee) {
        Phase phase = phaseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Phase non trouvée avec l'id: " + id));

        phase.setEstTerminee(terminee);
        Phase saved = phaseRepository.save(phase);
        return phaseMapper.toResponseDTO(saved);
    }

    public PhaseResponseDTO updateEtatFacturation(Long id, boolean facturee) {
        Phase phase = phaseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Phase non trouvée avec l'id: " + id));

        phase.setEstFacturee(facturee);
        Phase saved = phaseRepository.save(phase);
        return phaseMapper.toResponseDTO(saved);
    }

    public PhaseResponseDTO updateEtatPaiement(Long id, boolean payee) {
        Phase phase = phaseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Phase non trouvée avec l'id: " + id));

        phase.setEstPayee(payee);
        Phase saved = phaseRepository.save(phase);
        return phaseMapper.toResponseDTO(saved);
    }

    public void delete(Long id) {
        Phase phase = phaseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Phase non trouvée avec l'id: " + id));

        
        if (phase.getAffectations() != null && !phase.getAffectations().isEmpty()) {
            throw new ValidationException("Impossible de supprimer: la phase a des employés affectés");
        }

        if (phase.getLivrables() != null && !phase.getLivrables().isEmpty()) {
            throw new ValidationException("Impossible de supprimer: la phase a des livrables associés");
        }

        phaseRepository.delete(phase);
    }

    private Double calculerMontantTotalPhases(Projet projet) {
        if (projet.getPhases() == null) return 0.0;
        return projet.getPhases().stream()
                .mapToDouble(Phase::getMontant)
                .sum();
    }

    public List<PhaseResponseDTO> findTermineesNonFacturees() {
        return phaseRepository.findTermineesNonFacturees().stream()
                .map(phaseMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public List<PhaseResponseDTO> findFactureesNonPayees() {
        return phaseRepository.findFactureesNonPayees().stream()
                .map(phaseMapper::toResponseDTO)
                .collect(Collectors.toList());
    }
}