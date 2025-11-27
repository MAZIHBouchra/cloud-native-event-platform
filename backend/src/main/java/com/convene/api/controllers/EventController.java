package com.convene.api.controllers;

import com.convene.api.dtos.EventRequestDTO;
import com.convene.api.dtos.EventResponseDtos;
import com.convene.api.models.Event;
import com.convene.api.services.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "http://localhost:3000")
public class EventController {

    private final EventService eventService;

    // Injection de dépendance via le constructeur
    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    /**
     * POST /api/events
     * Création d'un événement avec image optionnelle
     */
    @PostMapping
    public ResponseEntity<?> createEvent(
            @Valid @RequestPart("event") EventRequestDTO eventDTO,
            @RequestPart(value = "image", required = false) MultipartFile imageFile
    ) {
        try {
            Event createdEvent = eventService.createEvent(eventDTO, imageFile);
            return new ResponseEntity<>(createdEvent, HttpStatus.CREATED);
        } catch (IOException e) {
            Map<String, String> errorResponse = new HashMap<>();
            // LIGNE AJOUTÉE POUR VOIR L'ERREUR
            errorResponse.put("error", "Error processing image: " + e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error creating event: " + e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * GET /api/events
     * Recherche publique
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
     * Récupère un événement par son ID
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
     * Met à jour un événement
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
     * Supprime un événement
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
