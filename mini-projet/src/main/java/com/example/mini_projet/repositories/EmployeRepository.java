package com.example.mini_projet.repositories;

import com.example.mini_projet.entities.Employe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeRepository extends JpaRepository<Employe, Long> {
    Optional<Employe> findByMatricule(String matricule);
    Optional<Employe> findByLogin(String login);
    Optional<Employe> findByEmail(String email);
    List<Employe> findByProfilCode(String profilCode);
    boolean existsByMatricule(String matricule);
    boolean existsByLogin(String login);
    boolean existsByEmail(String email);

    @Query("SELECT e FROM Employe e WHERE e.profil.code = :codeProfil")
    List<Employe> findByProfilCodeWithJPQL(@Param("codeProfil") String codeProfil);
}