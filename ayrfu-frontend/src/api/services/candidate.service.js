// src/api/services/candidate.service.js
import axios from '../axios';


const candidateService = {

  getAllCandidates: async () => {
    return axios.get('/candidates');
  },


  getCandidateById: async (id) => {
    return axios.get(`/candidates/${id}`);
  },


  getCandidateByEmail: async (email) => {
    return axios.get(`/candidates/email/${email}`);
  },

  createCandidate: async (candidateData) => {
    return axios.post('/candidates', candidateData);
  },


  updateCandidate: async (id, candidateData) => {
    return axios.put(`/candidates/${id}`, candidateData);
  },

 
  uploadCV: async (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return axios.post(`/candidates/${id}/cv`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },


  updateProfileWithCV: async (id, candidateData, cvFile) => {
    const formData = new FormData();
    formData.append('candidate', JSON.stringify(candidateData));
    
    if (cvFile) {
      formData.append('cv', cvFile);
    }
    
    return axios.post(`/candidates/${id}/update-profile-with-cv`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },


  applyForPosition: async (id, applicationData) => {
    return axios.post(`/candidates/${id}/applications`, applicationData);
  },

  getCandidateApplications: async (id) => {
    return axios.get(`/candidates/${id}/applications`);
  },

  getApplicationById: async (candidateId, applicationId) => {
    return axios.get(`/candidates/${candidateId}/applications/${applicationId}`);
  },

 
  updateApplication: async (candidateId, applicationId, applicationData) => {
    return axios.put(`/candidates/${candidateId}/applications/${applicationId}`, applicationData);
  },

 
  withdrawApplication: async (candidateId, applicationId) => {
    return axios.delete(`/candidates/${candidateId}/applications/${applicationId}`);
  },

  getMatchingJobs: async (id) => {
    return axios.get(`/candidates/${id}/matching-jobs`);
  },

  
  register: async (registrationData) => {
    return axios.post('/auth/register/candidate', registrationData);
  },

 
  deleteCandidate: async (id) => {
    return axios.delete(`/candidates/${id}`);
  }
};

export default candidateService;