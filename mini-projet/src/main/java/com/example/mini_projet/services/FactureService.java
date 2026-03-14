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
        System.out.println("Création d'une facture...");

        Phase phase = phaseRepository.findById(requestDTO.phaseId())
                .orElseThrow(() -> new ResourceNotFoundException("Phase non trouvée avec l'id: " + requestDTO.phaseId()));

        if (!phase.isEstTerminee()) {
            throw new ValidationException("Impossible de facturer une phase non terminée");
        }

        if (factureRepository.findByPhaseId(requestDTO.phaseId()).isPresent()) {
            throw new DuplicateResourceException("Une facture existe déjà pour cette phase");
        }

        if (factureRepository.findByNumeroFacture(requestDTO.numeroFacture()).isPresent()) {
            throw new DuplicateResourceException("Numéro de facture déjà utilisé");
        }

        Facture facture = factureMapper.toEntity(requestDTO);
        facture.setPhase(phase);
        Facture savedFacture = factureRepository.save(facture);

        phase.setEstFacturee(true);
        phaseRepository.save(phase);

        System.out.println(" Facture créée avec ID: " + savedFacture.getId());
        return factureMapper.toResponseDTO(savedFacture);
    }

    public FactureResponseDTO update(Long id, FactureRequestDTO requestDTO) {
        System.out.println(" Mise à jour facture ID: " + id);

        Facture facture = factureRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Facture non trouvée avec l'id: " + id));

        if (!facture.getNumeroFacture().equals(requestDTO.numeroFacture()) &&
                factureRepository.findByNumeroFacture(requestDTO.numeroFacture()).isPresent()) {
            throw new DuplicateResourceException("Numéro de facture déjà utilisé");
        }

        factureMapper.updateEntity(requestDTO, facture);
        Facture savedFacture = factureRepository.save(facture);

        System.out.println(" Facture mise à jour");
        return factureMapper.toResponseDTO(savedFacture);
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

    @Transactional
    public void delete(Long id) {
        System.out.println(" ATTENTION : Méthode delete appelée avec id = " + id);

        Facture facture = factureRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Facture non trouvée avec l'id: " + id));

        System.out.println(" Facture trouvée : " + facture.getNumeroFacture());

        Phase phase = facture.getPhase();
        if (phase != null) {
            System.out.println("Phase associée ID: " + phase.getId());
            phase.setEstFacturee(false);
            phaseRepository.save(phase);
            System.out.println("Phase mise à jour");
        }

        System.out.println(" Tentative de suppression...");
        factureRepository.delete(facture);
        System.out.println(" Suppression exécutée");

        
        boolean exists = factureRepository.existsById(id);
        System.out.println(" La facture existe encore ? " + exists);

        

    }

    public FactureResponseDTO enregistrerPaiement(Long id) {
        System.out.println(" Enregistrement paiement facture ID: " + id);

        Facture facture = factureRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Facture non trouvée avec l'id: " + id));

        facture.setDatePaiement(new java.util.Date());
        Phase phase = facture.getPhase();
        phase.setEstPayee(true);
        phaseRepository.save(phase);

        Facture savedFacture = factureRepository.save(facture);

        System.out.println(" Paiement enregistré");
        return factureMapper.toResponseDTO(savedFacture);
    }
}