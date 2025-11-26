package com.convene.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing // Annotation ajouté pour besoin !
// AJOUTEZ CET IMPORT
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

// MODIFIEZ CETTE LIGNE pour y inclure l'exclusion
@SpringBootApplication(exclude = { SecurityAutoConfiguration.class })
public class ConveneApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(ConveneApiApplication.class, args);
	}

}