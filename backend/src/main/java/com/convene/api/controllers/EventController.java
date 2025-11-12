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