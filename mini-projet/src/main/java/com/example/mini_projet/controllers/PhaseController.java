package com.example.mini_projet.controllers;

import com.example.mini_projet.dto.request.PhaseRequestDTO;
import com.example.mini_projet.dto.response.PhaseResponseDTO;
import com.example.mini_projet.services.PhaseService;
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
@Tag(name = "Gestion des phases", description = "API pour gérer les phases des projets")
public class PhaseController {

    private final PhaseService phaseService;

    public PhaseController(PhaseService phaseService) {
        this.phaseService = phaseService;
    }

    @PostMapping("/projets/{projetId}/phases")
    @PreAuthorize("hasAnyRole('CHEF_PROJET', 'DIRECTEUR')")
    @Operation(summary = "Créer une phase dans un projet")
    public ResponseEntity<PhaseResponseDTO> create(
            @PathVariable Long projetId,
            @Valid @RequestBody PhaseRequestDTO requestDTO) {
        PhaseResponseDTO response = phaseService.create(projetId, requestDTO);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/phases/{id}")
    @PreAuthorize("hasAnyRole('CHEF_PROJET', 'DIRECTEUR')")
    @Operation(summary = "Modifier une phase")
    public ResponseEntity<PhaseResponseDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody PhaseRequestDTO requestDTO) {
        PhaseResponseDTO response = phaseService.update(id, requestDTO);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/phases/{id}")
    @Operation(summary = "Consulter une phase")
    public ResponseEntity<PhaseResponseDTO> findById(@PathVariable Long id) {
        PhaseResponseDTO response = phaseService.findById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/projets/{projetId}/phases")
    @Operation(summary = "Lister les phases d'un projet")
    public ResponseEntity<List<PhaseResponseDTO>> findByProjet(@PathVariable Long projetId) {
        List<PhaseResponseDTO> response = phaseService.findByProjet(projetId);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/phases/{id}/realisation")
    @PreAuthorize("hasAnyRole('CHEF_PROJET', 'DIRECTEUR')")
    @Operation(summary = "Mettre à jour l'état de réalisation d'une phase")
    public ResponseEntity<PhaseResponseDTO> updateEtatRealisation(
            @PathVariable Long id,
            @RequestParam boolean terminee) {
        PhaseResponseDTO response = phaseService.updateEtatRealisation(id, terminee);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/phases/{id}/facturation")
    @PreAuthorize("hasRole('COMPTABLE')")
    @Operation(summary = "Mettre à jour l'état de facturation d'une phase")
    public ResponseEntity<PhaseResponseDTO> updateEtatFacturation(
            @PathVariable Long id,
            @RequestParam boolean facturee) {
        PhaseResponseDTO response = phaseService.updateEtatFacturation(id, facturee);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/phases/{id}/paiement")
    @PreAuthorize("hasRole('COMPTABLE')")
    @Operation(summary = "Mettre à jour l'état de paiement d'une phase")
    public ResponseEntity<PhaseResponseDTO> updateEtatPaiement(
            @PathVariable Long id,
            @RequestParam boolean payee) {
        PhaseResponseDTO response = phaseService.updateEtatPaiement(id, payee);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/phases/{id}")
    @PreAuthorize("hasAnyRole('CHEF_PROJET', 'DIRECTEUR')")
    @Operation(summary = "Supprimer une phase")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        phaseService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/phases/terminees-non-facturees")
    @PreAuthorize("hasRole('COMPTABLE')")
    @Operation(summary = "Lister les phases terminées non facturées")
    public ResponseEntity<List<PhaseResponseDTO>> findTermineesNonFacturees() {
        List<PhaseResponseDTO> response = phaseService.findTermineesNonFacturees();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/phases/facturees-non-payees")
    @PreAuthorize("hasRole('COMPTABLE')")
    @Operation(summary = "Lister les phases facturées non payées")
    public ResponseEntity<List<PhaseResponseDTO>> findFactureesNonPayees() {
        List<PhaseResponseDTO> response = phaseService.findFactureesNonPayees();
        return ResponseEntity.ok(response);
    }
}