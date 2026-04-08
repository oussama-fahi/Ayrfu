package com.ayrfu.ayrfu.service.impl;

import com.ayrfu.ayrfu.entity.Position;
import com.ayrfu.ayrfu.service.MatchingService;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
    public class MatchingServiceImpl implements MatchingService {

//        // This service will handle the matching algorithm for both positions and services
//
//        public double calculatePositionMatchScore(Position position, Map<String, String> candidatePreferences) {
//            double score = 0.0;
//
//            // Check technology match
//            if (position.getTechnology().toLowerCase().contains(
//                    candidatePreferences.getOrDefault("technology", "").toLowerCase())) {
//                score += 0.25;
//            }
//
//            // Check location match
//            if (position.getLocation().toLowerCase().contains(
//                    candidatePreferences.getOrDefault("location", "").toLowerCase())) {
//                score += 0.25;
//            }
//
//            // Check language match
//            if (position.getLanguages().toLowerCase().contains(
//                    candidatePreferences.getOrDefault("languages", "").toLowerCase())) {
//                score += 0.2;
//            }
//
//            // Check experience level match
//            if (position.getExperienceLevel().equalsIgnoreCase(
//                    candidatePreferences.getOrDefault("experienceLevel", ""))) {
//                score += 0.15;
//            }
//
//            // Check work model match
//            if (position.getWorkModel().equalsIgnoreCase(
//                    candidatePreferences.getOrDefault("workModel", ""))) {
//                score += 0.15;
//            }
//
//            return score;
//        }
//
//        public double calculateServiceMatchScore(Service service, String query) {
//            double score = 0.0;
//            String[] keywords = service.getKeywords().split(",");
//            String queryLower = query.toLowerCase();
//
//            // Check title match
//            if (service.getTitle().toLowerCase().contains(queryLower)) {
//                score += 0.4;
//            }
//
//            // Check description match
//            if (service.getDescription().toLowerCase().contains(queryLower)) {
//                score += 0.3;
//            }
//
//            // Check keyword matches
//            for (String keyword : keywords) {
//                if (queryLower.contains(keyword.trim().toLowerCase())) {
//                    score += 0.1;
//                    // Cap at 0.3 for keywords
//                    if (score > 0.7) {
//                        score = 0.7;
//                        break;
//                    }
//                }
//            }
//
//            return score;
//        }
    }