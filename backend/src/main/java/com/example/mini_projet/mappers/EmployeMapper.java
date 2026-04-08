package com.example.mini_projet.mappers;

import com.example.mini_projet.dto.request.EmployeRequestDTO;
import com.example.mini_projet.dto.response.EmployeResponseDTO;
import com.example.mini_projet.entities.Employe;
import com.example.mini_projet.entities.Profil;
import com.example.mini_projet.repositories.ProfilRepository;
import org.springframework.stereotype.Component;

@Component
public class EmployeMapper {

    private final ProfilRepository profilRepository;

    public EmployeMapper(ProfilRepository profilRepository) {
        this.profilRepository = profilRepository;
    }

    public Employe toEntity(EmployeRequestDTO dto) {
        if (dto == null) return null;

        Employe employe = new Employe();
        employe.setMatricule(dto.matricule());
        employe.setNom(dto.nom());
        employe.setPrenom(dto.prenom());
        employe.setTelephone(dto.telephone());
        employe.setEmail(dto.email());
        employe.setLogin(dto.login());
        employe.setPassword(dto.password()); 

        Profil profil = profilRepository.findById(dto.profilId()).orElse(null);
        employe.setProfil(profil);

        return employe;
    }

    public EmployeResponseDTO toResponseDTO(Employe employe) {
        if (employe == null) return null;

        return new EmployeResponseDTO(
                employe.getId(),
                employe.getMatricule(),
                employe.getNom(),
                employe.getPrenom(),
                employe.getTelephone(),
                employe.getEmail(),
                employe.getLogin(),
                employe.getProfil() != null ? employe.getProfil().getCode() : null,
                employe.getProfil() != null ? employe.getProfil().getLibelle() : null,
                employe.getProjetsDiriges() != null ? employe.getProjetsDiriges().size() : 0,
                employe.getAffectations() != null ? employe.getAffectations().size() : 0
        );
    }

    public void updateEntity(EmployeRequestDTO dto, Employe employe) {
        if (dto == null || employe == null) return;

        employe.setMatricule(dto.matricule());
        employe.setNom(dto.nom());
        employe.setPrenom(dto.prenom());
        employe.setTelephone(dto.telephone());
        employe.setEmail(dto.email());
        employe.setLogin(dto.login());

        if (dto.password() != null && !dto.password().isEmpty()) {
            employe.setPassword(dto.password()); 
        }

        if (dto.profilId() != null) {
            Profil profil = profilRepository.findById(dto.profilId()).orElse(null);
            employe.setProfil(profil);
        }
    }
}