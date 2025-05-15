package com.uddan.ayrfu.dto.response;

public record ClientBasicResponse(
        Long id,
        String companyName,
        String contactPerson,
        String email,
        String phoneNumber
) {
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String companyName;
        private String contactPerson;
        private String email;
        private String phoneNumber;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder companyName(String companyName) {
            this.companyName = companyName;
            return this;
        }

        public Builder contactPerson(String contactPerson) {
            this.contactPerson = contactPerson;
            return this;
        }

        public Builder email(String email) {
            this.email = email;
            return this;
        }

        public Builder phoneNumber(String phoneNumber) {
            this.phoneNumber = phoneNumber;
            return this;
        }

        public ClientBasicResponse build() {
            return new ClientBasicResponse(id, companyName, contactPerson, email, phoneNumber);
        }
    }
}