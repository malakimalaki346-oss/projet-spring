package com.example.mini_projet.controllers;

import com.example.mini_projet.dto.request.DocumentRequestDTO;
import com.example.mini_projet.dto.response.DocumentResponseDTO;
import com.example.mini_projet.services.DocumentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api")
@Tag(name = "Gestion des documents", description = "API pour gérer les documents des projets")
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @PostMapping(value = "/projets/{projetId}/documents", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('SECRETAIRE', 'CHEF_PROJET', 'DIRECTEUR', 'ADMIN')")
    @Operation(summary = "Ajouter un document à un projet")
    public ResponseEntity<DocumentResponseDTO> create(
            @PathVariable Long projetId,
            @RequestParam("code") String code,
            @RequestParam("type") String type,
            @RequestParam("titre") String titre,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "fichier", required = false) MultipartFile fichier) {

        DocumentRequestDTO requestDTO = new DocumentRequestDTO();
        requestDTO.setCode(code);
        requestDTO.setType(type);
        requestDTO.setTitre(titre);
        requestDTO.setDescription(description);

        DocumentResponseDTO response = documentService.create(projetId, requestDTO, fichier);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/documents/{id}")
    @PreAuthorize("hasAnyRole('SECRETAIRE', 'CHEF_PROJET', 'DIRECTEUR', 'ADMIN')")
    @Operation(summary = "Modifier un document")
    public ResponseEntity<DocumentResponseDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody DocumentRequestDTO requestDTO) {
        DocumentResponseDTO response = documentService.update(id, requestDTO);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/documents/{id}")
    @Operation(summary = "Consulter un document")
    public ResponseEntity<DocumentResponseDTO> findById(@PathVariable Long id) {
        DocumentResponseDTO response = documentService.findById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/projets/{projetId}/documents")
    @Operation(summary = "Lister les documents d'un projet")
    public ResponseEntity<List<DocumentResponseDTO>> findByProjet(@PathVariable Long projetId) {
        List<DocumentResponseDTO> response = documentService.findByProjet(projetId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/documents/{id}/download")
    @Operation(summary = "Telecharger un document")
    public ResponseEntity<Resource> download(@PathVariable Long id) {
        Resource resource = documentService.download(id);
        DocumentResponseDTO document = documentService.findById(id);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + document.titre() + "\"")
                .body(resource);
    }

    @DeleteMapping("/documents/{id}")
    @PreAuthorize("hasAnyRole('SECRETAIRE', 'CHEF_PROJET', 'DIRECTEUR', 'ADMIN')")
    @Operation(summary = "Supprimer un document")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        documentService.delete(id);
        return ResponseEntity.noContent().build();
    }
}