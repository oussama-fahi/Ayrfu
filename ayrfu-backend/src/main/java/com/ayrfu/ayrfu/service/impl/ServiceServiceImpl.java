package com.ayrfu.ayrfu.service.impl;

import com.ayrfu.ayrfu.dto.request.ServiceRequest;
import com.ayrfu.ayrfu.dto.response.ServiceResponse;
import com.ayrfu.ayrfu.entity.Service;
import com.ayrfu.ayrfu.exception.ResourceNotFoundException;
import com.ayrfu.ayrfu.repository.ServiceRepository;
import com.ayrfu.ayrfu.service.ServiceService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service
public class ServiceServiceImpl implements ServiceService {

    private static final Logger logger = LoggerFactory.getLogger(ServiceServiceImpl.class);

    private final ServiceRepository serviceRepository;


    public ServiceServiceImpl(ServiceRepository serviceRepository){
        this.serviceRepository=serviceRepository;
    }



    @Override
    @Transactional
    public ServiceResponse createService(ServiceRequest serviceRequest) {
        logger.info("Creating new service with title: {}", serviceRequest.getTitle());

        Service service = Service.builder()
                .title(serviceRequest.getTitle())
                .description(serviceRequest.getDescription())
                .benefits(serviceRequest.getBenefits())
                .availability(serviceRequest.getAvailability())
                .keywords(serviceRequest.getKeywords())
                .active(true)
                .build();

        Service savedService = serviceRepository.save(service);
        logger.info("Service created with ID: {}", savedService.getId());

        return mapToServiceResponse(savedService);
    }

    @Override
    @Transactional(readOnly = true)
    public ServiceResponse getServiceById(Long id) {
        logger.info("Fetching service with ID: {}", id);

        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with ID: " + id));

        return mapToServiceResponse(service);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ServiceResponse> getAllServices() {
        logger.info("Fetching all services");

        return serviceRepository.findAll().stream()
                .map(this::mapToServiceResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ServiceResponse> getAllActiveServices() {
        logger.info("Fetching all active services");

        return serviceRepository.findByActiveTrue().stream()
                .map(this::mapToServiceResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ServiceResponse updateService(Long id, ServiceRequest serviceRequest) {
        logger.info("Updating service with ID: {}", id);

        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with ID: " + id));

        service.setTitle(serviceRequest.getTitle());
        service.setDescription(serviceRequest.getDescription());
        service.setBenefits(serviceRequest.getBenefits());
        service.setAvailability(serviceRequest.getAvailability());
        service.setKeywords(serviceRequest.getKeywords());

        Service updatedService = serviceRepository.save(service);
        logger.info("Service updated with ID: {}", updatedService.getId());

        return mapToServiceResponse(updatedService);
    }

    @Override
    @Transactional
    public void activateService(Long id) {
        logger.info("Activating service with ID: {}", id);

        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with ID: " + id));

        service.setActive(true);
        serviceRepository.save(service);

        logger.info("Service activated with ID: {}", id);
    }

    @Override
    @Transactional
    public void deactivateService(Long id) {
        logger.info("Deactivating service with ID: {}", id);

        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with ID: " + id));

        service.setActive(false);
        serviceRepository.save(service);

        logger.info("Service deactivated with ID: {}", id);
    }

    @Override
    @Transactional
    public void deleteService(Long id) {
        logger.info("Deleting service with ID: {}", id);

        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with ID: " + id));

        serviceRepository.delete(service);

        logger.info("Service deleted with ID: {}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ServiceResponse> findServicesByKeywords(Set<String> keywords) {
        logger.info("Finding services by keywords: {}", keywords);

        Set<String> lowercaseKeywords = keywords.stream()
                .map(String::toLowerCase)
                .collect(Collectors.toSet());

        List<Service> services = serviceRepository.findByKeywordsContaining(lowercaseKeywords);

        logger.info("Found {} services matching keywords", services.size());

        return services.stream()
                .map(this::mapToServiceResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ServiceResponse> findServicesMatchingPrompt(String prompt) {
        logger.info("Finding services matching prompt: {}", prompt);

        // Extract keywords from the prompt (simple implementation)
        Set<String> extractedKeywords = extractKeywordsFromPrompt(prompt);

        if (extractedKeywords.isEmpty()) {
            return getAllActiveServices();
        }

        List<Service> services = serviceRepository.findByKeywordsOrderByRelevance(extractedKeywords);

        logger.info("Found {} services matching prompt", services.size());

        return services.stream()
                .map(this::mapToServiceResponse)
                .collect(Collectors.toList());
    }


    private ServiceResponse mapToServiceResponse(Service service) {
        return ServiceResponse.builder()
                .id(service.getId())
                .title(service.getTitle())
                .description(service.getDescription())
                .benefits(service.getBenefits())
                .availability(service.getAvailability())
                .keywords(service.getKeywords())
                .active(service.isActive())
                .createdAt(service.getCreatedAt())
                .updatedAt(service.getUpdatedAt())
                .build();
    }
    private Set<String> extractKeywordsFromPrompt(String prompt) {
        // List of common keywords related to IT services
        List<String> commonKeywords = List.of(
                "software", "development", "mobile", "web", "app", "application",
                "consulting", "it", "strategy", "digital", "transformation",
                "cloud", "migration", "security", "data", "analytics",
                "ai", "machine learning", "infrastructure", "devops"
        );

        Set<String> extractedKeywords = new HashSet<>();
        String lowercasePrompt = prompt.toLowerCase();

        for (String keyword : commonKeywords) {
            if (lowercasePrompt.contains(keyword)) {
                extractedKeywords.add(keyword);
            }
        }

        return extractedKeywords;
    }
}


