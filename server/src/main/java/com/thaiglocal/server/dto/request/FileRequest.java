package com.thaiglocal.server.dto.request;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class FileRequest {
    private String imageUrl;
}
