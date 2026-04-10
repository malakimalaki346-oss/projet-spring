package com.example.mini_projet.controllers;

import com.example.mini_projet.dto.request.AffectationRequestDTO;
import com.example.mini_projet.dto.response.AffectationResponseDTO;
import com.example.mini_projet.services.AffectationService;
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
@Tag(name = "Gestion des affectations", description = "API pour gérer les affectations employé-phase")
public class AffectationController {

    private final AffectationService affectationService;

    public AffectationController(AffectationService affectationService) {
        this.affectationService = affectationService;
    }

    @PostMapping("/phases/{phaseId}/employes/{employeId}")
    @PreAuthorize("hasAnyRole('ADMIN','CHEF_PROJET', 'DIRECTEUR')")
    @Operation(summary = "Affecter un employé à une phase")
    public ResponseEntity<AffectationResponseDTO> affecterEmploye(
            @PathVariable Long phaseId,
            @PathVariable Long employeId,
            @Valid @RequestBody AffectationRequestDTO requestDTO) {
        AffectationResponseDTO response = affectationService.affecterEmployeAPhase(phaseId, employeId, requestDTO);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/phases/{phaseId}/employes/{employeId}")
    @PreAuthorize("hasAnyRole('ADMIN','CHEF_PROJET', 'DIRECTEUR')")
    @Operation(summary = "Modifier une affectation")
    public ResponseEntity<AffectationResponseDTO> updateAffectation(
            @PathVariable Long phaseId,
            @PathVariable Long employeId,
            @Valid @RequestBody AffectationRequestDTO requestDTO) {
        AffectationResponseDTO response = affectationService.updateAffectation(phaseId, employeId, requestDTO);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/phases/{phaseId}/employes")
    @Operation(summary = "Lister les employés affectés à une phase")
    public ResponseEntity<List<AffectationResponseDTO>> findByPhase(@PathVariable Long phaseId) {
        List<AffectationResponseDTO> response = affectationService.findAffectationsByPhase(phaseId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/employes/{employeId}/phases")
    @Operation(summary = "Lister les phases d'un employé")
    public ResponseEntity<List<AffectationResponseDTO>> findByEmploye(@PathVariable Long employeId) {
        List<AffectationResponseDTO> response = affectationService.findAffectationsByEmploye(employeId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/phases/{phaseId}/employes/{employeId}")
    @Operation(summary = "Consulter une affectation spécifique")
    public ResponseEntity<AffectationResponseDTO> findAffectation(
            @PathVariable Long phaseId,
            @PathVariable Long employeId) {
        AffectationResponseDTO response = affectationService.findAffectation(phaseId, employeId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/phases/{phaseId}/employes/{employeId}")
    @PreAuthorize("hasAnyRole('ADMIN','CHEF_PROJET', 'DIRECTEUR')")
    @Operation(summary = "Désaffecter un employé d'une phase")
    public ResponseEntity<Void> desaffecterEmploye(
            @PathVariable Long phaseId,
            @PathVariable Long employeId) {
        affectationService.desaffecterEmploye(phaseId, employeId);
        return ResponseEntity.noContent().build();
    }
}