package com.convene.api.controllers;

import com.convene.api.models.Registration;
import com.convene.api.services.RegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/registrations")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class RegistrationController {

    private final RegistrationService registrationService;

    /**
     * POST /api/registrations/{eventId}
     * S'inscrire à un événement.
     * L'email est récupéré automatiquement du token JWT (Principal).
     */
    @PostMapping("/{eventId}")
    public ResponseEntity<?> register(
            @PathVariable Long eventId,
            Principal principal // Spring Security nous donne l'utilisateur connecté ici
    ) {
        try {
            // Si l'utilisateur n'est pas connecté, principal sera null (géré par SecurityConfig normalement)
            String email = principal.getName(); 
            
            Registration registration = registrationService.registerUser(email, eventId);
            return ResponseEntity.ok(registration);
            
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * GET /api/registrations/me
     * Voir mes inscriptions.
     */
    @GetMapping("/me")
    public ResponseEntity<List<Registration>> getMyRegistrations(Principal principal) {
        String email = principal.getName();
        List<Registration> registrations = registrationService.getUserRegistrations(email);
        return ResponseEntity.ok(registrations);
    }

    /**
     * DELETE /api/registrations/{eventId}
     * Se désinscrire.
     */
    @DeleteMapping("/{eventId}")
    public ResponseEntity<?> cancelRegistration(@PathVariable Long eventId, Principal principal) {
        try {
            String email = principal.getName();
            registrationService.cancelRegistration(email, eventId);
            return ResponseEntity.ok(Map.of("message", "Désinscription réussie"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * GET /api/registrations/event/{eventId}
     * Récupérer tous les participants d'un événement (Pour l'organisateur).
     */
    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<Registration>> getEventRegistrations(@PathVariable Long eventId) {
        // Idéalement, on devrait vérifier ici que l'utilisateur connecté est bien l'organisateur de cet événement
        List<Registration> registrations = registrationService.getEventRegistrations(eventId);
        return ResponseEntity.ok(registrations);
    }
}