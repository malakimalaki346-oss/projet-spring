package com.example.mini_projet.dto.response;

public class UserInfoResponseDTO {
    private Long id;
    private String login;
    private String nom;
    private String prenom;
    private String email;
    private String matricule;
    private String role;
    private String roleLibelle;

    public UserInfoResponseDTO(Long id, String login, String nom, String prenom,
                               String email, String matricule, String role, String roleLibelle) {
        this.id = id;
        this.login = login;
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.matricule = matricule;
        this.role = role;
        this.roleLibelle = roleLibelle;
    }


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
    public String getMatricule() { return matricule; }
    public void setMatricule(String matricule) { this.matricule = matricule; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getRoleLibelle() { return roleLibelle; }
    public void setRoleLibelle(String roleLibelle) { this.roleLibelle = roleLibelle; }
}