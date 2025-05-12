package com.uddan.ayrfu.service.impl;

import com.uddan.ayrfu.dto.request.ServiceRequestMessageRequest;
import com.uddan.ayrfu.dto.request.ServiceRequestRequest;
import com.uddan.ayrfu.dto.response.ClientBasicResponse;
import com.uddan.ayrfu.dto.response.ServiceBasicResponse;
import com.uddan.ayrfu.dto.response.ServiceRequestMessageResponse;
import com.uddan.ayrfu.dto.response.ServiceRequestResponse;
import com.uddan.ayrfu.dto.response.UserBasicResponse;
import com.uddan.ayrfu.entity.Client;
import com.uddan.ayrfu.entity.Service;
import com.uddan.ayrfu.entity.ServiceRequest;
import com.uddan.ayrfu.entity.ServiceRequestMessage;
import com.uddan.ayrfu.entity.User;
import com.uddan.ayrfu.exception.BadRequestException;
import com.uddan.ayrfu.exception.ResourceNotFoundException;
import com.uddan.ayrfu.repository.ServiceRepository;
import com.uddan.ayrfu.repository.ServiceRequestMessageRepository;
import com.uddan.ayrfu.repository.ServiceRequestRepository;
import com.uddan.ayrfu.repository.UserRepository;
import com.uddan.ayrfu.security.UserDetailsImpl;
import com.uddan.ayrfu.service.ActivityService;
import com.uddan.ayrfu.service.FileStorageService;
import com.uddan.ayrfu.service.ServiceRequestService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service
public class ServiceRequestServiceImpl implements ServiceRequestService {

    private static final Logger logger = LoggerFactory.getLogger(ServiceRequestServiceImpl.class);

    private final ServiceRequestRepository serviceRequestRepository;
    private final ServiceRequestMessageRepository messageRepository;
    private final ServiceRepository serviceRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    private final ActivityService activityService;

    public ServiceRequestServiceImpl(
            ServiceRequestRepository serviceRequestRepository,
            ServiceRequestMessageRepository messageRepository,
            ServiceRepository serviceRepository,
            UserRepository userRepository,
            FileStorageService fileStorageService,
            ActivityService activityService) {
        this.serviceRequestRepository = serviceRequestRepository;
        this.messageRepository = messageRepository;
        this.serviceRepository = serviceRepository;
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
        this.activityService = activityService;
    }

