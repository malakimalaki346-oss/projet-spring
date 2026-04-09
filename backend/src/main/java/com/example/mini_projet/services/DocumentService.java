package com.example.mini_projet.services;

import com.example.mini_projet.dto.request.DocumentRequestDTO;
import com.example.mini_projet.dto.response.DocumentResponseDTO;
import com.example.mini_projet.entities.Document;
import com.example.mini_projet.entities.Projet;
import com.example.mini_projet.exceptions.ResourceNotFoundException;
import com.example.mini_projet.mappers.DocumentMapper;
import com.example.mini_projet.repositories.DocumentRepository;
import com.example.mini_projet.repositories.ProjetRepository;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
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

    // Nouvelle methode create avec fichier
    public DocumentResponseDTO create(Long projetId, DocumentRequestDTO requestDTO, MultipartFile fichier) {
        Projet projet = projetRepository.findById(projetId)
                .orElseThrow(() -> new ResourceNotFoundException("Projet non trouve avec l'id: " + projetId));

        String cheminFichier = null;
        if (fichier != null && !fichier.isEmpty()) {
            try {
                String uploadDir = "C:/uploads/documents/";
                Path uploadPath = Paths.get(uploadDir);
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }
                String fileName = System.currentTimeMillis() + "_" + fichier.getOriginalFilename();
                Path filePath = uploadPath.resolve(fileName);
                fichier.transferTo(filePath.toFile());
                cheminFichier = filePath.toString();
            } catch (Exception e) {
                throw new RuntimeException("Erreur lors de la sauvegarde du fichier: " + e.getMessage());
            }
        }

        Document document = documentMapper.toEntity(requestDTO);
        document.setProjet(projet);
        document.setCheminFichier(cheminFichier);

        Document saved = documentRepository.save(document);
        return documentMapper.toResponseDTO(saved);
    }

    // Ancienne methode create (conservee pour compatibilite)
    public DocumentResponseDTO create(Long projetId, DocumentRequestDTO requestDTO) {
        Projet projet = projetRepository.findById(projetId)
                .orElseThrow(() -> new ResourceNotFoundException("Projet non trouve avec l'id: " + projetId));

        Document document = documentMapper.toEntity(requestDTO);
        document.setProjet(projet);

        Document saved = documentRepository.save(document);
        return documentMapper.toResponseDTO(saved);
    }

    public DocumentResponseDTO update(Long id, DocumentRequestDTO requestDTO) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document non trouve avec l'id: " + id));

        documentMapper.updateEntity(requestDTO, document);
        Document saved = documentRepository.save(document);
        return documentMapper.toResponseDTO(saved);
    }

    public DocumentResponseDTO findById(Long id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document non trouve avec l'id: " + id));
        return documentMapper.toResponseDTO(document);
    }

    public Document findByIdEntity(Long id) {
        return documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document non trouve avec l'id: " + id));
    }

    public List<DocumentResponseDTO> findByProjet(Long projetId) {
        return documentRepository.findByProjetId(projetId).stream()
                .map(documentMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public Resource download(Long id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document non trouve avec l'id: " + id));

        try {
            Path filePath = Paths.get(document.getCheminFichier());
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("Fichier non trouvable: " + document.getCheminFichier());
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("Erreur de lecture du fichier: " + e.getMessage());
        }
    }

    public void delete(Long id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document non trouve avec l'id: " + id));
        documentRepository.delete(document);
    }
}