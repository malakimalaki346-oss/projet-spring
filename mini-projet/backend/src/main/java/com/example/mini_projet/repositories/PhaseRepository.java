package com.example.mini_projet.repositories;

import com.example.mini_projet.entities.Phase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Date;
import java.util.List;

@Repository
public interface PhaseRepository extends JpaRepository<Phase, Long> {
    List<Phase> findByProjetId(Long projetId);
    List<Phase> findByEstTerminee(boolean estTerminee);
    List<Phase> findByEstFactureeAndEstTerminee(boolean estFacturee, boolean estTerminee);
    List<Phase> findByEstPayeeAndEstFacturee(boolean estPayee, boolean estFacturee);

    @Query("SELECT p FROM Phase p WHERE p.estTerminee = true AND p.estFacturee = false")
    List<Phase> findTermineesNonFacturees();

    @Query("SELECT p FROM Phase p WHERE p.estFacturee = true AND p.estPayee = false")
    List<Phase> findFactureesNonPayees();

    @Query("SELECT p FROM Phase p WHERE p.dateFin BETWEEN :debut AND :fin")
    List<Phase> findByPeriode(@Param("debut") Date debut, @Param("fin") Date fin);

    @Query("SELECT SUM(p.montant) FROM Phase p WHERE p.projet.id = :projetId")
    Double sumMontantPhasesByProjet(@Param("projetId") Long projetId);
}