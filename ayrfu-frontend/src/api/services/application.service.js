// src/api/services/application.service.js
import axios from 'axios';

/**
 * Service for managing job applications
 */
const applicationService = {
  /**
   * Get all applications for the current candidate
   * @returns {Promise} Promise containing the response data
   */
  getMyApplications: async () => {
    return axios.get('/api/candidates/my-applications');
  },

  /**
   * Get applications for a specific candidate
   * @param {string} candidateId - The candidate ID
   * @returns {Promise} Promise containing the response data
   */
  getCandidateApplications: async (candidateId) => {
    return axios.get(`/api/candidates/${candidateId}/applications`);
  },

  /**
   * Get application by ID
   * @param {string} applicationId - The application ID
   * @returns {Promise} Promise containing the response data
   */
  getApplicationById: async (applicationId) => {
    return axios.get(`/api/applications/${applicationId}`);
  },

  /**
   * Apply for a position
   * @param {string} candidateId - The candidate ID
   * @param {Object} applicationData - The application data
   * @returns {Promise} Promise containing the response data
   */
  applyForPosition: async (candidateId, applicationData) => {
    return axios.post(`/api/candidates/${candidateId}/applications`, applicationData);
  },

  /**
   * Update an existing application
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
   * Apply with CV upload in a single request
   * @param {string} candidateId - The candidate ID
   * @param {Object} formData - FormData containing application data and CV file
   * @returns {Promise} Promise containing the response data
   */
  applyWithCV: async (candidateId, formData) => {
    return axios.post(`/api/candidates/${candidateId}/apply-with-cv`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Add a message to an application
   * @param {string} applicationId - The application ID
   * @param {Object} messageData - The message data
   * @returns {Promise} Promise containing the response data
   */
  addApplicationMessage: async (applicationId, messageData) => {
    return axios.post(`/api/applications/${applicationId}/messages`, messageData);
  },

  /**
   * Upload a document for an application
   * @param {string} applicationId - The application ID
   * @param {File} file - The file to upload
   * @returns {Promise} Promise containing the response data
   */
  uploadApplicationDocument: async (applicationId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return axios.post(`/api/applications/${applicationId}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Get recommended positions for the current candidate
   * @returns {Promise} Promise containing the response data
   */
  getRecommendedPositions: async () => {
    return axios.get('/api/positions/recommended');
  },
};

export default applicationService;