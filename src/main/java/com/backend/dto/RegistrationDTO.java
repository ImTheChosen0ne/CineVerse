package com.backend.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.Set;

public class RegistrationDTO {
    @NotBlank(message = "Profile name is required.")
    private String profileName;
    @NotBlank(message = "Password is required.")
    private String password;
    @NotBlank(message = "Email is required.")
    private String email;
    @NotBlank(message = "First Name is required.")
    private String firstName;
    @NotBlank(message = "Last Name is required.")
    private String lastName;
    @NotBlank(message = "plan is required.")
    private String plan;

    public RegistrationDTO() {}
    public RegistrationDTO(String profileName, String email, String password, String firstName, String lastName, String plan) {
        this.profileName = profileName;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.plan = plan;
    }

    public String getProfileName() {
        return profileName;
    }

    public void setProfileName(String profileName) {
        this.profileName = profileName;
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

    public String getPlan() {
        return plan;
    }

    public void setPlan(String plan) {
        this.plan = plan;
    }

    public String toString() {
        return "Registration info: email:"  + this.email + " password: " + this.password + " firstName: " + this.firstName + " lastName: " + this.lastName;
    }

}
