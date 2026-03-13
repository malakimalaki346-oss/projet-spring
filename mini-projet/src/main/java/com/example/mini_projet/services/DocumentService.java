package com.example.mini_projet.services;


import com.example.mini_projet.dto.request.DocumentRequestDTO;
import com.example.mini_projet.dto.response.DocumentResponseDTO;
import com.example.mini_projet.entities.Document;
import com.example.mini_projet.entities.Projet;
import com.example.mini_projet.exceptions.DuplicateResourceException;
import com.example.mini_projet.exceptions.ResourceNotFoundException;
import com.example.mini_projet.mappers.DocumentMapper;
import com.example.mini_projet.repositories.DocumentRepository;
import com.example.mini_projet.repositories.ProjetRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final ProjetRepository projetRepository;
    private final DocumentMapper documentMapper;

    public DocumentService(DocumentRepository documentRepository,
                           ProjetRepository projetRepository,
                           DocumentMapper documentMapper) {
        this.documentRepository = documentRepository;
        this.projetRepository = projetRepository;
        this.documentMapper = documentMapper;
    }

    public DocumentResponseDTO create(Long projetId, DocumentRequestDTO requestDTO) {
        Projet projet = projetRepository.findById(projetId)
                .orElseThrow(() -> new ResourceNotFoundException("Projet non trouvé avec l'id: " + projetId));

        Document document = documentMapper.toEntity(requestDTO);
        document.setProjet(projet);

        Document saved = documentRepository.save(document);
        return documentMapper.toResponseDTO(saved);
    }

    public DocumentResponseDTO update(Long id, DocumentRequestDTO requestDTO) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document non trouvé avec l'id: " + id));

        documentMapper.updateEntity(requestDTO, document);
        Document saved = documentRepository.save(document);
        return documentMapper.toResponseDTO(saved);
    }

    public DocumentResponseDTO findById(Long id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document non trouvé avec l'id: " + id));
        return documentMapper.toResponseDTO(document);
    }

    public List<DocumentResponseDTO> findByProjet(Long projetId) {
        return documentRepository.findByProjetId(projetId).stream()
                .map(documentMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public void delete(Long id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document non trouvé avec l'id: " + id));
        documentRepository.delete(document);
    }
}