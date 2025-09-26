package com.course.projetoweb.controller;

import java.net.URI;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.course.projetoweb.entities.Integrador;
import com.course.projetoweb.services.IntegradorService;

import jakarta.validation.Valid;

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

    @GetMapping(value = "/{cnpj}")
    public ResponseEntity<Integrador> findById(@PathVariable String cnpj) {
        Integrador obj = userService.findByCnpj(cnpj);
        return ResponseEntity.ok().body(obj);
    }

    @PostMapping
    public ResponseEntity<Integrador> insert(@RequestBody @Valid Integrador obj) {
        obj = userService.insert(obj);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(obj.getId()).toUri();
        return ResponseEntity.created(uri).body(obj);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // @PutMapping(value = "/{id}")
    // public ResponseEntity<Integrador> update(@PathVariable Long id, @RequestBody Integrador obj) {
    //     obj = userService.update(id, obj);
    //     return ResponseEntity.ok().body(obj);
    // }
    
}
