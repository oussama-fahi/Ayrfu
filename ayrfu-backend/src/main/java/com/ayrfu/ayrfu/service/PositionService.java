package com.ayrfu.ayrfu.service;

import com.ayrfu.ayrfu.dto.request.PositionRequest;
import com.ayrfu.ayrfu.dto.response.PositionResponse;

import java.util.List;
import java.util.Set;

public interface PositionService {
    PositionResponse createPosition(PositionRequest positionRequest);
    PositionResponse getPositionById(Long id);
    List<PositionResponse> getAllPositions();

    List<PositionResponse> getAllActivePositions();

    PositionResponse updatePosition(Long id, PositionRequest positionRequest);

    void activatePosition(Long id);

    void deactivatePosition(Long id);

    void deletePosition(Long id);

    List<PositionResponse> findPositionsMatchingCriteria(
            String technology,
            String location,
            String experienceLevel,
            String workModel,
            Set<String> languages);
}

