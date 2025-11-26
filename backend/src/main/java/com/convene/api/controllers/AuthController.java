package com.convene.api.controllers;

import com.convene.api.dtos.SignInRequestDto;
import com.convene.api.dtos.SignUpRequestDto;
import com.convene.api.services.CognitoService;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AuthenticationResultType;

/**
 * REST Controller for handling authentication-related requests like sign-up and sign-in.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private CognitoService cognitoService;

    /**
     * Endpoint for user registration.
     */
    @PostMapping("/signup")
    public ResponseEntity<String> signUp(@RequestBody SignUpRequestDto signUpRequest) {
        try {
            cognitoService.signUp(signUpRequest);
            return ResponseEntity.ok("User registered successfully!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Endpoint for user authentication.
     */
    @PostMapping("/signin")
    public ResponseEntity<?> signIn(@RequestBody SignInRequestDto signInRequest) {
        try {
            // 1. Authentification via Cognito
            AuthenticationResultType result = cognitoService.signIn(signInRequest);
            
            // 2. Récupération du rôle
            String role = cognitoService.getUserRole(signInRequest.getEmail());

            // 3. Construction de la réponse JSON
            Map<String, String> response = new HashMap<>();
            response.put("accessToken", result.accessToken());
            response.put("idToken", result.idToken());
            response.put("refreshToken", result.refreshToken());
            response.put("role", role); 

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Login failed: " + e.getMessage());
        }
    }
}