package com.course.projetoweb.dto;

import com.course.projetoweb.entities.enums.IntegradorRole;

public record UpdateIntegradorDTO(
    String cnpj,
    String stateRegistration,
    Boolean isMei,
    String companyName,
    String tradeName,
    String postalCode,
    String state,
    String city,
    String address,
    String addressNumber,
    String addressComplement,
    String neighborhood,
    String email,
    String phone,
    String whatsapp,
    String password,
    IntegradorRole role
) {}