package com.course.projetoweb.entities;

import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotBlank;

@Embeddable
public class IntegradorProfile {

    private String stateRegistration;  // Inscrição estadual
    private Boolean isMei;             // Se é MEI

    @NotBlank
    private String companyName;        // Razão social

    private String tradeName;          // Nome fantasia

    @NotBlank
    private String postalCode;         // CEP

    @NotBlank
    private String state;              // Estado

    @NotBlank
    private String city;               // Cidade

    @NotBlank
    private String address;            // Endereço

    @NotBlank
    private String addressNumber;      // Número

    private String addressComplement;  // Complemento

    @NotBlank
    private String neighborhood;       // Bairro

    @NotBlank
    private String phone;              // Telefone comercial

    private String whatsapp;           // WhatsApp (opcional)

    public IntegradorProfile() {
        
    }

    public IntegradorProfile(String stateRegistration, Boolean isMei, @NotBlank String companyName, String tradeName,
            @NotBlank String postalCode, @NotBlank String state, @NotBlank String city, @NotBlank String address,
            @NotBlank String addressNumber, String addressComplement, @NotBlank String neighborhood,
            @NotBlank String phone, String whatsapp) {
        this.stateRegistration = stateRegistration;
        this.isMei = isMei;
        this.companyName = companyName;
        this.tradeName = tradeName;
        this.postalCode = postalCode;
        this.state = state;
        this.city = city;
        this.address = address;
        this.addressNumber = addressNumber;
        this.addressComplement = addressComplement;
        this.neighborhood = neighborhood;
        this.phone = phone;
        this.whatsapp = whatsapp;
    }

    // Getters e Setters
    public String getStateRegistration() {
        return stateRegistration;
    }

    public void setStateRegistration(String stateRegistration) {
        this.stateRegistration = stateRegistration;
    }

    public Boolean getIsMei() {
        return isMei;
    }

    public void setIsMei(Boolean isMei) {
        this.isMei = isMei;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getTradeName() {
        return tradeName;
    }

    public void setTradeName(String tradeName) {
        this.tradeName = tradeName;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getAddressNumber() {
        return addressNumber;
    }

    public void setAddressNumber(String addressNumber) {
        this.addressNumber = addressNumber;
    }

    public String getAddressComplement() {
        return addressComplement;
    }

    public void setAddressComplement(String addressComplement) {
        this.addressComplement = addressComplement;
    }

    public String getNeighborhood() {
        return neighborhood;
    }

    public void setNeighborhood(String neighborhood) {
        this.neighborhood = neighborhood;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getWhatsapp() {
        return whatsapp;
    }

    public void setWhatsapp(String whatsapp) {
        this.whatsapp = whatsapp;
    }
}
