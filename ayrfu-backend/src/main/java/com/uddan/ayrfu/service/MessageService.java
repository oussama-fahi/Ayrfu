package com.uddan.ayrfu.service;


import com.uddan.ayrfu.dto.request.MessageRequest;
import com.uddan.ayrfu.dto.response.MessageResponse;
import com.uddan.ayrfu.entity.Message;
import com.uddan.ayrfu.enumeration.MessageType;

import java.util.List;

public interface MessageService {

    MessageResponse createMessage(MessageRequest messageRequest);

    MessageResponse getMessageById(Long id);

    List<MessageResponse> getAllMessages();

    List<MessageResponse> getMessagesByType(MessageType type);

    List<MessageResponse> getUnreadMessages();

    List<MessageResponse> getUnreadMessagesByType(MessageType type);

    MessageResponse markMessageAsRead(Long id);

    void deleteMessage(Long id);
}