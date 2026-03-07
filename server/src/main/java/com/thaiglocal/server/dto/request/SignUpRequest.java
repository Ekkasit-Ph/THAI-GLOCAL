package com.thaiglocal.server.dto.request;

import java.sql.Date;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class SignUpRequest {
    @NotBlank(message = "Username is required.")
    @JsonProperty("username")
    private String username;

    @NotBlank(message = "Email is required.")
    @JsonProperty("email")
    @Email
    private String email;

    @NotBlank(message = "Password is required.")
    @JsonProperty("password")
    private String password;

    @NotBlank(message = "First Name is required.")
    @JsonProperty("firstName")
    private String firstName;

    @NotBlank(message = "Last Name is required.")
    @JsonProperty("lastName")
    private String lastName;

    @NotBlank(message = "Telephone is required.")
    @JsonProperty("telephone")
    private String telephone;

    @NotBlank(message = "Address is required.")
    @JsonProperty("address")
    private String address;

    @NotBlank(message = "Birth Date is required")
    @JsonProperty("birthDate")
    private LocalDateTime birthDate;
}
