package com.example.mini_projet.repositories;

import com.example.mini_projet.entities.Facture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface FactureRepository extends JpaRepository<Facture, Long> {
    Optional<Facture> findByNumeroFacture(String numeroFacture);
    Optional<Facture> findByPhaseId(Long phaseId);
    List<Facture> findByDateFactureBetween(Date debut, Date fin);
    List<Facture> findByDatePaiementIsNull();
    List<Facture> findByDatePaiementIsNotNull();

    @Query("SELECT f FROM Facture f WHERE f.datePaiement IS NULL AND f.dateFacture < :date")
    List<Facture> findFacturesImpayeesAvant(@Param("date") Date date);
}