package com.thaiglocal.webclient.dto.response;

import java.time.LocalDateTime;

public class ActivityResponse {
    private Long activityId;
    private String name;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String description;
    private LocalDateTime dateCanRegister;
    private Double price;
    private Integer registerCapacity;

    public ActivityResponse() {}

    public ActivityResponse(Long activityId, String name, LocalDateTime startTime, LocalDateTime endTime, String description,
                            LocalDateTime dateCanRegister, Double price, Integer registerCapacity) {
        this.activityId = activityId;
        this.name = name;
        this.startTime = startTime;
        this.endTime = endTime;
        this.description = description;
        this.dateCanRegister = dateCanRegister;
        this.price = price;
        this.registerCapacity = registerCapacity;
    }

    public Long getActivityId() { return activityId; }
    public String getName() { return name; }
    public LocalDateTime getStartTime() { return startTime; }
    public LocalDateTime getEndTime() { return endTime; }
    public String getDescription() { return description; }
    public LocalDateTime getDateCanRegister() { return dateCanRegister; }
    public Double getPrice() { return price; }
    public Integer getRegisterCapacity() { return registerCapacity; }

}