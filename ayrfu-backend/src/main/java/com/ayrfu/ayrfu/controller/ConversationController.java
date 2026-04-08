package com.ayrfu.ayrfu.controller;

import com.ayrfu.ayrfu.dto.request.ConversationRequest;
import com.ayrfu.ayrfu.dto.request.MessageRequest;
import com.ayrfu.ayrfu.dto.response.ConversationResponse;
import com.ayrfu.ayrfu.dto.response.MessageResponse;
import com.ayrfu.ayrfu.service.ConversationService;
import com.ayrfu.ayrfu.service.DocumentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/conversations")
@Tag(name = "Conversation API", description = "APIs for conversation management")
public class ConversationController {

    private static final Logger logger = LoggerFactory.getLogger(ConversationController.class);
    private final ConversationService conversationService;
    private final DocumentService documentService;

    public ConversationController(ConversationService conversationService, DocumentService documentService) {
        this.conversationService = conversationService;
        this.documentService = documentService;
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Create a new conversation", description = "Creates a new conversation with initial message")
    public ResponseEntity<ConversationResponse> createConversation(@Valid @RequestBody ConversationRequest request) {
        logger.info("Request to create conversation with subject: {}", request.getSubject());
        ConversationResponse conversation = conversationService.createConversation(request);
        return new ResponseEntity<>(conversation, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @PreAuthorize("@conversationService.isConversationParticipant(#id, authentication.principal.id) or hasRole('ADMIN') or hasRole('SUPER_USER')")
    @Operation(summary = "Get conversation by ID", description = "Retrieves a conversation by its ID")
    public ResponseEntity<ConversationResponse> getConversationById(@PathVariable Long id) {
        logger.info("Request to get conversation with ID: {}", id);
        ConversationResponse conversation = conversationService.getConversationById(id);
        return ResponseEntity.ok(conversation);
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get user conversations", description = "Retrieves all conversations for the current user")
    public ResponseEntity<List<ConversationResponse>> getUserConversations() {
        logger.info("Request to get conversations for current user");
        List<ConversationResponse> conversations = conversationService.getUserConversations();
        return ResponseEntity.ok(conversations);
    }

    @GetMapping("/{id}/messages")
    @PreAuthorize("@conversationService.isConversationParticipant(#id, authentication.principal.id) or hasRole('ADMIN') or hasRole('SUPER_USER')")
    @Operation(summary = "Get conversation messages", description = "Retrieves all messages in a conversation")
    public ResponseEntity<List<MessageResponse>> getConversationMessages(@PathVariable Long id) {
        logger.info("Request to get messages for conversation with ID: {}", id);
        List<MessageResponse> messages = conversationService.getConversationMessages(id);
        return ResponseEntity.ok(messages);
    }

    @PostMapping("/{id}/messages")
    @PreAuthorize("@conversationService.isConversationParticipant(#id, authentication.principal.id) or hasRole('ADMIN') or hasRole('SUPER_USER')")
    @Operation(summary = "Send message", description = "Sends a message in a conversation")
    public ResponseEntity<MessageResponse> sendMessage(
            @PathVariable Long id,
            @Valid @RequestPart("message") MessageRequest messageRequest,
            @RequestPart(value = "attachment", required = false) MultipartFile attachment) {

        logger.info("Request to send message to conversation with ID: {}", id);

        // Pass the attachment directly to the service method
        MessageResponse message = conversationService.sendMessage(id, messageRequest, attachment);
        return ResponseEntity.ok(message);
    }

    @PatchMapping("/messages/{id}/read")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Mark message as read", description = "Marks a message as read")
    public ResponseEntity<MessageResponse> markMessageAsRead(@PathVariable Long id) {
        logger.info("Request to mark message with ID: {} as read", id);
        MessageResponse message = conversationService.markMessageAsRead(id);
        return ResponseEntity.ok(message);
    }

    @PatchMapping("/{id}/mark-all-read")
    @PreAuthorize("@conversationService.isConversationParticipant(#id, authentication.principal.id) or hasRole('ADMIN') or hasRole('SUPER_USER')")
    @Operation(summary = "Mark all messages as read", description = "Marks all messages in a conversation as read")
    public ResponseEntity<Map<String, Integer>> markAllConversationMessagesAsRead(@PathVariable Long id) {
        logger.info("Request to mark all messages in conversation with ID: {} as read", id);
        int count = conversationService.markAllConversationMessagesAsRead(id);
        return ResponseEntity.ok(Map.of("marked", count));
    }
}