package com.course.projetoweb.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.course.projetoweb.entities.User;

public interface UserRepository extends JpaRepository<User, Long> {
    
}
