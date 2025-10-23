package com.course.projetoweb.repositories.admin;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.course.projetoweb.entities.Integrador;

public interface AdminRepository extends JpaRepository<Integrador, Long>{
     Optional<Integrador> findByCnpj(String cnpj);
}
