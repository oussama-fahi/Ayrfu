import axios from './axios';

const PositionAPI = {
  getAllActive: async () => {
    const response = await axios.get('/positions/active');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await axios.get(`/positions/${id}`);
    return response.data;
  },
  
  search: async (params) => {
    const searchParams = new URLSearchParams();
    
    if (params.technology) {
      searchParams.append('technology', params.technology);
    }
    
    if (params.location) {
      searchParams.append('location', params.location);
    }
    
    if (params.experienceLevel) {
      searchParams.append('experienceLevel', params.experienceLevel);
    }
    
    if (params.workModel) {
      searchParams.append('workModel', params.workModel);
    }
    
    if (params.languages && params.languages.length > 0) {
      params.languages.forEach(lang => {
        searchParams.append('languages', lang);
      });
    }
    
    const response = await axios.get(`/positions/search?${searchParams.toString()}`);
    return response.data;
  },
  
  // Admin functions
  create: async (positionData) => {
    const response = await axios.post('/positions', positionData);
    return response.data;
  },
  
  update: async (id, positionData) => {
    const response = await axios.put(`/positions/${id}`, positionData);
    return response.data;
  },
  
  activate: async (id) => {
    const response = await axios.patch(`/positions/${id}/activate`);
    return response.data;
  },
  
  deactivate: async (id) => {
    const response = await axios.patch(`/positions/${id}/deactivate`);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await axios.delete(`/positions/${id}`);
    return response.data;
  }
};

export default PositionAPI;
