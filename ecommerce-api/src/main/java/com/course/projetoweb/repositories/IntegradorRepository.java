package com.course.projetoweb.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.course.projetoweb.entities.Integrador;

@Repository
public interface IntegradorRepository extends JpaRepository<Integrador, Long> {
    Optional<Integrador> findByCnpj(String cnpj);
    Integrador findByEmail(String email);
    boolean existsByEmail(String email);
}
