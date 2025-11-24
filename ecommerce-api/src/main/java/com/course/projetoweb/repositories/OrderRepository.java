package com.course.projetoweb.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.course.projetoweb.entities.Order;
import com.course.projetoweb.entities.enums.OrderStatus;
import com.course.projetoweb.entities.enums.PaymentStatus;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    Optional<Order> findByOrderNumber(String orderNumber);
    
    List<Order> findByClient_Id(Long clientId);
    
    List<Order> findByClient_IdOrderByCreatedAtDesc(Long clientId);
    
    List<Order> findByStatus(OrderStatus status);
    
    List<Order> findByPaymentStatus(PaymentStatus paymentStatus);
    
    boolean existsByOrderNumber(String orderNumber);
}
