package com.convene.api.dtos;

import java.time.LocalDateTime;
import java.util.UUID;

public record EventResponseDtos(
        UUID id,
        String title,
        String description,
        String category,
        String imageUrl,
        LocalDateTime eventDate,
        String city,
        String address,
        Integer totalSeats,
        Integer availableSeats) {}

