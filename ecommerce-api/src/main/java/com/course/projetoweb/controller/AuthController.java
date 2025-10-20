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
import com.course.projetoweb.entities.IntegradorProfile;
import com.course.projetoweb.entities.enums.IntegradorRole;
import com.course.projetoweb.infra.security.TokenService;
import com.course.projetoweb.repositories.IntegradorRepository;
import com.course.projetoweb.utils.CnpjUtils;

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
        Integrador user = this.repository.findByCnpj(CnpjUtils.normalize(body.cnpj())).orElseThrow(() -> new RuntimeException("User not found"));
        if(passwordEncoder.matches(body.password(), user.getPassword())) {
            String token = this.tokenService.generateToken(user);
            return ResponseEntity.ok(new ResponseDTO(user.getCnpj(), token));
        }
        return ResponseEntity.badRequest().build();
    }

    @PostMapping("/register")
    public ResponseEntity register(@RequestBody @Valid RegisterRequestDTO body){
        
        // if (this.repository.findByCnpj(body.cnpj()) != null) return ResponseEntity.badRequest().build();
        Optional<Integrador> user = this.repository.findByCnpj(CnpjUtils.normalize(body.cnpj()));
        if (user.isPresent()) {
            return ResponseEntity.badRequest().body("CNPJ já cadastrado");
        }

        // Cria o perfil
        IntegradorProfile profile = new IntegradorProfile();
        profile.setStateRegistration(body.stateRegistration());
        profile.setIsMei(body.isMei());
        profile.setCompanyName(body.companyName());
        profile.setTradeName(body.tradeName());
        profile.setPostalCode(body.postalCode());
        profile.setState(body.state());
        profile.setCity(body.city());
        profile.setAddress(body.address());
        profile.setAddressNumber(body.addressNumber());
        profile.setAddressComplement(body.addressComplement());
        profile.setNeighborhood(body.neighborhood());
        profile.setPhone(body.phone());
        profile.setWhatsapp(body.whatsapp());

        // Cria o usuário principal
        Integrador newUser = new Integrador();
        newUser.setCnpj(CnpjUtils.normalize(body.cnpj()));
        newUser.setEmail(body.email());
        newUser.setPassword(passwordEncoder.encode(body.password()));
        newUser.setRole(body.role() != null ? body.role() : IntegradorRole.USER);
        newUser.setProfile(profile);
        this.repository.save(newUser); 

        String token = this.tokenService.generateToken(newUser);
        return ResponseEntity.ok(new ResponseDTO(newUser.getCnpj(), token));
        
    }

}
