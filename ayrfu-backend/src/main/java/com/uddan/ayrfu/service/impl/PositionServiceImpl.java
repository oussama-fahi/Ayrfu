package com.uddan.ayrfu.service.impl;

import com.uddan.ayrfu.dto.request.PositionRequest;
import com.uddan.ayrfu.dto.response.PositionResponse;
import com.uddan.ayrfu.entity.Candidate;
import com.uddan.ayrfu.entity.Position;
import com.uddan.ayrfu.entity.User;
import com.uddan.ayrfu.exception.ResourceNotFoundException;
import com.uddan.ayrfu.repository.CandidateRepository;
import com.uddan.ayrfu.repository.PositionRepository;
import com.uddan.ayrfu.repository.UserRepository;
import com.uddan.ayrfu.security.UserDetailsImpl;
import com.uddan.ayrfu.service.PositionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class PositionServiceImpl implements PositionService {

    private static final Logger logger = LoggerFactory.getLogger(PositionServiceImpl.class);

    private final PositionRepository positionRepository;
    private final UserRepository userRepository;
    private final CandidateRepository candidateRepository;

    public PositionServiceImpl(PositionRepository positionRepository,
                               UserRepository userRepository,
                               CandidateRepository candidateRepository) {
        this.positionRepository = positionRepository;
        this.userRepository = userRepository;
        this.candidateRepository = candidateRepository;
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
    public List<PositionResponse> getAllPositions(int page, int size) {
        logger.info("Fetching all positions, page: {}, size: {}", page, size);

        Pageable pageable = PageRequest.of(page, size);
        Page<Position> positions = positionRepository.findAll(pageable);

        return positions.getContent().stream()
                .map(this::mapToPositionResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PositionResponse> getAllActivePositions(int page, int size) {
        logger.info("Fetching all active positions, page: {}, size: {}", page, size);

        Pageable pageable = PageRequest.of(page, size);
        Page<Position> activePositions = positionRepository.findByActiveTrue(pageable);

        return activePositions.getContent().stream()
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
    public PositionResponse activatePosition(Long id) {
        logger.info("Activating position with ID: {}", id);

        Position position = positionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Position not found with ID: " + id));

        position.setActive(true);
        Position activatedPosition = positionRepository.save(position);

        logger.info("Position activated with ID: {}", id);

        return mapToPositionResponse(activatedPosition);
    }

    @Override
    @Transactional
    public PositionResponse deactivatePosition(Long id) {
        logger.info("Deactivating position with ID: {}", id);

        Position position = positionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Position not found with ID: " + id));

        position.setActive(false);
        Position deactivatedPosition = positionRepository.save(position);

        logger.info("Position deactivated with ID: {}", id);

        return mapToPositionResponse(deactivatedPosition);
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
                    .filter(position -> position.getLanguages() != null &&
                            position.getLanguages().containsAll(languages))
                    .collect(Collectors.toList());
        }

        // Only return active positions
        matchingPositions = matchingPositions.stream()
                .filter(Position::isActive)
                .collect(Collectors.toList());

        logger.info("Found {} positions matching the criteria", matchingPositions.size());

        return matchingPositions.stream()
                .map(this::mapToPositionResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PositionResponse> getRecommendedPositions() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetailsImpl)) {
            logger.warn("Cannot get recommended positions: No valid authentication found");
            return new ArrayList<>();
        }

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Candidate candidate = user.getCandidate();
        if (candidate == null) {
            logger.warn("Cannot get recommended positions: User is not a candidate");
            return new ArrayList<>();
        }

        logger.info("Finding recommended positions for candidate ID: {}", candidate.getId());

        // Get all active positions
        List<Position> activePositions = positionRepository.findByActiveTrue();

        // Calculate match score for each position
        List<PositionWithScore> positionsWithScores = activePositions.stream()
                .map(position -> {
                    int score = calculateMatchScore(position, candidate);
                    return new PositionWithScore(position, score);
                })
                .sorted(Comparator.comparing(PositionWithScore::getScore).reversed())
                .collect(Collectors.toList());

        // Take top 10 positions
        return positionsWithScores.stream()
                .limit(10)
                .map(p -> {
                    PositionResponse response = mapToPositionResponse(p.getPosition());
                    response.setMatchScore(p.getScore());
                    return response;
                })
                .collect(Collectors.toList());
    }

    private int calculateMatchScore(Position position, Candidate candidate) {
        int score = 0;

        // Technology match
        if (candidate.getTechnologies() != null && position.getTechnology() != null &&
                candidate.getTechnologies().contains(position.getTechnology())) {
            score += 40;
        }

        // Experience level match
        if (candidate.getExperienceLevel() != null && position.getExperienceLevel() != null &&
                candidate.getExperienceLevel().equals(position.getExperienceLevel())) {
            score += 20;
        }

        // Location match
        if (candidate.getPreferredLocation() != null && position.getLocation() != null &&
                candidate.getPreferredLocation().equals(position.getLocation())) {
            score += 15;
        }

        // Work model match
        if (candidate.getPreferredWorkModel() != null && position.getWorkModel() != null &&
                candidate.getPreferredWorkModel().equals(position.getWorkModel())) {
            score += 15;
        }

        // Languages match
        if (candidate.getLanguages() != null && position.getLanguages() != null) {
            Set<String> commonLanguages = new HashSet<>(candidate.getLanguages());
            commonLanguages.retainAll(position.getLanguages());
            score += commonLanguages.size() * 5;  // 5 points per common language
        }

        return Math.min(score, 100);  // Cap score at 100
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

    // Helper class for position scoring
    private static class PositionWithScore {
        private final Position position;
        private final int score;

        public PositionWithScore(Position position, int score) {
            this.position = position;
            this.score = score;
        }

        public Position getPosition() {
            return position;
        }

        public int getScore() {
            return score;
        }
    }
}