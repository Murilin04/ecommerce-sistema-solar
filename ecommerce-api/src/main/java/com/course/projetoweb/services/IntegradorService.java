package com.course.projetoweb.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;

import com.course.projetoweb.entities.Integrador;
import com.course.projetoweb.repositories.IntegradorRepository;
import com.course.projetoweb.services.exceptions.DatabaseException;
import com.course.projetoweb.services.exceptions.ResourceNotFoundException;

import jakarta.persistence.EntityNotFoundException;

@Service
public class IntegradorService {

    @Autowired
    private IntegradorRepository userRepository;

    public List<Integrador> findAll() {
        return userRepository.findAll();
    }

    public Integrador findById(Long id) {
        Optional<Integrador> obj = userRepository.findById(id);
        return obj.orElseThrow(() -> new ResourceNotFoundException(id));
    }

    public Integrador insert(Integrador obj) {
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
