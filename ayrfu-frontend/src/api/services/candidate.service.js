// src/api/services/candidate.service.js
import axios from 'axios';

/**
 * Service for managing candidate data and operations
 */
const candidateService = {
  /**
   * Get all candidates (admin only)
   * @returns {Promise} Promise containing the response data
   */
  getAllCandidates: async () => {
    return axios.get('/api/candidates');
  },

  /**
   * Get a candidate by ID
   * @param {string} id - The candidate ID
   * @returns {Promise} Promise containing the response data
   */
  getCandidateById: async (id) => {
    return axios.get(`/api/candidates/${id}`);
  },

  /**
   * Get a candidate by email
   * @param {string} email - The candidate email
   * @returns {Promise} Promise containing the response data
   */
  getCandidateByEmail: async (email) => {
    return axios.get(`/api/candidates/email/${email}`);
  },

  /**
   * Create a new candidate
   * @param {Object} candidateData - The candidate data
   * @returns {Promise} Promise containing the response data
   */
  createCandidate: async (candidateData) => {
    return axios.post('/api/candidates', candidateData);
  },

  /**
   * Update an existing candidate
   * @param {string} id - The candidate ID
   * @param {Object} candidateData - The updated candidate data
   * @returns {Promise} Promise containing the response data
   */
  updateCandidate: async (id, candidateData) => {
    return axios.put(`/api/candidates/${id}`, candidateData);
  },

  /**
   * Upload a CV for a candidate
   * @param {string} id - The candidate ID
   * @param {File} file - The CV file
   * @returns {Promise} Promise containing the response data
   */
  uploadCV: async (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return axios.post(`/api/candidates/${id}/cv`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Update profile and CV in one request
   * @param {string} id - The candidate ID
   * @param {Object} candidateData - The candidate data
   * @param {File} cvFile - The CV file (optional)
   * @returns {Promise} Promise containing the response data
   */
  updateProfileWithCV: async (id, candidateData, cvFile) => {
    const formData = new FormData();
    formData.append('candidate', JSON.stringify(candidateData));
    
    if (cvFile) {
      formData.append('cv', cvFile);
    }
    
    return axios.post(`/api/candidates/${id}/update-profile-with-cv`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Apply for a position
   * @param {string} id - The candidate ID
   * @param {Object} applicationData - The application data
   * @returns {Promise} Promise containing the response data
   */
  applyForPosition: async (id, applicationData) => {
    return axios.post(`/api/candidates/${id}/applications`, applicationData);
  },

  /**
   * Get all applications for a candidate
   * @param {string} id - The candidate ID
   * @returns {Promise} Promise containing the response data
   */
  getCandidateApplications: async (id) => {
    return axios.get(`/api/candidates/${id}/applications`);
  },

  /**
   * Get application by ID
   * @param {string} candidateId - The candidate ID
   * @param {string} applicationId - The application ID
   * @returns {Promise} Promise containing the response data
   */
  getApplicationById: async (candidateId, applicationId) => {
    return axios.get(`/api/candidates/${candidateId}/applications/${applicationId}`);
  },

  /**
   * Update an application
   * @param {string} candidateId - The candidate ID
   * @param {string} applicationId - The application ID
   * @param {Object} applicationData - The updated application data
   * @returns {Promise} Promise containing the response data
   */
  updateApplication: async (candidateId, applicationId, applicationData) => {
    return axios.put(`/api/candidates/${candidateId}/applications/${applicationId}`, applicationData);
  },

  /**
   * Withdraw an application
   * @param {string} candidateId - The candidate ID
   * @param {string} applicationId - The application ID
   * @returns {Promise} Promise containing the response data
   */
  withdrawApplication: async (candidateId, applicationId) => {
    return axios.delete(`/api/candidates/${candidateId}/applications/${applicationId}`);
  },

  /**
   * Get jobs that match candidate profile
   * @param {string} id - The candidate ID
   * @returns {Promise} Promise containing the response data
   */
  getMatchingJobs: async (id) => {
    return axios.get(`/api/candidates/${id}/matching-jobs`);
  },

  /**
   * Register a new candidate
   * @param {Object} registrationData - The registration data
   * @returns {Promise} Promise containing the response data
   */
  register: async (registrationData) => {
    return axios.post('/api/auth/register/candidate', registrationData);
  },

  /**
   * Delete a candidate (admin only)
   * @param {string} id - The candidate ID
   * @returns {Promise} Promise containing the response data
   */
  deleteCandidate: async (id) => {
    return axios.delete(`/api/candidates/${id}`);
  }
};

export default candidateService;