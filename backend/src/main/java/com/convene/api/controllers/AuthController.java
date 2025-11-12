package com.convene.api.controllers;

import com.convene.api.dtos.SignInRequestDto;
import com.convene.api.dtos.SignUpRequestDto;
import com.convene.api.services.CognitoService;
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
@CrossOrigin(origins = "*") // Allows requests from any origin, useful for development
public class AuthController {

    @Autowired
    private CognitoService cognitoService;

    /**
     * Endpoint for user registration.
     * @param signUpRequest The request body containing user details.
     * @return A success message or an error message.
     */
    @PostMapping("/signup")
    public ResponseEntity<String> signUp(@RequestBody SignUpRequestDto signUpRequest) {
        try {
            cognitoService.signUp(signUpRequest);
            // After successful sign-up, Cognito will send a confirmation email.
            return ResponseEntity.ok("User registered successfully! Please check your email to confirm your account.");
        } catch (Exception e) {
            // Return a more specific error message from the exception
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Endpoint for user authentication.
     * @param signInRequest The request body containing user credentials.
     * @return JWT tokens on successful login, or an error message on failure.
     */
    @PostMapping("/signin")
    public ResponseEntity<?> signIn(@RequestBody SignInRequestDto signInRequest) {
        try {
            AuthenticationResultType result = cognitoService.signIn(signInRequest);
            // On success, send the tokens back to the frontend
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            // For security, don't give too many details on why the login failed.
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials or user not confirmed.");
        }
    }
}