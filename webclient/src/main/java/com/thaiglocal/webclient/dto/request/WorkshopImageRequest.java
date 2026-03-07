package com.thaiglocal.webclient.dto.request;

public class WorkshopImageRequest {
    private String workshopImageUrl;
    private Long workshopId;

    public WorkshopImageRequest() {}

    public WorkshopImageRequest(String workshopImageUrl, Long workshopId) {
        this.workshopImageUrl = workshopImageUrl;
        this.workshopId = workshopId;
    }

    public String getWorkshopImageUrl() { return workshopImageUrl; }
    public void setWorkshopImageUrl(String workshopImageUrl) { this.workshopImageUrl = workshopImageUrl; }

    public Long getWorkshopId() { return workshopId; }
    public void setWorkshopId(Long workshopId) { this.workshopId = workshopId; }
}