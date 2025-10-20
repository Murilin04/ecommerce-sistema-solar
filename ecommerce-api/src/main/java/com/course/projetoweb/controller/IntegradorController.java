package com.course.projetoweb.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.course.projetoweb.dto.IntegradorDTO;
import com.course.projetoweb.dto.UpdatePasswordDTO;
import com.course.projetoweb.entities.Integrador;
import com.course.projetoweb.services.IntegradorService;

@RestController
@RequestMapping(value = "/integrador")
public class IntegradorController {

    @Autowired
    private IntegradorService userService;

    @GetMapping
    public ResponseEntity<List<Integrador>> findAll() {
        List<Integrador> list = userService.findAll();
        return ResponseEntity.ok().body(list);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<IntegradorDTO> findById(@PathVariable Long id) {
        Integrador obj = userService.findById(id);
        IntegradorDTO dto = new IntegradorDTO(obj);
        return ResponseEntity.ok().body(dto);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<IntegradorDTO> update(@PathVariable Long id, @RequestBody IntegradorDTO obj) {
        Integrador updated = userService.update(id, obj);
        IntegradorDTO dto = new IntegradorDTO(updated);
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/{id}/senha")
    public ResponseEntity<Void> updatePassword(@PathVariable Long id, @RequestBody UpdatePasswordDTO dto){
        userService.updatePassword(id, dto.getCurrentPassword(), dto.getNewPassword());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/check-email/{email}")
    public ResponseEntity<Integrador> checkEmail(@PathVariable("email") String email) {
        // Chama o método "checkEmail" do "userService" passando o email como parâmetro
        boolean emailExists = userService.checkEmail(email);
        // Se o email já existir, retorna uma resposta HTTP com o status "BAD_REQUEST"
        if (emailExists == true)
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        // Caso contrário, retorna uma resposta HTTP com o status "OK"
        return new ResponseEntity<>(HttpStatus.OK);
    }
    
}
