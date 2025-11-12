
package com.convene.api.configs;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Désactiver CSRF car nous n'utilisons pas de formulaires basés sur des sessions
            .csrf(csrf -> csrf.disable())
            
            // Définir les règles d'autorisation pour les requêtes HTTP
            .authorizeHttpRequests(auth -> auth
                // Autoriser l'accès SANS authentification aux endpoints de notre AuthController
                .requestMatchers("/api/auth/**").permitAll()
                
                // Exiger une authentification pour TOUTES les autres requêtes
                .anyRequest().authenticated()
            );

        return http.build();
    }
}