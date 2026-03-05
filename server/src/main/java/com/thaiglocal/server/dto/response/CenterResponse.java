package com.thaiglocal.server.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Builder
public class CenterResponse {
    private String centerName;
    private String address;
    private String telephone;
    private String email;
    private String line;
    private String facebook;
    private String webSite;
    private String createdAt;
    private String leaderFirstName;
    private String leaderLastName;
    private String leaderTelephone;
}
