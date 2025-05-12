package com.uddan.ayrfu.repository;

import com.uddan.ayrfu.entity.Conversation;
import com.uddan.ayrfu.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    @Query("SELECT c FROM Conversation c JOIN c.participants p WHERE p = :participant AND c.type = :type")
    List<Conversation> findByParticipantAndType(User participant, String type);
}