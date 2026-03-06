package com.thaiglocal.webclient.dto.response;

public record CenterResponse(
    Long centerId,
    String name,
    String address,
    String tel,
    String email,
    String line,
    String facebook,
    String website,
    String createdAt,
    String deletedAt,
    String leaderFirstName,
    String leaderLastName,
    String leaderTel
) {}