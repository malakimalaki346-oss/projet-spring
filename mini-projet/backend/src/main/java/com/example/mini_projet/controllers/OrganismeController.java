package com.example.mini_projet.controllers;

import com.example.mini_projet.dto.request.OrganismeRequestDTO;
import com.example.mini_projet.dto.response.OrganismeResponseDTO;
import com.example.mini_projet.services.OrganismeService;
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
@RequestMapping("/api/organismes")
@Tag(name = "Gestion des organismes", description = "API pour gérer les organismes clients")
public class OrganismeController {

    private final OrganismeService organismeService;

    public OrganismeController(OrganismeService organismeService) {
        this.organismeService = organismeService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SECRETAIRE', 'ADMIN')")
    @Operation(summary = "Créer un organisme")
    public ResponseEntity<OrganismeResponseDTO> create(@Valid @RequestBody OrganismeRequestDTO requestDTO) {
        OrganismeResponseDTO response = organismeService.create(requestDTO);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SECRETAIRE', 'ADMIN')")
    @Operation(summary = "Modifier un organisme")
    public ResponseEntity<OrganismeResponseDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody OrganismeRequestDTO requestDTO) {
        OrganismeResponseDTO response = organismeService.update(id, requestDTO);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Consulter un organisme")
    public ResponseEntity<OrganismeResponseDTO> findById(@PathVariable Long id) {
        OrganismeResponseDTO response = organismeService.findById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @Operation(summary = "Lister tous les organismes")
    public ResponseEntity<List<OrganismeResponseDTO>> findAll() {
        List<OrganismeResponseDTO> response = organismeService.findAll();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/paged")
    @Operation(summary = "Lister les organismes avec pagination")
    public ResponseEntity<Page<OrganismeResponseDTO>> findAllPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,asc") String[] sort) {

        Sort.Direction direction = sort[1].equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sort[0]));
        Page<OrganismeResponseDTO> response = organismeService.findAll(pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    @Operation(summary = "Rechercher des organismes par nom")
    public ResponseEntity<List<OrganismeResponseDTO>> searchByNom(
            @RequestParam String nom) {
        List<OrganismeResponseDTO> response = organismeService.searchByNom(nom);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Supprimer un organisme")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        organismeService.delete(id);
        return ResponseEntity.noContent().build();
    }
}