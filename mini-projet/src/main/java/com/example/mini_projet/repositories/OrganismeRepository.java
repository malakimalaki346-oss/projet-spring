package com.example.mini_projet.repositories;

import com.example.mini_projet.entities.Organisme;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrganismeRepository extends JpaRepository<Organisme, Long> {
    Optional<Organisme> findByCode(String code);
    List<Organisme> findByNomContainingIgnoreCase(String nom);
    List<Organisme> findByContactNomContainingIgnoreCase(String contactNom);
    boolean existsByCode(String code);
}