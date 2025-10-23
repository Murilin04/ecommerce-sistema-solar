package com.course.projetoweb.dto;

import com.course.projetoweb.entities.enums.IntegradorRole;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateIntegradorDTO(
    @NotBlank String cnpj,
    String stateRegistration,
    Boolean isMei,
    @NotBlank String companyName,
    String tradeName,
    @NotBlank String postalCode,
    @NotBlank String state,
    @NotBlank String city,
    @NotBlank String address,
    String addressNumber,
    String addressComplement,
    String neighborhood,
    @Email @NotBlank String email,
    String phone,
    String whatsapp,
    @NotBlank @Size(min = 6) String password,
    IntegradorRole role
) {}