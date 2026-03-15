# 🚀 API de Suivi de Projets (Mini-Projet) :

Cette application est une API REST développée avec Spring Boot, conçue pour la gestion complète de projets, incluant le suivi des phases, des employés, des livrables et de la facturation. Elle intègre une sécurité basée sur JWT et une documentation interactive avec Swagger.

# 📋 Fonctionnalités :

Le projet est divisé en plusieurs modules de gestion :

Gestion des Projets & Phases : Création, suivi de l'état d'avancement et organisation chronologique.

Gestion des Employés & Affectations : Attribution des ressources humaines aux différentes phases d'un projet.

Gestion des Livrables : Suivi des fichiers et résultats attendus par phase.

Gestion de la Facturation : Génération et suivi des factures clients et organismes.

Reporting & Statistiques : Consultation de tableaux de bord sur l'état des projets.

Sécurité : Authentification et autorisation via JSON Web Token (JWT).

# 🏗️ Architecture Technique :

L'application suit une architecture N-Tier (multi-couches) pour assurer la maintenabilité et l'évolutivité :

Controllers : Points d'entrée REST de l'API.

Services : Logique métier de l'application.

Repositories : Couche d'accès aux données (Spring Data JPA).

Entities : Modèles de données persistants.

DTOs & Mappers : Transfert de données sécurisé et conversion entre entités et objets de réponse (utilisation de MapStruct).

Security : Configuration JWT et gestion des accès.

# 🛠️ Technologies Utilisées :

Backend : Java 17+, Spring Boot 3.x

Sécurité : Spring Security, JWT

Base de données : MySQL / PostgreSQL (via JPA/Hibernate)

Documentation : Swagger UI / OpenAPI 3

Outils : Maven, IntelliJ IDEA, OBS Studio (pour les démos)

