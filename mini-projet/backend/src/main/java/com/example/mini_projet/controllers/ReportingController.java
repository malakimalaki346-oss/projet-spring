package com.example.mini_projet.controllers;

import com.example.mini_projet.dto.response.PhaseResponseDTO;
import com.example.mini_projet.dto.response.ProjetResponseDTO;
import com.example.mini_projet.dto.response.TableauBordDTO;
import com.example.mini_projet.services.ReportingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reporting")
@Tag(name = "Reporting et tableaux de bord", description = "API pour les statistiques et reporting")
public class ReportingController {

    private final ReportingService reportingService;

    public ReportingController(ReportingService reportingService) {
        this.reportingService = reportingService;
    }

    @GetMapping("/phases/payees")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTEUR', 'COMPTABLE', 'CHEF_PROJET')")
    @Operation(summary = "Lister les phases payées")
    public ResponseEntity<List<PhaseResponseDTO>> getPhasesPayees() {
        return ResponseEntity.ok(reportingService.getPhasesPayees());
    }

    @GetMapping("/tableau-de-bord")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTEUR', 'COMPTABLE', 'CHEF_PROJET')")
    @Operation(summary = "Obtenir les statistiques du tableau de bord")
    public ResponseEntity<TableauBordDTO> getTableauDeBord() {
        return ResponseEntity.ok(reportingService.getTableauDeBord());
    }

    @GetMapping("/projets/en-cours")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTEUR', 'CHEF_PROJET', 'SECRETAIRE')")
    @Operation(summary = "Lister les projets en cours")
    public ResponseEntity<List<ProjetResponseDTO>> getProjetsEnCours() {
        return ResponseEntity.ok(reportingService.getProjetsEnCours());
    }

    @GetMapping("/projets/clotures")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTEUR', 'CHEF_PROJET', 'SECRETAIRE')")
    @Operation(summary = "Lister les projets clôturés")
    public ResponseEntity<List<ProjetResponseDTO>> getProjetsClotures() {
        return ResponseEntity.ok(reportingService.getProjetsClotures());
    }
}