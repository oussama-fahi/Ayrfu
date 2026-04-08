package com.ayrfu.ayrfu.service;

import com.ayrfu.ayrfu.dto.request.MessageRequest;
import com.ayrfu.ayrfu.dto.response.MessageResponse;
import com.ayrfu.ayrfu.enumeration.MessageType;
import org.springframework.data.domain.Page;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface MessageService {

    @Transactional
    MessageResponse createMessage(MessageRequest messageRequest);

    @Transactional(readOnly = true)
    MessageResponse getMessageById(Long id);

    @Transactional(readOnly = true)
    List<MessageResponse> getAllMessages(int page, int size);

    @Transactional(readOnly = true)
    List<MessageResponse> getMessagesByType(MessageType type, int page, int size);

    @Transactional(readOnly = true)
    List<MessageResponse> getUnreadMessages();

    @Transactional(readOnly = true)
    Page<MessageResponse> getUnreadMessages(int page, int size);

    @Transactional(readOnly = true)
    List<MessageResponse> getUnreadMessagesByType(MessageType type);

    @Transactional(readOnly = true)
    Page<MessageResponse> getUnreadMessagesByType(MessageType type, int page, int size);

    @Transactional
    MessageResponse markMessageAsRead(Long id);

    @Transactional
    int markMultipleMessagesAsRead(List<Long> messageIds);

    @Transactional
    void deleteMessage(Long id);

    @Transactional(readOnly = true)
    List<MessageResponse> searchMessages(String searchText);

    @Transactional(readOnly = true)
    int getUnreadMessageCount();
}