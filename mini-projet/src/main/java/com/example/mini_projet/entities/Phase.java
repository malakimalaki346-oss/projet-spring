package com.example.mini_projet.entities;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Phase {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String code;
    private String libelle;
    private String description;

    @Temporal(TemporalType.DATE)
    private Date dateDebut;

    @Temporal(TemporalType.DATE)
    private Date dateFin;

    private Double pourcentage;
    private Double montant;

    // États
    private boolean estTerminee = false;
    private boolean estFacturee = false;
    private boolean estPayee = false;

    @ManyToOne
    @JoinColumn(name = "projet_id")
    private Projet projet;

    @OneToMany(mappedBy = "phase", cascade = CascadeType.ALL)
    private List<Affectation> affectations;

    @OneToMany(mappedBy = "phase", cascade = CascadeType.ALL)
    private List<Livrable> livrables;

    @OneToOne(mappedBy = "phase")
    private Facture facture;
}