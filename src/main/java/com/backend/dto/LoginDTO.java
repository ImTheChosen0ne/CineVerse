package com.backend.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class LoginDTO {
    private String email;

    private String password;

    public LoginDTO() {
    }
    public LoginDTO(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String toString() {
        return "Login info: email: " + this.email + " password: " + this.password;
    }
}
