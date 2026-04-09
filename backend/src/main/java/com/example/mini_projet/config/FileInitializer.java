package com.example.mini_projet.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Component
public class FileInitializer implements CommandLineRunner {

    private final String uploadDir = "uploads/documents/";

    @Override
    public void run(String... args) throws Exception {
        createUploadDirectory();
        createSampleFiles();
    }

    private void createUploadDirectory() {
        try {
            Path path = Paths.get(uploadDir);
            if (!Files.exists(path)) {
                Files.createDirectories(path);
                System.out.println("Dossier cree: " + uploadDir);
            }
        } catch (IOException e) {
            System.err.println("Erreur creation dossier: " + e.getMessage());
        }
    }

    private void createSampleFiles() {
        String[] files = {
                "DOC-001.pdf", "DOC-002.pdf", "DOC-003.pdf", "DOC-004.pdf", "DOC-005.pdf"
        };

        String[] contents = {
                "CAHIER DES CHARGES\n\nDocument initial du projet\nDate: " + new java.util.Date(),
                "SPECIFICATIONS FONCTIONNELLES\n\nDetails des besoins utilisateurs\nDate: " + new java.util.Date(),
                "ARCHITECTURE TECHNIQUE\n\nDiagramme des composants\nDate: " + new java.util.Date(),
                "COMPTE RENDU REUNION 1\n\nReunion de lancement du projet\nDate: " + new java.util.Date(),
                "CONTRAT DE PRESTATION\n\nContrat signe entre les parties\nDate: " + new java.util.Date()
        };

        for (int i = 0; i < files.length; i++) {
            try {
                Path filePath = Paths.get(uploadDir + files[i]);
                if (!Files.exists(filePath)) {
                    FileWriter writer = new FileWriter(filePath.toFile());
                    writer.write(contents[i]);
                    writer.close();
                    System.out.println("Fichier cree: " + files[i]);
                }
            } catch (IOException e) {
                System.err.println("Erreur creation fichier " + files[i] + ": " + e.getMessage());
            }
        }
    }
}