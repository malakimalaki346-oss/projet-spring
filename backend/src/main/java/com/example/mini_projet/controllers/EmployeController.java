package com.example.mini_projet.controllers;

import com.example.mini_projet.dto.request.EmployeRequestDTO;
import com.example.mini_projet.dto.response.EmployeResponseDTO;
import com.example.mini_projet.services.EmployeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/employes")
@Tag(name = "Gestion des employés", description = "API pour gérer les employés")
public class EmployeController {

    private final EmployeService employeService;

    public EmployeController(EmployeService employeService) {
        this.employeService = employeService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Créer un employé")
    public ResponseEntity<EmployeResponseDTO> create(@Valid @RequestBody EmployeRequestDTO requestDTO) {
        EmployeResponseDTO response = employeService.create(requestDTO);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Modifier un employé")
    public ResponseEntity<EmployeResponseDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody EmployeRequestDTO requestDTO) {
        EmployeResponseDTO response = employeService.update(id, requestDTO);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Consulter un employé")
    public ResponseEntity<EmployeResponseDTO> findById(@PathVariable Long id) {
        EmployeResponseDTO response = employeService.findById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @Operation(summary = "Lister tous les employés")
    public ResponseEntity<List<EmployeResponseDTO>> findAll() {
        List<EmployeResponseDTO> response = employeService.findAll();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/paged")
    @Operation(summary = "Lister les employés avec pagination")
    public ResponseEntity<Page<EmployeResponseDTO>> findAllPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,asc") String[] sort) {

        Sort.Direction direction = sort[1].equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sort[0]));
        Page<EmployeResponseDTO> response = employeService.findAll(pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/profil/{profilCode}")
    @Operation(summary = "Lister les employés par profil")
    public ResponseEntity<List<EmployeResponseDTO>> findByProfil(@PathVariable String profilCode) {
        List<EmployeResponseDTO> response = employeService.findByProfil(profilCode);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/disponibles")
    @Operation(summary = "Trouver les employés disponibles sur une période")
    public ResponseEntity<List<EmployeResponseDTO>> findDisponibles(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date dateDebut,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date dateFin) {
        List<EmployeResponseDTO> response = employeService.findEmployesDisponibles(dateDebut, dateFin);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Supprimer un employé")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        employeService.delete(id);
        return ResponseEntity.noContent().build();
    }
}