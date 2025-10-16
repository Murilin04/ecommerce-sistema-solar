package com.course.projetoweb.services;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.course.projetoweb.entities.Integrador;
import com.course.projetoweb.entities.PasswordResetToken;
import com.course.projetoweb.repositories.IntegradorRepository;
import com.course.projetoweb.repositories.PasswordResetTokenRepository;

import jakarta.mail.MessagingException;

@Service
public class PasswordResetService {

  @Autowired
  private IntegradorRepository userRepository; // Repositório para acesso aos usuários

  @Autowired
  private PasswordResetTokenRepository tokenRepository; // Repositório para acesso aos tokens de reset de senha

  @Autowired
  private EmailService emailService; // Serviço para envio de e-mails

  @Autowired
  private PasswordEncoder passwordEncoder;

  // Método para criar um token de reset de senha para um usuário
  public void createPasswordResetTokenForUser(Integrador user, String token) {
    PasswordResetToken resetToken = new PasswordResetToken();
    resetToken.setIntegrador(user); // Define o usuário associado ao token
    resetToken.setToken(token);
    tokenRepository.save(resetToken); // Salva o token no repositório
  }

  // Método para obter um token de reset de senha a partir do seu valor
  public PasswordResetToken getPasswordResetToken(String token) {
    return tokenRepository.findByToken(token);
  }

  // Método para enviar um e-mail de reset de senha para um usuário
  public void sendPasswordResetEmail(String email) throws MessagingException {
    Integrador user = userRepository.findByEmail(email);
    if (user == null || user.getEmail() == null) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "E-mail não cadastrado");
    }
    String token = UUID.randomUUID().toString(); // Gerar um novo token
    createPasswordResetTokenForUser(user, token); // Criar um token para o usuário
    emailService.sendPasswordResetEmail(user.getEmail(), token); // Enviar o e-mail com o token
  }

  // Método para alterar a senha de um usuário a partir de um token de reset de
  // senha e uma nova senha
  public void changePassword(String token, String newPassword, String emailRequest) throws MessagingException {
    PasswordResetToken resetToken = tokenRepository.findByToken(token);
    if (resetToken == null) { // Verificar se o token é válido
      throw new MessagingException("Token inválido ou expirado!");
    }

    Integrador user = resetToken.getIntegrador();
    // Verifica se o usuário existe e se o e-mail repassado corresponde ao e-mail
    // vinculado ao token
    if (user == null || !user.getEmail().equals(emailRequest)) {
      throw new MessagingException(
          "Usuário não encontrado ou e-mail inválido!");
    }

    user.setPassword(passwordEncoder.encode(newPassword)); // Alterar a senha do usuário
    userRepository.save(user); // Salvar as alterações no repositório
    tokenRepository.delete(resetToken); // Remover o token utilizado
  }
}
