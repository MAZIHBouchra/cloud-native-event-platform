package com.convene.api.controllers;

import com.convene.api.dtos.EventRequestDTO;
import com.convene.api.models.Event;
import com.convene.api.services.EventService;
import jakarta.validation.Valid; // Pour Spring Boot 3+
// import javax.validation.Valid; // Pour Spring Boot 2
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/events") // Endpoint de base pour les événements
@CrossOrigin(origins = "http://localhost:3000") // Autorisez votre frontend Next.js (ajustez en prod)
import com.convene.api.dtos.EventResponseDtos;
import com.convene.api.services.EventService;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @PostMapping
    public ResponseEntity<?> createEvent(
            @Valid @RequestPart("event") EventRequestDTO eventDTO, // Les données du formulaire
            @RequestPart(value = "image", required = false) MultipartFile imageFile // Le fichier image, optionnel
    ) {
        try {
            Event createdEvent = eventService.createEvent(eventDTO, imageFile);
            return new ResponseEntity<>(createdEvent, HttpStatus.CREATED);
        } catch (IOException e) {
            // Gérer les erreurs d'upload ou de traitement d'image
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error processing image: " + e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            // Gérer d'autres erreurs générales
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error creating event: " + e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
    /**
     * GET /api/events
     * Recherche publique : n'affiche que les événements dont status = "PUBLISHED".
     * Les dates de filtre sont en LocalDate (ISO.DATE).
     */
    @GetMapping
    public ResponseEntity<List<EventResponseDtos>> getEvents(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        List<EventResponseDtos> events = eventService.getEvents(search, category, city, startDate, endDate);
        return ResponseEntity.ok(events);
    }

    /**
     * GET /api/events/{id}
     * Récupère un événement public par son id (Long).
     */
    @GetMapping("/{id}")
    public ResponseEntity<EventResponseDtos> getEvent(@PathVariable("id") Long id) {
        return eventService
                .getEvent(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * PUT /api/events/{id}
     * Met à jour un événement existant.
     * Pour plus de clarté il vaut mieux créer un DTO de requête séparé (EventRequestDto), mais on réutilise EventResponseDtos ici.
     */
    @PutMapping("/{id}")
    public ResponseEntity<EventResponseDtos> updateEvent(@PathVariable("id") Long id, @RequestBody EventResponseDtos eventDetails) {
        return eventService
                .updateEvent(id, eventDetails)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * DELETE /api/events/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable("id") Long id) {
        boolean isDeleted = eventService.deleteEvent(id);

        if (isDeleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
