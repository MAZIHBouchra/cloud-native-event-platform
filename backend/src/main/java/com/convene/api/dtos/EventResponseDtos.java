package com.convene.api.dtos;

import java.time.LocalDateTime;

public record EventResponseDtos(
        Long id,
        String title,
        String description,
        String category,
        String imageUrl,
        LocalDateTime eventDate,
        String city,
        String address,
        Integer totalSeats,
        Integer availableSeats) {}

