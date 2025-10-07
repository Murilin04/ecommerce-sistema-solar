package com.course.projetoweb.entities;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.course.projetoweb.entities.enums.IntegradorRole;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "tb_integrador")
public class Integrador implements Serializable, UserDetails {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Column(length = 18, unique = true)
    private String cnpj;

    // inscricao_estadual
    private String stateRegistration;

    // sou_mei
    private Boolean isMei;

    // razão social
    @NotBlank
    private String companyName;

    // nome fantasia
    private String tradeName;

    // cep
    @NotBlank
    @Column(length = 9)
    private String postalCode;

    // estado
    @NotBlank
    private String state;

    // cidade
    @NotBlank
    private String city;

    // endereço
    @NotBlank
    private String address;

    // numero
    @NotBlank
    private String addressNumber;

    // complemento
    private String addressComplement;

    // bairro
    @NotBlank
    private String neighborhood;

    @NotBlank
    @Email
    private String email;

    // telefone comercial
    @NotBlank
    private String phone;

    private String whatsapp;

    @NotBlank
    private String password;

    private IntegradorRole role;

    @JsonIgnore
    @OneToMany(mappedBy = "client")
    private List<Order> orders = new ArrayList<>();
    
    public Integrador() {

    }

    public Integrador(Long id, @NotBlank String cnpj, String stateRegistration, Boolean isMei,
            @NotBlank String companyName, String tradeName, @NotBlank String postalCode, @NotBlank String state,
            @NotBlank String city, @NotBlank String address, @NotBlank String addressNumber, String addressComplement,
            @NotBlank String neighborhood, @NotBlank @Email String email, @NotBlank String phone, IntegradorRole role, String whatsapp) {
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
        this.role = role;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (this.role == IntegradorRole.ADMIN) return List.of(new SimpleGrantedAuthority("ROLE_ADMIN"), new SimpleGrantedAuthority("ROLE_USER"));
        else return List.of(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public String getUsername() {
        return cnpj;
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

     public IntegradorRole getRole() {
        return role;
    }

    public void setRole(IntegradorRole role) {
        this.role = role;
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
