package com.example.mini_projet.controllers;

import com.example.mini_projet.dto.request.ProjetRequestDTO;
import com.example.mini_projet.dto.response.ProjetResponseDTO;
import com.example.mini_projet.dto.response.ProjetResumeDTO;
import com.example.mini_projet.services.ProjetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projets")
@Tag(name = "Gestion des projets", description = "API pour gérer les projets")
public class ProjetController {

    private final ProjetService projetService;

    public ProjetController(ProjetService projetService) {
        this.projetService = projetService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SECRETAIRE', 'DIRECTEUR', 'CHEF_PROJET', 'ADMIN')")
    @Operation(summary = "Créer un projet")
    public ResponseEntity<ProjetResponseDTO> create(@Valid @RequestBody ProjetRequestDTO requestDTO) {
        ProjetResponseDTO response = projetService.create(requestDTO);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SECRETAIRE', 'DIRECTEUR', 'CHEF_PROJET', 'ADMIN')")
    @Operation(summary = "Modifier un projet")
    public ResponseEntity<ProjetResponseDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody ProjetRequestDTO requestDTO) {
        ProjetResponseDTO response = projetService.update(id, requestDTO);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Consulter un projet")
    public ResponseEntity<ProjetResponseDTO> findById(@PathVariable Long id) {
        ProjetResponseDTO response = projetService.findById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/resume")
    @Operation(summary = "Obtenir un résumé détaillé du projet")
    public ResponseEntity<ProjetResumeDTO> getResume(@PathVariable Long id) {
        ProjetResumeDTO response = projetService.getResume(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @Operation(summary = "Lister tous les projets")
    public ResponseEntity<List<ProjetResponseDTO>> findAll() {
        List<ProjetResponseDTO> response = projetService.findAll();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/paged")
    @Operation(summary = "Lister les projets avec pagination")
    public ResponseEntity<Page<ProjetResponseDTO>> findAllPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,asc") String[] sort) {

        Sort.Direction direction = sort[1].equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sort[0]));
        Page<ProjetResponseDTO> response = projetService.findAll(pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/chef/{chefId}")
    @Operation(summary = "Lister les projets d'un chef de projet")
    public ResponseEntity<List<ProjetResponseDTO>> findByChefProjet(@PathVariable Long chefId) {
        List<ProjetResponseDTO> response = projetService.findByChefProjet(chefId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/organisme/{organismeId}")
    @Operation(summary = "Lister les projets d'un organisme")
    public ResponseEntity<List<ProjetResponseDTO>> findByOrganisme(@PathVariable Long organismeId) {
        List<ProjetResponseDTO> response = projetService.findByOrganisme(organismeId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('DIRECTEUR', 'ADMIN')")
    @Operation(summary = "Supprimer un projet")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        projetService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/verifier-montant")
    @Operation(summary = "Vérifier si le montant des phases est cohérent")
    public ResponseEntity<Boolean> verifierMontantPhases(@PathVariable Long id) {
        boolean result = projetService.verifierMontantPhases(id);
        return ResponseEntity.ok(result);
    }
}