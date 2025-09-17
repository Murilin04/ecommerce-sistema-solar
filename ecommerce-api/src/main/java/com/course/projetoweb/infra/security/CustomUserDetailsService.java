package com.course.projetoweb.infra.security;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import com.course.projetoweb.entities.Integrador;
import com.course.projetoweb.repositories.IntegradorRepository;

@Component
public class CustomUserDetailsService implements UserDetailsService{

    @Autowired
    IntegradorRepository repository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
       Integrador user = this.repository.findByCnpj(username).orElseThrow(() -> new UsernameNotFoundException("User not found"));
       return new org.springframework.security.core.userdetails.User(user.getCnpj(), user.getPassword(), new ArrayList<>());
    }
    
}
