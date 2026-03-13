package com.example.mini_projet.services;


import com.example.mini_projet.dto.request.OrganismeRequestDTO;
import com.example.mini_projet.dto.response.OrganismeResponseDTO;
import com.example.mini_projet.entities.Organisme;
import com.example.mini_projet.exceptions.DuplicateResourceException;
import com.example.mini_projet.exceptions.ResourceInUseException;
import com.example.mini_projet.exceptions.ResourceNotFoundException;
import com.example.mini_projet.mappers.OrganismeMapper;
import com.example.mini_projet.repositories.OrganismeRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrganismeService {

    private final OrganismeRepository organismeRepository;
    private final OrganismeMapper organismeMapper;

    public OrganismeService(OrganismeRepository organismeRepository, OrganismeMapper organismeMapper) {
        this.organismeRepository = organismeRepository;
        this.organismeMapper = organismeMapper;
    }

    public OrganismeResponseDTO create(OrganismeRequestDTO requestDTO) {
        // Vérifier unicité du code
        if (organismeRepository.existsByCode(requestDTO.code())) {
            throw new DuplicateResourceException("Code déjà utilisé");
        }

        Organisme organisme = organismeMapper.toEntity(requestDTO);
        Organisme saved = organismeRepository.save(organisme);
        return organismeMapper.toResponseDTO(saved);
    }

    public OrganismeResponseDTO update(Long id, OrganismeRequestDTO requestDTO) {
        Organisme organisme = organismeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Organisme non trouvé avec l'id: " + id));

        // Vérifier unicité du code si modifié
        if (!organisme.getCode().equals(requestDTO.code()) &&
                organismeRepository.existsByCode(requestDTO.code())) {
            throw new DuplicateResourceException("Code déjà utilisé");
        }

        organismeMapper.updateEntity(requestDTO, organisme);
        Organisme saved = organismeRepository.save(organisme);
        return organismeMapper.toResponseDTO(saved);
    }

    public OrganismeResponseDTO findById(Long id) {
        Organisme organisme = organismeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Organisme non trouvé avec l'id: " + id));
        return organismeMapper.toResponseDTO(organisme);
    }

    public List<OrganismeResponseDTO> findAll() {
        return organismeRepository.findAll().stream()
                .map(organismeMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public Page<OrganismeResponseDTO> findAll(Pageable pageable) {
        return organismeRepository.findAll(pageable)
                .map(organismeMapper::toResponseDTO);
    }

    public List<OrganismeResponseDTO> searchByNom(String nom) {
        return organismeRepository.findByNomContainingIgnoreCase(nom).stream()
                .map(organismeMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public void delete(Long id) {
        Organisme organisme = organismeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Organisme non trouvé avec l'id: " + id));

        // Vérifier s'il a des projets
        if (organisme.getProjets() != null && !organisme.getProjets().isEmpty()) {
            throw new ResourceInUseException("Impossible de supprimer: l'organisme a des projets associés");
        }

        organismeRepository.delete(organisme);
    }
}