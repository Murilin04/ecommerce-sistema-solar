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

    public Integrador findByCnpj(String cnpj) {
        Optional<Integrador> obj = userRepository.findByCnpj(cnpj);
        return obj.orElseThrow(() -> new ResourceNotFoundException(cnpj));
    }

    public Integrador insert(Integrador obj) {
        try {
            obj.setPassword(passwordEncoder.encode(obj.getPassword()));           
        } catch (Exception e) {
            e.getStackTrace();
        }
        return userRepository.save(obj);
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

    // public Integrador update(Long id, Integrador obj) {
    //     try {
    //         Integrador entity = userRepository.getReferenceById(id);
    //         updateData(entity, obj);
    //         return userRepository.save(entity);
    //     } catch (EntityNotFoundException e) {
    //         throw new ResourceNotFoundException(id);
    //     }
      
    // }

    // private void updateData(Integrador entity, Integrador obj) {
    //     entity.setEmail(obj.getEmail());
    //     entity.setName(obj.getName());
    //     entity.setPhone(obj.getPhone());
    // }

}
