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
public class Facture {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String numeroFacture;

    @Temporal(TemporalType.DATE)
    private Date dateFacture;

    @Temporal(TemporalType.DATE)
    private Date datePaiement;

    private Double montant;

    @OneToOne
    @JoinColumn(name = "phase_id", unique = true)
    private Phase phase;
}