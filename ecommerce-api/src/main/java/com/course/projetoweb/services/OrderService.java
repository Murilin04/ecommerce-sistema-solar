package com.course.projetoweb.services;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.course.projetoweb.dto.CreateOrderRequestDTO;
import com.course.projetoweb.dto.OrderItemDTO;
import com.course.projetoweb.entities.Integrador;
import com.course.projetoweb.entities.Order;
import com.course.projetoweb.entities.OrderItem;
import com.course.projetoweb.entities.enums.OrderStatus;
import com.course.projetoweb.repositories.IntegradorRepository;
import com.course.projetoweb.repositories.OrderRepository;

@Service
public class OrderService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private ProductService productService;

    @Autowired
    private IntegradorRepository integradorRepository;


    @Transactional(readOnly = true)
    public List<Order> findAll() {
        return orderRepository.findAll();
    }

    @Transactional
    public Order createOrder(CreateOrderRequestDTO request) {
        // Gerar número único do pedido
        String orderNumber = generateOrderNumber();
        
        // Criar pedido
        Order order = new Order();
    order.setOrderNumber(orderNumber);
    // buscar integrador (cliente) pelo id enviado no DTO
    Integrador client = integradorRepository.findById(request.getUserId())
        .orElseThrow(() -> new RuntimeException("Integrador não encontrado: " + request.getUserId()));
    order.setClient(client);
        order.setShippingAddress(request.getShippingAddress());
        order.setShippingZipCode(request.getShippingZipCode());
        order.setShippingCity(request.getShippingCity());
        order.setShippingState(request.getShippingState());
        order.setShippingComplement(request.getShippingComplement());
        order.setCustomerEmail(request.getCustomerEmail());
        order.setCustomerPhone(request.getCustomerPhone());
        order.setCustomerName(request.getCustomerName());
        order.setPaymentMethod(request.getPaymentMethod());
        order.setNotes(request.getNotes());
        order.setShippingCost(request.getShippingCost() != null ? request.getShippingCost() : BigDecimal.ZERO);
        order.setDiscount(request.getDiscount() != null ? request.getDiscount() : BigDecimal.ZERO);
        
        // Adicionar itens
        for (OrderItemDTO itemDTO : request.getItems()) {
            OrderItem item = new OrderItem();

            // Carregar product do DB usando o id fornecido no DTO (evita product_id null)
            com.course.projetoweb.entities.Product product = null;
            if (itemDTO.getProductId() != null) {
                product = productService.findById(itemDTO.getProductId());
            } else {
                throw new IllegalArgumentException("productId is required for order items");
            }
            item.setProduct(product);

            // Preencher nome/imagem/código do produto (prefere valores do DTO quando fornecidos)
            item.setProductName(itemDTO.getProductName() != null ? itemDTO.getProductName() : product.getNome());
            item.setProductImage(itemDTO.getProductImage() != null ? itemDTO.getProductImage() : product.getImagem());
            item.setProductCode(itemDTO.getProductCode() != null ? itemDTO.getProductCode() : product.getCodigoCategoria());

            // Garantir que o unitPrice esteja definido antes de setar a quantidade
            java.math.BigDecimal unitPrice = itemDTO.getUnitPrice();
            if (unitPrice == null && product != null) {
                unitPrice = product.getPreco();
            }
            if (unitPrice == null) unitPrice = java.math.BigDecimal.ZERO;
            item.setUnitPrice(unitPrice);

            item.setQuantity(itemDTO.getQuantity());
            item.calculateTotalPrice();

            order.addItem(item);
        }
        
        // Calcular total
        order.calculateTotal();
        
        // Salvar pedido
        return orderRepository.save(order);
    }

    @Transactional(readOnly = true)
    public Order findById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado: " + id));
    }

    @Transactional(readOnly = true)
    public Order findByOrderNumber(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado: " + orderNumber));
    }

    @Transactional(readOnly = true)
    public List<Order> findByClientId(Long clientId) {
        return orderRepository.findByClient_IdOrderByCreatedAtDesc(clientId);
    }

    @Transactional
    public Order updateStatus(Long id, OrderStatus status) {
        Order order = findById(id);
        order.setStatus(status);
        return orderRepository.save(order);
    }

    @Transactional
    public Order cancelOrder(Long id, String reason) {
        Order order = findById(id);
        order.cancel(reason);
        return orderRepository.save(order);
    }

    private String generateOrderNumber() {
        String prefix = "ORD";
        String timestamp = String.valueOf(System.currentTimeMillis());
        String random = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        return prefix + "-" + timestamp + "-" + random;
    }

}
