package com.course.projetoweb.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;

import com.course.projetoweb.entities.Integrador;
import java.util.Optional;


public interface IntegradorRepository extends JpaRepository<Integrador, Long> {
    Optional<Integrador> findByCnpj(String cnpj);
    // UserDetails findByLogin(String login);
}
