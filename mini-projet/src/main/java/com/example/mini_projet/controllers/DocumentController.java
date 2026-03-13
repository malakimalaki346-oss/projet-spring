package com.example.mini_projet.controllers;

import com.example.mini_projet.dto.request.DocumentRequestDTO;
import com.example.mini_projet.dto.response.DocumentResponseDTO;
import com.example.mini_projet.services.DocumentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@Tag(name = "Gestion des documents", description = "API pour gérer les documents des projets")
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @PostMapping("/projets/{projetId}/documents")
    @PreAuthorize("hasAnyRole('SECRETAIRE', 'CHEF_PROJET', 'DIRECTEUR')")
    @Operation(summary = "Ajouter un document à un projet")
    public ResponseEntity<DocumentResponseDTO> create(
            @PathVariable Long projetId,
            @Valid @RequestBody DocumentRequestDTO requestDTO) {
        DocumentResponseDTO response = documentService.create(projetId, requestDTO);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/documents/{id}")
    @PreAuthorize("hasAnyRole('SECRETAIRE', 'CHEF_PROJET', 'DIRECTEUR')")
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

    @DeleteMapping("/documents/{id}")
    @PreAuthorize("hasAnyRole('SECRETAIRE', 'CHEF_PROJET', 'DIRECTEUR', 'ADMIN')")
    @Operation(summary = "Supprimer un document")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        documentService.delete(id);
        return ResponseEntity.noContent().build();
    }
}