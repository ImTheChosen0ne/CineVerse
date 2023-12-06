package com.backend.dto;

import com.backend.models.User;
import com.fasterxml.jackson.annotation.JsonIgnore;

public class LoginResponseDTO {
//    @JsonIgnore
    private User user;
    private String jwt;

    public LoginResponseDTO(){}

    public LoginResponseDTO(User user, String jwt) {
        this.user = user;
        this.jwt = jwt;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getJwt() {
        return jwt;
    }

    public void setJwt(String jwt) {
        this.jwt = jwt;
    }
}
