# Convene: Plateforme d'Événements Cloud-Native

Ce projet a pour but de concevoir et déployer une application web complète en utilisant une architecture Cloud-Native sur Amazon Web Services (AWS). Il s'agit d'un portail permettant aux utilisateurs de créer, gérer et de s'inscrire à des événements.

Il est réalisé dans le cadre du module "Cloud Computing" de l'Université Ibn Zohr (Année 2025/2026).

### Les 7 Composants Cloud

| Rôle Architectural | Service AWS Implémenté |
| ------------------------------------ | -------------------------- |
| 1. Hébergement Web Managé (PaaS) | **AWS Elastic Beanstalk** |
| 2. Base de Données Relationnelle (DBaaS) | **Amazon RDS** |
| 3. Gestion de l'Identité Utilisateur | **AWS Cognito** |
| 4. Gestion Sécurisée des Secrets | **AWS Secrets Manager** |
| 5. Stockage d'Objets | **Amazon S3** |
| 6. Réseau de Diffusion de Contenu (CDN) | **Amazon CloudFront** |
| 7. Surveillance & Performance (APM) | **Amazon CloudWatch** |

## Technologies Utilisées

| Catégorie | Technologie |
| :--- | :--- |
| **Cloud / Infrastructure** | Amazon Web Services (AWS) |
| **Backend** | Java, Spring Boot, Maven, JPA/Hibernate |
| **Frontend** | Next.js |
| **Base de Données** | MySQL |

## Guide de Lancement Local

#### Prérequis

*   Java JDK [À compléter : ex: 17+] et Maven
*   Node.js [À compléter : ex: v18+] et npm/pnpm
*   Un compte AWS configuré avec les accès (pour les services)

---

### **Backend (Spring Boot)**

1.  **Naviguez dans le dossier backend :**
    ```bash
    cd backend
    ```

2.  **Configurez vos variables d'environnement pour la base de données MySQL :**

    ```bash
    # Exemple
    set DB_URL=jdbc:mysql://localhost:3306/convene?useSSL=false&serverTimezone=UTC
    set DB_USERNAME=convene_user
    set DB_PASSWORD=secret
    ```

    > Pour initialiser le schéma et quelques données d'exemple, exécutez le script `frontend/scripts/init-database.sql` sur votre instance MySQL.

3.  **Lancez l'application :**
    ```bash
    ./mvnw spring-boot:run
    ```
    L'API sera accessible sur `http://localhost:8080`.

---

### **Frontend (Next.js)**

1.  **Naviguez dans le dossier frontend (depuis la racine) :**
    ```bash
    cd frontend
    ```
2.  **Installez les dépendances :**
    ```bash
    npm install
    ```
3.  **Définissez l'URL de l'API backend :**

    ```bash
    # Exemple
    set NEXT_PUBLIC_EVENTS_API_URL=http://localhost:8080
    ```

4.  **Lancez le serveur de développement :**
    ```bash
    npm run dev
    ```
    L'interface sera accessible sur `http://localhost:3000`.

