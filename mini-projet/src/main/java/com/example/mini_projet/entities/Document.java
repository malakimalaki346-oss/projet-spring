package com.example.mini_projet.entities;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Document {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String code;
    private String type; // "CDC", "SPEC", "ARCHI", "CR", etc.
    private String titre;
    private String description;
    private String cheminFichier;

    @Temporal(TemporalType.DATE)
    private Date dateUpload;

    @ManyToOne
    @JoinColumn(name = "projet_id")
    private Projet projet;
}