package com.example.mini_projet.dto.response;

public class JwtAuthenticationResponseDTO {
    private String accessToken;
    private String tokenType = "Bearer";
    private Long id;
    private String login;
    private String nom;
    private String prenom;
    private String email;
    private String role;

    public JwtAuthenticationResponseDTO(String accessToken, Long id, String login,
                                        String nom, String prenom, String email, String role) {
        this.accessToken = accessToken;
        this.id = id;
        this.login = login;
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.role = role;
    }


    public String getAccessToken() { return accessToken; }
    public void setAccessToken(String accessToken) { this.accessToken = accessToken; }
    public String getTokenType() { return tokenType; }
    public void setTokenType(String tokenType) { this.tokenType = tokenType; }
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getLogin() { return login; }
    public void setLogin(String login) { this.login = login; }
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}