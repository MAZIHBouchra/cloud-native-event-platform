package com.convene.api.repositories;

import com.convene.api.models.Event;
import com.convene.api.models.EventStatus;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface EventRepository extends JpaRepository<Event, UUID> {

    @Query(
            """
            SELECT e
            FROM Event e
            WHERE (:status IS NULL OR e.status = :status)
              AND (:category IS NULL OR LOWER(e.category) = LOWER(:category))
              AND (:city IS NULL OR LOWER(e.locationCity) = LOWER(:city))
              AND (:startDate IS NULL OR e.eventDate >= :startDate)
              AND (:endDate IS NULL OR e.eventDate <= :endDate)
              AND (
                  :search IS NULL OR
                  LOWER(e.title) LIKE CONCAT('%', LOWER(:search), '%') OR
                  LOWER(e.description) LIKE CONCAT('%', LOWER(:search), '%')
              )
            ORDER BY e.eventDate ASC
            """)
    List<Event> searchEvents(
            @Param("status") EventStatus status,
            @Param("category") String category,
            @Param("city") String city,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("search") String search);

    Optional<Event> findByIdAndStatus(UUID id, EventStatus status);
}