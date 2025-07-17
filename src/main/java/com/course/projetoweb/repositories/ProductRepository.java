package com.course.projetoweb.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.course.projetoweb.entities.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
    
}
