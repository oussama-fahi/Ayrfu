// src/api/services/message.service.js
import axios from 'axios';

/**
 * Service for managing messages and conversations
 */
const messageService = {
  /**
   * Get all conversations
   * @returns {Promise} Promise containing the response data
   */
  getAllConversations: async () => {
    return axios.get('/api/messages/conversations');
  },
  
  /**
   * Get conversation details with messages
   * @param {string} conversationId - The conversation ID
   * @returns {Promise} Promise containing the response data
   */
  getConversationDetails: async (conversationId) => {
    return axios.get(`/api/messages/conversations/${conversationId}`);
  },
  
  /**
   * Start a new conversation
   * @param {Object} conversationData - The conversation data with initial message
   * @returns {Promise} Promise containing the response data
   */
  startConversation: async (conversationData) => {
    return axios.post('/api/messages/conversations', conversationData);
  },
  
  /**
   * Reply to an existing conversation
   * @param {Object} replyData - The reply data
   * @returns {Promise} Promise containing the response data
   */
  replyToConversation: async (replyData) => {
    return axios.post('/api/messages/reply', replyData);
  },
  
  /**
   * Mark a conversation as read
   * @param {string} conversationId - The conversation ID
   * @returns {Promise} Promise containing the response data
   */
  markConversationAsRead: async (conversationId) => {
    return axios.post(`/api/messages/mark-read?conversationId=${conversationId}`);
  },
  
  /**
   * Close a conversation
   * @param {string} conversationId - The conversation ID
   * @returns {Promise} Promise containing the response data
   */
  closeConversation: async (conversationId) => {
    return axios.post(`/api/messages/conversations/${conversationId}/close`);
  },
  
  /**
   * Reopen a closed conversation
   * @param {string} conversationId - The conversation ID
   * @returns {Promise} Promise containing the response data
   */
  reopenConversation: async (conversationId) => {
    return axios.post(`/api/messages/conversations/${conversationId}/reopen`);
  },
  
  /**
   * Get unread message count
   * @returns {Promise} Promise containing the response data
   */
  getUnreadCount: async () => {
    return axios.get('/api/messages/unread-count');
  },
  
  /**
   * Get all messages
   * @returns {Promise} Promise containing the response data
   */
  getAllMessages: async () => {
    return axios.get('/api/messages');
  },
  
  /**
   * Get message by ID
   * @param {string} id - The message ID
   * @returns {Promise} Promise containing the response data
   */
  getMessageById: async (id) => {
    return axios.get(`/api/messages/${id}`);
  },
  
  /**
   * Create a new message (for contact form)
   * @param {Object} messageData - The message data
   * @returns {Promise} Promise containing the response data
   */
  createMessage: async (messageData) => {
    return axios.post('/api/messages', messageData);
  },
  
  /**
   * Get messages by type
   * @param {string} type - The message type (e.g., "CANDIDATE", "CLIENT")
   * @returns {Promise} Promise containing the response data
   */
  getMessagesByType: async (type) => {
    return axios.get(`/api/messages/type/${type}`);
  },
  
  /**
   * Get unread messages
   * @returns {Promise} Promise containing the response data
   */
  getUnreadMessages: async () => {
    return axios.get('/api/messages/unread');
  },
  
  /**
   * Get unread messages by type
   * @param {string} type - The message type (e.g., "CANDIDATE", "CLIENT")
   * @returns {Promise} Promise containing the response data
   */
  getUnreadMessagesByType: async (type) => {
    return axios.get(`/api/messages/unread/type/${type}`);
  },
  
  /**
   * Mark message as read
   * @param {string} id - The message ID
   * @returns {Promise} Promise containing the response data
   */
  markMessageAsRead: async (id) => {
    return axios.patch(`/api/messages/${id}/read`);
  },
  
  /**
   * Delete message
   * @param {string} id - The message ID
   * @returns {Promise} Promise containing the response data
   */
  deleteMessage: async (id) => {
    return axios.delete(`/api/messages/${id}`);
  }
};

export default messageService;