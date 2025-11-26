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

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. Désactiver CSRF (Indispensable pour les API REST)
            .csrf(AbstractHttpConfigurer::disable)

            // 2. Activer CORS (Pour que localhost:3000 puisse parler à localhost:8080)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            // 3. Configuration des accès URL
            .authorizeHttpRequests(auth -> auth
                // ✅ VOS ENDPOINTS (Authentification)
                .requestMatchers("/api/auth/**").permitAll()
                
                // ✅ ENDPOINTS EVENTS (Code fusionné)
                // On autorise tout pour l'instant pour faciliter le développement
                .requestMatchers("/api/events/**").permitAll()
                
                // ✅ CORS PRE-FLIGHT (Indispensable pour les navigateurs)
                .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()

                // Le reste nécessite d'être connecté
                .anyRequest().authenticated()
            );

        return http.build();
    }

    /**
     * Configuration CORS pour autoriser le Frontend Next.js
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Autoriser l'origine du Frontend
        configuration.setAllowedOrigins(List.of("http://localhost:3000"));
        
        // Autoriser les méthodes HTTP courantes
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        
        // Autoriser tous les en-têtes (Authorization, Content-Type...)
        configuration.setAllowedHeaders(List.of("*"));
        
        // Autoriser l'envoi de cookies/credentials si besoin
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}