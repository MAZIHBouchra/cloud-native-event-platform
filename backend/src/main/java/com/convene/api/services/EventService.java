package com.convene.api.services;

import com.convene.api.dtos.EventRequestDTO;
import com.convene.api.dtos.EventResponseDtos;
import com.convene.api.models.Event;
import com.convene.api.repositories.EventRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class EventService {

    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    /**
     * Crée un nouvel événement.
     */
    public Event createEvent(EventRequestDTO eventDTO, MultipartFile imageFile) throws IOException {
        String imageUrl = null;
        if (imageFile != null && !imageFile.isEmpty()) {
            // Logique d'upload d'image fictive (Mock)
            String fileName = UUID.randomUUID().toString() + "-" + imageFile.getOriginalFilename();
            // EN PRODUCTION: Uploader vers AWS S3
            imageUrl = "http://example.com/images/" + fileName; 
        }

        Event event = new Event();
        // Mappage DTO -> Entity
        event.setTitle(eventDTO.getTitle());
        event.setDescription(eventDTO.getDescription());
        event.setCategory(eventDTO.getCategory());
        // Conversion String -> LocalDate
        event.setEventDate(LocalDate.parse(eventDTO.getEventDate()));
        event.setTotalSeats(eventDTO.getTotalSeats());
        event.setImageUrl(imageUrl);
        
        event.setLocationCity(eventDTO.getCity());
        event.setLocationAddress(eventDTO.getAddress());

        // Champs gérés par le backend
        event.setOrganizerId(1L); // TODO: Récupérer l'ID de l'utilisateur connecté via le Token
        event.setAvailableSeats(eventDTO.getTotalSeats());
        event.setStatus("PUBLISHED");

        return eventRepository.save(event);
    }

    /**
     * Recherche publique : ne renvoie que les événements dont le status = "PUBLISHED".
     */
    public List<EventResponseDtos> getEvents(
            String search, String category, String city, LocalDate startDate, LocalDate endDate) {

        String normalizedSearch = normalize(search);
        String normalizedCategory = normalize(category);
        String normalizedCity = normalize(city);

        List<Event> events = eventRepository.searchEvents(
                "PUBLISHED", normalizedCategory, normalizedCity, startDate, endDate, normalizedSearch);

        return events.stream().map(this::toResponse).toList();
    }

    /**
     * Récupère un événement public (status = "PUBLISHED").
     */
    public Optional<EventResponseDtos> getEvent(Long id) {
        return eventRepository.findByIdAndStatus(id, "PUBLISHED").map(this::toResponse);
    }

    /**
     * Met à jour un événement existant.
     */
    @Transactional
    public Optional<EventResponseDtos> updateEvent(Long id, EventResponseDtos eventDetails) {
        return eventRepository.findById(id).map(existingEvent -> {
            // Mise à jour des champs
            // Note: On suppose ici que EventResponseDtos est un Java Record (d'où les méthodes sans get)
            // Si c'est une classe classique, remplacez .title() par .getTitle(), etc.
            existingEvent.setTitle(eventDetails.title());
            existingEvent.setDescription(eventDetails.description());
            existingEvent.setCategory(eventDetails.category());
            existingEvent.setImageUrl(eventDetails.imageUrl());
            existingEvent.setEventDate(eventDetails.eventDate());
            existingEvent.setLocationCity(eventDetails.city());
            existingEvent.setLocationAddress(eventDetails.address());
            existingEvent.setTotalSeats(eventDetails.totalSeats());
            existingEvent.setAvailableSeats(eventDetails.availableSeats());
            existingEvent.setStatus(eventDetails.status());

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

    // --- Méthodes Utilitaires ---

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