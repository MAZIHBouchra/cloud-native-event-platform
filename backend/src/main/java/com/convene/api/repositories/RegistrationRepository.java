package com.convene.api.repositories;

import com.convene.api.models.Registration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Long> {

    // Trouver toutes les inscriptions d'un participant (pour le dashboard "Mes Inscriptions")
    List<Registration> findByParticipantEmail(String participantEmail);

    // Vérifier si un participant est déjà inscrit à un événement précis (pour éviter les doublons)
    boolean existsByParticipantEmailAndEventId(String participantEmail, Long eventId);
    
    // Trouver une inscription spécifique (pour se désinscrire)
    Optional<Registration> findByParticipantEmailAndEventId(String participantEmail, Long eventId);
}