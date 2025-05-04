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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MessageServiceImpl implements MessageService {

    private static final Logger logger = LoggerFactory.getLogger(MessageServiceImpl.class);

    private final MessageRepository messageRepository;

    public MessageServiceImpl(MessageRepository messageRepository){
        this.messageRepository=messageRepository;
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
    public List<MessageResponse> getAllMessages() {
        logger.info("Fetching all messages");

        return messageRepository.findAll().stream()
                .map(this::mapToMessageResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MessageResponse> getMessagesByType(MessageType type) {
        logger.info("Fetching messages with type: {}", type);

        return messageRepository.findByType(type).stream()
                .map(this::mapToMessageResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MessageResponse> getUnreadMessages() {
        logger.info("Fetching unread messages");

        return messageRepository.findByRead(false).stream()
                .map(this::mapToMessageResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MessageResponse> getUnreadMessagesByType(MessageType type) {
        logger.info("Fetching unread messages with type: {}", type);

        return messageRepository.findByTypeAndRead(type, false).stream()
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