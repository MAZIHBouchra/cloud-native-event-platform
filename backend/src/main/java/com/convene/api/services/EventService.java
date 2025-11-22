package com.convene.api.services;

import com.convene.api.dtos.EventResponseDtos;
import com.convene.api.models.Event;
import com.convene.api.models.EventStatus;
import com.convene.api.repositories.EventRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;

    public List<EventResponseDtos> getEvents(
            String search, String category, String city, LocalDateTime startDate, LocalDateTime endDate) {
        String normalizedSearch = normalize(search);
        String normalizedCategory = normalize(category);
        String normalizedCity = normalize(city);

        List<Event> events =
                eventRepository.searchEvents(EventStatus.PUBLISHED, normalizedCategory, normalizedCity, startDate, endDate, normalizedSearch);

        return events.stream().map(this::toResponse).toList();
    }

    /**
     * Cette méthode est utilisée pour l'affichage public (filtre uniquement les PUBLISHED).
     */
    public Optional<EventResponseDtos> getEvent(UUID id) {
        return eventRepository.findByIdAndStatus(id, EventStatus.PUBLISHED).map(this::toResponse);
    }

    // ========================================================================
    // ================== SECTION CORRIGÉE ====================================
    // ========================================================================

    /**
     * Met à jour un événement existant.
     * Utilise @Transactional pour assurer l'intégrité des données.
     */
    @Transactional
    public Optional<EventResponseDtos> updateEvent(UUID id, EventResponseDtos eventDetails) {
        // On utilise findById (standard JPA) car l'organisateur doit pouvoir
        // modifier un événement même s'il est en DRAFT ou CANCELLED.
        return eventRepository.findById(id).map(existingEvent -> {
            
            // Mise à jour des champs avec les accesseurs corrects pour un record
            existingEvent.setTitle(eventDetails.title());
            existingEvent.setDescription(eventDetails.description());
            existingEvent.setCategory(eventDetails.category());
            existingEvent.setImageUrl(eventDetails.imageUrl());
            existingEvent.setEventDate(eventDetails.eventDate());
            
            // Gestion de la localisation avec les bons noms de champs du DTO
            existingEvent.setLocationCity(eventDetails.city());
            existingEvent.setLocationAddress(eventDetails.address());
            
            // Gestion des places
            existingEvent.setTotalSeats(eventDetails.totalSeats());
            existingEvent.setAvailableSeats(eventDetails.availableSeats());
            
            existingEvent.setStatus(eventDetails.status());

            // Sauvegarde en base
            Event savedEvent = eventRepository.save(existingEvent);
            
            // Retourne le DTO mis à jour
            return toResponse(savedEvent);
        });
    }

    /**
     * Supprime un événement.
     * Retourne true si succès, false si l'événement n'existait pas.
     */
    @Transactional
    public boolean deleteEvent(UUID id) {
        if (eventRepository.existsById(id)) {
            eventRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // ========================================================================
    // ========================================================================

    private EventResponseDtos toResponse(Event event) {
        return new EventResponseDtos(
                event.getId(),
                event.getTitle(),
                event.getDescription(),
                event.getCategory(),
                event.getImageUrl(),
                event.getEventDate(),
                event.getLocationCity(),
                event.getLocationAddress(),
                event.getTotalSeats(),
                event.getAvailableSeats(),
                event.getStatus());
    }

    private String normalize(String value) {
        if (!StringUtils.hasText(value)) {
            return null;
        }
        return value.trim();
    }
}