package com.course.projetoweb.dto;

import java.math.BigDecimal;
import java.util.List;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public class CreateOrderRequestDTO {
    
    @NotNull
    private Long userId; // receber apenas o id do integrador (cliente)
    
    @NotEmpty(message = "Carrinho não pode estar vazio")
    private List<OrderItemDTO> items;
    
    @NotBlank
    private String shippingAddress;
    
    @NotBlank
    private String shippingZipCode;
    
    @NotBlank
    private String shippingCity;
    
    @NotBlank
    private String shippingState;
    
    private String shippingComplement;
    
    @Email
    private String customerEmail;
    
    private String customerPhone;
    
    private String customerName;
    
    private String paymentMethod;
    
    private BigDecimal shippingCost;
    
    private BigDecimal discount;
    
    private String notes;

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public List<OrderItemDTO> getItems() {
        return items;
    }

    public void setItems(List<OrderItemDTO> items) {
        this.items = items;
    }

    public String getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public String getShippingZipCode() {
        return shippingZipCode;
    }

    public void setShippingZipCode(String shippingZipCode) {
        this.shippingZipCode = shippingZipCode;
    }

    public String getShippingCity() {
        return shippingCity;
    }

    public void setShippingCity(String shippingCity) {
        this.shippingCity = shippingCity;
    }

    public String getShippingState() {
        return shippingState;
    }

    public void setShippingState(String shippingState) {
        this.shippingState = shippingState;
    }

    public String getShippingComplement() {
        return shippingComplement;
    }

    public void setShippingComplement(String shippingComplement) {
        this.shippingComplement = shippingComplement;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public BigDecimal getShippingCost() {
        return shippingCost;
    }

    public void setShippingCost(BigDecimal shippingCost) {
        this.shippingCost = shippingCost;
    }

    public BigDecimal getDiscount() {
        return discount;
    }

    public void setDiscount(BigDecimal discount) {
        this.discount = discount;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    

}
