package com.convene.api.controllers;

import com.convene.api.dtos.EventResponseDtos;
import com.convene.api.services.EventService;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;// for delete
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;//heeeeeeeeeeeere

@RestController
@CrossOrigin(origins = "http://localhost:3000")// and heeeeeeeeeeeeeeeeeeeeeeeeeere
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @GetMapping
    public ResponseEntity<List<EventResponseDtos>> getEvents(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDateDateOnly,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDateDateOnly) {

        LocalDateTime resolvedStart = resolveDate(startDate, startDateDateOnly, true);
        LocalDateTime resolvedEnd = resolveDate(endDate, endDateDateOnly, false);

        List<EventResponseDtos> events = eventService.getEvents(search, category, city, resolvedStart, resolvedEnd);
        return ResponseEntity.ok(events);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventResponseDtos> getEvent(@PathVariable("id") String id) {
        return eventService
                .getEvent(UUID.fromString(id))
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    //-------------------------------------------------------------------
    @PutMapping("/{id}")
    public ResponseEntity<EventResponseDtos> updateEvent(@PathVariable("id") String id, @RequestBody EventResponseDtos eventDetails) {
        // Note : C'est une meilleure pratique de créer un DTO dédié pour les requêtes (ex: EventRequestDto)
        // mais pour commencer, réutiliser EventResponseDtos fonctionnera.
        return eventService
                .updateEvent(UUID.fromString(id), eventDetails)
                .map(ResponseEntity::ok) // Si la mise à jour réussit, renvoie 200 OK avec l'objet mis à jour
                .orElseGet(() -> ResponseEntity.notFound().build()); // Si l'événement n'est pas trouvé, renvoie 404
    }

    /**
     * Endpoint pour supprimer un événement par son ID.
     * DELETE /api/events/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable("id") String id) {
        boolean isDeleted = eventService.deleteEvent(UUID.fromString(id));

        if (isDeleted) {
            return ResponseEntity.noContent().build(); // Renvoie 204 No Content, la norme pour une suppression réussie
        } else {
            return ResponseEntity.notFound().build(); // Renvoie 404 si l'événement à supprimer n'a pas été trouvé
        }
    }
    private LocalDateTime resolveDate(LocalDateTime dateTime, LocalDate date, boolean startOfDay) {
        if (dateTime != null) {
            return dateTime;
        }

        if (date != null) {
            return startOfDay ? date.atStartOfDay() : date.atTime(23, 59, 59);
        }

        return null;
    }
}