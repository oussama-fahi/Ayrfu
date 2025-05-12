package com.uddan.ayrfu.dto.response;

public class ClientBasicResponse {
    private Long id;
    private String companyName;
    private String contactPerson;

    public ClientBasicResponse() {
    }

    public ClientBasicResponse(Long id, String companyName, String contactPerson) {
        this.id = id;
        this.companyName = companyName;
        this.contactPerson = contactPerson;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getContactPerson() {
        return contactPerson;
    }

    public void setContactPerson(String contactPerson) {
        this.contactPerson = contactPerson;
    }
}