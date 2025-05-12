package com.uddan.ayrfu.service.impl;

import com.uddan.ayrfu.dto.request.ApplicationMessageRequest;
import com.uddan.ayrfu.dto.response.ApplicationMessageResponse;
import com.uddan.ayrfu.dto.response.UserBasicResponse;
import com.uddan.ayrfu.entity.Application;
import com.uddan.ayrfu.entity.ApplicationMessage;
import com.uddan.ayrfu.entity.User;
import com.uddan.ayrfu.exception.BadRequestException;
import com.uddan.ayrfu.exception.ResourceNotFoundException;
import com.uddan.ayrfu.repository.ApplicationMessageRepository;
import com.uddan.ayrfu.repository.ApplicationRepository;
import com.uddan.ayrfu.repository.UserRepository;
import com.uddan.ayrfu.security.UserDetailsImpl;
import com.uddan.ayrfu.service.ApplicationMessageService;
import com.uddan.ayrfu.service.FileStorageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ApplicationMessageServiceImpl implements ApplicationMessageService {

    private static final Logger logger = LoggerFactory.getLogger(ApplicationMessageServiceImpl.class);

    private final ApplicationMessageRepository messageRepository;
    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    public ApplicationMessageServiceImpl(
            ApplicationMessageRepository messageRepository,
            ApplicationRepository applicationRepository,
            UserRepository userRepository,
            FileStorageService fileStorageService) {
        this.messageRepository = messageRepository;
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
    }

    @Override
    @Transactional
    public ApplicationMessageResponse addApplicationMessage(ApplicationMessageRequest messageRequest) {
        logger.info("Adding message to application with ID: {}", messageRequest.getApplicationId());

        User currentUser = getCurrentUser();
        Application application = applicationRepository.findById(messageRequest.getApplicationId())
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with ID: " + messageRequest.getApplicationId()));

        // Validate that the user is either the candidate or an admin/superuser
        if (!isUserAuthorizedForApplication(currentUser, application)) {
            throw new BadRequestException("User not authorized to add message to this application");
        }

        ApplicationMessage message = new ApplicationMessage();
        message.setApplication(application);
        message.setSender(currentUser);
        message.setContent(messageRequest.getContent());

        ApplicationMessage savedMessage = messageRepository.save(message);

        return mapToMessageResponse(savedMessage);
    }

    @Override
    @Transactional
    public ApplicationMessageResponse addApplicationMessageWithAttachment(
            ApplicationMessageRequest messageRequest,
            MultipartFile file) {
        logger.info("Adding message with attachment to application with ID: {}", messageRequest.getApplicationId());

        User currentUser = getCurrentUser();
        Application application = applicationRepository.findById(messageRequest.getApplicationId())
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with ID: " + messageRequest.getApplicationId()));

        // Validate that the user is either the candidate or an admin/superuser
        if (!isUserAuthorizedForApplication(currentUser, application)) {
            throw new BadRequestException("User not authorized to add message to this application");
        }

        // Store file
        String attachmentPath = null;
        String attachmentName = null;
        if (file != null && !file.isEmpty()) {
            attachmentPath = fileStorageService.storeFile(file);
            attachmentName = file.getOriginalFilename();
        }

        ApplicationMessage message = new ApplicationMessage();
        message.setApplication(application);
        message.setSender(currentUser);
        message.setContent(messageRequest.getContent());
        message.setAttachmentUrl(attachmentPath);
        message.setAttachmentName(attachmentName);

        ApplicationMessage savedMessage = messageRepository.save(message);

        return mapToMessageResponse(savedMessage);
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        return userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private boolean isUserAuthorizedForApplication(User user, Application application) {
        // Check if user is the candidate
        if (application.getCandidate().getUser() != null && application.getCandidate().getUser().getId().equals(user.getId())) {
            return true;
        }

        // Check if user has ADMIN or SUPER_USER role
        return user.getRoles().stream()
                .anyMatch(role -> role.getName().equals("ROLE_ADMIN") || role.getName().equals("ROLE_SUPER_USER"));
    }

    private ApplicationMessageResponse mapToMessageResponse(ApplicationMessage message) {
        return ApplicationMessageResponse.builder()
                .id(message.getId())
                .sender(new UserBasicResponse(message.getSender().getId(), message.getSender().getUserName()))
                .content(message.getContent())
                .attachmentUrl(message.getAttachmentUrl())
                .attachmentName(message.getAttachmentName())
                .sentAt(message.getSentAt())
                .build();
    }
}