package com.convene.api.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties; // IMPORT IMPORTANT
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@Table(name = "registrations")
@EntityListeners(AuditingEntityListener.class)
public class Registration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Qui s'inscrit ?
    @Column(nullable = false)
    private String participantEmail;

    // À quoi il s'inscrit ?
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    // CETTE LIGNE CORRIGE L'ERREUR 500 
    // Elle dit à Jackson : "Quand tu transformes en JSON, ne t'occupe pas des outils internes d'Hibernate"
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Event event;

    // Quand ?
    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime registrationDate;

    // Statut (CONFIRMED, CANCELLED)
    private String status = "CONFIRMED";
}