package com.uddan.ayrfu.controller;

import com.uddan.ayrfu.dto.request.ConversationMessageRequest;
import com.uddan.ayrfu.dto.response.ConversationMessageResponse;
import com.uddan.ayrfu.dto.response.ConversationResponse;
import com.uddan.ayrfu.service.ConversationService;
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

import java.util.List;

@RestController
@RequestMapping("/api/messages/conversations")
@Tag(name = "Conversations", description = "APIs for conversation management")
public class ConversationController {

    private static final Logger logger = LoggerFactory.getLogger(ConversationController.class);
    private final ConversationService conversationService;

    public ConversationController(ConversationService conversationService) {
        this.conversationService = conversationService;
    }

    @GetMapping("/{type}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get conversations", description = "Gets all conversations for candidate or client")
    public ResponseEntity<List<ConversationResponse>> getConversations(@PathVariable String type) {
        logger.info("Request to get conversations of type: {}", type);
        List<ConversationResponse> conversations = conversationService.getConversations(type);
        return ResponseEntity.ok(conversations);
    }

    @GetMapping("/{id}/messages")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get conversation messages", description = "Gets all messages in a conversation")
    public ResponseEntity<List<ConversationMessageResponse>> getConversationMessages(@PathVariable Long id) {
        logger.info("Request to get messages for conversation with ID: {}", id);
        List<ConversationMessageResponse> messages = conversationService.getConversationMessages(id);
        return ResponseEntity.ok(messages);
    }

    @PostMapping("/send")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Send message", description = "Sends a message in a conversation")
    public ResponseEntity<ConversationMessageResponse> sendMessage(
            @Valid @RequestBody ConversationMessageRequest messageRequest) {

        logger.info("Request to send message to conversation with ID: {}", messageRequest.getConversationId());
        ConversationMessageResponse message = conversationService.sendMessage(messageRequest);
        return new ResponseEntity<>(message, HttpStatus.CREATED);
    }

    @PostMapping(value = "/send-with-attachment", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Send message with attachment", description = "Sends a message with an attachment")
    public ResponseEntity<ConversationMessageResponse> sendMessageWithAttachment(
            @RequestParam("conversationId") Long conversationId,
            @RequestParam("content") String content,
            @RequestParam("file") MultipartFile file) {

        logger.info("Request to send message with attachment to conversation with ID: {}", conversationId);
        ConversationMessageRequest messageRequest = new ConversationMessageRequest(conversationId, content);
        ConversationMessageResponse message = conversationService.sendMessageWithAttachment(messageRequest, file);
        return new ResponseEntity<>(message, HttpStatus.CREATED);
    }
}