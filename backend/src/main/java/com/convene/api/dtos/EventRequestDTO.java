package com.convene.api.dtos;

import jakarta.validation.constraints.*;

public class EventRequestDTO {

    @NotBlank(message = "Title cannot be blank")
    @Size(max = 255, message = "Title cannot exceed 255 characters")
    private String title;

    @NotBlank(message = "Description cannot be blank")
    private String description;

    @NotBlank(message = "Category cannot be blank")
    private String category;

    @NotBlank(message = "Event date cannot be blank")
    private String eventDate;
    
    @NotBlank(message = "City cannot be blank")
    private String city; // Conserver "city" pour correspondre au frontend

    @NotBlank(message = "Address cannot be blank")
    private String address; // Conserver "address" pour correspondre au frontend

    @NotNull(message = "Total seats cannot be null")
    @Min(value = 1, message = "Total seats must be at least 1")
    private Integer totalSeats;
    
    // --- Getters et Setters --- 
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
    public String getEventDate() { 
        return eventDate; 
    }
    public void setEventDate(String eventDate) { 
        this.eventDate = eventDate; 
    }
    public String getCity() { 
        return city; 
    }
    public void setCity(String city) { 
        this.city = city; 
    }
    public String getAddress() { 
        return address; 
    }
    public void setAddress(String address) { 
        this.address = address; 
    }
    public Integer getTotalSeats() { 
        return totalSeats; 
    }
    public void setTotalSeats(Integer totalSeats) { 
        this.totalSeats = totalSeats; 
    }
}