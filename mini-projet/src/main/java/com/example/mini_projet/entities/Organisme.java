package com.example.mini_projet.entities;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Organisme {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;

    private String nom;
    private String adresse;
    private String telephone;
    private String contactNom;
    private String contactEmail;
    private String siteWeb;

    @OneToMany(mappedBy = "organisme")
    private List<Projet> projets;
}