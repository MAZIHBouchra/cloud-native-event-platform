package com.convene.api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

// IMPORT IMPORTANT À AJOUTER
import static org.springframework.security.config.Customizer.withDefaults;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. Désactiver CSRF (Indispensable pour les API REST)
            .csrf(AbstractHttpConfigurer::disable)

            // 2. Activer CORS
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            // 3. Configuration des accès URL
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/health").permitAll() // Health check endpoint
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/events/**").permitAll() // Lecture publique des événements
                .requestMatchers("/api/images/**").permitAll() // Allow image uploads
                .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()
                .anyRequest().authenticated() // Le reste (Inscriptions) nécessite un Token
            )
            
            // C'EST LA LIGNE MAGIQUE QUI MANQUAIT !
            // Elle dit à Spring : "Vérifie les tokens JWT (Bearer Token) avec Cognito"
            .oauth2ResourceServer(oauth2 -> oauth2.jwt(withDefaults()));

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Allow all origins (for development/testing - restrict in production)
        configuration.setAllowedOriginPatterns(List.of("*"));
        
        // Allow all HTTP methods
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"));
        
        // Allow all headers
        configuration.setAllowedHeaders(List.of("*"));
        
        // Allow credentials (cookies, authorization headers)
        configuration.setAllowCredentials(true);
        
        // Expose all response headers to the client
        configuration.setExposedHeaders(List.of("*"));
        
        // Cache preflight requests for 1 hour
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}