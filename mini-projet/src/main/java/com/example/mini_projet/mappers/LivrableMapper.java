package com.example.mini_projet.mappers;

import com.example.mini_projet.dto.request.LivrableRequestDTO;
import com.example.mini_projet.dto.response.LivrableResponseDTO;
import com.example.mini_projet.entities.Livrable;
import com.example.mini_projet.entities.Phase;
import com.example.mini_projet.repositories.PhaseRepository;
import org.springframework.stereotype.Component;

@Component
public class LivrableMapper {

    private final PhaseRepository phaseRepository;

    public LivrableMapper(PhaseRepository phaseRepository) {
        this.phaseRepository = phaseRepository;
    }

    public Livrable toEntity(LivrableRequestDTO dto) {
        if (dto == null) return null;

        Livrable livrable = new Livrable();
        livrable.setCode(dto.code());
        livrable.setLibelle(dto.libelle());
        livrable.setDescription(dto.description());
        livrable.setCheminFichier(dto.cheminFichier());

        return livrable;
    }

    public LivrableResponseDTO toResponseDTO(Livrable livrable) {
        if (livrable == null) return null;

        return new LivrableResponseDTO(
                livrable.getId(),
                livrable.getCode(),
                livrable.getLibelle(),
                livrable.getDescription(),
                livrable.getCheminFichier(),
                livrable.getPhase() != null ? livrable.getPhase().getId() : null,
                livrable.getPhase() != null ? livrable.getPhase().getLibelle() : null,
                livrable.getPhase() != null && livrable.getPhase().getProjet() != null ?
                        livrable.getPhase().getProjet().getNom() : null
        );
    }

    public void updateEntity(LivrableRequestDTO dto, Livrable livrable) {
        if (dto == null || livrable == null) return;

        livrable.setCode(dto.code());
        livrable.setLibelle(dto.libelle());
        livrable.setDescription(dto.description());
        livrable.setCheminFichier(dto.cheminFichier());
    }
}