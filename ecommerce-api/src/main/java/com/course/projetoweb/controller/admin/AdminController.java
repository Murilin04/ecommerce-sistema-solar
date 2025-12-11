package com.course.projetoweb.controller.admin;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.course.projetoweb.dto.CreateIntegradorDTO;
import com.course.projetoweb.dto.IntegradorDTO;
import com.course.projetoweb.dto.UpdatePasswordDTO;
import com.course.projetoweb.entities.Integrador;
import com.course.projetoweb.services.admin.AdminService;

import jakarta.validation.Valid;

@RestController
@RequestMapping(value = "/admin/integrador")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {  
    
    @Autowired
    private AdminService adminService;

    // Listar todos
    @GetMapping
    public ResponseEntity<List<Integrador>> findAll() {
        return ResponseEntity.ok(adminService.findAll());
    }

    // Busca integrador por ID
    @GetMapping(value = "/{id}")
    public ResponseEntity<IntegradorDTO> findById(@PathVariable Long id) {
        Integrador obj = adminService.findById(id);
        IntegradorDTO dto = new IntegradorDTO(obj);
        return ResponseEntity.ok().body(dto);
    }

    // Criar integrador
    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody CreateIntegradorDTO dto) {
        return ResponseEntity.ok(adminService.create(dto));
    }

    // Atualizar integrador
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody IntegradorDTO dto) {
        return ResponseEntity.ok(adminService.update(id, dto));
    }

    // Atualiza a senha do integrador
    @PutMapping("/{id}/senha")
    public ResponseEntity<Void> updatePassword(@PathVariable Long id, @RequestBody UpdatePasswordDTO dto){
        adminService.updatePassword(id, dto.getCurrentPassword(), dto.getNewPassword());
        return ResponseEntity.noContent().build();
    }

    // Deletar integrador
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        adminService.delete(id);
        return ResponseEntity.noContent().build();
    }
   
}
