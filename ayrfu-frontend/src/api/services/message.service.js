import axios from '../axios';

class MessageService {
  getAllMessages() {
    return axios.get('/messages');
  }
  
  getMessageById(id) {
    return axios.get(`/messages/${id}`);
  }
  
  createMessage(messageData) {
    return axios.post('/messages', messageData);
  }
  
  getMessagesByType(type) {
    return axios.get(`/messages/type/${type}`);
  }
  
  getUnreadMessages() {
    return axios.get('/messages/unread');
  }
  
  getUnreadMessagesByType(type) {
    return axios.get(`/messages/unread/type/${type}`);
  }
  
  markMessageAsRead(id) {
    return axios.patch(`/messages/${id}/read`);
  }
  
  deleteMessage(id) {
    return axios.delete(`/messages/${id}`);
  }
}

export default new MessageService();