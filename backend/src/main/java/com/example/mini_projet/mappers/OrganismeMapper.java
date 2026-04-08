package com.example.mini_projet.mappers;

import com.example.mini_projet.dto.request.OrganismeRequestDTO;
import com.example.mini_projet.dto.response.OrganismeResponseDTO;
import com.example.mini_projet.entities.Organisme;
import org.springframework.stereotype.Component;

@Component
public class OrganismeMapper {

    public Organisme toEntity(OrganismeRequestDTO dto) {
        if (dto == null) return null;

        Organisme organisme = new Organisme();
        organisme.setCode(dto.code());
        organisme.setNom(dto.nom());
        organisme.setAdresse(dto.adresse());
        organisme.setTelephone(dto.telephone());
        organisme.setContactNom(dto.contactNom());
        organisme.setContactEmail(dto.contactEmail());
        organisme.setSiteWeb(dto.siteWeb());

        return organisme;
    }

    public OrganismeResponseDTO toResponseDTO(Organisme organisme) {
        if (organisme == null) return null;

        return new OrganismeResponseDTO(
                organisme.getId(),
                organisme.getCode(),
                organisme.getNom(),
                organisme.getAdresse(),
                organisme.getTelephone(),
                organisme.getContactNom(),
                organisme.getContactEmail(),
                organisme.getSiteWeb(),
                organisme.getProjets() != null ? organisme.getProjets().size() : 0
        );
    }

    public void updateEntity(OrganismeRequestDTO dto, Organisme organisme) {
        if (dto == null || organisme == null) return;

        organisme.setCode(dto.code());
        organisme.setNom(dto.nom());
        organisme.setAdresse(dto.adresse());
        organisme.setTelephone(dto.telephone());
        organisme.setContactNom(dto.contactNom());
        organisme.setContactEmail(dto.contactEmail());
        organisme.setSiteWeb(dto.siteWeb());
    }
}