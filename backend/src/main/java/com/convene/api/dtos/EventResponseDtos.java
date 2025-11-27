package com.convene.api.dtos;

import java.time.LocalDate;

// On utilise un record, c'est moderne et concis pour les DTOs
public record EventResponseDtos(
    Long id,
    String title,
    String description,
    String category,
    String imageUrl,
    LocalDate eventDate,
    String city,
    String address,
    Integer totalSeats,
    Integer availableSeats,
    String status
) {}