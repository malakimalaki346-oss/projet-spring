package com.example.mini_projet.services;



import com.example.mini_projet.dto.request.ProjetRequestDTO;
import com.example.mini_projet.dto.response.ProjetResponseDTO;
import com.example.mini_projet.dto.response.ProjetResumeDTO;
import com.example.mini_projet.entities.Employe;
import com.example.mini_projet.entities.Organisme;
import com.example.mini_projet.entities.Projet;
import com.example.mini_projet.exceptions.DuplicateResourceException;
import com.example.mini_projet.exceptions.ResourceNotFoundException;
import com.example.mini_projet.exceptions.ValidationException;
import com.example.mini_projet.mappers.ProjetMapper;
import com.example.mini_projet.repositories.EmployeRepository;
import com.example.mini_projet.repositories.OrganismeRepository;
import com.example.mini_projet.repositories.ProjetRepository;
import com.example.mini_projet.repositories.PhaseRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProjetService {

    private final ProjetRepository projetRepository;
    private final PhaseRepository phaseRepository;
    private final EmployeRepository employeRepository;
    private final OrganismeRepository organismeRepository;
    private final ProjetMapper projetMapper;

    public ProjetService(ProjetRepository projetRepository,
                         PhaseRepository phaseRepository,
                         EmployeRepository employeRepository,
                         OrganismeRepository organismeRepository,
                         ProjetMapper projetMapper) {
        this.projetRepository = projetRepository;
        this.phaseRepository = phaseRepository;
        this.employeRepository = employeRepository;
        this.organismeRepository = organismeRepository;
        this.projetMapper = projetMapper;
    }

    public ProjetResponseDTO create(ProjetRequestDTO requestDTO) {
        
        if (projetRepository.findByCode(requestDTO.code()).isPresent()) {
            throw new DuplicateResourceException("Code projet déjà utilisé");
        }

        
        if (requestDTO.dateDebut().after(requestDTO.dateFin())) {
            throw new ValidationException("La date de début doit être antérieure à la date de fin");
        }

        
        Organisme organisme = organismeRepository.findById(requestDTO.organismeId())
                .orElseThrow(() -> new ResourceNotFoundException("Organisme non trouvé avec l'id: " + requestDTO.organismeId()));

        
        Employe chefProjet = employeRepository.findById(requestDTO.chefProjetId())
                .orElseThrow(() -> new ResourceNotFoundException("Chef de projet non trouvé avec l'id: " + requestDTO.chefProjetId()));

        
        if (!chefProjet.getProfil().getCode().equals("CHEF_PROJET") &&
                !chefProjet.getProfil().getCode().equals("DIRECTEUR")) {
            throw new ValidationException("L'employé doit avoir le profil Chef de Projet ou Directeur");
        }

        Projet projet = projetMapper.toEntity(requestDTO);
        projet.setOrganisme(organisme);
        projet.setChefProjet(chefProjet);

        Projet saved = projetRepository.save(projet);
        return projetMapper.toResponseDTO(saved);
    }

    public ProjetResponseDTO update(Long id, ProjetRequestDTO requestDTO) {
        Projet projet = projetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Projet non trouvé avec l'id: " + id));

        
        if (!projet.getCode().equals(requestDTO.code()) &&
                projetRepository.findByCode(requestDTO.code()).isPresent()) {
            throw new DuplicateResourceException("Code projet déjà utilisé");
        }

        
        if (requestDTO.dateDebut().after(requestDTO.dateFin())) {
            throw new ValidationException("La date de début doit être antérieure à la date de fin");
        }

        
        Organisme organisme = organismeRepository.findById(requestDTO.organismeId())
                .orElseThrow(() -> new ResourceNotFoundException("Organisme non trouvé avec l'id: " + requestDTO.organismeId()));

        
        Employe chefProjet = employeRepository.findById(requestDTO.chefProjetId())
                .orElseThrow(() -> new ResourceNotFoundException("Chef de projet non trouvé avec l'id: " + requestDTO.chefProjetId()));

        projetMapper.updateEntity(requestDTO, projet);
        projet.setOrganisme(organisme);
        projet.setChefProjet(chefProjet);

        Projet saved = projetRepository.save(projet);
        return projetMapper.toResponseDTO(saved);
    }

    public ProjetResponseDTO findById(Long id) {
        Projet projet = projetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Projet non trouvé avec l'id: " + id));
        return projetMapper.toResponseDTO(projet);
    }

    public ProjetResumeDTO getResume(Long id) {
        Projet projet = projetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Projet non trouvé avec l'id: " + id));
        return projetMapper.toResumeDTO(projet);
    }

    public List<ProjetResponseDTO> findAll() {
        return projetRepository.findAll().stream()
                .map(projetMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public Page<ProjetResponseDTO> findAll(Pageable pageable) {
        return projetRepository.findAll(pageable)
                .map(projetMapper::toResponseDTO);
    }

    public List<ProjetResponseDTO> findByChefProjet(Long chefId) {
        return projetRepository.findByChefProjetId(chefId).stream()
                .map(projetMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public List<ProjetResponseDTO> findByOrganisme(Long organismeId) {
        return projetRepository.findByOrganismeId(organismeId).stream()
                .map(projetMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public void delete(Long id) {
        Projet projet = projetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Projet non trouvé avec l'id: " + id));

        
        if (projet.getPhases() != null && !projet.getPhases().isEmpty()) {
            throw new ValidationException("Impossible de supprimer: le projet a des phases associées");
        }

        projetRepository.delete(projet);
    }

    public Double calculerMontantTotalPhases(Long projetId) {
        Double montant = phaseRepository.sumMontantPhasesByProjet(projetId);
        return montant != null ? montant : 0.0;
    }

    public boolean verifierMontantPhases(Long projetId) {
        Double montantPhases = calculerMontantTotalPhases(projetId);
        Projet projet = projetRepository.findById(projetId).orElse(null);
        return projet != null && montantPhases <= projet.getMontantGlobal();
    }
}