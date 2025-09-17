package com.course.projetoweb.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.course.projetoweb.entities.Integrador;
import java.util.Optional;


public interface IntegradorRepository extends JpaRepository<Integrador, Long> {
    Optional<Integrador> findByCnpj(String cnpj);
}
