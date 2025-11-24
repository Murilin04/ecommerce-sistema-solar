package com.course.projetoweb.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.course.projetoweb.entities.Payment;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    
    Optional<Payment> findByTransactionId(String transactionId);
    
    Optional<Payment> findByOrderId(Long orderId);
    
    boolean existsByTransactionId(String transactionId);
}