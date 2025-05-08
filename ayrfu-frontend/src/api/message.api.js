// src/api/message.api.js
import axios from './axios';

const MessageAPI = {
  create: async (messageData) => {
    const response = await axios.post('/messages', messageData);
    return response.data;
  },
  
  // Admin functions
  getAll: async () => {
    const response = await axios.get('/messages');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await axios.get(`/messages/${id}`);
    return response.data;
  },
  
  getByType: async (type) => {
    try {
      const response = await axios.get(`/messages/type/${type}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching messages of type ${type}:`, error);
      return [];
    }
  },
  
  getUnread: async () => {
    try {
      const response = await axios.get('/messages/unread');
      return response.data;
    } catch (error) {
      console.error('Error fetching unread messages:', error);
      return [];
    }
  },
  
  getUnreadByType: async (type) => {
    try {
      const response = await axios.get(`/messages/unread/type/${type}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching unread messages of type ${type}:`, error);
      return [];
    }
  },
  
  markAsRead: async (id) => {
    const response = await axios.patch(`/messages/${id}/read`);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await axios.delete(`/messages/${id}`);
    return response.data;
  }
};

export default MessageAPI;