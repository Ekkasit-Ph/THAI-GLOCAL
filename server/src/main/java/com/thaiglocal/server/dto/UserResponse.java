package com.thaiglocal.server.dto;

import java.util.Date;

import com.thaiglocal.server.Model.Role;

public record UserResponse(
    // Long userId,
    String username,
    String email,
    String firstName,
    String lastName,    
    // String password,
    Role role,
    String telephone,
    String address,
    Date birtDate,
    Date createdAt,
    Date deleteAt,
    Boolean isActive
) {
}
