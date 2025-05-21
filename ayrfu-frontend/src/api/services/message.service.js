import axios from '../axios';

const messageService = {
  getAllMessages: async () => {
    return axios.get('/messages');
  },
  
  getMessagesByType: async (type) => {
    return axios.get(`/messages/type/${type}`);
  },
  
  getUnreadMessages: async () => {
    return axios.get('/messages/unread');
  },
  
  getUnreadMessagesByType: async (type) => {
    return axios.get(`/messages/unread/type/${type}`);
  },
  
  getUnreadCount: async () => {
    return axios.get('/messages/unread/count');
  },
  
  getMessageById: async (id) => {
    return axios.get(`/messages/${id}`);
  },
  
  createMessage: async (messageData) => {
    return axios.post('/messages', messageData);
  },
  
  markMessageAsRead: async (id) => {
    return axios.patch(`/messages/${id}/read`);
  },
  
  markMultipleAsRead: async (messageIds) => {
    return axios.post('/messages/mark-read', { messageIds });
  },
  
  deleteMessage: async (id) => {
    return axios.delete(`/messages/${id}`);
  },
  
  searchMessages: async (searchText) => {
    return axios.get(`/messages/search?searchText=${encodeURIComponent(searchText)}`);
  }
};

export default messageService;