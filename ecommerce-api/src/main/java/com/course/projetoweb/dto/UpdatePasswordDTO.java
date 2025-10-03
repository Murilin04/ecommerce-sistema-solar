package com.course.projetoweb.dto;

import com.course.projetoweb.entities.Integrador;

public class UpdatePasswordDTO {
    private String currentPassword;
    private String newPassword;

    public UpdatePasswordDTO() {}

    public UpdatePasswordDTO(Integrador obj) {
        currentPassword = obj.getPassword();
    }

    public String getCurrentPassword() {
        return currentPassword;
    }
    public void setCurrentPassword(String currentPassword) {
        this.currentPassword = currentPassword;
    }
    public String getNewPassword() {
        return newPassword;
    }
    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }

}
