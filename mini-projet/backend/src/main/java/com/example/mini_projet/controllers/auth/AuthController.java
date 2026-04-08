package com.example.mini_projet.controllers.auth;

import com.example.mini_projet.dto.request.ChangePasswordRequestDTO;
import com.example.mini_projet.dto.request.LoginRequestDTO;
import com.example.mini_projet.dto.response.JwtAuthenticationResponseDTO;
import com.example.mini_projet.dto.response.UserInfoResponseDTO;
import com.example.mini_projet.entities.Employe;
import com.example.mini_projet.exceptions.ValidationException;
import com.example.mini_projet.repositories.EmployeRepository;
import com.example.mini_projet.security.JwtTokenProvider;
import com.example.mini_projet.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final EmployeRepository employeRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtTokenProvider tokenProvider,
                          EmployeRepository employeRepository,
                          PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.employeRepository = employeRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<JwtAuthenticationResponseDTO> login(@Valid @RequestBody LoginRequestDTO loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getLogin(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = tokenProvider.generateToken(authentication);

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        return ResponseEntity.ok(new JwtAuthenticationResponseDTO(
                jwt,
                userPrincipal.getId(),
                userPrincipal.getUsername(),
                userPrincipal.getNom(),
                userPrincipal.getPrenom(),
                userPrincipal.getEmail(),
                userPrincipal.getAuthorities().iterator().next().getAuthority()
        ));
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserInfoResponseDTO> getCurrentUser() {
        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();

        Employe employe = employeRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouve"));

        return ResponseEntity.ok(new UserInfoResponseDTO(
                employe.getId(),
                employe.getLogin(),
                employe.getNom(),
                employe.getPrenom(),
                employe.getEmail(),
                employe.getMatricule(),
                employe.getProfil().getCode(),
                employe.getProfil().getLibelle()
        ));
    }

    @PostMapping("/change-password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> changePassword(@Valid @RequestBody ChangePasswordRequestDTO request) {
        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();

        Employe employe = employeRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouve"));

        if (!passwordEncoder.matches(request.getOldPassword(), employe.getPassword())) {
            throw new ValidationException("Ancien mot de passe incorrect");
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new ValidationException("La confirmation ne correspond pas au nouveau mot de passe");
        }

        if (request.getOldPassword().equals(request.getNewPassword())) {
            throw new ValidationException("Le nouveau mot de passe doit etre different de l'ancien");
        }

        employe.setPassword(passwordEncoder.encode(request.getNewPassword()));
        employeRepository.save(employe);

        return ResponseEntity.ok("Mot de passe modifie avec succes");
    }
}