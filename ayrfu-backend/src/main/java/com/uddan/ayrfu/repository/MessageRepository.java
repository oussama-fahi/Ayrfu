package com.uddan.ayrfu.repository;


import com.uddan.ayrfu.entity.Message;
import com.uddan.ayrfu.enumeration.MessageType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findByType(MessageType type);

    List<Message> findByTypeAndRead(MessageType type, boolean read);

    List<Message> findByRead(boolean read);

    List<Message> findBySenderEmail(String senderEmail);
}