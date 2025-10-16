package com.course.projetoweb.entities;

import java.util.Calendar;
import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "password_reset_tokens")
public class PasswordResetToken {
    
    private static final int EXPIRATION = 60 * 30; // tempo de expiração do token: 30 minutos

    @Id // indica que esse campo é uma chave primária
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Chave primária gerada automaticamente pelo BD.
    private Long id;

    private String token; // token de redefinição de senha

    @OneToOne(targetEntity = Integrador.class, fetch = FetchType.EAGER) // relacionamento 1:1 com a entidade User, recuperação do DB
    @JoinColumn(nullable = false, name = "integrador_id") // indica que este campo é uma chave estrangeira referenciando a tabela user
    private Integrador integrador; // usuário associado ao token.

    private Date expiryDate; // data de expiração do token

    // Esse método cria um novo token com a data de expiração calculada
    public PasswordResetToken() {
        this.expiryDate = calculateExpiryDate(EXPIRATION);
    }

    public PasswordResetToken(Integrador integrador, String token) {
        this.integrador = integrador; // associa um usuário ao token
        this.token = token; // define o token de redefinição de senha
        this.expiryDate = calculateExpiryDate(EXPIRATION); // cria um novo token com a data de expiração calculada
    }

    private Date calculateExpiryDate(final int expiryTimeInMinutes) {
        final Calendar cal = Calendar.getInstance(); // obtém uma instância do calendário atual
        cal.setTimeInMillis(new Date().getTime()); // define o tempo atual como o tempo do calendário
        cal.add(Calendar.MINUTE, expiryTimeInMinutes); // adiciona o tempo de expiração do token em minutos
        return new Date(cal.getTime().getTime()); // retorna a data com a expiração do token
    }

    public static int getExpiration() {
        return EXPIRATION;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Integrador getIntegrador() {
        return integrador;
    }

    public void setIntegrador(Integrador integrador) {
        this.integrador = integrador;
    }

    public Date getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(Date expiryDate) {
        this.expiryDate = expiryDate;
    }

}
