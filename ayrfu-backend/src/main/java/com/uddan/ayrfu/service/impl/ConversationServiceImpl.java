package com.uddan.ayrfu.service.impl;

import com.uddan.ayrfu.dto.request.ConversationRequest;
import com.uddan.ayrfu.dto.request.MessageRequest;
import com.uddan.ayrfu.dto.response.ConversationResponse;
import com.uddan.ayrfu.dto.response.DocumentResponse;
import com.uddan.ayrfu.dto.response.MessageResponse;
import com.uddan.ayrfu.dto.response.UserBasicResponse;
import com.uddan.ayrfu.entity.Conversation;
import com.uddan.ayrfu.entity.Document;
import com.uddan.ayrfu.entity.Message;
import com.uddan.ayrfu.entity.User;
import com.uddan.ayrfu.enumeration.DocumentType;
import com.uddan.ayrfu.enumeration.MessageType;
import com.uddan.ayrfu.exception.BadRequestException;
import com.uddan.ayrfu.exception.ResourceNotFoundException;
import com.uddan.ayrfu.repository.ConversationRepository;
import com.uddan.ayrfu.repository.DocumentRepository;
import com.uddan.ayrfu.repository.MessageRepository;
import com.uddan.ayrfu.repository.UserRepository;
import com.uddan.ayrfu.security.UserDetailsImpl;
import com.uddan.ayrfu.service.ConversationService;
import com.uddan.ayrfu.service.DocumentService;
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

@Service("conversationService")
public class ConversationServiceImpl implements ConversationService {

    private static final Logger logger = LoggerFactory.getLogger(ConversationServiceImpl.class);

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final DocumentService documentService;
    private final DocumentRepository documentRepository;

    public ConversationServiceImpl(
            ConversationRepository conversationRepository,
            MessageRepository messageRepository,
            UserRepository userRepository,
            DocumentService documentService,
            DocumentRepository documentRepository) {
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.documentService = documentService;
        this.documentRepository = documentRepository;
    }

    @Override
    @Transactional
    public ConversationResponse createConversation(ConversationRequest request) {
        logger.info("Creating new conversation with subject: {}", request.getSubject());

        User currentUser = getCurrentAuthenticatedUser();
        User recipient = userRepository.findById(request.getRecipientId())
                .orElseThrow(() -> new ResourceNotFoundException("Recipient not found with ID: " + request.getRecipientId()));

        // Create conversation
        Conversation conversation = Conversation.builder()
                .subject(request.getSubject())
                .initiator(currentUser)
                .recipient(recipient)
                .build();

        Conversation savedConversation = conversationRepository.save(conversation);

        // If initial message is provided, create it
        if (request.getInitialMessage() != null && !request.getInitialMessage().isEmpty()) {
            Message initialMessage = Message.builder()
                    .type(getMessageTypeForUser(currentUser))
                    .sender(currentUser)
                    .senderName(currentUser.getUserName())
                    .senderEmail(currentUser.getEmail())
                    .content(request.getInitialMessage())
                    .conversation(savedConversation)
                    .build();

            messageRepository.save(initialMessage);
        }

        logger.info("Conversation created with ID: {}", savedConversation.getId());

        return mapToConversationResponse(savedConversation);
    }

