import axios from '../axios';

const conversationService = {
  getAllConversations: async () => {
    return axios.get('/conversations');
  },
  
  getConversationDetails: async (conversationId) => {
    return axios.get(`/conversations/${conversationId}`);
  },
  
  getConversationMessages: async (conversationId) => {
    return axios.get(`/conversations/${conversationId}/messages`);
  },
  
  startConversation: async (conversationData) => {
    return axios.post('/conversations', conversationData);
  },
  
  sendMessage: async (conversationId, formData) => {
    return axios.post(`/conversations/${conversationId}/messages`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  markAllAsRead: async (conversationId) => {
    return axios.patch(`/conversations/${conversationId}/mark-all-read`);
  },
  
  getUnreadCount: async () => {
    return axios.get('/messages/unread/count');
  }
};

export default conversationService;