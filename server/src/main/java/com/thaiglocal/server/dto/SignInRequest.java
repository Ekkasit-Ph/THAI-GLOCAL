package com.thaiglocal.server.dto;

import jakarta.validation.constraints.NotBlank;

public class SignInRequest {
    @NotBlank(message = "Username or Email is required.")
    private String usernameOrEmail;

    @NotBlank(message = "Password is required.")
    private String password;

    public String getUsernameOrEmail() {
        return usernameOrEmail;
    }

    public String getPassword() {
        return password;
    }
}
