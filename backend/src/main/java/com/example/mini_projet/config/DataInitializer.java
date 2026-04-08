package com.example.mini_projet.config;

import com.example.mini_projet.entities.*;
import com.example.mini_projet.repositories.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;

@Component
public class DataInitializer implements CommandLineRunner {

    private final ProfilRepository profilRepository;
    private final EmployeRepository employeRepository;
    private final OrganismeRepository organismeRepository;
    private final ProjetRepository projetRepository;
    private final PhaseRepository phaseRepository;
    private final PasswordEncoder passwordEncoder;  

    public DataInitializer(ProfilRepository profilRepository,
                           EmployeRepository employeRepository,
                           OrganismeRepository organismeRepository,
                           ProjetRepository projetRepository,
                           PhaseRepository phaseRepository,
                           PasswordEncoder passwordEncoder) {  
        this.profilRepository = profilRepository;
        this.employeRepository = employeRepository;
        this.organismeRepository = organismeRepository;
        this.projetRepository = projetRepository;
        this.phaseRepository = phaseRepository;
        this.passwordEncoder = passwordEncoder;  
    }

    @Override
    @Transactional
    public void run(String... args) {
        System.out.println("=== INITIALISATION DES DONNÉES DE TEST ===");

        createProfils();
        createAdminUser();
        createTestData();

        System.out.println("=== INITIALISATION TERMINÉE ===");
    }

    private void createProfils() {
        if (profilRepository.count() == 0) {
            System.out.println("Création des profils...");

            profilRepository.save(new Profil("ADMIN", "Administrateur", "Gestion des utilisateurs"));
            profilRepository.save(new Profil("DIRECTEUR", "Directeur", "Gestion complète des projets"));
            profilRepository.save(new Profil("CHEF_PROJET", "Chef de Projet", "Gestion des phases et affectations"));
            profilRepository.save(new Profil("COMPTABLE", "Comptable", "Gestion des factures et paiements"));
            profilRepository.save(new Profil("SECRETAIRE", "Secrétaire", "Gestion administrative"));
            profilRepository.save(new Profil("TECHNICIEN", "Technicien", "Exécution des tâches"));

            System.out.println(" Profils créés");
        }
    }

    private void createAdminUser() {
        if (employeRepository.findByLogin("admin").isEmpty()) {
            System.out.println("Création de l'utilisateur admin...");

            Profil adminProfil = profilRepository.findByCode("ADMIN").orElseThrow();

            Employe admin = new Employe();
            admin.setMatricule("ADMIN001");
            admin.setNom("Admin");
            admin.setPrenom("System");
            admin.setEmail("admin@toubkalit.ma");
            admin.setLogin("admin");
            
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setTelephone("0600000000");
            admin.setProfil(adminProfil);

            employeRepository.save(admin);
            System.out.println(" Admin créé (login: admin, password: admin123)");
        }
    }

    private void createTestData() {
        if (organismeRepository.count() == 0) {
            System.out.println("Création des données de test...");

            Organisme organisme = new Organisme();
            organisme.setCode("CLI001");
            organisme.setNom("Client SA");
            organisme.setAdresse("123 Rue de Paris, Casablanca");
            organisme.setTelephone("0522-123456");
            organisme.setContactNom("M. Ahmed");
            organisme.setContactEmail("contact@client.ma");
            organisme.setSiteWeb("www.client.ma");
            organismeRepository.save(organisme);

            Profil chefProfil = profilRepository.findByCode("CHEF_PROJET").orElseThrow();
            Employe chef = new Employe();
            chef.setMatricule("CP001");
            chef.setNom("Alaoui");
            chef.setPrenom("Mohamed");
            chef.setEmail("m.alaoui@toubkalit.ma");
            chef.setLogin("chef");
            
            chef.setPassword(passwordEncoder.encode("chef123"));
            chef.setTelephone("0612345678");
            chef.setProfil(chefProfil);
            employeRepository.save(chef);

            Projet projet = new Projet();
            projet.setCode("PROJ2025-001");
            projet.setNom("Développement Application Suivi");
            projet.setDescription("Application de gestion de projets");
            projet.setDateDebut(new Date());
            projet.setDateFin(new Date(System.currentTimeMillis() + 90L * 24 * 60 * 60 * 1000));
            projet.setMontantGlobal(500000.0);
            projet.setOrganisme(organisme);
            projet.setChefProjet(chef);
            projetRepository.save(projet);

            Phase phase1 = new Phase();
            phase1.setCode("PHASE-001");
            phase1.setLibelle("Analyse et Conception");
            phase1.setDescription("Phase d'analyse des besoins");
            phase1.setDateDebut(new Date());
            phase1.setDateFin(new Date(System.currentTimeMillis() + 30L * 24 * 60 * 60 * 1000));
            phase1.setPourcentage(20.0);
            phase1.setMontant(100000.0);
            phase1.setEstTerminee(false);
            phase1.setEstFacturee(false);
            phase1.setEstPayee(false);
            phase1.setProjet(projet);
            phaseRepository.save(phase1);

            System.out.println(" Données de test créées");
        }
    }
}