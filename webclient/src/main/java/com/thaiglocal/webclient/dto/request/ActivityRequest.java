package com.thaiglocal.webclient.dto.request;

import java.time.LocalDateTime;

public class ActivityRequest {
    private String activityName;
    private String description;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private LocalDateTime dateCanRegister;
    private Double price;
    private Integer registerCapacity;

    public ActivityRequest() {}

    public ActivityRequest(String activityName, String description, LocalDateTime startDate, LocalDateTime endDate, LocalDateTime dateCanRegister, Double price, Integer registerCapacity) {
        this.activityName = activityName;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.dateCanRegister = dateCanRegister;
        this.price = price;
        this.registerCapacity = registerCapacity;
    }

    public String getActivityName() { return activityName; }
    public void setActivityName(String activityName) { this.activityName = activityName; }

    public LocalDateTime getStartDate() { return startDate; }
    public void setStartDate(LocalDateTime startDate) { this.startDate = startDate; }

    public LocalDateTime getEndDate() { return endDate; }
    public void setEndDate(LocalDateTime endDate) { this.endDate = endDate; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDateTime getDateCanRegister() { return dateCanRegister; }
    public void setDateCanRegister(LocalDateTime dateCanRegister) { this.dateCanRegister = dateCanRegister; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public Integer getRegisterCapacity() { return registerCapacity; }
    public void setRegisterCapacity(Integer registerCapacity) { this.registerCapacity = registerCapacity; }
}
