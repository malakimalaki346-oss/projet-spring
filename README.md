# Système de Suivi de Projets

## Description

Le projet consiste à développer une application web complète de suivi de projets destinée à une société de services réalisant des activités variées telles que le développement logiciel, les études techniques, l'intégration ou encore l'assistance. L'objectif principal est de centraliser l'information liée aux projets afin d'assurer une visibilité complète sur leur évolution, d'améliorer la coordination entre les intervenants et de sécuriser les opérations de mise à jour selon les responsabilités de chaque utilisateur.

L'application est utilisée par plusieurs profils internes : directeur, chefs de projet, comptable, secrétaires et autres employés. Chaque utilisateur accède via un compte personnel et peut consulter ou modifier uniquement les informations autorisées par son rôle.

## Objectifs

- Centraliser la gestion des projets, phases, livrables et documents techniques
- Assurer un suivi financier complet avec gestion des factures et paiements
- Garantir la sécurité des accès avec authentification JWT et gestion des rôles
- Fournir une interface utilisateur intuitive pour la consultation et le reporting
- Permettre la recherche avancée et la génération de rapports par période

## Architecture du projet

### Backend (Spring Boot)
- Architecture en couches : Controllers, Services, Repositories, Entities
- API RESTful avec endpoints documentés via Swagger/OpenAPI
- Sécurisation avec Spring Security et JWT
- Gestion des exceptions centralisée avec @ControllerAdvice
- Validation des données avec Jakarta Validation

### Frontend (React)
- Composants fonctionnels avec hooks (useState, useEffect)
- Gestion d'état avec Context API pour l'authentification
- Routing avec React Router DOM
- Communication API avec Axios et intercepteurs JWT
- Interface responsive avec CSS personnalisé

### Base de données
- MySQL 8.0
- 9 tables : profil, employe, organisme, projet, phase, affectation, livrable, document, facture
- Relations JPA : OneToMany, ManyToOne, OneToOne
- Clé composée pour la table affectation (employe_id, phase_id)

### Infrastructure (Docker)
- Conteneurisation complète avec Docker
- Orchestration avec docker-compose
- Trois services : MySQL, Backend Spring Boot, Frontend React


Base de données : MySQL / PostgreSQL (via JPA/Hibernate)

Documentation : Swagger UI / OpenAPI 3

Outils : Maven, IntelliJ IDEA, OBS Studio (pour les démos)

## Technologies utilisées

### Backend
- Spring Boot 3.5.11
- Spring Data JPA
- Spring Security 6.5.8
- JWT (JJWT 0.11.5)
- MySQL Connector 9.6.0
- Hibernate 6.6.42
- Lombok 1.18.42
- SpringDoc OpenAPI 2.3.0

### Frontend
- React 18
- React Router DOM 6
- Axios 1.6
- Context API
- CSS Modules

### Base de données
- MySQL 8.0

### DevOps
- Docker
- Docker Compose
- Maven
- Git

## Structure du projet

## backend/

![WhatsApp Image 2026-04-03 at 09 22 25](https://github.com/user-attachments/assets/d66b35eb-b877-4edc-b4af-fbd98f5c6924)

<img width="474" height="851" alt="image" src="https://github.com/user-attachments/assets/93b5729f-f6e1-4243-9309-6dc2a91f2f85" />


<img width="463" height="794" alt="image" src="https://github.com/user-attachments/assets/4cc6a3ec-4eb0-425d-9c85-26e5f5dbafff" />


<img width="470" height="834" alt="image" src="https://github.com/user-attachments/assets/1daf4da6-7302-4d6e-8bd3-e7ca9f4f5f1a" />


<img width="463" height="810" alt="image" src="https://github.com/user-attachments/assets/dd84d99c-dafa-46dc-aeb5-96adad62ca6b" />


<img width="469" height="320" alt="image" src="https://github.com/user-attachments/assets/201fee6c-1ef6-49f1-b074-f93f122cba55" />


## frontend/

<img width="458" height="837" alt="image" src="https://github.com/user-attachments/assets/8d4336e6-ca78-4cd4-829c-001d09db90d0" />


<img width="461" height="809" alt="image" src="https://github.com/user-attachments/assets/196b11ee-ba62-4995-82e7-fdf4c6e6b255" />



## Installation et exécution

### Prérequis
- Java 21
- Maven 3.9+
- Node.js 18+
- MySQL 8.0
- Docker et Docker Compose (optionnel)

### Étapes d'installation

    bash
     git clone https://github.com/malakimalaki346-oss/projet-spring.git
     cd projet-spring


## Lancer avec Docker

    docker-compose up --build

## Lancer sans Docker

### Backend

    cd backend
    mvn clean install
    <img width="1855" height="928" alt="Capture d&#39;écran 2026-04-09 111031" src="https://github.com/user-attachments/assets/08ce3b08-7815-4166-8a44-19f728084e40" />
    <img width="1815" height="905" alt="Capture d&#39;écran 2026-04-09 111121" src="https://github.com/user-attachments/assets/3eebfcd6-c9c8-4063-82a7-aed68be691da" />

    mvn spring-boot:run
    <img width="1867" height="931" alt="Capture d&#39;écran 2026-04-09 111240" src="https://github.com/user-attachments/assets/1f8750ab-7ba7-457f-af3f-b0b191d346af" />
    <img width="1866" height="927" alt="Capture d&#39;écran 2026-04-09 111250" src="https://github.com/user-attachments/assets/0add9449-aeaa-4962-92b8-78a4ae422354" />
    <img width="1866" height="924" alt="Capture d&#39;écran 2026-04-09 111301" src="https://github.com/user-attachments/assets/22858c49-d225-402d-ad8e-0359dcc00483" />

    

### Frontend

    cd frontend
    npm install
    npm start


## Sécurité
- Type d'authentification : JWT (JSON Web Token) avec expiration 24h

- Gestion des rôles : ADMIN, DIRECTEUR, CHEF_PROJET, COMPTABLE, SECRETAIRE, TECHNICIEN

- Protection des routes :

      Endpoints backend protégés avec @PreAuthorize

      Routes frontend protégées avec PrivateRoute component

      Intercepteur Axios pour ajout automatique du token

## Rôles et permissions
Rôle:          Permissions
ADMIN:	       Gestion complète (employés, profils, suppression)
DIRECTEUR:  	 Consultation tout, modification projets (montant, chef)
CHEF_PROJET:	 Gestion phases, affectations, livrables
COMPTABLE:	   Gestion factures, paiements, états financiers
SECRETAIRE:	   Gestion organismes, création projets, documents
TECHNICIEN:	   Consultation seule

## Fonctionnalités principales
- Gestion complète des organismes clients (CRUD + recherche)

- Gestion des employés avec profils et disponibilité

- Gestion des projets avec règles métier (dates, montants)

- Gestion des phases avec calcul automatique des montants

- Affectation des employés aux phases avec vérification de disponibilité

- Gestion des livrables et documents techniques

- Gestion des factures avec suivi des états (facturée/payée)

- Authentification JWT avec gestion des rôles

- Documentation API Swagger














