package com.convene.api.services;

import com.convene.api.dtos.EventRequestDTO;
import com.convene.api.dtos.EventResponseDtos;
import com.convene.api.models.Event;
import com.convene.api.repositories.EventRepository;
import com.convene.api.repositories.RegistrationRepository; // <--- NOUVEL IMPORT
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
    private final RegistrationRepository registrationRepository; // <--- NOUVELLE DÉPENDANCE
    private final S3Service s3Service;

    // Mise à jour du constructeur pour inclure RegistrationRepository
    public EventService(EventRepository eventRepository, 
                        RegistrationRepository registrationRepository, 
                        S3Service s3Service) {
        this.eventRepository = eventRepository;
        this.registrationRepository = registrationRepository;
        this.s3Service = s3Service;
    }

    // ... (createEvent, getEvents, getEvent, updateEvent restent identiques) ...
    // Je vous remets createEvent pour être sûr que le fichier soit complet
    
    public Event createEvent(EventRequestDTO eventDTO, MultipartFile imageFile) throws IOException {
        String imageUrl = null;
        if (imageFile != null && !imageFile.isEmpty()) {
            imageUrl = s3Service.uploadImage(imageFile, "events");
        }

        Event event = new Event();
        event.setTitle(eventDTO.getTitle());
        event.setDescription(eventDTO.getDescription());
        event.setCategory(eventDTO.getCategory());
        event.setEventDate(LocalDate.parse(eventDTO.getEventDate()));
        event.setTotalSeats(eventDTO.getTotalSeats());
        event.setImageUrl(imageUrl);
        event.setLocationCity(eventDTO.getCity());
        event.setLocationAddress(eventDTO.getAddress());
        event.setOrganizerId(1L); 
        event.setAvailableSeats(eventDTO.getTotalSeats());
        event.setStatus("PUBLISHED");

        return eventRepository.save(event);
    }

    public List<EventResponseDtos> getEvents(String search, String category, String city, LocalDate startDate, LocalDate endDate) {
        String normalizedSearch = normalize(search);
        String normalizedCategory = normalize(category);
        String normalizedCity = normalize(city);
        List<Event> events = eventRepository.searchEvents("PUBLISHED", normalizedCategory, normalizedCity, startDate, endDate, normalizedSearch);
        return events.stream().map(this::toResponse).toList();
    }

    public Optional<EventResponseDtos> getEvent(Long id) {
        return eventRepository.findByIdAndStatus(id, "PUBLISHED").map(this::toResponse);
    }

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

    // =================================================================
    // 👇 LA CORRECTION EST ICI
    // =================================================================
    @Transactional
    public boolean deleteEvent(Long id) {
        if (eventRepository.existsById(id)) {
            // 1. D'abord, on supprime les inscriptions liées (pour éviter l'erreur Foreign Key)
            registrationRepository.deleteByEventId(id);

            // 2. Ensuite, on supprime l'événement
            eventRepository.deleteById(id);
            return true;
        }
        return false;
    }
    // =================================================================

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