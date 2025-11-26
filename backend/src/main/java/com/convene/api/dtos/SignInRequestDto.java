package com.convene.api.dtos;

import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for user sign-in requests.
 * It carries the user's credentials for authentication.
 */
@Data
@NoArgsConstructor
public class SignInRequestDto {

    private String email;
    private String password;
}