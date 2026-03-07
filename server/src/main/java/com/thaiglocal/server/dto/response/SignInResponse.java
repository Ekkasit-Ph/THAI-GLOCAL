package com.thaiglocal.server.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SignInResponse {
    private String username;
    private String email;
    private String role;
    // Barear
    private String tokenType;
    private String accessToken;
    private String refreshToken;
}

