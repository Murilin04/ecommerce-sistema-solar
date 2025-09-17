package com.course.projetoweb.entities;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "tb_integrador")
public class Integrador implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @JsonProperty("cnpj")
    @NotBlank
    @Column(length = 18, unique = true)
    private String cnpj;

    @JsonProperty("inscricao_estadual")
    private String stateRegistration;

    @JsonProperty("sou_mei")
    private Boolean isMei;

    @JsonProperty("razao_social")
    @NotBlank
    private String companyName;

    @JsonProperty("nome_fantasia")
    private String tradeName;

    @JsonProperty("cep")
    @NotBlank
    @Column(length = 9)
    private String postalCode;

    @JsonProperty("estado")
    @NotBlank
    private String state;

    @JsonProperty("cidade")
    @NotBlank
    private String city;

    @JsonProperty("endereco")
    @NotBlank
    private String address;

    @JsonProperty("numero")
    @NotBlank
    private String addressNumber;

    @JsonProperty("complemento")
    private String addressComplement;

    @JsonProperty("bairro")
    @NotBlank
    private String neighborhood;

    @JsonProperty("email")
    @NotBlank
    @Email
    private String email;

    @JsonProperty("telefone_comercial")
    @NotBlank
    private String phone;

    @JsonProperty("whatsapp")
    private String whatsapp;

    @NotBlank
    private String password;

    @JsonIgnore
    @OneToMany(mappedBy = "client")
    private List<Order> orders = new ArrayList<>();
    
    public Integrador() {

    }

    public Integrador(Long id, @NotBlank String cnpj, String stateRegistration, Boolean isMei,
            @NotBlank String companyName, String tradeName, @NotBlank String postalCode, @NotBlank String state,
            @NotBlank String city, @NotBlank String address, @NotBlank String addressNumber, String addressComplement,
            @NotBlank String neighborhood, @NotBlank @Email String email, @NotBlank String phone, String whatsapp) {
        this.id = id;
        this.cnpj = cnpj;
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
        this.email = email;
        this.phone = phone;
        this.whatsapp = whatsapp;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public List<Order> getOrders() {
        return orders;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((id == null) ? 0 : id.hashCode());
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        Integrador other = (Integrador) obj;
        if (id == null) {
            if (other.id != null)
                return false;
        } else if (!id.equals(other.id))
            return false;
        return true;
    }

}
