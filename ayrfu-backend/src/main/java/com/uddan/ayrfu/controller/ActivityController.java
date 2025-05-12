package com.uddan.ayrfu.controller;

import com.uddan.ayrfu.dto.response.ActivityResponse;
import com.uddan.ayrfu.service.ActivityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activity")
@Tag(name = "Activity", description = "APIs for user activity")
public class ActivityController {

    private static final Logger logger = LoggerFactory.getLogger(ActivityController.class);
    private final ActivityService activityService;

    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    @GetMapping("/recent")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get recent activity", description = "Retrieves recent activity for the user")
    public ResponseEntity<List<ActivityResponse>> getRecentActivity() {
        logger.info("Request to get recent activity for current user");
        List<ActivityResponse> activities = activityService.getRecentActivity();
        return ResponseEntity.ok(activities);
    }
}