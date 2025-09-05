package com.course.projetoweb.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.course.projetoweb.entities.Integrador;

public interface IntegradorRepository extends JpaRepository<Integrador, Long> {
    
}
