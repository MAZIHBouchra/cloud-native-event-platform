package com.convene.api.services;

import com.convene.api.dtos.EventRequestDTO;
import com.convene.api.models.Event;
import com.convene.api.repositories.EventRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Service
import com.convene.api.dtos.EventResponseDtos;
import com.convene.api.models.Event;
import com.convene.api.repositories.EventRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public Event createEvent(EventRequestDTO eventDTO, MultipartFile imageFile) throws IOException {
        String imageUrl = null;
        if (imageFile != null && !imageFile.isEmpty()) {
            // Logique d'upload d'image (comme précédemment)
            String fileName = UUID.randomUUID().toString() + "-" + imageFile.getOriginalFilename();
            // EN PRODUCTION: Uploader vers AWS S3, Cloudinary, etc.
            imageUrl = "http://example.com/images/" + fileName; // URL fictive
        }

        Event event = new Event();
        // --- Mappage depuis le DTO vers l'Entité ---
        // Champs du frontend directement mappés
        event.setTitle(eventDTO.getTitle());
        event.setDescription(eventDTO.getDescription());
        event.setCategory(eventDTO.getCategory());
        event.setEventDate(LocalDate.parse(eventDTO.getEventDate()));
        event.setTotalSeats(eventDTO.getTotalSeats());
        event.setImageUrl(imageUrl);
        
        // Mappage des noms de colonnes différents
        event.setLocationCity(eventDTO.getCity()); // city du DTO -> locationCity de l'entité
        event.setLocationAddress(eventDTO.getAddress()); // address du DTO -> locationAddress de l'entité

        // Champs gérés par le backend et non par le frontend
        event.setOrganizerId(1L); // TODO: Remplacer par l'ID de l'organisateur connecté (gestion de l'authentification)
        event.setAvailableSeats(eventDTO.getTotalSeats()); // Par défaut, tous les sièges sont disponibles
        event.setStatus("PUBLISHED"); // Statut par défaut (ex: UPCOMING, ACTIVE, CANCELLED)

        return eventRepository.save(event);
    }
}
    /**
     * Recherche publique : ne renvoie que les événements dont le status = "PUBLISHED".
     *
     * Remarque : j'ai utilisé LocalDate pour les dates (aligné avec Event.eventDate).
     */
    public List<EventResponseDtos> getEvents(
            String search, String category, String city, LocalDate startDate, LocalDate endDate) {

        String normalizedSearch = normalize(search);
        String normalizedCategory = normalize(category);
        String normalizedCity = normalize(city);

        // Ajuste la signature du repository pour accepter String status et LocalDate pour les bornes.
        List<Event> events =
                eventRepository.searchEvents("PUBLISHED", normalizedCategory, normalizedCity, startDate, endDate, normalizedSearch);

        return events.stream().map(this::toResponse).toList();
    }

    /**
     * Récupère un événement public (status = "PUBLISHED").
     * Maintenant l'identifiant est de type Long (et non UUID).
     */
    public Optional<EventResponseDtos> getEvent(Long id) {
        return eventRepository.findByIdAndStatus(id, "PUBLISHED").map(this::toResponse);
    }

    // ========================================================================
    // ================== SECTION CORRIGÉE (sans UUID) ==========================
    // ========================================================================

    /**
     * Met à jour un événement existant.
     * Utilise @Transactional pour assurer l'intégrité des données.
     * L'identifiant est de type Long.
     */
    @Transactional
    public Optional<EventResponseDtos> updateEvent(Long id, EventResponseDtos eventDetails) {
        // findById standard pour pouvoir modifier n'importe quel événement (DRAFT, CANCELLED, ...)
        return eventRepository.findById(id).map(existingEvent -> {

            // Mise à jour des champs (les accesseurs de EventResponseDtos restent les mêmes,
            // on suppose que c'est un record avec des méthodes title(), description(), ...)
            existingEvent.setTitle(eventDetails.title());
            existingEvent.setDescription(eventDetails.description());
            existingEvent.setCategory(eventDetails.category());
            existingEvent.setImageUrl(eventDetails.imageUrl());

            // Event.eventDate est de type LocalDate : on suppose que eventDetails.eventDate() renvoie un LocalDate.
            existingEvent.setEventDate(eventDetails.eventDate());

            // Localisation
            existingEvent.setLocationCity(eventDetails.city());
            existingEvent.setLocationAddress(eventDetails.address());

            // Places
            existingEvent.setTotalSeats(eventDetails.totalSeats());
            existingEvent.setAvailableSeats(eventDetails.availableSeats());

            // Status en String (ex: "DRAFT", "PUBLISHED", ...)
            existingEvent.setStatus(eventDetails.status());

            // Sauvegarde
            Event savedEvent = eventRepository.save(existingEvent);

            return toResponse(savedEvent);
        });
    }

    /**
     * Supprime un événement.
     */
    @Transactional
    public boolean deleteEvent(Long id) {
        if (eventRepository.existsById(id)) {
            eventRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // ========================================================================
    // ========================================================================

    private EventResponseDtos toResponse(Event event) {
        // On suppose que EventResponseDtos attend un Long id et LocalDate pour eventDate
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
                event.getStatus()
        );
    }

    private String normalize(String value) {
        if (!StringUtils.hasText(value)) {
            return null;
        }
        return value.trim();
    }
}
