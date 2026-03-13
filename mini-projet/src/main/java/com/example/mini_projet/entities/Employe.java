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
public class Employe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String matricule;

    private String nom;
    private String prenom;
    private String telephone;

    @Column(unique = true)
    private String email;

    @Column(unique = true)
    private String login;

    private String password;

    @ManyToOne
    @JoinColumn(name = "profil_id")
    private Profil profil;

    @OneToMany(mappedBy = "chefProjet")
    private List<Projet> projetsDiriges;

    @OneToMany(mappedBy = "employe")
    private List<Affectation> affectations;
}