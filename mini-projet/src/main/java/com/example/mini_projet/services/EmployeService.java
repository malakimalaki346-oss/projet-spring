package com.example.mini_projet.services;

import com.example.mini_projet.dto.request.EmployeRequestDTO;
import com.example.mini_projet.dto.response.EmployeResponseDTO;
import com.example.mini_projet.entities.Employe;
import com.example.mini_projet.entities.Profil;
import com.example.mini_projet.exceptions.DuplicateResourceException;
import com.example.mini_projet.exceptions.ResourceInUseException;
import com.example.mini_projet.exceptions.ResourceNotFoundException;
import com.example.mini_projet.mappers.EmployeMapper;
import com.example.mini_projet.repositories.AffectationRepository;
import com.example.mini_projet.repositories.EmployeRepository;
import com.example.mini_projet.repositories.ProfilRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class EmployeService {

    private final EmployeRepository employeRepository;
    private final ProfilRepository profilRepository;
    private final AffectationRepository affectationRepository;  // ⬅️ AJOUTER cette dépendance
    private final EmployeMapper employeMapper;

    // ✅ CONSTRUCTEUR MIS À JOUR avec AffectationRepository
    public EmployeService(EmployeRepository employeRepository,
                          ProfilRepository profilRepository,
                          AffectationRepository affectationRepository,  // ⬅️ AJOUTER ce paramètre
                          EmployeMapper employeMapper) {
        this.employeRepository = employeRepository;
        this.profilRepository = profilRepository;
        this.affectationRepository = affectationRepository;  // ⬅️ AJOUTER cette ligne
        this.employeMapper = employeMapper;
    }

    public EmployeResponseDTO create(EmployeRequestDTO requestDTO) {
        // Vérifications d'unicité
        if (employeRepository.existsByMatricule(requestDTO.matricule())) {
            throw new DuplicateResourceException("Matricule déjà utilisé");
        }
        if (employeRepository.existsByLogin(requestDTO.login())) {
            throw new DuplicateResourceException("Login déjà utilisé");
        }
        if (employeRepository.existsByEmail(requestDTO.email())) {
            throw new DuplicateResourceException("Email déjà utilisé");
        }

        // Vérifier que le profil existe
        Profil profil = profilRepository.findById(requestDTO.profilId())
                .orElseThrow(() -> new ResourceNotFoundException("Profil non trouvé avec l'id: " + requestDTO.profilId()));

        Employe employe = employeMapper.toEntity(requestDTO);
        employe.setPassword(requestDTO.password());
        employe.setProfil(profil);

        Employe saved = employeRepository.save(employe);
        return employeMapper.toResponseDTO(saved);
    }

    public EmployeResponseDTO update(Long id, EmployeRequestDTO requestDTO) {
        Employe employe = employeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employé non trouvé avec l'id: " + id));

        // Vérifications d'unicité si modifiés
        if (!employe.getMatricule().equals(requestDTO.matricule()) &&
                employeRepository.existsByMatricule(requestDTO.matricule())) {
            throw new DuplicateResourceException("Matricule déjà utilisé");
        }
        if (!employe.getLogin().equals(requestDTO.login()) &&
                employeRepository.existsByLogin(requestDTO.login())) {
            throw new DuplicateResourceException("Login déjà utilisé");
        }
        if (!employe.getEmail().equals(requestDTO.email()) &&
                employeRepository.existsByEmail(requestDTO.email())) {
            throw new DuplicateResourceException("Email déjà utilisé");
        }

        // Vérifier que le profil existe
        Profil profil = profilRepository.findById(requestDTO.profilId())
                .orElseThrow(() -> new ResourceNotFoundException("Profil non trouvé avec l'id: " + requestDTO.profilId()));

        employeMapper.updateEntity(requestDTO, employe);

        if (requestDTO.password() != null && !requestDTO.password().isEmpty()) {
            employe.setPassword(requestDTO.password());
        }

        employe.setProfil(profil);

        Employe saved = employeRepository.save(employe);
        return employeMapper.toResponseDTO(saved);
    }

    public EmployeResponseDTO findById(Long id) {
        Employe employe = employeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employé non trouvé avec l'id: " + id));
        return employeMapper.toResponseDTO(employe);
    }

    public List<EmployeResponseDTO> findAll() {
        return employeRepository.findAll().stream()
                .map(employeMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public Page<EmployeResponseDTO> findAll(Pageable pageable) {
        return employeRepository.findAll(pageable)
                .map(employeMapper::toResponseDTO);
    }

    public List<EmployeResponseDTO> findByProfil(String profilCode) {
        return employeRepository.findByProfilCode(profilCode).stream()
                .map(employeMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    // ✅ NOUVELLE MÉTHODE 1 : Vérifier si un employé est disponible sur une période
    public boolean estDisponibleSurPeriode(Long employeId, Date dateDebut, Date dateFin) {
        return !affectationRepository.estEmployeOccupeSurPeriode(employeId, dateDebut, dateFin);
    }

    // ✅ NOUVELLE MÉTHODE 2 : Trouver tous les employés disponibles sur une période
    public List<EmployeResponseDTO> findEmployesDisponibles(Date dateDebut, Date dateFin) {
        return employeRepository.findAll().stream()
                .filter(employe -> estDisponibleSurPeriode(employe.getId(), dateDebut, dateFin))
                .map(employeMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    // ✅ NOUVELLE MÉTHODE 3 : Trouver les employés disponibles par profil
    public List<EmployeResponseDTO> findEmployesDisponiblesParProfil(String profilCode, Date dateDebut, Date dateFin) {
        return employeRepository.findByProfilCode(profilCode).stream()
                .filter(employe -> estDisponibleSurPeriode(employe.getId(), dateDebut, dateFin))
                .map(employeMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public void delete(Long id) {
        Employe employe = employeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employé non trouvé avec l'id: " + id));

        // Vérifier s'il a des projets dirigés
        if (employe.getProjetsDiriges() != null && !employe.getProjetsDiriges().isEmpty()) {
            throw new ResourceInUseException("Impossible de supprimer: l'employé dirige des projets");
        }

        // Vérifier s'il a des affectations
        if (employe.getAffectations() != null && !employe.getAffectations().isEmpty()) {
            throw new ResourceInUseException("Impossible de supprimer: l'employé a des affectations en cours");
        }

        employeRepository.delete(employe);
    }
}