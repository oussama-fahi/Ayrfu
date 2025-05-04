import axios from '../axios';

class ServiceService {
  getAllServices() {
    return axios.get('/services');
  }
  
  getAllActiveServices() {
    return axios.get('/services/active');
  }
  
  getServiceById(id) {
    return axios.get(`/services/${id}`);
  }
  
  createService(serviceData) {
    return axios.post('/services', serviceData);
  }
  
  updateService(id, serviceData) {
    return axios.put(`/services/${id}`, serviceData);
  }
  
  activateService(id) {
    return axios.patch(`/services/${id}/activate`);
  }
  
  deactivateService(id) {
    return axios.patch(`/services/${id}/deactivate`);
  }
  
  deleteService(id) {
    return axios.delete(`/services/${id}`);
  }
  
  searchServicesByKeywords(keywords) {
    let queryParams = new URLSearchParams();
    keywords.forEach(keyword => queryParams.append('keywords', keyword));
    return axios.get(`/services/search?${queryParams.toString()}`);
  }
  
  searchServicesByPrompt(prompt) {
    return axios.get(`/services/prompt/search?prompt=${encodeURIComponent(prompt)}`);
  }
}

export default new ServiceService();