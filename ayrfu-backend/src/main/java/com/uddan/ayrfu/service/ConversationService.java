package com.uddan.ayrfu.service;

import com.uddan.ayrfu.dto.request.ConversationMessageRequest;
import com.uddan.ayrfu.dto.response.ConversationMessageResponse;
import com.uddan.ayrfu.dto.response.ConversationResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ConversationService {

    List<ConversationResponse> getConversations(String type);

    List<ConversationMessageResponse> getConversationMessages(Long conversationId);

    ConversationMessageResponse sendMessage(ConversationMessageRequest messageRequest);

    ConversationMessageResponse sendMessageWithAttachment(ConversationMessageRequest messageRequest, MultipartFile file);
}