package com.course.projetoweb.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.course.projetoweb.entities.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
    
}
