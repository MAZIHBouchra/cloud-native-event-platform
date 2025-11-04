
# Portail d'Inscription à des Événements (Cloud-Native Event Platform)

Ce projet a pour but de concevoir, déployer et documenter une application web complète en utilisant une architecture Cloud-Native sur Amazon Web Services (AWS). Il s'agit d'un portail permettant aux utilisateurs de créer, gérer et de s'inscrire à des événements.

Il est réalisé dans le cadre du module "Cloud Computing".

## Fonctionnalités Principales

*   **Pour les Organisateurs :**
    *   Créer, modifier et supprimer des événements.
    *   Ajouter une image de présentation pour chaque événement.
    *   Consulter en temps réel la liste des participants inscrits.
*   **Pour les Participants :**
    *   Créer un compte et gérer son profil.
    *   Découvrir et rechercher des événements.
    *   S'inscrire et se désinscrire d'un événement en un clic.

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

*   **Cloud / Infrastructure :**
    *   Amazon Web Services (AWS)
*   **Backend :**
    *   Développé en java (Spring boot)
*   **Frontend :**
    *   Développé avec Vue.js
*   **Base de Données :**
    *   Amazon RDS (MySQL)

## Installation et Lancement Local

*(Cette section sera complétée au fur et à mesure du développement)*
