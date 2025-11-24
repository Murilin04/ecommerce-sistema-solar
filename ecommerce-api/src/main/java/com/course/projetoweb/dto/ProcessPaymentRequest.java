package com.course.projetoweb.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ProcessPaymentRequest {
    
    @NotNull
    private Long orderId;
    
    @NotBlank
    private String paymentMethod; // PIX, CREDIT_CARD, BOLETO
    
    @NotNull
    @DecimalMin("0.01")
    private BigDecimal amount;
    
    // Dados do cartão (se aplicável)
    private String cardNumber;
    private String cardHolderName;
    private String cardExpiryMonth;
    private String cardExpiryYear;
    private String cardCvv;
    private Integer installments;
    public Long getOrderId() {
        return orderId;
    }
    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }
    public String getPaymentMethod() {
        return paymentMethod;
    }
    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
    public BigDecimal getAmount() {
        return amount;
    }
    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
    public String getCardNumber() {
        return cardNumber;
    }
    public void setCardNumber(String cardNumber) {
        this.cardNumber = cardNumber;
    }
    public String getCardHolderName() {
        return cardHolderName;
    }
    public void setCardHolderName(String cardHolderName) {
        this.cardHolderName = cardHolderName;
    }
    public String getCardExpiryMonth() {
        return cardExpiryMonth;
    }
    public void setCardExpiryMonth(String cardExpiryMonth) {
        this.cardExpiryMonth = cardExpiryMonth;
    }
    public String getCardExpiryYear() {
        return cardExpiryYear;
    }
    public void setCardExpiryYear(String cardExpiryYear) {
        this.cardExpiryYear = cardExpiryYear;
    }
    public String getCardCvv() {
        return cardCvv;
    }
    public void setCardCvv(String cardCvv) {
        this.cardCvv = cardCvv;
    }
    public Integer getInstallments() {
        return installments;
    }
    public void setInstallments(Integer installments) {
        this.installments = installments;
    }

    
}
