package com.example.mini_projet.dto.request;

import jakarta.validation.constraints.NotBlank;
import org.springframework.web.multipart.MultipartFile;

public class DocumentRequestDTO {

        @NotBlank(message = "Le code est obligatoire")
        private String code;

        @NotBlank(message = "Le type est obligatoire")
        private String type;

        @NotBlank(message = "Le titre est obligatoire")
        private String titre;

        private String description;

        private String cheminFichier;

        private MultipartFile fichier;

        // Constructeurs
        public DocumentRequestDTO() {}

        public DocumentRequestDTO(String code, String type, String titre, String description, String cheminFichier, MultipartFile fichier) {
                this.code = code;
                this.type = type;
                this.titre = titre;
                this.description = description;
                this.cheminFichier = cheminFichier;
                this.fichier = fichier;
        }

        // Getters et Setters
        public String getCode() {
                return code;
        }

        public void setCode(String code) {
                this.code = code;
        }

        public String getType() {
                return type;
        }

        public void setType(String type) {
                this.type = type;
        }

        public String getTitre() {
                return titre;
        }

        public void setTitre(String titre) {
                this.titre = titre;
        }

        public String getDescription() {
                return description;
        }

        public void setDescription(String description) {
                this.description = description;
        }

        public String getCheminFichier() {
                return cheminFichier;
        }

        public void setCheminFichier(String cheminFichier) {
                this.cheminFichier = cheminFichier;
        }

        public MultipartFile getFichier() {
                return fichier;
        }

        public void setFichier(MultipartFile fichier) {
                this.fichier = fichier;
        }
}