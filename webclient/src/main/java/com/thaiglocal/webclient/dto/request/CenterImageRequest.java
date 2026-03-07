package com.thaiglocal.webclient.dto.request;

public class CenterImageRequest {
    private String centerImageUrl;
    private Long centerId;

    public CenterImageRequest() {
    }

    public CenterImageRequest(String centerImageUrl, Long centerId) {
        this.centerImageUrl = centerImageUrl;
        this.centerId = centerId;
    }

    public String getCenterImageUrl() {
        return centerImageUrl;
    }

    public void setCenterImageUrl(String centerImageUrl) {
        this.centerImageUrl = centerImageUrl;
    }

    public Long getCenterId() {
        return centerId;
    }

    public void setCenterId(Long centerId) {
        this.centerId = centerId;
    }
}
