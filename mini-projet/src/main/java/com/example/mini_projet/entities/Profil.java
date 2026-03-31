package com.example.mini_projet.entities;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
@Entity
@Table(name = "profils")
public class Profil {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Column(length = 100)
    private String libelle;

    @Column(length = 255)
    private String description;

    @OneToMany(mappedBy = "profil", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Employe> employes = new ArrayList<>();

    
    public Profil() {
    }

    
    public Profil(String code, String libelle, String description) {
        this.code = code;
        this.libelle = libelle;
        this.description = description;
    }

    
    public Profil(Long id, String code, String libelle, String description) {
        this.id = id;
        this.code = code;
        this.libelle = libelle;
        this.description = description;
    }

    
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getLibelle() {
        return libelle;
    }

    public void setLibelle(String libelle) {
        this.libelle = libelle;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<Employe> getEmployes() {
        return employes;
    }

    public void setEmployes(List<Employe> employes) {
        this.employes = employes;
    }

    
    public void addEmploye(Employe employe) {
        employes.add(employe);
        employe.setProfil(this);
    }

    
    public void removeEmploye(Employe employe) {
        employes.remove(employe);
        employe.setProfil(null);
    }

    @Override
    public String toString() {
        return "Profil{" +
                "id=" + id +
                ", code='" + code + '\'' +
                ", libelle='" + libelle + '\'' +
                '}';
    }
}