package com.course.projetoweb.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Desabilita CSRF para testes
                .headers(headers -> headers.frameOptions(frame -> frame.disable())) // Libera uso de frames (H2 precisa)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/integrador/**").permitAll() // libera seu endpoint de cadastro
                        .requestMatchers("/h2-console/**").permitAll() // libera H2 console
                        .anyRequest().authenticated() // o resto precisa de autenticação
                );

        return http.build();
    }

    // BCrypt para ser usado em qualquer parte do projeto
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
