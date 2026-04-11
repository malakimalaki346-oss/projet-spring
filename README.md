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
![WhatsApp Image 2026-04-10 at 21 23 06 (1)](https://github.com/user-attachments/assets/d3ed0ad8-3381-4ecf-8187-377095a5ef0a)

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

<img width="698" height="284" alt="image" src="https://github.com/user-attachments/assets/e5063a06-111c-41a2-a4c9-f5c5cfefd594" />


<img width="653" height="734" alt="image" src="https://github.com/user-attachments/assets/845225c9-a020-4181-8544-d8f3042fda08" />


<img width="474" height="851" alt="image" src="https://github.com/user-attachments/assets/93b5729f-f6e1-4243-9309-6dc2a91f2f85" />


<img width="463" height="794" alt="image" src="https://github.com/user-attachments/assets/4cc6a3ec-4eb0-425d-9c85-26e5f5dbafff" />


<img width="470" height="834" alt="image" src="https://github.com/user-attachments/assets/1daf4da6-7302-4d6e-8bd3-e7ca9f4f5f1a" />


<img width="463" height="810" alt="image" src="https://github.com/user-attachments/assets/dd84d99c-dafa-46dc-aeb5-96adad62ca6b" />


<img width="469" height="320" alt="image" src="https://github.com/user-attachments/assets/201fee6c-1ef6-49f1-b074-f93f122cba55" />


## frontend/

<img width="653" height="798" alt="image" src="https://github.com/user-attachments/assets/13c3dec1-4354-4008-bcc6-09421e0b6413" />


<img width="640" height="799" alt="image" src="https://github.com/user-attachments/assets/00e7204f-183f-48ef-8fb0-1b1658396f69" />


<img width="646" height="810" alt="image" src="https://github.com/user-attachments/assets/c368c024-921c-412a-86e4-c6a1620b1b51" />


<img width="620" height="817" alt="image" src="https://github.com/user-attachments/assets/7ccd4775-0235-4fb6-bdb1-83aae0f471e8" />


<img width="634" height="118" alt="image" src="https://github.com/user-attachments/assets/6a5dafe6-543d-4e14-b2ad-83be61890620" />


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
    
<img width="1880" height="905" alt="Capture d&#39;écran 2026-04-10 140008" src="https://github.com/user-attachments/assets/908bd4d3-1c54-482b-92ea-34234e2cc8ed" />
<img width="1887" height="914" alt="Capture d&#39;écran 2026-04-10 140022" src="https://github.com/user-attachments/assets/113a0808-dfcc-43c5-977b-12f2dd6fc256" />

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
    
<img width="1864" height="908" alt="Capture d&#39;écran 2026-04-10 153936" src="https://github.com/user-attachments/assets/adc9e3d6-350d-46ed-ab90-4147a7028f37" />
<img width="1881" height="347" alt="Capture d&#39;écran 2026-04-10 154028" src="https://github.com/user-attachments/assets/ea081ab4-ac7b-448b-a8d1-6479f46e3c74" />

    npm start
    
<img width="1868" height="661" alt="Capture d&#39;écran 2026-04-10 154112" src="https://github.com/user-attachments/assets/596d2401-66e8-48a3-a9cd-55654abec024" />



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
### Gestion des organismes
- Création, modification, consultation et suppression d'un organisme client
- Recherche par nom, code ou contact
- Visualisation des projets associés à chaque organisme

### Gestion des employés
- Création, modification, consultation et suppression d'un employé
- Attribution d'un profil (rôle) à chaque employé
- Vérification de disponibilité sur une période donnée
- Recherche par profil (chef de projet, technicien, etc.)

  ### Gestion des projets
- Création, modification, consultation et suppression d'un projet
- Validation des dates (date début < date fin)
- Association à un organisme client et à un chef de projet
- Calcul automatique du montant total des phases
- Résumé détaillé du projet (phases, montants, avancement)

### Gestion des phases
- Création de phases dans un projet
- Validation des dates (comprises dans l'intervalle du projet)
- Calcul automatique du montant à partir du pourcentage
- Validation que la somme des montants des phases ne dépasse pas le montant du projet
- Mise à jour des états : terminée, facturée, payée

### Gestion des affectations
- Affectation d'un employé à une phase (clé composée employe_id + phase_id)
- Vérification de la disponibilité de l'employé sur la période
- Validation que les dates d'affectation sont dans l'intervalle de la phase
- Consultation des affectations par phase ou par employé

  ### Gestion des livrables
- Ajout de livrables à une phase
- Stockage du chemin du fichier
- Consultation des livrables par phase

### Gestion des documents
- Ajout de documents techniques à un projet
- Types de documents : CDC, SPEC, ARCHI, CR, etc.
- Consultation des documents par projet

### Gestion des factures
- Création de facture pour une phase terminée
- Validation qu'une phase ne peut être facturée deux fois
- Enregistrement du paiement
- Consultation des phases terminées non facturées
- Consultation des phases facturées non payées

  ### Authentification et sécurité
- Login avec génération de token JWT
- Récupération des informations de l'utilisateur connecté
- Changement de mot de passe
- Protection des endpoints par rôle (@PreAuthorize)
- Hashage des mots de passe avec BCrypt

  ## API Endpoints
### Authentification

<img width="1882" height="293" alt="Capture d&#39;écran 2026-04-10 160738" src="https://github.com/user-attachments/assets/7e720c16-b3e8-4dd1-8181-44c857b09f7f" />
### Organismes

<img width="1833" height="567" alt="Capture d&#39;écran 2026-04-10 160931" src="https://github.com/user-attachments/assets/828af641-ceb1-46c0-8180-e8c9f2c663a1" />
### Employés

<img width="1820" height="657" alt="Capture d&#39;écran 2026-04-10 161135" src="https://github.com/user-attachments/assets/383005fd-b3a2-4338-8799-6d9774b54ae4" />
### Projets

<img width="1873" height="807" alt="Capture d&#39;écran 2026-04-10 161227" src="https://github.com/user-attachments/assets/fd46bc53-54f5-4403-8c63-279f95338f67" />
### Phases

<img width="1830" height="857" alt="Capture d&#39;écran 2026-04-10 161334" src="https://github.com/user-attachments/assets/4aba2330-7f2f-464f-8017-de096d5a5ec8" />
### Affectations

<img width="1800" height="524" alt="Capture d&#39;écran 2026-04-10 161439" src="https://github.com/user-attachments/assets/b0ebf8b2-6921-4ea8-97f4-44c2423b8c00" />
### Livrables

<img width="1807" height="455" alt="Capture d&#39;écran 2026-04-10 161502" src="https://github.com/user-attachments/assets/d3ba33d2-c4f1-4be3-b318-0c831b95c1a2" />
### Documents

<img width="1821" height="481" alt="Capture d&#39;écran 2026-04-10 161558" src="https://github.com/user-attachments/assets/bc9bdc53-386d-48c6-b524-e5c84f666262" />
### Factures

<img width="1857" height="527" alt="Capture d&#39;écran 2026-04-10 161621" src="https://github.com/user-attachments/assets/f2fc8f0f-bc8f-4874-950b-f359b84184ac" />

## Règles métier implémentées

1. **Validation des dates** : dateDebut < dateFin pour projet et phase
2. **Cohérence projet-phase** : dates phase comprises dans dates projet
3. **Montant phases** : somme montants phases ≤ montant global projet
4. **Disponibilité employé** : un employé ne peut être affecté à deux phases simultanément
5. **Facturation** : seule une phase terminée peut être facturée
6. **Unicité** : codes projet, matricule employé, login, email uniques
7. **Clé composée** : une affectation unique par couple (employe_id, phase_id)


## Dashboard / Reporting


- Tableau de bord avec indicateurs clés (nombre de projets, montants)

- Liste des projets récents

- Phases terminées non facturées

- Phases facturées non payées

- Recherche multi-critères sur projets, organismes, employés

- Pagination sur toutes les listes

## Vidéo de démonstration

### ADMIN:



https://github.com/user-attachments/assets/0a12e7c9-f74b-40b4-b0bf-e9bc2b8627f1



https://github.com/user-attachments/assets/f676d35d-ee8f-4741-939c-df3e586a2e7b




https://github.com/user-attachments/assets/0d2c1957-e108-4172-9463-c52e73044e37












https://github.com/user-attachments/assets/efa8755e-eb9b-4998-b246-96f7bbf4c038

https://github.com/user-attachments/assets/3f4b0367-9ced-4e0c-ab65-ebd81b889965




https://github.com/user-attachments/assets/02a2767a-c769-4655-9acf-0b7bac1fd456



https://github.com/user-attachments/assets/e8104d09-ad57-4cd8-8d19-f7ad13805d7f



https://github.com/user-attachments/assets/5d39ccb2-a764-4c21-869b-48389a034023



https://github.com/user-attachments/assets/17d90ce6-743c-42be-a125-8c92fa106bc9



https://github.com/user-attachments/assets/c3da0149-678d-4e5d-a402-6d9f7f85c9c4



https://github.com/user-attachments/assets/bf39c229-3975-4923-8e2c-bef3c7350c20




## API Documentation (Swagger)
Lien : http://localhost:8081/swagger-ui.html

## Tests

### Connexion
POST /api/auth/login

<img width="1439" height="908" alt="Capture d&#39;écran 2026-04-10 162652" src="https://github.com/user-attachments/assets/8ceda4db-e6e2-4087-a7e1-0af50a57fe58" />

#### Créer un organisme
POST /api/organismes

<img width="1682" height="655" alt="Capture d&#39;écran 2026-04-10 163002" src="https://github.com/user-attachments/assets/682c1a12-8451-46d0-87ac-a168b698468f" />


<img width="1627" height="241" alt="Capture d&#39;écran 2026-04-10 163019" src="https://github.com/user-attachments/assets/98b97ab4-dd9c-4844-b195-7d73dc5053fa" />


#### Créer un projet


<img width="1789" height="810" alt="Capture d&#39;écran 2026-04-10 163614" src="https://github.com/user-attachments/assets/65f96d61-a0d2-4672-aff6-9364d0add02b" />

<img width="1816" height="380" alt="Capture d&#39;écran 2026-04-10 163650" src="https://github.com/user-attachments/assets/d8940183-c81e-4e2f-9c5c-fd17825e34ce" />

#### Créer une phase


<img width="1686" height="652" alt="Capture d&#39;écran 2026-04-10 165804" src="https://github.com/user-attachments/assets/da341193-26e0-4175-a919-6d935b955ed8" />

<img width="1616" height="258" alt="Capture d&#39;écran 2026-04-10 165656" src="https://github.com/user-attachments/assets/ff8aac64-d2a8-46ee-b79a-88663465a1fb" />


## Conteneurisation
Dockerfile backend : Multi-stage build avec OpenJDK 21

Dockerfile frontend : Build avec Node.js, production avec Nginx

docker-compose.yml : Orchestration des trois services (MySQL, backend, frontend)

# Auteurs
Nom 1 : OUARIBA FATIMA ZAHRA

Nom 2 : NAIT HADDOU MALAK

## Remarques
Les mots de passe sont hashés avec BCrypt avant stockage

La clé secrète JWT est configurable dans application.properties

La base de données est créée automatiquement au premier démarrage (ddl-auto=update)

L'application inclut un initialiseur de données de test (DataInitializer)

Les phases vérifient automatiquement que leur montant total ne dépasse pas le projet

Les affectations vérifient la disponibilité des employés sur les périodes

