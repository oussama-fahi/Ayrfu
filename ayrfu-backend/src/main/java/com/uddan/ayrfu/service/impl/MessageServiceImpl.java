package com.uddan.ayrfu.service.impl;

import com.uddan.ayrfu.dto.request.MessageRequest;
import com.uddan.ayrfu.dto.response.DocumentResponse;
import com.uddan.ayrfu.dto.response.MessageResponse;
import com.uddan.ayrfu.entity.Document;
import com.uddan.ayrfu.entity.Message;
import com.uddan.ayrfu.entity.User;
import com.uddan.ayrfu.enumeration.MessageType;
import com.uddan.ayrfu.exception.BadRequestException;
import com.uddan.ayrfu.exception.ResourceNotFoundException;
import com.uddan.ayrfu.repository.MessageRepository;
import com.uddan.ayrfu.repository.UserRepository;
import com.uddan.ayrfu.security.UserDetailsImpl;
import com.uddan.ayrfu.service.MessageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MessageServiceImpl implements MessageService {

    private static final Logger logger = LoggerFactory.getLogger(MessageServiceImpl.class);

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public MessageServiceImpl(MessageRepository messageRepository, UserRepository userRepository) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public MessageResponse createMessage(MessageRequest messageRequest) {
        logger.info("Creating new message from: {}", messageRequest.getSenderName());

        Message message = Message.builder()
                .type(messageRequest.getType())
                .senderName(messageRequest.getSenderName())
                .senderEmail(messageRequest.getSenderEmail())
                .senderPhone(messageRequest.getSenderPhone())
                .content(messageRequest.getContent())
                .build();

        Message savedMessage = messageRepository.save(message);
        logger.info("Message created with ID: {}", savedMessage.getId());

        return mapToMessageResponse(savedMessage);
    }

    @Override
    @Transactional(readOnly = true)
    public MessageResponse getMessageById(Long id) {
        logger.info("Fetching message with ID: {}", id);

        Message message = messageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Message not found with ID: " + id));

        return mapToMessageResponse(message);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MessageResponse> getAllMessages(int page, int size) {
        logger.info("Fetching all messages, page: {}, size: {}", page, size);

        Pageable pageable = PageRequest.of(page, size);
        Page<Message> messages = messageRepository.findAll(pageable);

        return messages.getContent().stream()
                .map(this::mapToMessageResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MessageResponse> getMessagesByType(MessageType type, int page, int size) {
        logger.info("Fetching messages with type: {}, page: {}, size: {}", type, page, size);

        Pageable pageable = PageRequest.of(page, size);
        Page<Message> messages = messageRepository.findByType(type, pageable);

        return messages.getContent().stream()
                .map(this::mapToMessageResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MessageResponse> getUnreadMessages() {
        User currentUser = getCurrentAuthenticatedUser();
        logger.info("Fetching unread messages for user ID: {}", currentUser.getId());

        List<Message> unreadMessages = messageRepository.findUnreadMessagesForUser(currentUser);

        return unreadMessages.stream()
                .map(this::mapToMessageResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<MessageResponse> getUnreadMessages(int page, int size) {
        User currentUser = getCurrentAuthenticatedUser();
        logger.info("Fetching unread messages for user ID: {}, page: {}, size: {}",
                currentUser.getId(), page, size);

        Pageable pageable = PageRequest.of(page, size);
        Page<Message> unreadMessages = messageRepository.findUnreadMessagesForUser(currentUser, pageable);

        return unreadMessages.map(this::mapToMessageResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MessageResponse> getUnreadMessagesByType(MessageType type) {
        User currentUser = getCurrentAuthenticatedUser();
        logger.info("Fetching unread messages with type: {} for user ID: {}",
                type, currentUser.getId());

        List<Message> unreadMessages = messageRepository.findUnreadMessagesOfTypeForUser(type, currentUser);

        return unreadMessages.stream()
                .map(this::mapToMessageResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<MessageResponse> getUnreadMessagesByType(MessageType type, int page, int size) {
        User currentUser = getCurrentAuthenticatedUser();
        logger.info("Fetching unread messages with type: {} for user ID: {}, page: {}, size: {}",
                type, currentUser.getId(), page, size);

        Pageable pageable = PageRequest.of(page, size);
        Page<Message> unreadMessages = messageRepository.findUnreadMessagesOfTypeForUser(type, currentUser, pageable);

        return unreadMessages.map(this::mapToMessageResponse);
    }

    @Override
    @Transactional
    public MessageResponse markMessageAsRead(Long id) {
        logger.info("Marking message with ID: {} as read", id);

        Message message = messageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Message not found with ID: " + id));

        if (!message.isRead()) {
            message.setRead(true);
            message.setReadAt(LocalDateTime.now());
            messageRepository.save(message);
        }

        return mapToMessageResponse(message);
    }

    @Override
    @Transactional
    public int markMultipleMessagesAsRead(List<Long> messageIds) {
        logger.info("Marking {} messages as read", messageIds.size());

        if (messageIds.isEmpty()) {
            return 0;
        }

        int updatedCount = 0;
        LocalDateTime now = LocalDateTime.now();

        for (Long id : messageIds) {
            try {
                Message message = messageRepository.findById(id)
                        .orElse(null);

                if (message != null && !message.isRead()) {
                    message.setRead(true);
                    message.setReadAt(now);
                    messageRepository.save(message);
                    updatedCount++;
                }
            } catch (Exception e) {
                logger.error("Error marking message with ID: {} as read", id, e);
                // Continue with the next message
            }
        }

        logger.info("Successfully marked {} messages as read", updatedCount);
        return updatedCount;
    }

    @Override
    @Transactional
    public void deleteMessage(Long id) {
        logger.info("Deleting message with ID: {}", id);

        Message message = messageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Message not found with ID: " + id));

        messageRepository.delete(message);
        logger.info("Message deleted with ID: {}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MessageResponse> searchMessages(String searchText) {
        logger.info("Searching for messages containing text: {}", searchText);

        User currentUser = getCurrentAuthenticatedUser();

        // Find messages containing the search text that the user has access to
        List<Message> matchingMessages = messageRepository.findByContentContainingIgnoreCase(searchText);

        // Filter to only include messages from conversations the user is part of
        List<Message> accessibleMessages = matchingMessages.stream()
                .filter(message -> message.getConversation() != null &&
                        (message.getConversation().getInitiator().getId().equals(currentUser.getId()) ||
                                message.getConversation().getRecipient().getId().equals(currentUser.getId())))
                .collect(Collectors.toList());

        return accessibleMessages.stream()
                .map(this::mapToMessageResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public int getUnreadMessageCount() {
        User currentUser = getCurrentAuthenticatedUser();
        logger.info("Getting unread message count for user with ID: {}", currentUser.getId());

        return messageRepository.countUnreadMessagesForUser(currentUser);
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

    private MessageResponse mapToMessageResponse(Message message) {
        return MessageResponse.builder()
                .id(message.getId())
                .type(message.getType())
                .senderId(message.getSender() != null ? message.getSender().getId() : null)
                .senderName(message.getSenderName())
                .senderEmail(message.getSenderEmail())
                .senderPhone(message.getSenderPhone())
                .conversationId(message.getConversation() != null ? message.getConversation().getId() : null)
                .content(message.getContent())
                .attachment(message.getAttachment() != null ? mapToDocumentResponse(message.getAttachment()) : null)
                .sentAt(message.getCreatedAt())
                .read(message.isRead())
                .readAt(message.getReadAt())
                .build();
    }

    private DocumentResponse mapToDocumentResponse(Document document) {
        if (document == null) {
            return null;
        }

        return DocumentResponse.builder()
                .id(document.getId())
                .fileName(document.getFileName())
                .contentType(document.getContentType())
                .fileSize(document.getFileSize())
                .documentType(document.getDocumentType())
                .description(document.getDescription())
                .build();
    }
}