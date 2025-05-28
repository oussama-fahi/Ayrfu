package com.uddan.ayrfu.service;

import com.uddan.ayrfu.dto.request.MessageRequest;
import com.uddan.ayrfu.dto.response.DocumentResponse;
import com.uddan.ayrfu.dto.response.MessageResponse;
import com.uddan.ayrfu.entity.Conversation;
import com.uddan.ayrfu.entity.Document;
import com.uddan.ayrfu.entity.Message;
import com.uddan.ayrfu.entity.User;
import com.uddan.ayrfu.enumeration.MessageType;
import com.uddan.ayrfu.exception.ResourceNotFoundException;
import com.uddan.ayrfu.repository.MessageRepository;
import com.uddan.ayrfu.repository.UserRepository;
import com.uddan.ayrfu.security.UserDetailsImpl;
import com.uddan.ayrfu.service.impl.MessageServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class MessageServiceTest {

    @Mock
    private MessageRepository messageRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private MessageServiceImpl messageService;

    private User testUser;
    private UserDetailsImpl userDetails;
    private Message testMessage;
    private Conversation testConversation;
    private Document testDocument;

    @BeforeEach
    void setUp() {
        // Set up test user
        testUser = new User();
        testUser.setId(1L);
        testUser.setUserName("Test User");
        testUser.setEmail("test@example.com");

        // Set up user details
        userDetails = UserDetailsImpl.build(testUser);

        // Set up test conversation
        testConversation = new Conversation();
        testConversation.setId(1L);
        testConversation.setSubject("Test Conversation");
        testConversation.setInitiator(testUser);

        // Set up test document
        testDocument = new Document();
        testDocument.setId(1L);
        testDocument.setFileName("test.pdf");
        testDocument.setContentType("application/pdf");
        testDocument.setFileSize(1024L);

        // Set up test message
        testMessage = new Message();
        testMessage.setId(1L);
        testMessage.setType(MessageType.CANDIDATE);
        testMessage.setSender(testUser);
        testMessage.setSenderName(testUser.getUserName());
        testMessage.setSenderEmail(testUser.getEmail());
        testMessage.setConversation(testConversation);
        testMessage.setContent("Test message content");
        testMessage.setRead(false);
        LocalDateTime now = LocalDateTime.now();
        testMessage.setCreatedAt(now);
        testMessage.setUpdatedAt(now);

        // Set up the security context
        SecurityContextHolder.setContext(securityContext);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(testUser));
    }

    @Test
    void createMessage_ShouldReturnMessageResponse() {
        // Arrange
        MessageRequest request = new MessageRequest();
        request.setType(MessageType.CANDIDATE);
        request.setSenderName("Test User");
        request.setSenderEmail("test@example.com");
        request.setContent("Test message content");

        when(messageRepository.save(any(Message.class))).thenReturn(testMessage);

        // Act
        MessageResponse response = messageService.createMessage(request);

        // Assert
        assertNotNull(response);
        assertEquals(testMessage.getId(), response.id());
        assertEquals(testMessage.getType(), response.type());
        assertEquals(testMessage.getSenderName(), response.senderName());
        assertEquals(testMessage.getSenderEmail(), response.senderEmail());
        assertEquals(testMessage.getContent(), response.content());
        verify(messageRepository).save(any(Message.class));
    }

    @Test
    void getMessageById_ShouldReturnMessageResponse() {
        when(messageRepository.findById(1L)).thenReturn(Optional.of(testMessage));
        MessageResponse response = messageService.getMessageById(1L);
        assertNotNull(response);
        assertEquals(testMessage.getId(), response.id());
        assertEquals(testMessage.getType(), response.type());
        assertEquals(testMessage.getSenderName(), response.senderName());
        verify(messageRepository).findById(1L);
    }

    @Test
    void getMessageById_ShouldThrowExceptionWhenMessageNotFound() {
        // Arrange
        when(messageRepository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            messageService.getMessageById(99L);
        });
        verify(messageRepository).findById(99L);
    }

    @Test
    void getAllMessages_ShouldReturnListOfMessageResponses() {
        // Arrange
        List<Message> messages = Arrays.asList(testMessage);
        Page<Message> messagePage = new PageImpl<>(messages);

        when(messageRepository.findAll(any(Pageable.class))).thenReturn(messagePage);

        // Act
        List<MessageResponse> responses = messageService.getAllMessages(0, 10);

        // Assert
        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals(testMessage.getId(), responses.get(0).id());
        verify(messageRepository).findAll(any(Pageable.class));
    }

    @Test
    void getMessagesByType_ShouldReturnListOfMessageResponses() {
        // Arrange
        List<Message> messages = Arrays.asList(testMessage);
        Page<Message> messagePage = new PageImpl<>(messages);

        when(messageRepository.findByType(eq(MessageType.CANDIDATE), any(Pageable.class))).thenReturn(messagePage);

        // Act
        List<MessageResponse> responses = messageService.getMessagesByType(MessageType.CANDIDATE, 0, 10);

        // Assert
        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals(testMessage.getId(), responses.get(0).id());
        assertEquals(MessageType.CANDIDATE, responses.get(0).type());
        verify(messageRepository).findByType(eq(MessageType.CANDIDATE), any(Pageable.class));
    }

    @Test
    void getUnreadMessages_ShouldReturnListOfUnreadMessages() {
        // Arrange
        List<Message> messages = Arrays.asList(testMessage);
        when(messageRepository.findUnreadMessagesForUser(any(User.class))).thenReturn(messages);

        // Act
        List<MessageResponse> responses = messageService.getUnreadMessages();

        // Assert
        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals(testMessage.getId(), responses.get(0).id());
        assertFalse(responses.get(0).read());
        verify(messageRepository).findUnreadMessagesForUser(any(User.class));
    }

    @Test
    void getUnreadMessagesWithPagination_ShouldReturnPageOfUnreadMessages() {
        // Arrange
        List<Message> messages = Arrays.asList(testMessage);
        Page<Message> messagePage = new PageImpl<>(messages);

        when(messageRepository.findUnreadMessagesForUser(any(User.class), any(Pageable.class))).thenReturn(messagePage);

        // Act
        Page<MessageResponse> responsePage = messageService.getUnreadMessages(0, 10);

        // Assert
        assertNotNull(responsePage);
        assertEquals(1, responsePage.getContent().size());
        assertEquals(testMessage.getId(), responsePage.getContent().get(0).id());
        assertFalse(responsePage.getContent().get(0).read());
        verify(messageRepository).findUnreadMessagesForUser(any(User.class), any(Pageable.class));
    }

    @Test
    void getUnreadMessagesByType_ShouldReturnListOfUnreadMessagesByType() {
        // Arrange
        List<Message> messages = Arrays.asList(testMessage);
        when(messageRepository.findUnreadMessagesOfTypeForUser(eq(MessageType.CANDIDATE), any(User.class)))
                .thenReturn(messages);

        // Act
        List<MessageResponse> responses = messageService.getUnreadMessagesByType(MessageType.CANDIDATE);

        // Assert
        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals(testMessage.getId(), responses.get(0).id());
        assertEquals(MessageType.CANDIDATE, responses.get(0).type());
        assertFalse(responses.get(0).read());
        verify(messageRepository).findUnreadMessagesOfTypeForUser(eq(MessageType.CANDIDATE), any(User.class));
    }

    @Test
    void getUnreadMessagesByTypeWithPagination_ShouldReturnPageOfUnreadMessagesByType() {
        // Arrange
        List<Message> messages = Arrays.asList(testMessage);
        Page<Message> messagePage = new PageImpl<>(messages);

        when(messageRepository.findUnreadMessagesOfTypeForUser(eq(MessageType.CANDIDATE), any(User.class), any(Pageable.class)))
                .thenReturn(messagePage);

        // Act
        Page<MessageResponse> responsePage = messageService.getUnreadMessagesByType(MessageType.CANDIDATE, 0, 10);

        // Assert
        assertNotNull(responsePage);
        assertEquals(1, responsePage.getContent().size());
        assertEquals(testMessage.getId(), responsePage.getContent().get(0).id());
        assertEquals(MessageType.CANDIDATE, responsePage.getContent().get(0).type());
        assertFalse(responsePage.getContent().get(0).read());
        verify(messageRepository).findUnreadMessagesOfTypeForUser(eq(MessageType.CANDIDATE), any(User.class), any(Pageable.class));
    }

    @Test
    void markMessageAsRead_ShouldMarkMessageAsRead() {
        // Arrange
        Message unreadMessage = new Message();
        unreadMessage.setId(1L);
        unreadMessage.setRead(false);
        unreadMessage.setReadAt(null);
        unreadMessage.setContent("Test content");
        unreadMessage.setType(MessageType.CANDIDATE);
        unreadMessage.setSenderName("Test User");
        unreadMessage.setSenderEmail("test@example.com");
        unreadMessage.setCreatedAt(LocalDateTime.now());
        unreadMessage.setUpdatedAt(LocalDateTime.now());

        when(messageRepository.findById(1L)).thenReturn(Optional.of(unreadMessage));
        when(messageRepository.save(any(Message.class))).thenAnswer(invocation -> {
            Message message = invocation.getArgument(0);
            message.setRead(true);
            message.setReadAt(LocalDateTime.now());
            return message;
        });

        // Act
        MessageResponse response = messageService.markMessageAsRead(1L);

        // Assert
        assertNotNull(response);
        assertTrue(response.read());
        assertNotNull(response.readAt());
        verify(messageRepository).findById(1L);
        verify(messageRepository).save(any(Message.class));
    }

    @Test
    void markMultipleMessagesAsRead_ShouldReturnCountOfMarkedMessages() {
        // Arrange
        Message message1 = new Message();
        message1.setId(1L);
        message1.setRead(false);

        Message message2 = new Message();
        message2.setId(2L);
        message2.setRead(false);

        when(messageRepository.findById(1L)).thenReturn(Optional.of(message1));
        when(messageRepository.findById(2L)).thenReturn(Optional.of(message2));
        when(messageRepository.findById(3L)).thenReturn(Optional.empty());

        // Act
        int count = messageService.markMultipleMessagesAsRead(Arrays.asList(1L, 2L, 3L));

        // Assert
        assertEquals(2, count);
        verify(messageRepository, times(2)).save(any(Message.class));
    }

    @Test
    void deleteMessage_ShouldDeleteMessage() {
        // Arrange
        when(messageRepository.findById(1L)).thenReturn(Optional.of(testMessage));
        doNothing().when(messageRepository).delete(any(Message.class));

        // Act
        messageService.deleteMessage(1L);

        // Assert
        verify(messageRepository).findById(1L);
        verify(messageRepository).delete(testMessage);
    }

    @Test
    void searchMessages_ShouldReturnMatchingMessages() {
        // Arrange
        List<Message> messages = Arrays.asList(testMessage);
        when(messageRepository.findByContentContainingIgnoreCase("test")).thenReturn(messages);

        // Act
        List<MessageResponse> responses = messageService.searchMessages("test");

        // Assert
        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals(testMessage.getId(), responses.get(0).id());
        assertTrue(responses.get(0).content().toLowerCase().contains("test"));
        verify(messageRepository).findByContentContainingIgnoreCase("test");
    }

    @Test
    void getUnreadMessageCount_ShouldReturnCount() {
        // Arrange
        when(messageRepository.countUnreadMessagesForUser(any(User.class))).thenReturn(5);

        // Act
        int count = messageService.getUnreadMessageCount();

        // Assert
        assertEquals(5, count);
        verify(messageRepository).countUnreadMessagesForUser(any(User.class));
    }

    @Test
    void mapToMessageResponse_ShouldMapCorrectly() {
        // Act - this calls the private mapToMessageResponse method
        MessageResponse response = messageService.getMessageById(1L);

        // Arrange
        when(messageRepository.findById(1L)).thenReturn(Optional.of(testMessage));

        // Assert
        assertNotNull(response);
        assertEquals(testMessage.getId(), response.id());
        assertEquals(testMessage.getType(), response.type());
        assertEquals(testMessage.getSenderName(), response.senderName());
        assertEquals(testMessage.getSenderEmail(), response.senderEmail());
        assertEquals(testMessage.getContent(), response.content());
        assertEquals(testMessage.isRead(), response.read());
        assertEquals(testMessage.getReadAt(), response.readAt());
        assertEquals(testMessage.getCreatedAt(), response.sentAt());
    }

    @Test
    void mapToMessageResponse_WithAttachment_ShouldMapCorrectly() {
        // Arrange
        testMessage.setAttachment(testDocument);
        when(messageRepository.findById(1L)).thenReturn(Optional.of(testMessage));

        // Act
        MessageResponse response = messageService.getMessageById(1L);

        // Assert
        assertNotNull(response);
        assertNotNull(response.attachment());
        assertEquals(testDocument.getId(), response.attachment().id());
        assertEquals(testDocument.getFileName(), response.attachment().fileName());
        assertEquals(testDocument.getContentType(), response.attachment().contentType());
        assertEquals(testDocument.getFileSize(), response.attachment().fileSize());
    }
}