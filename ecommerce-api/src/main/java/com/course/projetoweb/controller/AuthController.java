package com.course.projetoweb.controller;

import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.course.projetoweb.dto.LoginRequestDTO;
import com.course.projetoweb.dto.RegisterRequestDTO;
import com.course.projetoweb.dto.ResponseDTO;
import com.course.projetoweb.entities.Integrador;
import com.course.projetoweb.entities.enums.IntegradorRole;
import com.course.projetoweb.infra.security.TokenService;
import com.course.projetoweb.repositories.IntegradorRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {
    
    private final IntegradorRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    public AuthController(IntegradorRepository repository, PasswordEncoder passwordEncoder, TokenService tokenService) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
    }

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody @Valid LoginRequestDTO body) {
        Integrador user = this.repository.findByCnpj(body.cnpj()).orElseThrow(() -> new RuntimeException("User not found"));
        if(passwordEncoder.matches(body.password(), user.getPassword())) {
            String token = this.tokenService.generateToken(user);
            return ResponseEntity.ok(new ResponseDTO(user.getCnpj(), token));
        }
        return ResponseEntity.badRequest().build();
    }

    @PostMapping("/register")
    public ResponseEntity register(@RequestBody @Valid RegisterRequestDTO body){
        
        // if (this.repository.findByCnpj(body.cnpj()) != null) return ResponseEntity.badRequest().build();
        Optional<Integrador> user = this.repository.findByCnpj(body.cnpj());

        if(user.isEmpty()) {
            Integrador newUser = new Integrador();
            newUser.setCnpj(body.cnpj());
            newUser.setStateRegistration(body.stateRegistration());
            newUser.setIsMei(body.isMei());
            newUser.setCompanyName(body.companyName());
            newUser.setTradeName(body.tradeName());
            newUser.setPostalCode(body.postalCode());
            newUser.setState(body.state());
            newUser.setCity(body.city());
            newUser.setAddress(body.address());
            newUser.setAddressNumber(body.addressNumber());
            newUser.setAddressComplement(body.addressComplement());
            newUser.setNeighborhood(body.neighborhood());
            newUser.setEmail(body.email());
            newUser.setPhone(body.phone());
            newUser.setWhatsapp(body.whatsapp());
            newUser.setPassword(passwordEncoder.encode(body.password()));
            newUser.setRole(body.role() != null ? body.role() : IntegradorRole.USER);
            this.repository.save(newUser); 

            String token = this.tokenService.generateToken(newUser);
            return ResponseEntity.ok(new ResponseDTO(newUser.getCnpj(), token));
        }
        return ResponseEntity.badRequest().build();
    }

}
