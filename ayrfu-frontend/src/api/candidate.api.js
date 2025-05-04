import axios from './axios';

const CandidateAPI = {
  create: async (candidateData) => {
    const response = await axios.post('/candidates', candidateData);
    return response.data;
  },
  
  getById: async (id) => {
    const response = await axios.get(`/candidates/${id}`);
    return response.data;
  },
  
  getByEmail: async (email) => {
    const response = await axios.get(`/candidates/email/${email}`);
    return response.data;
  },
  
  update: async (id, candidateData) => {
    const response = await axios.put(`/candidates/${id}`, candidateData);
    return response.data;
  },
  
  uploadCV: async (id, fileData) => {
    const formData = new FormData();
    formData.append('file', fileData);
    
    const response = await axios.post(`/candidates/${id}/cv`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },
  
  applyForPosition: async (id, applicationData) => {
    const response = await axios.post(`/candidates/${id}/applications`, applicationData);
    return response.data;
  },
  
  getApplications: async (id) => {
    const response = await axios.get(`/candidates/${id}/applications`);
    return response.data;
  }
};

export default CandidateAPI;