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

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final S3Service s3Service; // Injection du service S3 de Salma

    // Constructeur avec injection des dépendances
    public EventService(EventRepository eventRepository, S3Service s3Service) {
        this.eventRepository = eventRepository;
        this.s3Service = s3Service;
    }

    /**
     * Crée un nouvel événement avec upload d'image vers S3.
     */
    public Event createEvent(EventRequestDTO eventDTO, MultipartFile imageFile) throws IOException {
        String imageUrl = null;
        
        // Gestion de l'image via le S3Service de Salma
        if (imageFile != null && !imageFile.isEmpty()) {
            // On appelle uploadImage avec le fichier et le nom du dossier "events"
            imageUrl = s3Service.uploadImage(imageFile, "events");
        }

        Event event = new Event();
        // Mappage DTO -> Entity
        event.setTitle(eventDTO.getTitle());
        event.setDescription(eventDTO.getDescription());
        event.setCategory(eventDTO.getCategory());
        // Conversion String -> LocalDate
        event.setEventDate(LocalDate.parse(eventDTO.getEventDate()));
        event.setTotalSeats(eventDTO.getTotalSeats());
        
        // Sauvegarde de l'URL S3 (ou null si pas d'image)
        event.setImageUrl(imageUrl); 
        
        event.setLocationCity(eventDTO.getCity());
        event.setLocationAddress(eventDTO.getAddress());

        // Champs gérés par le backend
        event.setOrganizerId(1L); // TODO: Plus tard, récupérer l'ID depuis le token
        event.setAvailableSeats(eventDTO.getTotalSeats());
        event.setStatus("PUBLISHED");

        return eventRepository.save(event);
    }

    /**
     * Recherche publique des événements.
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
     * Récupère un événement par ID.
     */
    public Optional<EventResponseDtos> getEvent(Long id) {
        return eventRepository.findByIdAndStatus(id, "PUBLISHED").map(this::toResponse);
    }

    /**
     * Met à jour un événement.
     */
    @Transactional
    public Optional<EventResponseDtos> updateEvent(Long id, EventResponseDtos eventDetails) {
        return eventRepository.findById(id).map(existingEvent -> {
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
            // Optionnel : On pourrait aussi supprimer l'image de S3 ici
            // Mais pour l'instant, on supprime juste l'événement de la BDD
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