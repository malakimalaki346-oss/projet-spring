package com.example.mini_projet.repositories;

import com.example.mini_projet.entities.Livrable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface LivrableRepository extends JpaRepository<Livrable, Long> {
    List<Livrable> findByPhaseId(Long phaseId);
    Optional<Livrable> findByCode(String code);
    List<Livrable> findByPhaseProjetId(Long projetId);
}