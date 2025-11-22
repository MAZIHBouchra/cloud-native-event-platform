package com.convene.api.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "char(36)")
    @JdbcTypeCode(SqlTypes.CHAR)
    private UUID id;

    @Column(name = "organizer_id", nullable = false, columnDefinition = "char(36)")
    @JdbcTypeCode(SqlTypes.CHAR)
    private Long organizerId;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "LONGTEXT", nullable = false)
    private String description;

    @Column(length = 100)
    private String category;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "event_date", nullable = false)
    private LocalDateTime eventDate;

    @Column(name = "location_city", nullable = false, length = 100)
    private String locationCity;

    @Column(name = "location_address", nullable = false, length = 255)
    private String locationAddress;

    @Column(name = "total_seats", nullable = false)
    private Integer totalSeats;

    @Column(name = "available_seats", nullable = false)
    private Integer availableSeats;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EventStatus status = EventStatus.DRAFT;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}