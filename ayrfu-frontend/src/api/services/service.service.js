import axios from '../axios';

const serviceService = {
  getAllServices: async () => {
    return axios.get('/services');
  },

  getAllActiveServices: async () => {
    return axios.get('/services/active');
  },

  getServiceById: async (id) => {
    return axios.get(`/services/${id}`);
  },

  createService: async (serviceData) => {
    return axios.post('/services', serviceData);
  },

  updateService: async (id, serviceData) => {
    return axios.put(`/services/${id}`, serviceData);
  },

  activateService: async (id) => {
    return axios.patch(`/services/${id}/activate`);
  },

  deactivateService: async (id) => {
    return axios.patch(`/services/${id}/deactivate`);
  },

  deleteService: async (id) => {
    return axios.delete(`/services/${id}`);
  },

  searchServicesByKeywords: async (keywords) => {
    let queryParams = new URLSearchParams();
    keywords.forEach(keyword => queryParams.append('keywords', keyword));
    return axios.get(`/services/search?${queryParams.toString()}`);
  },

  searchServicesByPrompt: async (prompt) => {
    return axios.get(`/services/prompt/search?prompt=${encodeURIComponent(prompt)}`);
  }
};

export default serviceService;