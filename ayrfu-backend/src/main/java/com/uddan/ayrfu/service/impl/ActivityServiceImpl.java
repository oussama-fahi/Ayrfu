package com.uddan.ayrfu.service.impl;

import com.uddan.ayrfu.dto.response.ActivityResponse;
import com.uddan.ayrfu.entity.Activity;
import com.uddan.ayrfu.entity.User;
import com.uddan.ayrfu.exception.ResourceNotFoundException;
import com.uddan.ayrfu.repository.ActivityRepository;
import com.uddan.ayrfu.repository.UserRepository;
import com.uddan.ayrfu.security.UserDetailsImpl;
import com.uddan.ayrfu.service.ActivityService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ActivityServiceImpl implements ActivityService {

    private static final Logger logger = LoggerFactory.getLogger(ActivityServiceImpl.class);

    private final ActivityRepository activityRepository;
    private final UserRepository userRepository;

    public ActivityServiceImpl(ActivityRepository activityRepository, UserRepository userRepository) {
        this.activityRepository = activityRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ActivityResponse> getRecentActivity() {
        logger.info("Getting recent activity for current user");

        User currentUser = getCurrentUser();
        List<Activity> activities = activityRepository.findByUserOrderByCreatedAtDesc(currentUser);

        return activities.stream()
                .map(this::mapToActivityResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void recordActivity(String type, String title, String description, String entityType, Long entityId) {
        logger.info("Recording activity of type: {} for entity: {}", type, entityType);

        User currentUser = getCurrentUser();

        Activity activity = new Activity();
        activity.setUser(currentUser);
        activity.setType(type);
        activity.setTitle(title);
        activity.setDescription(description);
        activity.setEntityType(entityType);
        activity.setEntityId(entityId);

        activityRepository.save(activity);
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        return userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private ActivityResponse mapToActivityResponse(Activity activity) {
        return ActivityResponse.builder()
                .id(activity.getId())
                .type(activity.getType())
                .title(activity.getTitle())
                .description(activity.getDescription())
                .entityType(activity.getEntityType())
                .entityId(activity.getEntityId())
                .createdAt(activity.getCreatedAt())
                .build();
    }
}