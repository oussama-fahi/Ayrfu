package com.uddan.ayrfu.repository;

import com.uddan.ayrfu.entity.Message;
import com.uddan.ayrfu.enumeration.MessageType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    Page<Message> findByType(MessageType type, Pageable pageable);
    Page<Message> findByRead(boolean read, Pageable pageable);
    Page<Message> findByTypeAndRead(MessageType type, boolean read, Pageable pageable);
    Page<Message> findAll(Pageable pageable);
}