    @Override
    @Transactional(readOnly = true)
    public ConversationResponse getConversationById(Long id) {
        logger.info("Getting conversation with ID: {}", id);

        Conversation conversation = conversationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found with ID: " + id));

        return mapToConversationResponse(conversation);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ConversationResponse> getUserConversations() {
        User currentUser = getCurrentAuthenticatedUser();
        logger.info("Getting conversations for user with ID: {}", currentUser.getId());

        List<Conversation> conversations = conversationRepository.findUserConversations(currentUser);

        return conversations.stream()
                .map(this::mapToConversationResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MessageResponse> getConversationMessages(Long conversationId) {
        logger.info("Getting messages for conversation with ID: {}", conversationId);

        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found with ID: " + conversationId));

        List<Message> messages = messageRepository.findByConversationOrderByCreatedAtAsc(conversation);

        return messages.stream()
                .map(this::mapToMessageResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public MessageResponse sendMessage(Long conversationId, MessageRequest messageRequest, MultipartFile attachment) {
        logger.info("Sending message to conversation with ID: {}", conversationId);

        User currentUser = getCurrentAuthenticatedUser();

        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found with ID: " + conversationId));

        // Ensure user is participant in conversation
        if (!isConversationParticipant(conversationId, currentUser.getId())) {
            throw new BadRequestException("User is not a participant in this conversation");
        }

        // Upload attachment if provided
        Document attachmentDoc = null;
        if (attachment != null && !attachment.isEmpty()) {
            try {
                // Upload document
                DocumentResponse uploadedDoc = documentService.uploadSystemDocument(
                        attachment,
                        "Message attachment for conversation: " + conversationId
                );

                // Retrieve the document entity
                attachmentDoc = documentRepository.findById(uploadedDoc.id())
                        .orElseThrow(() -> new ResourceNotFoundException("Failed to retrieve uploaded document"));
            } catch (Exception e) {
                logger.error("Failed to upload attachment", e);
                throw new BadRequestException("Failed to upload attachment: " + e.getMessage());
            }
        }

        // Create message
        Message message = Message.builder()
                .type(getMessageTypeForUser(currentUser))
                .sender(currentUser)
                .senderName(currentUser.getUserName())
                .senderEmail(currentUser.getEmail())
                .senderPhone(messageRequest.getSenderPhone())
                .content(messageRequest.getContent())
                .conversation(conversation)
                .attachment(attachmentDoc)
                .build();

        Message savedMessage = messageRepository.save(message);

        // Update conversation timestamp
        conversation.setUpdatedAt(LocalDateTime.now());
        conversationRepository.save(conversation);

        logger.info("Message sent with ID: {}", savedMessage.getId());

        return mapToMessageResponse(savedMessage);
    }

    @Override
    @Transactional
    public MessageResponse markMessageAsRead(Long messageId) {
        logger.info("Marking message with ID: {} as read", messageId);

        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new ResourceNotFoundException("Message not found with ID: " + messageId));

        User currentUser = getCurrentAuthenticatedUser();

        // Only recipient can mark as read (not sender)
        if (message.getSender() != null && message.getSender().getId().equals(currentUser.getId())) {
            throw new BadRequestException("Sender cannot mark their own message as read");
        }

        // Ensure user is conversation participant
        Conversation conversation = message.getConversation();
        if (!isConversationParticipant(conversation.getId(), currentUser.getId())) {
            throw new BadRequestException("User is not a participant in this conversation");
        }

        if (!message.isRead()) {
            message.setRead(true);
            message.setReadAt(LocalDateTime.now());
            message = messageRepository.save(message);
        }

        return mapToMessageResponse(message);
    }

    @Override
    @Transactional
    public int markAllConversationMessagesAsRead(Long conversationId) {
        logger.info("Marking all messages in conversation with ID: {} as read", conversationId);

        User currentUser = getCurrentAuthenticatedUser();

        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found with ID: " + conversationId));

        // Ensure user is participant
        if (!isConversationParticipant(conversationId, currentUser.getId())) {
            throw new BadRequestException("User is not a participant in this conversation");
        }

        // Get all unread messages not sent by current user
        List<Message> unreadMessages = messageRepository.findByConversationAndSenderNotAndReadFalse(
                conversation, currentUser);

        LocalDateTime now = LocalDateTime.now();
        int count = 0;

        for (Message message : unreadMessages) {
            message.setRead(true);
            message.setReadAt(now);
            messageRepository.save(message);
            count++;
        }

        logger.info("Marked {} messages as read in conversation with ID: {}", count, conversationId);

        return count;
    }

    @Override
    @Transactional(readOnly = true)
    public List<MessageResponse> searchMessages(String searchText) {
        logger.info("Searching for messages containing text: {}", searchText);

        User currentUser = getCurrentAuthenticatedUser();

        // Find messages containing the search text
        List<Message> matchingMessages = messageRepository.findByContentContainingIgnoreCase(searchText);

        // Filter to only include messages from conversations the user is part of
        List<Message> accessibleMessages = matchingMessages.stream()
                .filter(message -> isConversationParticipant(
                        message.getConversation().getId(),
                        currentUser.getId()))
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

    @Override
    public boolean isConversationParticipant(Long conversationId, Long userId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found with ID: " + conversationId));

        return (conversation.getInitiator() != null && conversation.getInitiator().getId().equals(userId)) ||
                (conversation.getRecipient() != null && conversation.getRecipient().getId().equals(userId));
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

    private MessageType getMessageTypeForUser(User user) {
        if (user.getClient() != null) {
            return MessageType.CLIENT;
        } else if (user.getCandidate() != null) {
            return MessageType.CANDIDATE;
        } else {
            return MessageType.ADMIN;
        }
    }

    private ConversationResponse mapToConversationResponse(Conversation conversation) {
        // Get last message
        Message lastMessage = messageRepository.findFirstByConversationOrderByCreatedAtDesc(conversation)
                .orElse(null);

        // Get unread count for current user
        User currentUser = getCurrentAuthenticatedUser();
        int unreadCount = messageRepository.countByConversationAndSenderNotAndReadFalse(
                conversation, currentUser);

        return ConversationResponse.builder()
                .id(conversation.getId())
                .subject(conversation.getSubject())
                .initiator(mapToUserBasicResponse(conversation.getInitiator()))
                .recipient(mapToUserBasicResponse(conversation.getRecipient()))
                .lastMessage(lastMessage != null ? mapToMessageResponse(lastMessage) : null)
                .unreadCount(unreadCount)
                .createdAt(conversation.getCreatedAt())
                .updatedAt(conversation.getUpdatedAt())
                .build();
    }

    private UserBasicResponse mapToUserBasicResponse(User user) {
        if (user == null) {
            return null;
        }

        return UserBasicResponse.builder()
                .id(user.getId())
                .fullName(user.getUserName())
                .email(user.getEmail())
                .userType(getUserType(user))
                .build();
    }

    private String getUserType(User user) {
        if (user.getClient() != null) {
            return "CLIENT";
        } else if (user.getCandidate() != null) {
            return "CANDIDATE";
        } else {
            return "ADMIN";
        }
    }

    private MessageResponse mapToMessageResponse(Message message) {
        return MessageResponse.builder()
                .id(message.getId())
                .type(message.getType())
                .senderId(message.getSender() != null ? message.getSender().getId() : null)
                .senderName(message.getSenderName())
                .senderEmail(message.getSenderEmail())
                .senderPhone(message.getSenderPhone())
                .conversationId(message.getConversation().getId())
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