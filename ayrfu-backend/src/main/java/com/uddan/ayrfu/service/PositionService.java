package com.uddan.ayrfu.service;

import com.uddan.ayrfu.dto.request.PositionRequest;
import com.uddan.ayrfu.dto.response.PositionResponse;

import java.util.List;
import java.util.Set;

public interface PositionService {
    PositionResponse createPosition(PositionRequest positionRequest);
    PositionResponse getPositionById(Long id);
    List<PositionResponse> getAllPositions(int page, int size);
    List<PositionResponse> getAllActivePositions(int page, int size);
    PositionResponse updatePosition(Long id, PositionRequest positionRequest);
    PositionResponse activatePosition(Long id);
    PositionResponse deactivatePosition(Long id);
    void deletePosition(Long id);
    List<PositionResponse> findPositionsMatchingCriteria(String technology, String location,
                                                         String experienceLevel, String workModel,
                                                         Set<String> languages);
    List<PositionResponse> getRecommendedPositions();
}