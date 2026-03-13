package com.example.mini_projet.repositories;

import com.example.mini_projet.entities.Projet;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProjetRepository extends JpaRepository<Projet, Long> {
    Optional<Projet> findByCode(String code);
    List<Projet> findByChefProjetId(Long chefProjetId);
    List<Projet> findByOrganismeId(Long organismeId);
    List<Projet> findByDateDebutBetween(Date debut, Date fin);
    List<Projet> findByNomContainingIgnoreCase(String nom);
    Page<Projet> findByNomContainingIgnoreCase(String nom, Pageable pageable);

    @Query("SELECT p FROM Projet p WHERE p.chefProjet.id = :chefId")
    List<Projet> findProjetsByChef(@Param("chefId") Long chefId);

    @Query("SELECT p FROM Projet p WHERE p.dateFin < CURRENT_DATE")
    List<Projet> findProjetsTermines();

    @Query("SELECT p FROM Projet p WHERE p.dateDebut > CURRENT_DATE")
    List<Projet> findProjetsFuturs();
}