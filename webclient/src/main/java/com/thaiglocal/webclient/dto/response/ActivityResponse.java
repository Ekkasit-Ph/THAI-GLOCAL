package com.thaiglocal.webclient.dto.response;

import java.time.LocalDateTime;

public record ActivityResponse(
    Long activityId,
    String activityName,
    String description,
    LocalDateTime startDate,
    LocalDateTime endDate,
    LocalDateTime dateCanRegister,
    Double price,
    Integer registerCapacity
) {}