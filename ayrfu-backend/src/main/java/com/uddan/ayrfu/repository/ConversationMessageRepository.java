package com.uddan.ayrfu.repository;

import com.uddan.ayrfu.entity.Conversation;
import com.uddan.ayrfu.entity.ConversationMessage;
import com.uddan.ayrfu.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConversationMessageRepository extends JpaRepository<ConversationMessage, Long> {

    List<ConversationMessage> findByConversationOrderBySentAtAsc(Conversation conversation);

    @Query("SELECT COUNT(m) FROM ConversationMessage m WHERE m.conversation = :conversation AND m.sender != :recipient AND m.read = false")
    int countByConversationAndRecipientAndReadFalse(Conversation conversation, User recipient);
}