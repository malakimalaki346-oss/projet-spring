package com.example.mini_projet.services;


import com.example.mini_projet.dto.request.FactureRequestDTO;
import com.example.mini_projet.dto.response.FactureResponseDTO;
import com.example.mini_projet.entities.Facture;
import com.example.mini_projet.entities.Phase;
import com.example.mini_projet.exceptions.DuplicateResourceException;
import com.example.mini_projet.exceptions.ResourceNotFoundException;
import com.example.mini_projet.exceptions.ValidationException;
import com.example.mini_projet.mappers.FactureMapper;
import com.example.mini_projet.repositories.FactureRepository;
import com.example.mini_projet.repositories.PhaseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class FactureService {

    private final FactureRepository factureRepository;
    private final PhaseRepository phaseRepository;
    private final FactureMapper factureMapper;

    public FactureService(FactureRepository factureRepository,
                          PhaseRepository phaseRepository,
                          FactureMapper factureMapper) {
        this.factureRepository = factureRepository;
        this.phaseRepository = phaseRepository;
        this.factureMapper = factureMapper;
    }

    public FactureResponseDTO create(FactureRequestDTO requestDTO) {
        // Vérifier que la phase existe
        Phase phase = phaseRepository.findById(requestDTO.phaseId())
                .orElseThrow(() -> new ResourceNotFoundException("Phase non trouvée avec l'id: " + requestDTO.phaseId()));

        // Vérifier que la phase est terminée
        if (!phase.isEstTerminee()) {
            throw new ValidationException("Impossible de facturer une phase non terminée");
        }

        // Vérifier que la phase n'a pas déjà une facture
        if (factureRepository.findByPhaseId(requestDTO.phaseId()).isPresent()) {
            throw new DuplicateResourceException("Une facture existe déjà pour cette phase");
        }

        // Vérifier que le numéro de facture est unique
        if (factureRepository.findByNumeroFacture(requestDTO.numeroFacture()).isPresent()) {
            throw new DuplicateResourceException("Numéro de facture déjà utilisé");
        }

        Facture facture = factureMapper.toEntity(requestDTO);
        facture.setPhase(phase);

        // Marquer la phase comme facturée
        phase.setEstFacturee(true);
        phaseRepository.save(phase);

        Facture saved = factureRepository.save(facture);
        return factureMapper.toResponseDTO(saved);
    }

    public FactureResponseDTO update(Long id, FactureRequestDTO requestDTO) {
        Facture facture = factureRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Facture non trouvée avec l'id: " + id));

        // Vérifier que le numéro de facture est unique si modifié
        if (!facture.getNumeroFacture().equals(requestDTO.numeroFacture()) &&
                factureRepository.findByNumeroFacture(requestDTO.numeroFacture()).isPresent()) {
            throw new DuplicateResourceException("Numéro de facture déjà utilisé");
        }

        factureMapper.updateEntity(requestDTO, facture);
        Facture saved = factureRepository.save(facture);
        return factureMapper.toResponseDTO(saved);
    }

    public FactureResponseDTO findById(Long id) {
        Facture facture = factureRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Facture non trouvée avec l'id: " + id));
        return factureMapper.toResponseDTO(facture);
    }

    public List<FactureResponseDTO> findAll() {
        return factureRepository.findAll().stream()
                .map(factureMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public void delete(Long id) {
        Facture facture = factureRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Facture non trouvée avec l'id: " + id));

        Phase phase = facture.getPhase();
        phase.setEstFacturee(false);
        phaseRepository.save(phase);

        factureRepository.delete(facture);
    }

    public FactureResponseDTO enregistrerPaiement(Long id) {
        Facture facture = factureRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Facture non trouvée avec l'id: " + id));

        facture.setDatePaiement(new java.util.Date());
        Phase phase = facture.getPhase();
        phase.setEstPayee(true);

        phaseRepository.save(phase);
        Facture saved = factureRepository.save(facture);
        return factureMapper.toResponseDTO(saved);
    }
}
