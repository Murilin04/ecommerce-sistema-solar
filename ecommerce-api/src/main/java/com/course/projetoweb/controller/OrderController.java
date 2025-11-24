package com.course.projetoweb.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.course.projetoweb.dto.CreateOrderRequestDTO;
import com.course.projetoweb.entities.Order;
import com.course.projetoweb.entities.enums.OrderStatus;
import com.course.projetoweb.repositories.OrderRepository;
import com.course.projetoweb.services.OrderService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;
    
    @Autowired
    private OrderRepository orderRepository;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Order> createOrder(@Valid @RequestBody CreateOrderRequestDTO request) {
        Order order = orderService.createOrder(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(order);
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        Order order = orderService.findById(id);
        return ResponseEntity.ok(order);
    }

    @GetMapping("/number/{orderNumber}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Order> getOrderByNumber(@PathVariable String orderNumber) {
        Order order = orderService.findByOrderNumber(orderNumber);
        return ResponseEntity.ok(order);
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Order>> getOrdersByUserId(@PathVariable Long userId) {
        List<Order> orders = orderService.findByClientId(userId);
        return ResponseEntity.ok(orders);
    }

    @PatchMapping("/{id}/cancel")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Order> cancelOrder(@PathVariable Long id, @RequestParam String reason) {
        Order order = orderService.cancelOrder(id, reason);
        return ResponseEntity.ok(order);
    }

    // admin endpoints

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderService.findAll();
        return ResponseEntity.ok(orders);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        String status = request.get("status");
        OrderStatus newStatus = OrderStatus.valueOf(status);
        Order order = orderService.updateStatus(id, newStatus);
        return ResponseEntity.ok(order);
    }

    @PatchMapping("/{id}/tracking")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Order> addTrackingCode(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        String code = request.get("code");
        Order order = orderService.findById(id);
        order.markAsShipped(code);
        orderRepository.save(order);
        return ResponseEntity.ok(order);
    }
}
