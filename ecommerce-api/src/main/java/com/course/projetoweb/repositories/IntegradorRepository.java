package com.course.projetoweb.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.course.projetoweb.entities.Integrador;


public interface IntegradorRepository extends JpaRepository<Integrador, Long> {
    Optional<Integrador> findByCnpj(String cnpj);
    Integrador findByEmail(String email);
}
