package com.convene.api.services;

import com.convene.api.dtos.EventResponseDtos;
import com.convene.api.models.Event;
import com.convene.api.models.EventStatus;
import com.convene.api.repositories.EventRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;

    public List<EventResponseDtos> getEvents(
            String search, String category, String city, LocalDateTime startDate, LocalDateTime endDate) {
        String normalizedSearch = normalize(search);
        String normalizedCategory = normalize(category);
        String normalizedCity = normalize(city);

        List<Event> events =
                eventRepository.searchEvents(null, normalizedCategory, normalizedCity, startDate, endDate, normalizedSearch);

        return events.stream().map(this::toResponse).toList();
    }

    public Optional<EventResponseDtos> getEvent(Long id) {
        return eventRepository.findByIdAndStatus(id, EventStatus.PUBLISHED).map(this::toResponse);
    }

    private EventResponseDtos toResponse(Event event) {
        return new EventResponseDtos(
                event.getId(),
                event.getTitle(),
                event.getDescription(),
                event.getCategory(),
                event.getImageUrl(),
                event.getEventDate(),
                event.getLocationCity(),
                event.getLocationAddress(),
                event.getTotalSeats(),
                event.getAvailableSeats());
    }

    private String normalize(String value) {
        if (!StringUtils.hasText(value)) {
            return null;
        }
        return value.trim();
    }
}

