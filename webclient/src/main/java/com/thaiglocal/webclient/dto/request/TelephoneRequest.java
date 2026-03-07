package com.thaiglocal.webclient.dto.request;

public class TelephoneRequest {
    private String telelephoneNumber;
    private Long centerId;

    public TelephoneRequest() {}

    public TelephoneRequest(String telelephoneNumber, Long centerId) {
        this.telelephoneNumber = telelephoneNumber;
        this.centerId = centerId;
    }

    public String getTelelephoneNumber() { return telelephoneNumber; }
    public void setTelelephoneNumber(String telelephoneNumber) { this.telelephoneNumber = telelephoneNumber; }

    public Long getCenterId() { return centerId; }
    public void setCenterId(Long centerId) { this.centerId = centerId; }


}
