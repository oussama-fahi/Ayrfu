package com.ayrfu.ayrfu.repository;

import com.ayrfu.ayrfu.entity.Conversation;
import com.ayrfu.ayrfu.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    @Query("SELECT c FROM Conversation c WHERE c.initiator = ?1 OR c.recipient = ?1 ORDER BY c.updatedAt DESC")
    List<Conversation> findUserConversations(User user);
}