package com.example.mini_projet.repositories;

import com.example.mini_projet.entities.Affectation;
import com.example.mini_projet.entities.AffectationId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Date;
import java.util.List;

@Repository
public interface AffectationRepository extends JpaRepository<Affectation, AffectationId> {
    List<Affectation> findByEmployeId(Long employeId);
    List<Affectation> findByPhaseId(Long phaseId);

    @Query("SELECT a FROM Affectation a WHERE a.employe.id = :employeId AND a.dateDebut >= :debut AND a.dateFin <= :fin")
    List<Affectation> findEmployeAffectationsSurPeriode(
            @Param("employeId") Long employeId,
            @Param("debut") Date debut,
            @Param("fin") Date fin);

    @Query("SELECT CASE WHEN COUNT(a) > 0 THEN true ELSE false END FROM Affectation a " +
            "WHERE a.employe.id = :employeId AND a.dateDebut <= :fin AND a.dateFin >= :debut")
    boolean estEmployeOccupeSurPeriode(
            @Param("employeId") Long employeId,
            @Param("debut") Date debut,
            @Param("fin") Date fin);

    @Query("SELECT a FROM Affectation a WHERE a.phase.projet.id = :projetId")
    List<Affectation> findAffectationsByProjet(@Param("projetId") Long projetId);
}