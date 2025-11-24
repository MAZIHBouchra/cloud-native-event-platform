-- ---------------------------------------------------------------------------
-- Schema SQL basé sur le diagramme de classes "Portail d'Inscription aux Événements"
-- Compatible MySQL / Amazon RDS MySQL
--
-- Classes modélisées :
--   - Utilisateur  (rôle: participant ou organisateur)
--   - Role         (ex : "Participant", "Organisateur")
--   - Evenement    (organisé par un utilisateur)
--   - Inscription  (lien entre un participant et un événement)
--
-- Les mots de passe des utilisateurs doivent être fournis sous forme hashée.
-- ---------------------------------------------------------------------------

/* Activer le mode SQL strict pour garantir l'intégrité. */
SET sql_mode = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

/* Créer la base si besoin (décommentez selon vos besoins) */
-- CREATE DATABASE IF NOT EXISTS convene CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE convene;

/* Supprimer les tables existantes (ordre inverse des dépendances) */
DROP TABLE IF EXISTS inscriptions;
DROP TABLE IF EXISTS evenements;
DROP TABLE IF EXISTS utilisateurs;
DROP TABLE IF EXISTS roles;

/* Table des rôles (Participant, Organisateur, etc.) */
CREATE TABLE roles (
  id_role        INT AUTO_INCREMENT PRIMARY KEY,
  libelle        VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/* Table des utilisateurs */
CREATE TABLE utilisateurs (
  id_utilisateur   BIGINT AUTO_INCREMENT PRIMARY KEY,
  nom              VARCHAR(100) NOT NULL,
  prenom           VARCHAR(100) NOT NULL,
  email            VARCHAR(150) NOT NULL UNIQUE,
  mot_de_passe_hash VARCHAR(255) NOT NULL,
  telephone        VARCHAR(30),
  role_id          INT NOT NULL,
  date_creation    DATETIME DEFAULT CURRENT_TIMESTAMP,
  date_mise_a_jour DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_utilisateur_role
    FOREIGN KEY (role_id) REFERENCES roles (id_role)
      ON UPDATE CASCADE
      ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_utilisateur_role ON utilisateurs (role_id);

/* Table des événements */
CREATE TABLE evenements (
  id_evenement       BIGINT AUTO_INCREMENT PRIMARY KEY,
  titre              VARCHAR(200) NOT NULL,
  description        TEXT NOT NULL,
  categorie          VARCHAR(100),
  date_evenement     DATETIME NOT NULL,
  ville              VARCHAR(120) NOT NULL,
  adresse            VARCHAR(255) NOT NULL,
  places_totales     INT NOT NULL,
  places_disponibles INT NOT NULL,
  organisateur_id    BIGINT NOT NULL,
  date_creation      DATETIME DEFAULT CURRENT_TIMESTAMP,
  date_mise_a_jour   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_places
    CHECK (places_totales >= 0 AND places_disponibles >= 0 AND places_disponibles <= places_totales),
  CONSTRAINT fk_evenement_organisateur
    FOREIGN KEY (organisateur_id) REFERENCES utilisateurs (id_utilisateur)
      ON UPDATE CASCADE
      ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_evenement_organisateur ON evenements (organisateur_id);
CREATE INDEX idx_evenement_date ON evenements (date_evenement);
CREATE INDEX idx_evenement_ville ON evenements (ville);

/* Table des inscriptions (participant <> événement) */
CREATE TABLE inscriptions (
  id_inscription    BIGINT AUTO_INCREMENT PRIMARY KEY,
  participant_id    BIGINT NOT NULL,
  evenement_id      BIGINT NOT NULL,
  date_inscription  DATETIME DEFAULT CURRENT_TIMESTAMP,
  statut            ENUM('CONFIRMEE', 'ANNULEE') DEFAULT 'CONFIRMEE',
  CONSTRAINT fk_inscription_participant
    FOREIGN KEY (participant_id) REFERENCES utilisateurs (id_utilisateur)
      ON UPDATE CASCADE
      ON DELETE CASCADE,
  CONSTRAINT fk_inscription_evenement
    FOREIGN KEY (evenement_id) REFERENCES evenements (id_evenement)
      ON UPDATE CASCADE
      ON DELETE CASCADE,
  CONSTRAINT uq_participant_evenement UNIQUE (participant_id, evenement_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_inscription_evenement ON inscriptions (evenement_id);

/* ---------------------------------------------------------------------------
   Jeu de données d'exemple (facultatif) */
INSERT INTO roles (libelle) VALUES ('Participant'), ('Organisateur');

INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe_hash, telephone, role_id)
VALUES
  ('Dupont', 'Alice', 'alice.participant@example.com', '$2y$10$examplehashparticipant', '+33123456789', 1),
  ('Martin', 'Jean', 'jean.organisateur@example.com', '$2y$10$examplehashorganisateur', '+33987654321', 2);

INSERT INTO evenements (titre, description, categorie, date_evenement, ville, adresse, places_totales, places_disponibles, organisateur_id)
VALUES
  ('Atelier Cloud AWS', 'Découverte des services AWS pour les débutants.', 'Technologie', DATE_ADD(NOW(), INTERVAL 15 DAY), 'Paris', '10 Rue du Cloud, Paris', 100, 80, 2),
  ('Workshop UX Design', 'Créer des expériences utilisateurs efficaces.', 'Design', DATE_ADD(NOW(), INTERVAL 30 DAY), 'Lyon', '25 Avenue des Designers, Lyon', 60, 45, 2);

INSERT INTO inscriptions (participant_id, evenement_id, statut)
VALUES
  (1, 1, 'CONFIRMEE');
-- ---------------------------------------------------------------------------


