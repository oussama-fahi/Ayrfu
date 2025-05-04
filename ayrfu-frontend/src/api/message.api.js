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
    const response = await axios.get(`/messages/type/${type}`);
    return response.data;
  },
  
  getUnread: async () => {
    const response = await axios.get('/messages/unread');
    return response.data;
  },
  
  getUnreadByType: async (type) => {
    const response = await axios.get(`/messages/unread/type/${type}`);
    return response.data;
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