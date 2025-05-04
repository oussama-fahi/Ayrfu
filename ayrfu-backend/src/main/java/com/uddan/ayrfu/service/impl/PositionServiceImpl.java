package com.uddan.ayrfu.service.impl;

import com.uddan.ayrfu.dto.request.PositionRequest;
import com.uddan.ayrfu.dto.response.PositionResponse;
import com.uddan.ayrfu.entity.Position;
import com.uddan.ayrfu.exception.ResourceNotFoundException;
import com.uddan.ayrfu.repository.PositionRepository;
import com.uddan.ayrfu.service.PositionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class PositionServiceImpl implements PositionService {

    private static final Logger logger = LoggerFactory.getLogger(PositionServiceImpl.class);

    private final PositionRepository positionRepository;
    
    public PositionServiceImpl(PositionRepository positionRepository){
        this.positionRepository=positionRepository;
    }

    @Override
    @Transactional
    public PositionResponse createPosition(PositionRequest positionRequest) {
        logger.info("Creating new position with title: {}", positionRequest.getTitle());

        Position position = Position.builder()
                .title(positionRequest.getTitle())
                .description(positionRequest.getDescription())
                .technology(positionRequest.getTechnology())
                .location(positionRequest.getLocation())
                .languages(positionRequest.getLanguages())
                .experienceLevel(positionRequest.getExperienceLevel())
                .workModel(positionRequest.getWorkModel())
                .active(true)
                .build();

        Position savedPosition = positionRepository.save(position);
        logger.info("Position created with ID: {}", savedPosition.getId());

        return mapToPositionResponse(savedPosition);
    }

    @Override
    @Transactional(readOnly = true)
    public PositionResponse getPositionById(Long id) {
        logger.info("Fetching position with ID: {}", id);

        Position position = positionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Position not found with ID: " + id));

        return mapToPositionResponse(position);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PositionResponse> getAllPositions() {
        logger.info("Fetching all positions");

        return positionRepository.findAll().stream()
                .map(this::mapToPositionResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PositionResponse> getAllActivePositions() {
        logger.info("Fetching all active positions");

        return positionRepository.findByActiveTrue().stream()
                .map(this::mapToPositionResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public PositionResponse updatePosition(Long id, PositionRequest positionRequest) {
        logger.info("Updating position with ID: {}", id);

        Position position = positionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Position not found with ID: " + id));

        position.setTitle(positionRequest.getTitle());
        position.setDescription(positionRequest.getDescription());
        position.setTechnology(positionRequest.getTechnology());
        position.setLocation(positionRequest.getLocation());
        position.setLanguages(positionRequest.getLanguages());
        position.setExperienceLevel(positionRequest.getExperienceLevel());
        position.setWorkModel(positionRequest.getWorkModel());

        Position updatedPosition = positionRepository.save(position);
        logger.info("Position updated with ID: {}", updatedPosition.getId());

        return mapToPositionResponse(updatedPosition);
    }

    @Override
    @Transactional
    public void activatePosition(Long id) {
        logger.info("Activating position with ID: {}", id);

        Position position = positionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Position not found with ID: " + id));

        position.setActive(true);
        positionRepository.save(position);

        logger.info("Position activated with ID: {}", id);
    }

    @Override
    @Transactional
    public void deactivatePosition(Long id) {
        logger.info("Deactivating position with ID: {}", id);

        Position position = positionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Position not found with ID: " + id));

        position.setActive(false);
        positionRepository.save(position);

        logger.info("Position deactivated with ID: {}", id);
    }

    @Override
    @Transactional
    public void deletePosition(Long id) {
        logger.info("Deleting position with ID: {}", id);

        Position position = positionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Position not found with ID: " + id));

        positionRepository.delete(position);

        logger.info("Position deleted with ID: {}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PositionResponse> findPositionsMatchingCriteria(
            String technology,
            String location,
            String experienceLevel,
            String workModel,
            Set<String> languages) {

        logger.info("Finding positions matching criteria - Technology: {}, Location: {}, Experience: {}, Work Model: {}, Languages: {}",
                technology, location, experienceLevel, workModel, languages);

        List<Position> matchingPositions;

        // First filter by basic criteria
        matchingPositions = positionRepository.findPositionsMatchingCriteria(
                technology, location, experienceLevel, workModel);

        // If languages are specified, filter further by languages
        if (languages != null && !languages.isEmpty()) {
            matchingPositions = matchingPositions.stream()
                    .filter(position -> position.getLanguages().containsAll(languages))
                    .collect(Collectors.toList());
        }

        logger.info("Found {} positions matching the criteria", matchingPositions.size());

        return matchingPositions.stream()
                .map(this::mapToPositionResponse)
                .collect(Collectors.toList());
    }

    private PositionResponse mapToPositionResponse(Position position) {
        return PositionResponse.builder()
                .id(position.getId())
                .title(position.getTitle())
                .description(position.getDescription())
                .technology(position.getTechnology())
                .location(position.getLocation())
                .languages(position.getLanguages())
                .experienceLevel(position.getExperienceLevel())
                .workModel(position.getWorkModel())
                .active(position.isActive())
                .createdAt(position.getCreatedAt())
                .updatedAt(position.getUpdatedAt())
                .build();
    }

}
