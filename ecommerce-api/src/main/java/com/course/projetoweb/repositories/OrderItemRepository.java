package com.course.projetoweb.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.course.projetoweb.entities.OrderItem;
import com.course.projetoweb.entities.pk.OrderItemPK;

public interface OrderItemRepository extends JpaRepository<OrderItem, OrderItemPK> {
    
}
