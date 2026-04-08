package com.example.mini_projet;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@SpringBootApplication
public class MiniProjetApplication {
	public static void main(String[] args) {
		SpringApplication.run(MiniProjetApplication.class, args);
		System.out.println("\n Application démarrée !");
		System.out.println(" Swagger: http://localhost:8081/swagger-ui/index.html");
	}
}