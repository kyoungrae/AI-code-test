package com;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class VimsLoginApplication {

	public static void main(String[] args) {
		SpringApplication.run(VimsLoginApplication.class, args);
	}

}
