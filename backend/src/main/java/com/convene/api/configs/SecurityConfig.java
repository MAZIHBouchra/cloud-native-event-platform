package com.convene.api.configs;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsConfigurationSource;
import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        System.out.println("🚨 CHARGEMENT SECURITÉ AVEC CORS FIX 🚨");

        http
            // 1. Désactiver CSRF (Indispensable pour API)
            .csrf(AbstractHttpConfigurer::disable)
            
            // 2. Activer CORS avec notre configuration spécifique ci-dessous
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            // 3. Autoriser les URL
            .authorizeHttpRequests(auth -> auth
                // On autorise TOUT ce qui est sous /api/auth pour être sûr
                .requestMatchers("/api/auth/**").permitAll()
                // Autoriser aussi les requêtes OPTIONS (pour le pré-vol CORS)
                .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()
                .anyRequest().authenticated()
            );

        return http.build();
    }

    // 👇 C'EST CE BEAN MAGIQUE QUI MANQUAIT 👇
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Autoriser le Frontend (Port 3000)
        configuration.setAllowedOrigins(List.of("http://localhost:3000"));
        
        // Autoriser toutes les méthodes (GET, POST, OPTIONS...)
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        
        // Autoriser tous les headers (Authorization, Content-Type...)
        configuration.setAllowedHeaders(List.of("*"));
        
        // Autoriser les credentials (cookies/tokens)
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}