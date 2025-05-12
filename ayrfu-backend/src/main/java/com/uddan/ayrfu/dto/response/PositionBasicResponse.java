package com.uddan.ayrfu.dto.response;

public record PositionBasicResponse(
        Long id,
        String title,
        String technology,
        String location,
        String experienceLevel,
        String workModel
) {
    // Builder pattern for records
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String title;
        private String technology;
        private String location;
        private String experienceLevel;
        private String workModel;

        private Builder() {
        }

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder title(String title) {
            this.title = title;
            return this;
        }

        public Builder technology(String technology) {
            this.technology = technology;
            return this;
        }

        public Builder location(String location) {
            this.location = location;
            return this;
        }

        public Builder experienceLevel(String experienceLevel) {
            this.experienceLevel = experienceLevel;
            return this;
        }

        public Builder workModel(String workModel) {
            this.workModel = workModel;
            return this;
        }

        public PositionBasicResponse build() {
            return new PositionBasicResponse(id, title, technology, location, experienceLevel, workModel);
        }
    }
}