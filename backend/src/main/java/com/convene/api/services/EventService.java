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