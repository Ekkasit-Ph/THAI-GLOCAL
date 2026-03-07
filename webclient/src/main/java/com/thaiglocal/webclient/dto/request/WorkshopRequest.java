package com.thaiglocal.webclient.dto.request;

import com.thaiglocal.webclient.dto.enums.WorkshopType;

public class WorkshopRequest {
    private String workshopName;
    private String description;
    private Double price;
    private Integer memberCapacity;
    private WorkshopType workshopType;

    public WorkshopRequest() {}

    public WorkshopRequest(String workshopName, String description, Double price, Integer memberCapacity, WorkshopType workshopType) {
        this.workshopName = workshopName;
        this.description = description;
        this.price = price;
        this.memberCapacity = memberCapacity;
        this.workshopType = workshopType;
    }


    public String getWorkshopName() { return workshopName; }
    public void setWorkshopName(String workshopName) { this.workshopName = workshopName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public Integer getMemberCapacity() { return memberCapacity; }
    public void setMemberCapacity(Integer memberCapacity) { this.memberCapacity = memberCapacity; }

    public WorkshopType getWorkshopType() { return workshopType; }
    public void setWorkshopType(WorkshopType workshopType) { this.workshopType = workshopType; }
}
