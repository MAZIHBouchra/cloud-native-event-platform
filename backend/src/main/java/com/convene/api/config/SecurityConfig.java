package com.convene.api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher; // Nouvelle importation

import static org.springframework.security.config.Customizer.withDefaults; // Nouvelle importation

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable) // Désactivez CSRF pour les APIs REST, sinon POST, PUT, DELETE échoueront.
            .authorizeHttpRequests(authorize -> authorize
                // Autorise toutes les requêtes POST à /api/events sans authentification
                .requestMatchers(AntPathRequestMatcher.antMatcher("/api/events")).permitAll()
                // Ou pour autoriser TOUTES les requêtes à /api/**
                // .requestMatchers(AntPathRequestMatcher.antMatcher("/api/**")).permitAll()
                // Si vous voulez autoriser toutes les requêtes sans aucune sécurité pour le moment:
                // .anyRequest().permitAll() // C'EST TRÈS INSECURE POUR LA PRODUCTION !

                // Toutes les autres requêtes nécessitent une authentification (si d'autres endpoints existent)
                .anyRequest().authenticated()
            )
            .httpBasic(withDefaults()) // Utilise l'authentification HTTP Basic par défaut
            .formLogin(withDefaults()); // Utilise le formulaire de login par défaut
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