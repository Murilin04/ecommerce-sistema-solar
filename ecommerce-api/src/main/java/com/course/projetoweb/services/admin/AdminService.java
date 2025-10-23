package com.course.projetoweb.services.admin;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.course.projetoweb.dto.CreateIntegradorDTO;
import com.course.projetoweb.dto.IntegradorDTO;
import com.course.projetoweb.dto.UpdateIntegradorDTO;
import com.course.projetoweb.entities.Integrador;
import com.course.projetoweb.entities.IntegradorProfile;
import com.course.projetoweb.entities.enums.IntegradorRole;
import com.course.projetoweb.repositories.admin.AdminRepository;
import com.course.projetoweb.services.exceptions.DatabaseException;
import com.course.projetoweb.services.exceptions.ResourceNotFoundException;
import com.course.projetoweb.utils.CnpjUtils;

@Service
public class AdminService {
    
    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<Integrador> findAll() {
        return adminRepository.findAll();
    }

    public Integrador findById(Long id) {
        Optional<Integrador> obj = adminRepository.findById(id);
        return obj.orElseThrow(() -> new ResourceNotFoundException(id));
    }

    public Integrador create(CreateIntegradorDTO dto) {
        Optional<Integrador> existing = adminRepository.findByCnpj(CnpjUtils.normalize(dto.cnpj()));
        if (existing.isPresent()) {
            throw new DatabaseException("CNPJ já cadastrado");
        }

        IntegradorProfile profile = new IntegradorProfile();
        profile.setStateRegistration(dto.stateRegistration());
        profile.setIsMei(dto.isMei());
        profile.setCompanyName(dto.companyName());
        profile.setTradeName(dto.tradeName());
        profile.setPostalCode(dto.postalCode());
        profile.setState(dto.state());
        profile.setCity(dto.city());
        profile.setAddress(dto.address());
        profile.setAddressNumber(dto.addressNumber());
        profile.setAddressComplement(dto.addressComplement());
        profile.setNeighborhood(dto.neighborhood());
        profile.setPhone(dto.phone());
        profile.setWhatsapp(dto.whatsapp());

        Integrador integrador = new Integrador();
        integrador.setCnpj(CnpjUtils.normalize(dto.cnpj()));
        integrador.setEmail(dto.email());
        integrador.setPassword(passwordEncoder.encode(dto.password()));
        integrador.setRole(dto.role() != null ? dto.role() : IntegradorRole.USER);
        integrador.setProfile(profile);

        return adminRepository.save(integrador);
    }

    public Integrador update(Long id, IntegradorDTO dto) {
        Integrador entity = adminRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(id));

        // Atualiza campos flat
        entity.setCnpj(dto.getCnpj());
        entity.setEmail(dto.getEmail());

        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            entity.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        // Atualiza o profile
        if (entity.getProfile() == null) entity.setProfile(new IntegradorProfile());
        IntegradorProfile profile = entity.getProfile();

        profile.setStateRegistration(dto.getStateRegistration());
        profile.setIsMei(dto.getIsMei());
        profile.setCompanyName(dto.getCompanyName());
        profile.setTradeName(dto.getTradeName());
        profile.setPostalCode(dto.getPostalCode());
        profile.setState(dto.getState());
        profile.setCity(dto.getCity());
        profile.setAddress(dto.getAddress());
        profile.setAddressNumber(dto.getAddressNumber());
        profile.setAddressComplement(dto.getAddressComplement());
        profile.setNeighborhood(dto.getNeighborhood());
        profile.setPhone(dto.getPhone());
        profile.setWhatsapp(dto.getWhatsapp());

        entity.setProfile(profile);

        return adminRepository.save(entity);
    }

    public void updatePassword(Long id, String currentPassword, String newPassword) {
        Integrador entity = adminRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException(id));
        // Verifica se a senha atual bate com a do banco
        if (!passwordEncoder.matches(currentPassword, entity.getPassword())) {
            throw new RuntimeException("Senha atual incorreta");
        }

        // Atualiza a senha
        entity.setPassword(passwordEncoder.encode(newPassword));
        adminRepository.save(entity);
    }

    public void delete(Long id) {
        try {
            adminRepository.deleteById(id);
        } catch (EmptyResultDataAccessException e) {
            throw new ResourceNotFoundException(id);
        } catch (DataIntegrityViolationException e) {
            throw new DatabaseException(e.getMessage());
        }

    }
}
