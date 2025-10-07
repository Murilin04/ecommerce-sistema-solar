package com.course.projetoweb.entities.enums;

public enum IntegradorRole {
    ADMIN("admin"),
    USER("user");

    private String role;

    IntegradorRole(String role) {
        this.role = role;
    }

    public String getRole() {
        return role;
    }
}
