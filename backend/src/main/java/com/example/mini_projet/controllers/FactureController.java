package com.example.mini_projet.controllers;

import com.example.mini_projet.dto.request.FactureRequestDTO;
import com.example.mini_projet.dto.response.FactureResponseDTO;
import com.example.mini_projet.services.FactureService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/factures")
@Tag(name = "Gestion des factures", description = "API pour gérer les factures")
public class FactureController {

    private final FactureService factureService;

    public FactureController(FactureService factureService) {
        this.factureService = factureService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('COMPTABLE', 'ADMIN')")
    @Operation(summary = "Créer une facture")
    public ResponseEntity<FactureResponseDTO> create(@Valid @RequestBody FactureRequestDTO requestDTO) {
        FactureResponseDTO response = factureService.create(requestDTO);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('COMPTABLE', 'ADMIN')")
    @Operation(summary = "Modifier une facture")
    public ResponseEntity<FactureResponseDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody FactureRequestDTO requestDTO) {
        FactureResponseDTO response = factureService.update(id, requestDTO);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('COMPTABLE', 'DIRECTEUR', 'ADMIN')")
    @Operation(summary = "Consulter une facture")
    public ResponseEntity<FactureResponseDTO> findById(@PathVariable Long id) {
        FactureResponseDTO response = factureService.findById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('COMPTABLE', 'DIRECTEUR', 'ADMIN')")
    @Operation(summary = "Lister toutes les factures")
    public ResponseEntity<List<FactureResponseDTO>> findAll() {
        List<FactureResponseDTO> response = factureService.findAll();
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('COMPTABLE', 'ADMIN')")
    @Operation(summary = "Supprimer une facture")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        System.out.println(" Contrôleur DELETE appelé avec id = " + id);
        factureService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/paiement")
    @PreAuthorize("hasAnyRole('COMPTABLE', 'ADMIN')")
    @Operation(summary = "Enregistrer le paiement d'une facture")
    public ResponseEntity<FactureResponseDTO> enregistrerPaiement(@PathVariable Long id) {
        FactureResponseDTO response = factureService.enregistrerPaiement(id);
        return ResponseEntity.ok(response);
    }
}