    @Override
    @Transactional
    public ServiceRequestResponse createServiceRequest(ServiceRequestRequest requestDTO, MultipartFile file) {
        logger.info("Creating service request for service ID: {}", requestDTO.getServiceId());

        User currentUser = getCurrentUser();

        // Validate that the user is a client
        Client client = currentUser.getClient();
        if (client == null) {
            throw new BadRequestException("User is not a client");
        }

        // Get the service
        com.uddan.ayrfu.entity.Service service = serviceRepository.findById(requestDTO.getServiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with ID: " + requestDTO.getServiceId()));

        // Create the service request
        ServiceRequest serviceRequest = new ServiceRequest();
        serviceRequest.setService(service);
        serviceRequest.setClient(client);
        serviceRequest.setDescription(requestDTO.getDescription());
        serviceRequest.setUrgency(requestDTO.getUrgency());

        try {
            serviceRequest.setPreferredStartDate(LocalDate.parse(requestDTO.getPreferredStartDate()));
        } catch (Exception e) {
            throw new BadRequestException("Invalid preferred start date format. Use ISO format (YYYY-MM-DD)");
        }

        serviceRequest.setAdditionalInfo(requestDTO.getAdditionalInfo());
        serviceRequest.setStatus("PENDING");

        // Store document if provided
        if (file != null && !file.isEmpty()) {
            String documentPath = fileStorageService.storeFile(file);
            serviceRequest.setDocumentPath(documentPath);
            serviceRequest.setDocumentName(file.getOriginalFilename());
        }

        ServiceRequest savedRequest = serviceRequestRepository.save(serviceRequest);

        // Record activity
        activityService.recordActivity(
                "SERVICE_REQUEST_CREATED",
                "Service Request Created",
                "You have created a service request for " + service.getTitle(),
                "SERVICE_REQUEST",
                savedRequest.getId()
        );

        return mapToServiceRequestResponse(savedRequest);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ServiceRequestResponse> getMyRequests() {
        logger.info("Getting service requests for current client");

        User currentUser = getCurrentUser();

        // Validate that the user is a client
        Client client = currentUser.getClient();
        if (client == null) {
            throw new BadRequestException("User is not a client");
        }

        List<ServiceRequest> requests = serviceRequestRepository.findByClientOrderByCreatedAtDesc(client);

        return requests.stream()
                .map(this::mapToServiceRequestResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ServiceRequestResponse getRequestById(Long id) {
        logger.info("Getting service request with ID: {}", id);

        User currentUser = getCurrentUser();
        ServiceRequest request = serviceRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service request not found with ID: " + id));

        // Check if user is authorized to view this request
        if (!isUserAuthorizedForRequest(currentUser, request)) {
            throw new ResourceNotFoundException("Service request not found with ID: " + id);
        }

        return mapToServiceRequestResponseWithDetails(request);
    }

    @Override
    @Transactional
    public ServiceRequestMessageResponse addRequestMessage(ServiceRequestMessageRequest messageRequest, MultipartFile file) {
        logger.info("Adding message to service request with ID: {}", messageRequest.getRequestId());

        User currentUser = getCurrentUser();
        ServiceRequest request = serviceRequestRepository.findById(messageRequest.getRequestId())
                .orElseThrow(() -> new ResourceNotFoundException("Service request not found with ID: " + messageRequest.getRequestId()));

        // Check if user is authorized to add message to this request
        if (!isUserAuthorizedForRequest(currentUser, request)) {
            throw new ResourceNotFoundException("Service request not found with ID: " + messageRequest.getRequestId());
        }

        // Create the message
        ServiceRequestMessage message = new ServiceRequestMessage();
        message.setServiceRequest(request);
        message.setSender(currentUser);
        message.setContent(messageRequest.getContent());

        // Store attachment if provided
        if (file != null && !file.isEmpty()) {
            String attachmentPath = fileStorageService.storeFile(file);
            message.setAttachmentUrl(attachmentPath);
            message.setAttachmentName(file.getOriginalFilename());
        }

        ServiceRequestMessage savedMessage = messageRepository.save(message);

        // Record activity if the sender is not the client (i.e., it's an admin reply)
        if (currentUser.getClient() == null || !currentUser.getClient().equals(request.getClient())) {
            activityService.recordActivity(
                    "SERVICE_REQUEST_MESSAGE",
                    "Service Request Message",
                    "You received a new message for your service request",
                    "SERVICE_REQUEST",
                    request.getId()
            );
        }

        return mapToMessageResponse(savedMessage);
    }

    @Override
    @Transactional
    public ServiceRequestResponse cancelRequest(Long id) {
        logger.info("Cancelling service request with ID: {}", id);

        User currentUser = getCurrentUser();
        ServiceRequest request = serviceRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service request not found with ID: " + id));

        // Only the client who created the request can cancel it
        if (currentUser.getClient() == null || !currentUser.getClient().equals(request.getClient())) {
            throw new BadRequestException("Only the client who created the request can cancel it");
        }

        // Update status
        request.setStatus("CANCELLED");
        ServiceRequest updatedRequest = serviceRequestRepository.save(request);

        // Record activity
        activityService.recordActivity(
                "SERVICE_REQUEST_CANCELLED",
                "Service Request Cancelled",
                "You have cancelled your service request for " + request.getService().getTitle(),
                "SERVICE_REQUEST",
                updatedRequest.getId()
        );

        return mapToServiceRequestResponse(updatedRequest);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ServiceRequestResponse> getAllRequests() {
        logger.info("Getting all service requests");

        // Check if user has admin or super user role
        User currentUser = getCurrentUser();
        boolean isAdminOrSuperUser = currentUser.getRoles().stream()
                .anyMatch(role -> role.getName().equals("ROLE_ADMIN") || role.getName().equals("ROLE_SUPER_USER"));

        if (!isAdminOrSuperUser) {
            throw new BadRequestException("User is not authorized to view all requests");
        }

        List<ServiceRequest> requests = serviceRequestRepository.findAll();

        return requests.stream()
                .map(this::mapToServiceRequestResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ServiceRequestResponse updateRequestStatus(Long id, String status) {
        logger.info("Updating status of service request with ID: {} to: {}", id, status);

        // Check if user has admin or super user role
        User currentUser = getCurrentUser();
        boolean isAdminOrSuperUser = currentUser.getRoles().stream()
                .anyMatch(role -> role.getName().equals("ROLE_ADMIN") || role.getName().equals("ROLE_SUPER_USER"));

        if (!isAdminOrSuperUser) {
            throw new BadRequestException("User is not authorized to update request status");
        }

        // Validate status
        if (!isValidStatus(status)) {
            throw new BadRequestException("Invalid status: " + status);
        }

        ServiceRequest request = serviceRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service request not found with ID: " + id));

        // Update status
        request.setStatus(status);
        ServiceRequest updatedRequest = serviceRequestRepository.save(request);

        // Record activity
        activityService.recordActivity(
                "SERVICE_REQUEST_STATUS_UPDATED",
                "Service Request Status Updated",
                "Your service request status has been updated to " + status,
                "SERVICE_REQUEST",
                updatedRequest.getId()
        );

        return mapToServiceRequestResponse(updatedRequest);
    }

    @Override
    @Transactional
    public ServiceRequestResponse assignRequest(Long id, Long assigneeId) {
        logger.info("Assigning service request with ID: {} to user with ID: {}", id, assigneeId);

        // Check if user has admin or super user role
        User currentUser = getCurrentUser();
        boolean isAdminOrSuperUser = currentUser.getRoles().stream()
                .anyMatch(role -> role.getName().equals("ROLE_ADMIN") || role.getName().equals("ROLE_SUPER_USER"));

        if (!isAdminOrSuperUser) {
            throw new BadRequestException("User is not authorized to assign requests");
        }

        ServiceRequest request = serviceRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service request not found with ID: " + id));

        User assignee = userRepository.findById(assigneeId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + assigneeId));

        // Update assignee
        request.setAssignedTo(assignee);
        ServiceRequest updatedRequest = serviceRequestRepository.save(request);

        // Record activity
        activityService.recordActivity(
                "SERVICE_REQUEST_ASSIGNED",
                "Service Request Assigned",
                "Your service request has been assigned to " + assignee.getUserName(),
                "SERVICE_REQUEST",
                updatedRequest.getId()
        );

        return mapToServiceRequestResponse(updatedRequest);
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        return userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private boolean isValidStatus(String status) {
        return status != null && (
                status.equals("PENDING") ||
                        status.equals("IN_PROGRESS") ||
                        status.equals("COMPLETED") ||
                        status.equals("CANCELLED"));
    }

    private boolean isUserAuthorizedForRequest(User user, ServiceRequest request) {
        // Check if user is the client who created the request
        if (user.getClient() != null && user.getClient().equals(request.getClient())) {
            return true;
        }

        // Check if user is assigned to the request
        if (request.getAssignedTo() != null && request.getAssignedTo().equals(user)) {
            return true;
        }

        // Check if user has admin or super user role
        return user.getRoles().stream()
                .anyMatch(role -> role.getName().equals("ROLE_ADMIN") || role.getName().equals("ROLE_SUPER_USER"));
    }

    private ServiceRequestResponse mapToServiceRequestResponse(ServiceRequest request) {
        ServiceBasicResponse service = new ServiceBasicResponse(
                request.getService().getId(),
                request.getService().getTitle()
        );

        ClientBasicResponse client = new ClientBasicResponse(
                request.getClient().getId(),
                request.getClient().getCompanyName(),
                request.getClient().getContactPerson()
        );

        UserBasicResponse assignedTo = null;
        if (request.getAssignedTo() != null) {
            assignedTo = new UserBasicResponse(
                    request.getAssignedTo().getId(),
                    request.getAssignedTo().getUserName()
            );
        }

        return ServiceRequestResponse.builder()
                .id(request.getId())
                .service(service)
                .client(client)
                .status(request.getStatus())
                .assignedTo(assignedTo)
                .requestedAt(request.getCreatedAt())
                .updatedAt(request.getUpdatedAt())
                .build();
    }

    private ServiceRequestResponse mapToServiceRequestResponseWithDetails(ServiceRequest request) {
        ServiceRequestResponse response = mapToServiceRequestResponse(request);

        // Add additional details
        response.setDescription(request.getDescription());
        response.setUrgency(request.getUrgency());
        response.setPreferredStartDate(request.getPreferredStartDate());
        response.setAdditionalInfo(request.getAdditionalInfo());
        response.setNotes(request.getNotes());
        response.setDocumentName(request.getDocumentName());
        response.setDocumentPath(request.getDocumentPath());

        // Add messages
        List<ServiceRequestMessage> messages = messageRepository.findByServiceRequestOrderBySentAtAsc(request);
        response.setMessages(
                messages.stream()
                        .map(this::mapToMessageResponse)
                        .collect(Collectors.toList())
        );

        return response;
    }

    private ServiceRequestMessageResponse mapToMessageResponse(ServiceRequestMessage message) {
        return ServiceRequestMessageResponse.builder()
                .id(message.getId())
                .sender(new UserBasicResponse(message.getSender().getId(), message.getSender().getUserName()))
                .content(message.getContent())
                .attachmentUrl(message.getAttachmentUrl())
                .attachmentName(message.getAttachmentName())
                .sentAt(message.getSentAt())
                .build();
    }
}