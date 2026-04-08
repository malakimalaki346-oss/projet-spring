package com.example.mini_projet.services;


import com.example.mini_projet.dto.request.AffectationRequestDTO;
import com.example.mini_projet.dto.response.AffectationResponseDTO;
import com.example.mini_projet.entities.Affectation;
import com.example.mini_projet.entities.AffectationId;
import com.example.mini_projet.entities.Employe;
import com.example.mini_projet.entities.Phase;
import com.example.mini_projet.exceptions.ResourceNotFoundException;
import com.example.mini_projet.exceptions.ValidationException;
import com.example.mini_projet.mappers.AffectationMapper;
import com.example.mini_projet.repositories.AffectationRepository;
import com.example.mini_projet.repositories.EmployeRepository;
import com.example.mini_projet.repositories.PhaseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AffectationService {

    private final AffectationRepository affectationRepository;
    private final EmployeRepository employeRepository;
    private final PhaseRepository phaseRepository;
    private final AffectationMapper affectationMapper;

    public AffectationService(AffectationRepository affectationRepository,
                              EmployeRepository employeRepository,
                              PhaseRepository phaseRepository,
                              AffectationMapper affectationMapper) {
        this.affectationRepository = affectationRepository;
        this.employeRepository = employeRepository;
        this.phaseRepository = phaseRepository;
        this.affectationMapper = affectationMapper;
    }

    public AffectationResponseDTO affecterEmployeAPhase(Long phaseId, Long employeId, AffectationRequestDTO requestDTO) {
        
        Phase phase = phaseRepository.findById(phaseId)
                .orElseThrow(() -> new ResourceNotFoundException("Phase non trouvée avec l'id: " + phaseId));

        
        Employe employe = employeRepository.findById(employeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employé non trouvé avec l'id: " + employeId));

        
        if (requestDTO.dateDebut().before(phase.getDateDebut()) ||
                requestDTO.dateFin().after(phase.getDateFin())) {
            throw new ValidationException("Les dates d'affectation doivent être comprises dans les dates de la phase");
        }

        
        boolean estDisponible = !affectationRepository.estEmployeOccupeSurPeriode(
                employeId, requestDTO.dateDebut(), requestDTO.dateFin());

        if (!estDisponible) {
            throw new ValidationException("L'employé n'est pas disponible sur cette période");
        }

        
        AffectationId id = new AffectationId(employeId, phaseId);
        if (affectationRepository.existsById(id)) {
            throw new ValidationException("Cet employé est déjà affecté à cette phase");
        }

        
        Affectation affectation = affectationMapper.toEntity(requestDTO);
        affectation.setId(id);
        affectation.setEmploye(employe);
        affectation.setPhase(phase);

        Affectation saved = affectationRepository.save(affectation);
        return affectationMapper.toResponseDTO(saved);
    }

    public AffectationResponseDTO updateAffectation(Long phaseId, Long employeId, AffectationRequestDTO requestDTO) {
        AffectationId id = new AffectationId(employeId, phaseId);
        Affectation affectation = affectationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Affectation non trouvée"));

        Phase phase = affectation.getPhase();

        
        if (requestDTO.dateDebut().before(phase.getDateDebut()) ||
                requestDTO.dateFin().after(phase.getDateFin())) {
            throw new ValidationException("Les dates d'affectation doivent être comprises dans les dates de la phase");
        }

        affectationMapper.updateEntity(requestDTO, affectation);
        Affectation saved = affectationRepository.save(affectation);
        return affectationMapper.toResponseDTO(saved);
    }

    public List<AffectationResponseDTO> findAffectationsByPhase(Long phaseId) {
        return affectationRepository.findByPhaseId(phaseId).stream()
                .map(affectationMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public List<AffectationResponseDTO> findAffectationsByEmploye(Long employeId) {
        return affectationRepository.findByEmployeId(employeId).stream()
                .map(affectationMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public AffectationResponseDTO findAffectation(Long phaseId, Long employeId) {
        AffectationId id = new AffectationId(employeId, phaseId);
        Affectation affectation = affectationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Affectation non trouvée"));
        return affectationMapper.toResponseDTO(affectation);
    }

    public void desaffecterEmploye(Long phaseId, Long employeId) {
        AffectationId id = new AffectationId(employeId, phaseId);
        if (!affectationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Affectation non trouvée");
        }
        affectationRepository.deleteById(id);
    }
}
