package com.convene.api.dtos;

import java.time.LocalDateTime;
import java.util.UUID;
import java.time.LocalDate;

import com.convene.api.models.EventStatus;

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
