package com.thaiglocal.webclient.dto.response;

import com.thaiglocal.webclient.dto.enums.WorkshopType;

public record WorkshopResponse(
    Long workshopId,
    String workshopName,
    String description,
    Double price,
    Integer memberCapacity,
    WorkshopType workshopType
) {}
