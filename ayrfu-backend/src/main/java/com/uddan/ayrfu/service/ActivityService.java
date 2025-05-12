package com.uddan.ayrfu.service;

import com.uddan.ayrfu.dto.response.ActivityResponse;
import java.util.List;

public interface ActivityService {

    List<ActivityResponse> getRecentActivity();

    void recordActivity(String type, String title, String description, String entityType, Long entityId);
}