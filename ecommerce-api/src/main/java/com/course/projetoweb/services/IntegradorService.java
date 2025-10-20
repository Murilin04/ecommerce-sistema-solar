package com.course.projetoweb.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.course.projetoweb.dto.IntegradorDTO;
import com.course.projetoweb.entities.Integrador;
import com.course.projetoweb.entities.IntegradorProfile;
import com.course.projetoweb.repositories.IntegradorRepository;
import com.course.projetoweb.services.exceptions.DatabaseException;
import com.course.projetoweb.services.exceptions.ResourceNotFoundException;

@Service
public class IntegradorService {

    private final PasswordEncoder passwordEncoder;

    @Autowired
    private IntegradorRepository userRepository;

    IntegradorService(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    public List<Integrador> findAll() {
        return userRepository.findAll();
    }

    public Integrador findById(Long id) {
        Optional<Integrador> obj = userRepository.findById(id);
        return obj.orElseThrow(() -> new ResourceNotFoundException(id));
    }

    public void delete(Long id) {
        try {
            userRepository.deleteById(id);
        } catch (EmptyResultDataAccessException e) {
            throw new ResourceNotFoundException(id);
        } catch (DataIntegrityViolationException e) {
            throw new DatabaseException(e.getMessage());
        }

    }

    public Integrador update(Long id, IntegradorDTO dto) {
        Integrador entity = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(id));

        // Atualiza campos flat
        entity.setCnpj(dto.getCnpj());
        entity.setEmail(dto.getEmail());

        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            entity.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        // Atualiza o profile
        if (entity.getProfile() == null) entity.setProfile(new IntegradorProfile());
        IntegradorProfile profile = entity.getProfile();

        profile.setStateRegistration(dto.getStateRegistration());
        profile.setIsMei(dto.getIsMei());
        profile.setCompanyName(dto.getCompanyName());
        profile.setTradeName(dto.getTradeName());
        profile.setPostalCode(dto.getPostalCode());
        profile.setState(dto.getState());
        profile.setCity(dto.getCity());
        profile.setAddress(dto.getAddress());
        profile.setAddressNumber(dto.getAddressNumber());
        profile.setAddressComplement(dto.getAddressComplement());
        profile.setNeighborhood(dto.getNeighborhood());
        profile.setPhone(dto.getPhone());
        profile.setWhatsapp(dto.getWhatsapp());

        entity.setProfile(profile);

        return userRepository.save(entity);
    }

    public void updatePassword(Long id, String currentPassword, String newPassword) {
        Integrador entity = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException(id));
        // Verifica se a senha atual bate com a do banco
        if (!passwordEncoder.matches(currentPassword, entity.getPassword())) {
            throw new RuntimeException("Senha atual incorreta");
        }

        // Atualiza a senha
        entity.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(entity);
    }

    public Integrador getByEmail(String email) {
        Integrador user = userRepository.findByEmail(email);
        return user;
    }

    // verifica se um determinado email já está cadastrado no banco de dados
    public boolean checkEmail(String email) {

        // busca um usuário pelo email
        return userRepository.findByEmail(email) != null;
    }

}
