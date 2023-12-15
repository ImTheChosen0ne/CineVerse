package com.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class VerifyEmailDTO {
    @NotBlank(message = "Email is required.")
    private String email;

    public VerifyEmailDTO() {}
    public VerifyEmailDTO(String email) {
        this.email = email;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String toString() {
        return "Registration info: email:"  + this.email;
    }

}
