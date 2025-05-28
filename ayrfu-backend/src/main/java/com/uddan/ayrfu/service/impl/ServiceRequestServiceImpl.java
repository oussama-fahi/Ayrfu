package com.uddan.ayrfu.service.impl;

import com.uddan.ayrfu.dto.request.ServiceRequestRequest;
import com.uddan.ayrfu.dto.response.ClientBasicResponse;
import com.uddan.ayrfu.dto.response.ServiceBasicResponse;
import com.uddan.ayrfu.dto.response.ServiceRequestResponse;
import com.uddan.ayrfu.entity.Client;
import com.uddan.ayrfu.entity.Service;
import com.uddan.ayrfu.entity.ServiceRequest;
import com.uddan.ayrfu.entity.User;
import com.uddan.ayrfu.enumeration.ServiceRequestStatus;
import com.uddan.ayrfu.exception.BadRequestException;
import com.uddan.ayrfu.exception.ResourceNotFoundException;
import com.uddan.ayrfu.repository.ClientRepository;
import com.uddan.ayrfu.repository.ServiceRepository;
import com.uddan.ayrfu.repository.ServiceRequestRepository;
import com.uddan.ayrfu.repository.UserRepository;
import com.uddan.ayrfu.security.UserDetailsImpl;
import com.uddan.ayrfu.service.ServiceRequestService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service("serviceRequestService")
public class ServiceRequestServiceImpl implements ServiceRequestService {

    private static final Logger logger = LoggerFactory.getLogger(ServiceRequestServiceImpl.class);

    private final ServiceRequestRepository serviceRequestRepository;
    private final ClientRepository clientRepository;
    private final ServiceRepository serviceRepository;
    private final UserRepository userRepository;

    public ServiceRequestServiceImpl(
            ServiceRequestRepository serviceRequestRepository,
            ClientRepository clientRepository,
            ServiceRepository serviceRepository,
            UserRepository userRepository) {
        this.serviceRequestRepository = serviceRequestRepository;
        this.clientRepository = clientRepository;
        this.serviceRepository = serviceRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public ServiceRequestResponse createServiceRequest(ServiceRequestRequest requestDto) {
        logger.info("Creating service request for service ID: {}", requestDto.getServiceId());

        // Get current authenticated user
        User currentUser = getCurrentAuthenticatedUser();

        // Get client for current user
        Client client = clientRepository.findByUser(currentUser)
                .orElseThrow(() -> new BadRequestException("Client profile not found for current user"));

        // Get service
        Service service = serviceRepository.findById(requestDto.getServiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with ID: " + requestDto.getServiceId()));

        // Check if service is active
        if (!service.isActive()) {
            throw new BadRequestException("Cannot request inactive service: " + service.getTitle());
        }

        // Create service request
        ServiceRequest serviceRequest = ServiceRequest.builder()
                .client(client)
                .service(service)
                .details(requestDto.getDetails())
                .status(ServiceRequestStatus.PENDING)
                .build();

        // Save service request
        ServiceRequest savedRequest = serviceRequestRepository.save(serviceRequest);
        logger.info("Service request created with ID: {}", savedRequest.getId());

        return mapToServiceRequestResponse(savedRequest);
    }

    @Override
    @Transactional(readOnly = true)
    public ServiceRequestResponse getServiceRequestById(Long id) {
        logger.info("Getting service request with ID: {}", id);

        ServiceRequest serviceRequest = serviceRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service request not found with ID: " + id));

        return mapToServiceRequestResponse(serviceRequest);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ServiceRequestResponse> getServiceRequestsByClient(Long clientId, int page, int size) {
        logger.info("Getting service requests for client with ID: {}", clientId);

        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new ResourceNotFoundException("Client not found with ID: " + clientId));

        Page<ServiceRequest> requests = serviceRequestRepository.findByClient(client, PageRequest.of(page, size));

        return requests.getContent().stream()
                .map(this::mapToServiceRequestResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ServiceRequestResponse> getCurrentClientServiceRequests(int page, int size) {
        logger.info("Getting service requests for current client");

        // Get current authenticated user
        User currentUser = getCurrentAuthenticatedUser();

        // Get client for current user
        Client client = clientRepository.findByUser(currentUser)
                .orElseThrow(() -> new BadRequestException("Client profile not found for current user"));

        Page<ServiceRequest> requests = serviceRequestRepository.findByClient(client, PageRequest.of(page, size));

        if (requests.isEmpty()) {
            logger.info("No service requests found for client ID: {}", client.getId());
        }

        return requests.getContent().stream()
                .map(this::mapToServiceRequestResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ServiceRequestResponse> getServiceRequestsByStatus(ServiceRequestStatus status, int page, int size) {
        logger.info("Getting service requests with status: {}", status);

        Page<ServiceRequest> requests = serviceRequestRepository.findByStatus(status, PageRequest.of(page, size));

        return requests.getContent().stream()
                .map(this::mapToServiceRequestResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ServiceRequestResponse updateServiceRequestStatus(Long id, ServiceRequestStatus status) {
        logger.info("Updating service request with ID: {} to status: {}", id, status);

        ServiceRequest serviceRequest = serviceRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service request not found with ID: " + id));

        serviceRequest.setStatus(status);
        ServiceRequest updatedRequest = serviceRequestRepository.save(serviceRequest);

        return mapToServiceRequestResponse(updatedRequest);
    }

    @Override
    @Transactional
    public void deleteServiceRequest(Long id) {
        logger.info("Deleting service request with ID: {}", id);

        ServiceRequest serviceRequest = serviceRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service request not found with ID: " + id));

        serviceRequestRepository.delete(serviceRequest);
        logger.info("Service request deleted with ID: {}", id);
    }

    @Override
    public boolean isOwnRequest(Long requestId, Long userId) {
        logger.debug("Checking if user with ID: {} owns service request with ID: {}", userId, requestId);

        ServiceRequest request = serviceRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Service request not found with ID: " + requestId));

        return request.getClient().getUser() != null &&
                request.getClient().getUser().getId().equals(userId);
    }

    private User getCurrentAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetailsImpl)) {
            throw new BadRequestException("User not authenticated");
        }

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        return userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private ServiceRequestResponse mapToServiceRequestResponse(ServiceRequest serviceRequest) {
        return ServiceRequestResponse.builder()
                .id(serviceRequest.getId())
                .client(mapToClientBasicResponse(serviceRequest.getClient()))
                .service(mapToServiceBasicResponse(serviceRequest.getService()))
                .details(serviceRequest.getDetails())
                .status(serviceRequest.getStatus())
                .createdAt(serviceRequest.getCreatedAt())
                .updatedAt(serviceRequest.getUpdatedAt())
                .build();
    }

    private ClientBasicResponse mapToClientBasicResponse(Client client) {
        return ClientBasicResponse.builder()
                .id(client.getId())
                .companyName(client.getCompanyName())
                .contactPerson(client.getContactPerson())
                .email(client.getEmail())
                .phoneNumber(client.getPhoneNumber())
                .build();
    }

    private ServiceBasicResponse mapToServiceBasicResponse(Service service) {
        return ServiceBasicResponse.builder()
                .id(service.getId())
                .title(service.getTitle())
                .description(service.getDescription())
                .build();
    }
}