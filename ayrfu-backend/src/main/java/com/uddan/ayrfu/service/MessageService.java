package com.uddan.ayrfu.service;

import com.uddan.ayrfu.dto.request.MessageRequest;
import com.uddan.ayrfu.dto.response.MessageResponse;
import com.uddan.ayrfu.enumeration.MessageType;

import java.util.List;

public interface MessageService {
    MessageResponse createMessage(MessageRequest messageRequest);
    MessageResponse getMessageById(Long id);
    List<MessageResponse> getAllMessages(int page, int size);
    List<MessageResponse> getMessagesByType(MessageType type, int page, int size);
    List<MessageResponse> getUnreadMessages(int page, int size);
    List<MessageResponse> getUnreadMessagesByType(MessageType type, int page, int size);
    MessageResponse markMessageAsRead(Long id);
    int markMultipleMessagesAsRead(List<Long> messageIds);
    void deleteMessage(Long id);
}