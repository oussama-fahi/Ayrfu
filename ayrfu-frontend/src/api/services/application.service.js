// src/api/services/application.service.js
import axios from '../axios';


const applicationService = {

  getMyApplications: async () => {
    return axios.get('/candidates/my-applications');
  },


  getCandidateApplications: async (candidateId) => {
    return axios.get(`/candidates/${candidateId}/applications`);
  },


  getApplicationById: async (applicationId) => {
    return axios.get(`/applications/${applicationId}`);
  },


  applyForPosition: async (candidateId, applicationData) => {
    return axios.post(`/candidates/${candidateId}/applications`, applicationData);
  },

  updateApplication: async (candidateId, applicationId, applicationData) => {
    return axios.put(`/candidates/${candidateId}/applications/${applicationId}`, applicationData);
  },

  withdrawApplication: async (candidateId, applicationId) => {
    return axios.delete(`/candidates/${candidateId}/applications/${applicationId}`);
  },


  applyWithCV: async (candidateId, formData) => {
    return axios.post(`/candidates/${candidateId}/apply-with-cv`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  addApplicationMessage: async (applicationId, messageData) => {
    return axios.post(`/applications/${applicationId}/messages`, messageData);
  },


  uploadApplicationDocument: async (applicationId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return axios.post(`/applications/${applicationId}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  getRecommendedPositions: async () => {
    return axios.get('/positions/recommended');
  },
};

export default applicationService;