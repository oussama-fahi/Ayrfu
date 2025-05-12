package com.uddan.ayrfu.service.impl;

import com.uddan.ayrfu.dto.request.MessageRequest;
import com.uddan.ayrfu.dto.response.MessageResponse;
import com.uddan.ayrfu.entity.Message;
import com.uddan.ayrfu.enumeration.MessageType;
import com.uddan.ayrfu.exception.ResourceNotFoundException;
import com.uddan.ayrfu.repository.MessageRepository;
import com.uddan.ayrfu.service.MessageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MessageServiceImpl implements MessageService {

    private static final Logger logger = LoggerFactory.getLogger(MessageServiceImpl.class);

    private final MessageRepository messageRepository;

    public MessageServiceImpl(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
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
    public List<MessageResponse> getUnreadMessages(int page, int size) {
        logger.info("Fetching unread messages, page: {}, size: {}", page, size);

        Pageable pageable = PageRequest.of(page, size);
        Page<Message> messages = messageRepository.findByRead(false, pageable);

        return messages.getContent().stream()
                .map(this::mapToMessageResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MessageResponse> getUnreadMessagesByType(MessageType type, int page, int size) {
        logger.info("Fetching unread messages with type: {}, page: {}, size: {}", type, page, size);

        Pageable pageable = PageRequest.of(page, size);
        Page<Message> messages = messageRepository.findByTypeAndRead(type, false, pageable);

        return messages.getContent().stream()
                .map(this::mapToMessageResponse)
                .collect(Collectors.toList());
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

    private MessageResponse mapToMessageResponse(Message message) {
        return MessageResponse.builder()
                .id(message.getId())
                .type(message.getType())
                .senderName(message.getSenderName())
                .senderEmail(message.getSenderEmail())
                .senderPhone(message.getSenderPhone())
                .content(message.getContent())
                .sentAt(message.getSentAt())
                .read(message.isRead())
                .readAt(message.getReadAt())
                .build();
    }
}