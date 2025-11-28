package com.convene.api.repositories;

import com.convene.api.models.Registration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Long> {

    // Trouver toutes les inscriptions d'un participant
    List<Registration> findByParticipantEmail(String participantEmail);

    List<Registration> findByEventId(Long eventId);

    // Vérifier si un participant est déjà inscrit
    boolean existsByParticipantEmailAndEventId(String participantEmail, Long eventId);
    
    // Trouver une inscription spécifique
    Optional<Registration> findByParticipantEmailAndEventId(String participantEmail, Long eventId);

    // C'EST LA MÉTHODE MANQUANTE QU'IL FAUT AJOUTER 
    // Elle permet à Spring Boot de supprimer toutes les inscriptions liées à un événement
    void deleteByEventId(Long eventId);
}