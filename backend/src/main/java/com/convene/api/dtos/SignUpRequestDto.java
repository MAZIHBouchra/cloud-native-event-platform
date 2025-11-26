package com.convene.api.dtos;

import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for user registration requests.
 * It carries the necessary information from the client to the server to create a new user account.
 */
@Data // Génère automatiquement les getters, setters, toString(), equals(), hashCode()
@NoArgsConstructor // Génère un constructeur sans arguments
public class SignUpRequestDto {

    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String role; // Expected values: "ORGANIZER" or "PARTICIPANT"
}