package com.ayrfu.ayrfu.controller;

import com.ayrfu.ayrfu.dto.request.MarkMessagesReadRequest;
import com.ayrfu.ayrfu.dto.request.MessageRequest;
import com.ayrfu.ayrfu.dto.response.MessageResponse;
import com.ayrfu.ayrfu.dto.response.MessagesReadResponse;
import com.ayrfu.ayrfu.enumeration.MessageType;
import com.ayrfu.ayrfu.service.MessageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
@Tag(name = "Message API", description = "APIs for message management")
public class MessageController {

    private static final Logger logger = LoggerFactory.getLogger(MessageController.class);
    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @PostMapping
    @Operation(summary = "Create a new message", description = "Creates a new message with the provided details")
    public ResponseEntity<MessageResponse> createMessage(@Valid @RequestBody MessageRequest messageRequest) {
        logger.info("Request to create message from: {}", messageRequest.getSenderName());
        MessageResponse createdMessage = messageService.createMessage(messageRequest);
        return new ResponseEntity<>(createdMessage, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_USER') or hasRole('ADMIN')")
    @Operation(summary = "Get message by ID", description = "Retrieves a message by its ID")
    public ResponseEntity<MessageResponse> getMessageById(@PathVariable Long id) {
        logger.info("Request to get message with ID: {}", id);
        MessageResponse message = messageService.getMessageById(id);
        return ResponseEntity.ok(message);
    }

    @GetMapping
    @PreAuthorize("hasRole('SUPER_USER') or hasRole('ADMIN')")
    @Operation(summary = "Get all messages", description = "Retrieves all messages")
    public ResponseEntity<List<MessageResponse>> getAllMessages(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        logger.info("Request to get all messages, page: {}, size: {}", page, size);
        List<MessageResponse> messages = messageService.getAllMessages(page, size);
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/type/{type}")
    @PreAuthorize("hasRole('SUPER_USER') or hasRole('ADMIN')")
    @Operation(summary = "Get messages by type", description = "Retrieves messages by type (CANDIDATE or CLIENT)")
    public ResponseEntity<List<MessageResponse>> getMessagesByType(
            @PathVariable MessageType type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        logger.info("Request to get messages with type: {}, page: {}, size: {}", type, page, size);
        List<MessageResponse> messages = messageService.getMessagesByType(type, page, size);
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/unread")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get unread messages", description = "Retrieves all unread messages for the current user")
    public ResponseEntity<List<MessageResponse>> getUnreadMessages() {
        logger.info("Request to get unread messages");
        List<MessageResponse> unreadMessages = messageService.getUnreadMessages();
        return ResponseEntity.ok(unreadMessages);
    }

    @GetMapping("/unread/paged")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get unread messages with pagination", description = "Retrieves unread messages with pagination")
    public ResponseEntity<Page<MessageResponse>> getUnreadMessagesPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        logger.info("Request to get unread messages, page: {}, size: {}", page, size);
        Page<MessageResponse> unreadMessages = messageService.getUnreadMessages(page, size);
        return ResponseEntity.ok(unreadMessages);
    }

    @GetMapping("/unread/type/{type}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get unread messages by type", description = "Retrieves unread messages by type")
    public ResponseEntity<List<MessageResponse>> getUnreadMessagesByType(@PathVariable MessageType type) {
        logger.info("Request to get unread messages with type: {}", type);
        List<MessageResponse> unreadMessages = messageService.getUnreadMessagesByType(type);
        return ResponseEntity.ok(unreadMessages);
    }

    @GetMapping("/unread/type/{type}/paged")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get unread messages by type with pagination", description = "Retrieves unread messages by type with pagination")
    public ResponseEntity<Page<MessageResponse>> getUnreadMessagesByTypePaged(
            @PathVariable MessageType type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        logger.info("Request to get unread messages with type: {}, page: {}, size: {}", type, page, size);
        Page<MessageResponse> unreadMessages = messageService.getUnreadMessagesByType(type, page, size);
        return ResponseEntity.ok(unreadMessages);
    }

    @PatchMapping("/{id}/read")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Mark message as read", description = "Marks a message as read by its ID")
    public ResponseEntity<MessageResponse> markMessageAsRead(@PathVariable Long id) {
        logger.info("Request to mark message with ID: {} as read", id);
        MessageResponse readMessage = messageService.markMessageAsRead(id);
        return ResponseEntity.ok(readMessage);
    }

    @PostMapping("/mark-read")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Mark multiple messages as read", description = "Marks multiple messages as read")
    public ResponseEntity<MessagesReadResponse> markMultipleMessagesAsRead(
            @Valid @RequestBody MarkMessagesReadRequest request) {
        logger.info("Request to mark {} messages as read", request.getMessageIds().size());
        int count = messageService.markMultipleMessagesAsRead(request.getMessageIds());

        MessagesReadResponse response = new MessagesReadResponse(count, LocalDateTime.now());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_USER')")
    @Operation(summary = "Delete a message", description = "Deletes a message by its ID")
    public ResponseEntity<Void> deleteMessage(@PathVariable Long id) {
        logger.info("Request to delete message with ID: {}", id);
        messageService.deleteMessage(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Search messages", description = "Searches for messages containing specific text")
    public ResponseEntity<List<MessageResponse>> searchMessages(@RequestParam String searchText) {
        logger.info("Request to search messages containing: {}", searchText);
        List<MessageResponse> messages = messageService.searchMessages(searchText);
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/unread/count")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get unread message count", description = "Gets the count of unread messages for the current user")
    public ResponseEntity<Map<String, Integer>> getUnreadMessageCount() {
        logger.info("Request to get unread message count");
        int count = messageService.getUnreadMessageCount();
        return ResponseEntity.ok(Map.of("count", count));
    }
}