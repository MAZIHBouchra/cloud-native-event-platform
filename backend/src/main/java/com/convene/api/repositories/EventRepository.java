package com.convene.api.repositories;

import com.convene.api.models.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    /**
     * Recherche avec filtres optionnels :
     * - status (String)
     * - category (String)
     * - city (String)
     * - startDate / endDate (LocalDate)
     * - search (texte appliqué sur title OR description)
     *
     * On utilise LOWER(...) et LIKE pour une recherche insensible à la casse.
     */
    @Query("""
        SELECT e FROM Event e
        WHERE (:status IS NULL OR e.status = :status)
          AND (:category IS NULL OR LOWER(e.category) = LOWER(:category))
          AND (:city IS NULL OR LOWER(e.locationCity) = LOWER(:city))
          AND (:startDate IS NULL OR e.eventDate >= :startDate)
          AND (:endDate IS NULL OR e.eventDate <= :endDate)
          AND (
                :search IS NULL
                OR LOWER(e.title) LIKE CONCAT('%', LOWER(:search), '%')
                OR LOWER(e.description) LIKE CONCAT('%', LOWER(:search), '%')
              )
        ORDER BY e.eventDate
    """)
    List<Event> searchEvents(
            @Param("status") String status,
            @Param("category") String category,
            @Param("city") String city,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("search") String search
    );

    /**
     * Récupérer un événement par id si son status correspond (ex: "PUBLISHED").
     */
    Optional<Event> findByIdAndStatus(Long id, String status);
}