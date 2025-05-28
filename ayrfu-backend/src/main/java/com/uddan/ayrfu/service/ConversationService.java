package com.uddan.ayrfu.service;

import com.uddan.ayrfu.dto.request.ConversationRequest;
import com.uddan.ayrfu.dto.request.MessageRequest;
import com.uddan.ayrfu.dto.response.ConversationResponse;
import com.uddan.ayrfu.dto.response.MessageResponse;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ConversationService {

    @Transactional
    ConversationResponse createConversation(ConversationRequest request);

    @Transactional(readOnly = true)
    ConversationResponse getConversationById(Long id);

    @Transactional(readOnly = true)
    List<ConversationResponse> getUserConversations();

    @Transactional(readOnly = true)
    List<MessageResponse> getConversationMessages(Long conversationId);

    @Transactional
    MessageResponse sendMessage(Long conversationId, MessageRequest messageRequest, MultipartFile attachment);


    @Transactional
    MessageResponse markMessageAsRead(Long messageId);

    @Transactional
    int markAllConversationMessagesAsRead(Long conversationId);

    @Transactional(readOnly = true)
    List<MessageResponse> searchMessages(String searchText);

    @Transactional(readOnly = true)
    int getUnreadMessageCount();

    boolean isConversationParticipant(Long conversationId, Long userId);
}