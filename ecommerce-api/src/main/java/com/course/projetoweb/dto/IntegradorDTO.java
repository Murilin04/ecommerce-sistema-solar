package com.course.projetoweb.dto;

import com.course.projetoweb.entities.Integrador;
public class IntegradorDTO {
    private Long id;
    private String cnpj;
    private String email;
    private String password;

    // Profile fields (flat)
    private String stateRegistration;
    private Boolean isMei;
    private String companyName;
    private String tradeName;
    private String postalCode;
    private String state;
    private String city;
    private String address;
    private String addressNumber;
    private String addressComplement;
    private String neighborhood;
    private String phone;
    private String whatsapp;

    public IntegradorDTO() {}

    public IntegradorDTO(Integrador entity) {
        this.id = entity.getId();
        this.cnpj = entity.getCnpj();
        this.email = entity.getEmail();

        if (entity.getProfile() != null) {
            this.stateRegistration = entity.getProfile().getStateRegistration();
            this.isMei = entity.getProfile().getIsMei();
            this.companyName = entity.getProfile().getCompanyName();
            this.tradeName = entity.getProfile().getTradeName();
            this.postalCode = entity.getProfile().getPostalCode();
            this.state = entity.getProfile().getState();
            this.city = entity.getProfile().getCity();
            this.address = entity.getProfile().getAddress();
            this.addressNumber = entity.getProfile().getAddressNumber();
            this.addressComplement = entity.getProfile().getAddressComplement();
            this.neighborhood = entity.getProfile().getNeighborhood();
            this.phone = entity.getProfile().getPhone();
            this.whatsapp = entity.getProfile().getWhatsapp();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCnpj() {
        return cnpj;
    }

    public void setCnpj(String cnpj) {
        this.cnpj = cnpj;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

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
