package com.uddan.ayrfu.controller;

import com.uddan.ayrfu.dto.request.ApplicationMessageRequest;
import com.uddan.ayrfu.dto.response.ApplicationMessageResponse;
import com.uddan.ayrfu.service.ApplicationMessageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/applications/messages")
@Tag(name = "Application Messages", description = "APIs for application message management")
public class ApplicationMessageController {

    private static final Logger logger = LoggerFactory.getLogger(ApplicationMessageController.class);
    private final ApplicationMessageService applicationMessageService;

    public ApplicationMessageController(ApplicationMessageService applicationMessageService) {
        this.applicationMessageService = applicationMessageService;
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Add application message", description = "Adds a message to an application")
    public ResponseEntity<ApplicationMessageResponse> addApplicationMessage(
            @Valid @RequestBody ApplicationMessageRequest messageRequest) {

        logger.info("Request to add message to application with ID: {}", messageRequest.getApplicationId());
        ApplicationMessageResponse message = applicationMessageService.addApplicationMessage(messageRequest);
        return new ResponseEntity<>(message, HttpStatus.CREATED);
    }

    @PostMapping(value = "/with-attachment", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Add application message with attachment", description = "Adds a message with an attachment to an application")
    public ResponseEntity<ApplicationMessageResponse> addApplicationMessageWithAttachment(
            @RequestParam("applicationId") Long applicationId,
            @RequestParam("content") String content,
            @RequestParam("file") MultipartFile file) {

        logger.info("Request to add message with attachment to application with ID: {}", applicationId);
        ApplicationMessageRequest messageRequest = new ApplicationMessageRequest(applicationId, content);
        ApplicationMessageResponse message = applicationMessageService.addApplicationMessageWithAttachment(messageRequest, file);
        return new ResponseEntity<>(message, HttpStatus.CREATED);
    }
}