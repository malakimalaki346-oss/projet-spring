package com.example.mini_projet.controllers;


import com.example.mini_projet.entities.Profil;
import com.example.mini_projet.repositories.ProfilRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/profils")
public class ProfilController {

    private final ProfilRepository profilRepository;

    public ProfilController(ProfilRepository profilRepository) {
        this.profilRepository = profilRepository;
    }

    @GetMapping
    public ResponseEntity<List<Profil>> getAll() {
        return ResponseEntity.ok(profilRepository.findAll());
    }
}