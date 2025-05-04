import axios from './axios';

const ServiceAPI = {
  getAllActive: async () => {
    const response = await axios.get('/services/active');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await axios.get(`/services/${id}`);
    return response.data;
  },
  
  searchByKeywords: async (keywords) => {
    const keywordsParam = keywords.join(',');
    const response = await axios.get(`/services/search?keywords=${keywordsParam}`);
    return response.data;
  },
  
  searchByPrompt: async (prompt) => {
    const response = await axios.get(`/services/prompt/search?prompt=${encodeURIComponent(prompt)}`);
    return response.data;
  },
  
  // Admin functions
  create: async (serviceData) => {
    const response = await axios.post('/services', serviceData);
    return response.data;
  },
  
  update: async (id, serviceData) => {
    const response = await axios.put(`/services/${id}`, serviceData);
    return response.data;
  },
  
  activate: async (id) => {
    const response = await axios.patch(`/services/${id}/activate`);
    return response.data;
  },
  
  deactivate: async (id) => {
    const response = await axios.patch(`/services/${id}/deactivate`);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await axios.delete(`/services/${id}`);
    return response.data;
  }
};

export default ServiceAPI;
