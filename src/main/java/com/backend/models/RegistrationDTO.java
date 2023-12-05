package com.backend.models;

import java.util.Set;

public class RegistrationDTO {

    private String username;
    private String password;
    private String email;
    private String firstName;
    private String lastName;

    public RegistrationDTO() {
    }
    public RegistrationDTO(String username, String password, String firstName, String lastName, String email) {
        this.username = username;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String toString() {
        return "Registration info: username: " + this.username + " password: " + this.password + " firstName: " + this.firstName + " lastName: " + this.lastName + " email: " + this.email;
    }

}
