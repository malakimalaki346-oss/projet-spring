package com.example.mini_projet.controllers;

import com.example.mini_projet.dto.request.LivrableRequestDTO;
import com.example.mini_projet.dto.response.LivrableResponseDTO;
import com.example.mini_projet.services.LivrableService;
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
@Tag(name = "Gestion des livrables", description = "API pour gérer les livrables des phases")
public class LivrableController {

    private final LivrableService livrableService;

    public LivrableController(LivrableService livrableService) {
        this.livrableService = livrableService;
    }

    @PostMapping("/phases/{phaseId}/livrables")
    @PreAuthorize("hasAnyRole('CHEF_PROJET', 'DIRECTEUR', 'ADMIN')")
    @Operation(summary = "Ajouter un livrable à une phase")
    public ResponseEntity<LivrableResponseDTO> create(
            @PathVariable Long phaseId,
            @Valid @RequestBody LivrableRequestDTO requestDTO) {
        LivrableResponseDTO response = livrableService.create(phaseId, requestDTO);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/livrables/{id}")
    @PreAuthorize("hasAnyRole('CHEF_PROJET', 'DIRECTEUR', 'ADMIN')")
    @Operation(summary = "Modifier un livrable")
    public ResponseEntity<LivrableResponseDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody LivrableRequestDTO requestDTO) {
        LivrableResponseDTO response = livrableService.update(id, requestDTO);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/livrables/{id}")
    @Operation(summary = "Consulter un livrable")
    public ResponseEntity<LivrableResponseDTO> findById(@PathVariable Long id) {
        LivrableResponseDTO response = livrableService.findById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/phases/{phaseId}/livrables")
    @Operation(summary = "Lister les livrables d'une phase")
    public ResponseEntity<List<LivrableResponseDTO>> findByPhase(@PathVariable Long phaseId) {
        List<LivrableResponseDTO> response = livrableService.findByPhase(phaseId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/livrables/{id}")
    @PreAuthorize("hasAnyRole('CHEF_PROJET', 'DIRECTEUR', 'ADMIN')")
    @Operation(summary = "Supprimer un livrable")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        livrableService.delete(id);
        return ResponseEntity.noContent().build();
    }
}