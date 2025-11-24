package com.course.projetoweb.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.course.projetoweb.dto.ProcessPaymentRequest;
import com.course.projetoweb.entities.Payment;
import com.course.projetoweb.services.PaymentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/process")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Payment> processPayment(@Valid @RequestBody ProcessPaymentRequest request) {
        Payment payment = paymentService.processPayment(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(payment);
    }

    @PostMapping("/confirm/{transactionId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Payment> confirmPayment(@PathVariable String transactionId) {
        Payment payment = paymentService.confirmPayment(transactionId);
        return ResponseEntity.ok(payment);
    }
}
