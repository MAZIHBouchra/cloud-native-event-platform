package com.convene.api.models;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime; 

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Table(name = "events")
@EntityListeners(AuditingEntityListener.class)
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "organizer_id", nullable = false) 
    private Long organizerId;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String category;

    @Column(name = "image_url") // image_url dans la BDD
    private String imageUrl;

    @Column(name = "event_date", nullable = false) // event_date dans la BDD
    private LocalDate eventDate;
    

    @Column(name = "location_city", nullable = false) // location_city dans la BDD
    private String locationCity;

    @Column(name = "location_address", nullable = false) // location_address dans la BDD
    private String locationAddress;

    @Column(name = "total_seats", nullable = false) // total_seats dans la BDD
    private Integer totalSeats;

    @Column(name = "available_seats", nullable = false) //  available_seats dans la BDD
    private Integer availableSeats; 

    @Column(nullable = false)
    private String status; // Ex: "Active", "Cancelled", "Upcoming"

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // --- Constructeurs ---
    public Event() {}

    public Long getId() { 
        return id;
    }
    public void setId(Long id) { 
        this.id = id; 
    }
    public Long getOrganizerId() {
        return organizerId; 
    }
    public void setOrganizerId(Long organizerId) {
        this.organizerId = organizerId; 
    }
    public String getTitle() {
        return title; 
    }
    public void setTitle(String title) { 
        this.title = title; 
    }
    public String getDescription() { 
        return description; 
    }
    public void setDescription(String description) {
        this.description = description; 
    }
    public String getCategory() {
        return category; 
    }
    public void setCategory(String category) {
        this.category = category; 
    }
    public String getImageUrl() { 
        return imageUrl; 
    }
    public void setImageUrl(String imageUrl) { 
        this.imageUrl = imageUrl; 
    }
    public LocalDate getEventDate() { 
        return eventDate; 
    }
    public void setEventDate(LocalDate eventDate) { 
        this.eventDate = eventDate; 
    }
    public String getLocationCity() { 
        return locationCity; 
    }
    public void setLocationCity(String locationCity) {
         this.locationCity = locationCity; 
    }
    public String getLocationAddress() { 
        return locationAddress; 
    }
    public void setLocationAddress(String locationAddress) { 
        this.locationAddress = locationAddress; 
    }
    public Integer getTotalSeats() { 
        return totalSeats; 
    }
    public void setTotalSeats(Integer totalSeats) { 
        this.totalSeats = totalSeats; 
    }
    public Integer getAvailableSeats() { 
        return availableSeats; 
    }
    public void setAvailableSeats(Integer availableSeats) { 
        this.availableSeats = availableSeats; 
    }
    public String getStatus() { 
        return status; 
    }
    public void setStatus(String status) { 
        this.status = status; 
    }
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime createdAt) { 
        this.createdAt = createdAt; 
    }
    public LocalDateTime getUpdatedAt() { 
        return updatedAt; 
    }
    public void setUpdatedAt(LocalDateTime updatedAt) {
         this.updatedAt = updatedAt; 
    }
}