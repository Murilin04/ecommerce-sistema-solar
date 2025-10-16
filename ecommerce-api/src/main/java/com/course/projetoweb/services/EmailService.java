package com.course.projetoweb.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired // Injeta o objeto JavaMailSender no atributo javaMailSender.
    private JavaMailSender javaMailSender;

    // Método responsável por enviar e-mail de redefinição de senha.
    public void sendPasswordResetEmail(String recipient, String token) throws MessagingException {

        // Cria uma nova mensagem de e-mail.
        MimeMessage message = javaMailSender.createMimeMessage();

        // Cria um novo helper para auxiliar na criação da mensagem de e-mail.
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        // Define o remetente do e-mail.
        helper.setFrom("WM Energia Solar <murilin04.rksporte@gmail.com>");

        // Define o destinatário do e-mail.
        helper.setTo(recipient);

        // Define o assunto do e-mail.
        helper.setSubject("API de redefinição de senha");

        // Define o corpo do e-mail. Passa o e-mail do usuario + token na url.
        // URL correta da sua aplicação Angular
        String frontendUrl = "http://localhost:4200/reset";

        String text = "<html>"
                + "<body style='font-family: Arial, sans-serif;'>"
                + "<h1>Recuperação de senha</h1>"
                + "<p>Olá, tudo bem?</p>"
                + "<p>Você solicitou a redefinição de senha do e-mail cadastrado em nosso sistema. Clique no link abaixo para prosseguir:</p>"
                + "<p style='background-color: #24a0ed; padding: 10px; color: white; border-radius: 5px; display: inline-block;'>"
                + "<a href='" + frontendUrl + "/" + recipient + "/" + token + "' style='color: white; text-decoration: none;'>"
                + "Redefinir senha</a></p>"
                + "<p>Obrigado por utilizar nosso sistema. Se houver alguma dúvida, sinta-se à vontade para me contatar.</p>"
                + "<p>Atenciosamente,<br>Murilo Barros.</p>"
                + "<p>"
                + "<span style='background-color: #0e76a8; padding: 10px; color: white; border-radius: 5px; display: inline-block;'>"
                + "<a href='https://www.linkedin.com/in/murilo-barros-9685b8289' style='color: white; text-decoration: none;'>LinkedIn</a></span> "
                + "<span style='background-color: #171515; padding: 10px; color: white; border-radius: 5px; display: inline-block;'>"
                + "<a href='https://github.com/Murilin04' style='color: white; text-decoration: none;'>GitHub</a></span>"
                + "</p>"
                + "</body></html>";

        // Define o corpo do e-mail como texto HTML.
        helper.setText(text, true);

        // Envia a mensagem de e-mail.
        javaMailSender.send(message);
    }
}
