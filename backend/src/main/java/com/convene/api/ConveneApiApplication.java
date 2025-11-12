package com.convene.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing // Annotation ajouté pour besoin !
public class ConveneApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(ConveneApiApplication.class, args);
	}

}
