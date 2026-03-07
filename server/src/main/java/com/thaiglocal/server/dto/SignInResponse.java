package com.thaiglocal.server.dto;

import com.thaiglocal.server.Model.Role;

public record SignInResponse(
    String username,
    String email,
    Role role
) {
}

