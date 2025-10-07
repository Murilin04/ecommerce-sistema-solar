package com.course.projetoweb.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.course.projetoweb.entities.Integrador;
import com.course.projetoweb.repositories.IntegradorRepository;
import com.course.projetoweb.services.exceptions.DatabaseException;
import com.course.projetoweb.services.exceptions.ResourceNotFoundException;

import jakarta.persistence.EntityNotFoundException;

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

    public Integrador update(Long id, Integrador obj) {
        try {
            Integrador entity = userRepository.getReferenceById(id);
            updateData(entity, obj);
            return userRepository.save(entity);
        } catch (EntityNotFoundException e) {
            throw new ResourceNotFoundException(id);
        }
      
    }

    private void updateData(Integrador entity, Integrador obj) {
        entity.setCnpj(obj.getCnpj());
        entity.setStateRegistration(obj.getStateRegistration());
        entity.setIsMei(obj.getIsMei());
        entity.setCompanyName(obj.getCompanyName());
        entity.setTradeName(obj.getTradeName());
        entity.setPostalCode(obj.getPostalCode());
        entity.setState(obj.getState());
        entity.setCity(obj.getCity());
        entity.setAddress(obj.getAddress());
        entity.setAddressNumber(obj.getAddressNumber());
        entity.setAddressComplement(obj.getAddressComplement());
        entity.setNeighborhood(obj.getNeighborhood());
        entity.setEmail(obj.getEmail());
        entity.setPhone(obj.getPhone());
        entity.setWhatsapp(obj.getWhatsapp());
        if (obj.getPassword() != null && !obj.getPassword().isBlank()) {
            entity.setPassword(passwordEncoder.encode(obj.getPassword()));
        }
       
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

}
