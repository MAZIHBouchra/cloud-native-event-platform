package com.convene.api.services;

import com.convene.api.models.Event;
import com.convene.api.models.Registration;
import com.convene.api.repositories.EventRepository;
import com.convene.api.repositories.RegistrationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final EventRepository eventRepository;

    /**
     * Inscrire un utilisateur à un événement
     */
    @Transactional // Important : Si une étape échoue, tout est annulé (rollback)
    public Registration registerUser(String userEmail, Long eventId) {
        
        // 1. Vérifier si l'événement existe
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Événement non trouvé"));

        // 2. Vérifier si l'utilisateur est déjà inscrit
        if (registrationRepository.existsByParticipantEmailAndEventId(userEmail, eventId)) {
            throw new RuntimeException("Vous êtes déjà inscrit à cet événement.");
        }

        // 3. Vérifier s'il reste des places
        if (event.getAvailableSeats() <= 0) {
            throw new RuntimeException("Désolé, cet événement est complet.");
        }

        // 4. Créer l'inscription
        Registration registration = new Registration();
        registration.setParticipantEmail(userEmail);
        registration.setEvent(event);
        registration.setStatus("CONFIRMED");

        // 5. Décrémenter le nombre de places disponibles
        event.setAvailableSeats(event.getAvailableSeats() - 1);
        eventRepository.save(event);

        // 6. Sauvegarder l'inscription
        return registrationRepository.save(registration);
    }

    /**
     * Récupérer toutes les inscriptions d'un utilisateur
     */
    public List<Registration> getUserRegistrations(String userEmail) {
        return registrationRepository.findByParticipantEmail(userEmail);
    }

    /**
     * Désinscrire un utilisateur (Optionnel pour l'instant)
     */
    @Transactional
    public void cancelRegistration(String userEmail, Long eventId) {
        Registration registration = registrationRepository.findByParticipantEmailAndEventId(userEmail, eventId)
                .orElseThrow(() -> new RuntimeException("Inscription introuvable"));

        // On remet la place disponible
        Event event = registration.getEvent();
        event.setAvailableSeats(event.getAvailableSeats() + 1);
        eventRepository.save(event);

        // On supprime l'inscription
        registrationRepository.delete(registration);
    }

    public List<Registration> getEventRegistrations(Long eventId) {
        return registrationRepository.findByEventId(eventId);
    }
}