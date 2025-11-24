package com.course.projetoweb.entities;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.course.projetoweb.entities.enums.PaymentMethod;
import com.course.projetoweb.entities.enums.PaymentStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "payment")
public class Payment implements Serializable {
    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    @JsonIgnore
    private Order order;

    @NotBlank(message = "Número da transação é obrigatório")
    @Column(name = "transaction_id", unique = true, nullable = false, length = 100)
    private String transactionId;

    @NotNull(message = "Valor é obrigatório")
    @DecimalMin(value = "0.0", inclusive = false)
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false, length = 20)
    private PaymentMethod paymentMethod;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PaymentStatus status = PaymentStatus.PENDING;

    // Dados específicos do método de pagamento
    @Column(name = "card_last_digits", length = 4)
    private String cardLastDigits;

    @Column(name = "card_brand", length = 50)
    private String cardBrand;

    @Column(name = "pix_qr_code", columnDefinition = "TEXT")
    private String pixQrCode;

    @Column(name = "pix_code", columnDefinition = "TEXT")
    private String pixCode;

    @Column(name = "boleto_url", columnDefinition = "TEXT")
    private String boletoUrl;

    @Column(name = "boleto_barcode", length = 100)
    private String boletoBarcode;

    // Parcelamento
    @Min(1)
    @Column(name = "installments")
    private Integer installments = 1;

    @Column(name = "installment_amount", precision = 10, scale = 2)
    private BigDecimal installmentAmount;

    // Informações adicionais
    @Column(name = "processor_response", columnDefinition = "TEXT")
    private String processorResponse;

    @Column(name = "failure_reason", columnDefinition = "TEXT")
    private String failureReason;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

     // Construtores
    public Payment() {
    }

    public Payment(Order order, BigDecimal amount, PaymentMethod paymentMethod, String transactionId) {
        this.order = order;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.transactionId = transactionId;
    }

    // Helper methods
    public void markAsPaid() {
        this.status = PaymentStatus.PAID;
        this.paidAt = LocalDateTime.now();
    }

    public void markAsFailed(String reason) {
        this.status = PaymentStatus.FAILED;
        this.failureReason = reason;
    }

    public void markAsProcessing() {
        this.status = PaymentStatus.PROCESSING;
    }

    public boolean isPaid() {
        return this.status == PaymentStatus.PAID;
    }

    public boolean isPending() {
        return this.status == PaymentStatus.PENDING;
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public PaymentStatus getStatus() {
        return status;
    }

    public void setStatus(PaymentStatus status) {
        this.status = status;
    }

    public String getCardLastDigits() {
        return cardLastDigits;
    }

    public void setCardLastDigits(String cardLastDigits) {
        this.cardLastDigits = cardLastDigits;
    }

    public String getCardBrand() {
        return cardBrand;
    }

    public void setCardBrand(String cardBrand) {
        this.cardBrand = cardBrand;
    }

    public String getPixQrCode() {
        return pixQrCode;
    }

    public void setPixQrCode(String pixQrCode) {
        this.pixQrCode = pixQrCode;
    }

    public String getPixCode() {
        return pixCode;
    }

    public void setPixCode(String pixCode) {
        this.pixCode = pixCode;
    }

    public String getBoletoUrl() {
        return boletoUrl;
    }

    public void setBoletoUrl(String boletoUrl) {
        this.boletoUrl = boletoUrl;
    }

    public String getBoletoBarcode() {
        return boletoBarcode;
    }

    public void setBoletoBarcode(String boletoBarcode) {
        this.boletoBarcode = boletoBarcode;
    }

    public Integer getInstallments() {
        return installments;
    }

    public void setInstallments(Integer installments) {
        this.installments = installments;
    }

    public BigDecimal getInstallmentAmount() {
        return installmentAmount;
    }

    public void setInstallmentAmount(BigDecimal installmentAmount) {
        this.installmentAmount = installmentAmount;
    }

    public String getProcessorResponse() {
        return processorResponse;
    }

    public void setProcessorResponse(String processorResponse) {
        this.processorResponse = processorResponse;
    }

    public String getFailureReason() {
        return failureReason;
    }

    public void setFailureReason(String failureReason) {
        this.failureReason = failureReason;
    }

    public LocalDateTime getPaidAt() {
        return paidAt;
    }

    public void setPaidAt(LocalDateTime paidAt) {
        this.paidAt = paidAt;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
} 
