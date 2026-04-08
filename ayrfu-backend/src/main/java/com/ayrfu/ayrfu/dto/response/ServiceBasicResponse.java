package com.ayrfu.ayrfu.dto.response;

public record ServiceBasicResponse(
        Long id,
        String title,
        String description
) {
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String title;
        private String description;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder title(String title) {
            this.title = title;
            return this;
        }

        public Builder description(String description) {
            this.description = description;
            return this;
        }

        public ServiceBasicResponse build() {
            return new ServiceBasicResponse(id, title, description);
        }
    }
}