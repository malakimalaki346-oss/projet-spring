package com.example.mini_projet.services;


import com.example.mini_projet.dto.request.LivrableRequestDTO;
import com.example.mini_projet.dto.response.LivrableResponseDTO;
import com.example.mini_projet.entities.Livrable;
import com.example.mini_projet.entities.Phase;
import com.example.mini_projet.exceptions.DuplicateResourceException;
import com.example.mini_projet.exceptions.ResourceNotFoundException;
import com.example.mini_projet.mappers.LivrableMapper;
import com.example.mini_projet.repositories.LivrableRepository;
import com.example.mini_projet.repositories.PhaseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class LivrableService {

    private final LivrableRepository livrableRepository;
    private final PhaseRepository phaseRepository;
    private final LivrableMapper livrableMapper;

    public LivrableService(LivrableRepository livrableRepository,
                           PhaseRepository phaseRepository,
                           LivrableMapper livrableMapper) {
        this.livrableRepository = livrableRepository;
        this.phaseRepository = phaseRepository;
        this.livrableMapper = livrableMapper;
    }

    public LivrableResponseDTO create(Long phaseId, LivrableRequestDTO requestDTO) {
        Phase phase = phaseRepository.findById(phaseId)
                .orElseThrow(() -> new ResourceNotFoundException("Phase non trouvée avec l'id: " + phaseId));

        
        if (livrableRepository.findByCode(requestDTO.code()).isPresent()) {
            throw new DuplicateResourceException("Code livrable déjà utilisé");
        }

        Livrable livrable = livrableMapper.toEntity(requestDTO);
        livrable.setPhase(phase);

        Livrable saved = livrableRepository.save(livrable);
        return livrableMapper.toResponseDTO(saved);
    }

    public LivrableResponseDTO update(Long id, LivrableRequestDTO requestDTO) {
        Livrable livrable = livrableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Livrable non trouvé avec l'id: " + id));

        
        if (!livrable.getCode().equals(requestDTO.code()) &&
                livrableRepository.findByCode(requestDTO.code()).isPresent()) {
            throw new DuplicateResourceException("Code livrable déjà utilisé");
        }

        livrableMapper.updateEntity(requestDTO, livrable);
        Livrable saved = livrableRepository.save(livrable);
        return livrableMapper.toResponseDTO(saved);
    }

    public LivrableResponseDTO findById(Long id) {
        Livrable livrable = livrableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Livrable non trouvé avec l'id: " + id));
        return livrableMapper.toResponseDTO(livrable);
    }

    public List<LivrableResponseDTO> findByPhase(Long phaseId) {
        return livrableRepository.findByPhaseId(phaseId).stream()
                .map(livrableMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public void delete(Long id) {
        Livrable livrable = livrableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Livrable non trouvé avec l'id: " + id));
        livrableRepository.delete(livrable);
    }
}
