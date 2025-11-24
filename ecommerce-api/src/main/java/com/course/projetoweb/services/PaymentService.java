package com.course.projetoweb.services;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Random;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.course.projetoweb.dto.ProcessPaymentRequest;
import com.course.projetoweb.entities.Order;
import com.course.projetoweb.entities.Payment;
import com.course.projetoweb.entities.enums.PaymentMethod;
import com.course.projetoweb.entities.enums.PaymentStatus;
import com.course.projetoweb.repositories.OrderRepository;
import com.course.projetoweb.repositories.PaymentRepository;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private OrderService orderService;

    @Transactional
    public Payment processPayment(ProcessPaymentRequest request) {
        Order order = orderService.findById(request.getOrderId());

        if (order.getPaymentStatus() == PaymentStatus.PAID) {
            throw new RuntimeException("Pedido já foi pago");
        }

        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setAmount(request.getAmount());
        payment.setTransactionId(generateTransactionId());
        payment.setPaymentMethod(PaymentMethod.valueOf(request.getPaymentMethod()));
        payment.setInstallments(request.getInstallments() != null ? request.getInstallments() : 1);

        if (payment.getInstallments() > 1) {
            payment.setInstallmentAmount(
                    payment.getAmount().divide(BigDecimal.valueOf(payment.getInstallments()), 2,
                            BigDecimal.ROUND_HALF_UP));
        }

        switch (payment.getPaymentMethod()) {
            case PIX:
                processPix(payment);
                break;
            case CREDIT_CARD:
            case DEBIT_CARD:
                processCard(payment, request);
                // ✅ CONFIRMAR AUTOMATICAMENTE APÓS PROCESSAMENTO
                if (payment.getStatus() == PaymentStatus.PAID) {
                    order.markAsPaid();
                    orderRepository.save(order);
                }
                break;
            case BOLETO:
                processBoleto(payment);
                break;
        }

        payment = paymentRepository.save(payment);
        order.setPayment(payment);
        order.setPaymentMethod(request.getPaymentMethod());
        orderRepository.save(order);

        return payment;
    }

    @Transactional
    public Payment confirmPayment(String transactionId) {
        Payment payment = paymentRepository.findByTransactionId(transactionId)
                .orElseThrow(() -> new RuntimeException("Pagamento não encontrado: " + transactionId));
        
        // Marcar como pago
        payment.markAsPaid();
        payment.setProcessorResponse("Pagamento confirmado com sucesso");
        
        // Atualizar pedido
        Order order = payment.getOrder();
        order.markAsPaid();
        
        orderRepository.save(order);
        return paymentRepository.save(payment);
    }

    private void processPix(Payment payment) {
        // Simular geração de código PIX
        payment.setPixCode(generatePixCode());
        payment.setPixQrCode("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==");
        payment.setExpiresAt(LocalDateTime.now().plusMinutes(30));
        payment.setStatus(PaymentStatus.PENDING);
    }

    private void processCard(Payment payment, ProcessPaymentRequest request) {
        // Simular processamento de cartão
        payment.setCardLastDigits(request.getCardNumber().substring(request.getCardNumber().length() - 4));
        payment.setCardBrand(detectCardBrand(request.getCardNumber()));
        
        // Simular aprovação/rejeição (90% aprovação)
        boolean approved = new Random().nextInt(100) < 90;
        
        if (approved) {
            payment.markAsPaid();
            payment.setProcessorResponse("Transação aprovada");
            payment.getOrder().markAsPaid();
        } else {
            payment.markAsFailed("Transação recusada pela operadora");
        }
    }

    private void processBoleto(Payment payment) {
        // Simular geração de boleto
        payment.setBoletoBarcode(generateBoletoBarcode());
        payment.setBoletoUrl("https://exemplo.com/boleto/" + payment.getTransactionId());
        payment.setExpiresAt(LocalDateTime.now().plusDays(3));
        payment.setStatus(PaymentStatus.PENDING);
    }

    private String generateTransactionId() {
        return "TXN-" + UUID.randomUUID().toString().toUpperCase();
    }

    private String generatePixCode() {
        return UUID.randomUUID().toString().replaceAll("-", "").toUpperCase();
    }

    private String generateBoletoBarcode() {
        Random random = new Random();
        StringBuilder barcode = new StringBuilder();
        for (int i = 0; i < 47; i++) {
            barcode.append(random.nextInt(10));
        }
        return barcode.toString();
    }

    private String detectCardBrand(String cardNumber) {
        if (cardNumber.startsWith("4")) return "VISA";
        if (cardNumber.startsWith("5")) return "MASTERCARD";
        if (cardNumber.startsWith("3")) return "AMEX";
        return "OTHER";
    }
}
