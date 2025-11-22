package com.convene.api.config;

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
            // Désactiver CSRF, car c'est souvent utilisé pour les API REST
            .csrf(csrf -> csrf.disable()) 
            
            // Définir les autorisations pour les requêtes HTTP
            .authorizeHttpRequests(auth -> auth
                // Autoriser tout le monde (connecté ou non) à accéder aux URLs commençant par /api/events
                .requestMatchers("/api/events/**").permitAll() 
                
                // Exiger une authentification pour toutes les autres requêtes
                .anyRequest().authenticated() 
            )
            
            // Utiliser la configuration de formulaire de login par défaut de Spring Security
            .formLogin(form -> form.permitAll());

        return http.build();
    }
}