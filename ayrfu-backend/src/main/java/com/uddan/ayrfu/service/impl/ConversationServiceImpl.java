package com.uddan.ayrfu.service.impl;

import com.uddan.ayrfu.dto.request.ConversationMessageRequest;
import com.uddan.ayrfu.dto.response.ConversationMessageResponse;
import com.uddan.ayrfu.dto.response.ConversationResponse;
import com.uddan.ayrfu.dto.response.UserBasicResponse;
import com.uddan.ayrfu.entity.Conversation;
import com.uddan.ayrfu.entity.ConversationMessage;
import com.uddan.ayrfu.entity.User;
import com.uddan.ayrfu.exception.ResourceNotFoundException;
import com.uddan.ayrfu.repository.ConversationMessageRepository;
import com.uddan.ayrfu.repository.ConversationRepository;
import com.uddan.ayrfu.repository.UserRepository;
import com.uddan.ayrfu.security.UserDetailsImpl;
import com.uddan.ayrfu.service.ConversationService;
import com.uddan.ayrfu.service.FileStorageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ConversationServiceImpl implements ConversationService {

    private static final Logger logger = LoggerFactory.getLogger(ConversationServiceImpl.class);

    private final ConversationRepository conversationRepository;
    private final ConversationMessageRepository messageRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    public ConversationServiceImpl(
            ConversationRepository conversationRepository,
            ConversationMessageRepository messageRepository,
            UserRepository userRepository,
            FileStorageService fileStorageService) {
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ConversationResponse> getConversations(String type) {
        logger.info("Getting conversations of type: {}", type);

        User currentUser = getCurrentUser();
        List<Conversation> conversations = conversationRepository.findByParticipantAndType(currentUser, type);

        return conversations.stream()
                .map(this::mapToConversationResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ConversationMessageResponse> getConversationMessages(Long conversationId) {
        logger.info("Getting messages for conversation with ID: {}", conversationId);

        User currentUser = getCurrentUser();
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found with ID: " + conversationId));

        // Check if user is a participant
        if (!conversation.getParticipants().contains(currentUser)) {
            throw new ResourceNotFoundException("Conversation not found with ID: " + conversationId);
        }

        List<ConversationMessage> messages = messageRepository.findByConversationOrderBySentAtAsc(conversation);

        // Mark unread messages as read
        messages.stream()
                .filter(message -> !message.isRead() && !message.getSender().equals(currentUser))
                .forEach(message -> {
                    message.setRead(true);
                    message.setReadAt(LocalDateTime.now());
                    messageRepository.save(message);
                });

        return messages.stream()
                .map(this::mapToMessageResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ConversationMessageResponse sendMessage(ConversationMessageRequest messageRequest) {
        logger.info("Sending message to conversation with ID: {}", messageRequest.getConversationId());

        User currentUser = getCurrentUser();
        Conversation conversation = conversationRepository.findById(messageRequest.getConversationId())
                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found with ID: " + messageRequest.getConversationId()));

        // Check if user is a participant
        if (!conversation.getParticipants().contains(currentUser)) {
            throw new ResourceNotFoundException("Conversation not found with ID: " + messageRequest.getConversationId());
        }

        ConversationMessage message = new ConversationMessage();
        message.setConversation(conversation);
        message.setSender(currentUser);
        message.setContent(messageRequest.getContent());
        message.setRead(false);

        ConversationMessage savedMessage = messageRepository.save(message);

        // Update conversation last message
        conversation.setLastMessage(messageRequest.getContent());
        conversation.setLastMessageDate(savedMessage.getSentAt());
        conversationRepository.save(conversation);

        return mapToMessageResponse(savedMessage);
    }

    @Override
    @Transactional
    public ConversationMessageResponse sendMessageWithAttachment(ConversationMessageRequest messageRequest, MultipartFile file) {
        logger.info("Sending message with attachment to conversation with ID: {}", messageRequest.getConversationId());

        User currentUser = getCurrentUser();
        Conversation conversation = conversationRepository.findById(messageRequest.getConversationId())
                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found with ID: " + messageRequest.getConversationId()));

        // Check if user is a participant
        if (!conversation.getParticipants().contains(currentUser)) {
            throw new ResourceNotFoundException("Conversation not found with ID: " + messageRequest.getConversationId());
        }

        // Store file
        String attachmentPath = null;
        String attachmentName = null;
        if (file != null && !file.isEmpty()) {
            attachmentPath = fileStorageService.storeFile(file);
            attachmentName = file.getOriginalFilename();
        }

        ConversationMessage message = new ConversationMessage();
        message.setConversation(conversation);
        message.setSender(currentUser);
        message.setContent(messageRequest.getContent());
        message.setAttachmentUrl(attachmentPath);
        message.setAttachmentName(attachmentName);
        message.setRead(false);

        ConversationMessage savedMessage = messageRepository.save(message);

        // Update conversation last message
        conversation.setLastMessage(messageRequest.getContent());
        conversation.setLastMessageDate(savedMessage.getSentAt());
        conversationRepository.save(conversation);

        return mapToMessageResponse(savedMessage);
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        return userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private ConversationResponse mapToConversationResponse(Conversation conversation) {
        int unreadCount = messageRepository.countByConversationAndRecipientAndReadFalse(
                conversation, getCurrentUser());

        return ConversationResponse.builder()
                .id(conversation.getId())
                .title(conversation.getTitle())
                .type(conversation.getType())
                .lastMessage(conversation.getLastMessage())
                .lastMessageDate(conversation.getLastMessageDate())
                .unreadCount(unreadCount)
                .build();
    }

    private ConversationMessageResponse mapToMessageResponse(ConversationMessage message) {
        return ConversationMessageResponse.builder()
                .id(message.getId())
                .sender(new UserBasicResponse(message.getSender().getId(), message.getSender().getUserName()))
                .content(message.getContent())
                .attachmentUrl(message.getAttachmentUrl())
                .attachmentName(message.getAttachmentName())
                .read(message.isRead())
                .sentAt(message.getSentAt())
                .readAt(message.getReadAt())
                .build();
    }
}