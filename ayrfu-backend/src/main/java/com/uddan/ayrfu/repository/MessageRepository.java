package com.uddan.ayrfu.repository;

import com.uddan.ayrfu.entity.Conversation;
import com.uddan.ayrfu.entity.Message;
import com.uddan.ayrfu.entity.User;
import com.uddan.ayrfu.enumeration.MessageType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    /**
     * Finds all messages in a conversation, ordered by sent time ascending
     */
    List<Message> findByConversationOrderByCreatedAtAsc(Conversation conversation);
    List<Message> findByConversationOrderByCreatedAtDesc(Conversation conversation);
    Optional<Message> findFirstByConversationOrderByCreatedAtDesc(Conversation conversation);

    /**
     * Finds all messages by a specific sender
     */
    List<Message> findBySender(User sender);

    /**
     * Finds all messages by message type
     */
    List<Message> findByType(MessageType type);

    /**
     * Finds all messages by message type with pagination
     */
    Page<Message> findByType(MessageType type, Pageable pageable);

    /**
     * Finds all read or unread messages
     */
    List<Message> findByRead(boolean read);

    /**
     * Finds all read or unread messages with pagination
     */
    Page<Message> findByRead(boolean read, Pageable pageable);

    /**
     * Finds all read or unread messages of a specific type
     */
    List<Message> findByTypeAndRead(MessageType type, boolean read);

    /**
     * Finds all read or unread messages of a specific type with pagination
     */
    Page<Message> findByTypeAndRead(MessageType type, boolean read, Pageable pageable);

    /**
     * Counts unread messages in a conversation
     */
    int countByConversationAndReadFalse(Conversation conversation);

    /**
     * Counts unread messages in a conversation not sent by the specified user
     */
    int countByConversationAndSenderNotAndReadFalse(Conversation conversation, User user);

    /**
     * Finds all unread messages in a conversation not sent by the specified user
     */
    List<Message> findByConversationAndSenderNotAndReadFalse(Conversation conversation, User user);

    /**
     * Finds messages that contain specific text in their content
     */
    @Query("SELECT m FROM Message m WHERE LOWER(m.content) LIKE LOWER(CONCAT('%', :searchText, '%'))")
    List<Message> findByContentContainingIgnoreCase(@Param("searchText") String searchText);

    /**
     * Finds messages between two users across all conversations
     */
    @Query("SELECT m FROM Message m WHERE m.conversation IN " +
            "(SELECT c FROM Conversation c WHERE " +
            "(c.initiator = :user1 AND c.recipient = :user2) OR " +
            "(c.initiator = :user2 AND c.recipient = :user1)) " +
            "ORDER BY m.createdAt ASC")
    List<Message> findMessagesBetweenUsers(@Param("user1") User user1, @Param("user2") User user2);

    /**
     * Finds all messages in conversations where the specified user is a participant
     */
    @Query("SELECT m FROM Message m WHERE m.conversation IN " +
            "(SELECT c FROM Conversation c WHERE c.initiator = :user OR c.recipient = :user) " +
            "ORDER BY m.createdAt DESC")
    Page<Message> findMessagesForUser(@Param("user") User user, Pageable pageable);

    /**
     * Finds all unread messages for a specific user
     */
    @Query("SELECT m FROM Message m WHERE " +
            "m.read = false AND m.sender != :user AND " +
            "m.conversation IN (SELECT c FROM Conversation c WHERE c.initiator = :user OR c.recipient = :user)")
    List<Message> findUnreadMessagesForUser(@Param("user") User user);

    /**
     * Finds all unread messages for a specific user with pagination
     */
    @Query("SELECT m FROM Message m WHERE " +
            "m.read = false AND m.sender != :user AND " +
            "m.conversation IN (SELECT c FROM Conversation c WHERE c.initiator = :user OR c.recipient = :user)")
    Page<Message> findUnreadMessagesForUser(@Param("user") User user, Pageable pageable);

    /**
     * Finds all unread messages of a specific type for a user
     */
    @Query("SELECT m FROM Message m WHERE " +
            "m.read = false AND m.sender != :user AND m.type = :type AND " +
            "m.conversation IN (SELECT c FROM Conversation c WHERE c.initiator = :user OR c.recipient = :user)")
    List<Message> findUnreadMessagesOfTypeForUser(@Param("type") MessageType type, @Param("user") User user);

    /**
     * Finds all unread messages of a specific type for a user with pagination
     */
    @Query("SELECT m FROM Message m WHERE " +
            "m.read = false AND m.sender != :user AND m.type = :type AND " +
            "m.conversation IN (SELECT c FROM Conversation c WHERE c.initiator = :user OR c.recipient = :user)")
    Page<Message> findUnreadMessagesOfTypeForUser(@Param("type") MessageType type, @Param("user") User user, Pageable pageable);

    /**
     * Counts all unread messages for a specific user
     */
    @Query("SELECT COUNT(m) FROM Message m WHERE " +
            "m.read = false AND m.sender != :user AND " +
            "m.conversation IN (SELECT c FROM Conversation c WHERE c.initiator = :user OR c.recipient = :user)")
    int countUnreadMessagesForUser(@Param("user") User user);

    /**
     * Finds all messages with attachments
     */
    @Query("SELECT m FROM Message m WHERE m.attachment IS NOT NULL")
    List<Message> findMessagesWithAttachments();
}