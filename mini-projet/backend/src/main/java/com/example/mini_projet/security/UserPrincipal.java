package com.example.mini_projet.security;

import com.example.mini_projet.entities.Employe;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.List;

public class UserPrincipal implements UserDetails {

    private Long id;
    private String username;
    private String password;
    private Collection<? extends GrantedAuthority> authorities;
    private String nom;
    private String prenom;
    private String email;
    private String matricule;

    public UserPrincipal(Long id, String username, String password,
                         Collection<? extends GrantedAuthority> authorities,
                         String nom, String prenom, String email, String matricule) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.authorities = authorities;
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.matricule = matricule;
    }

    public static UserPrincipal create(Employe employe) {
        List<GrantedAuthority> authorities = Collections.singletonList(
                new SimpleGrantedAuthority("ROLE_" + employe.getProfil().getCode())
        );

        return new UserPrincipal(
                employe.getId(),
                employe.getLogin(),
                employe.getPassword(),
                authorities,
                employe.getNom(),
                employe.getPrenom(),
                employe.getEmail(),
                employe.getMatricule()
        );
    }

    public Long getId() {
        return id;
    }

    public String getNom() {
        return nom;
    }

    public String getPrenom() {
        return prenom;
    }

    public String getEmail() {
        return email;
    }

    public String getMatricule() {
        return matricule;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}