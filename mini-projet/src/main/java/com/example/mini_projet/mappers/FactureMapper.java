package com.example.mini_projet.mappers;

import com.example.mini_projet.dto.request.FactureRequestDTO;
import com.example.mini_projet.dto.response.FactureResponseDTO;
import com.example.mini_projet.entities.Facture;
import com.example.mini_projet.entities.Phase;
import com.example.mini_projet.repositories.PhaseRepository;
import org.springframework.stereotype.Component;

@Component
public class FactureMapper {

    private final PhaseRepository phaseRepository;

    public FactureMapper(PhaseRepository phaseRepository) {
        this.phaseRepository = phaseRepository;
    }

    public Facture toEntity(FactureRequestDTO dto) {
        if (dto == null) return null;

        Facture facture = new Facture();
        facture.setNumeroFacture(dto.numeroFacture());
        facture.setDateFacture(dto.dateFacture());
        facture.setDatePaiement(dto.datePaiement());
        facture.setMontant(dto.montant());

        return facture;
    }

    public FactureResponseDTO toResponseDTO(Facture facture) {
        if (facture == null) return null;

        return new FactureResponseDTO(
                facture.getId(),
                facture.getNumeroFacture(),
                facture.getDateFacture(),
                facture.getDatePaiement(),
                facture.getMontant(),
                facture.getPhase() != null ? facture.getPhase().getId() : null,
                facture.getPhase() != null ? facture.getPhase().getLibelle() : null,
                facture.getPhase() != null && facture.getPhase().getProjet() != null ?
                        facture.getPhase().getProjet().getNom() : null,
                facture.getPhase() != null && facture.getPhase().getProjet() != null &&
                        facture.getPhase().getProjet().getOrganisme() != null ?
                        facture.getPhase().getProjet().getOrganisme().getNom() : null,
                facture.getDatePaiement() != null
        );
    }

    public void updateEntity(FactureRequestDTO dto, Facture facture) {
        if (dto == null || facture == null) return;

        facture.setNumeroFacture(dto.numeroFacture());
        facture.setDateFacture(dto.dateFacture());
        facture.setDatePaiement(dto.datePaiement());
        facture.setMontant(dto.montant());
    }
}