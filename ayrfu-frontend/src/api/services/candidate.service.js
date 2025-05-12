import axios from '../axios';

/**
 * Service for all candidate-related API operations
 */
class CandidateService {
  /**
   * Fetches all candidates
   * @returns {Promise} Promise with candidates data
   */
  getAllCandidates() {
    return axios.get('/candidates');
  }

  /**
   * Fetch a candidate by their ID
   * @param {number} id - Candidate ID
   * @returns {Promise} Promise with candidate data
   */
  getCandidateById(id) {
    return axios.get(`/candidates/${id}`);
  }

  /**
   * Fetch a candidate by their email
   * @param {string} email - Candidate email
   * @returns {Promise} Promise with candidate data
   */
  getCandidateByEmail(email) {
    return axios.get(`/candidates/email/${email}`);
  }

  /**
   * Create a new candidate profile
   * @param {Object} candidateData - Candidate data
   * @returns {Promise} Promise with created candidate data
   */
  createCandidate(candidateData) {
    return axios.post('/candidates', candidateData);
  }

  /**
   * Update a candidate's profile
   * @param {number} id - Candidate ID
   * @param {Object} candidateData - Updated candidate data
   * @returns {Promise} Promise with updated candidate data
   */
  updateCandidate(id, candidateData) {
    return axios.put(`/candidates/${id}`, candidateData);
  }

  /**
   * Upload a CV for a candidate
   * @param {number} id - Candidate ID
   * @param {File} file - CV file
   * @returns {Promise} Promise with upload result
   */
  uploadCV(id, file) {
    const formData = new FormData();
    formData.append('file', file);
    return axios.post(`/candidates/${id}/cv`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  /**
   * Apply for a position
   * @param {number} id - Candidate ID
   * @param {Object} applicationData - Application data including positionId
   * @returns {Promise} Promise with application data
   */
  applyForPosition(id, applicationData) {
    return axios.post(`/candidates/${id}/applications`, applicationData);
  }

  /**
   * Get all applications for a candidate
   * @param {number} id - Candidate ID
   * @returns {Promise} Promise with candidate's applications
   */
  getCandidateApplications(id) {
    return axios.get(`/candidates/${id}/applications`);
  }

  /**
   * Get current candidate's applications
   * @returns {Promise} Promise with candidate's applications
   */
  getMyApplications() {
    return axios.get('/applications/my-applications');
  }
  
  /**
   * Get application details by ID
   * @param {number} id - Application ID
   * @returns {Promise} Promise with application details
   */
  getApplicationById(id) {
    return axios.get(`/applications/${id}`);
  }

  /**
   * Add a message to an application
   * @param {number} applicationId - Application ID
   * @param {string} content - Message content
   * @returns {Promise} Promise with message data
   */
  addApplicationMessage(applicationId, content) {
    return axios.post('/applications/messages', {
      applicationId,
      content
    });
  }

  /**
   * Add a message with attachment to an application
   * @param {number} applicationId - Application ID
   * @param {string} content - Message content
   * @param {File} file - Attachment file
   * @returns {Promise} Promise with message data
   */
  addApplicationMessageWithAttachment(applicationId, content, file) {
    const formData = new FormData();
    formData.append('file', file);
    
    const url = `/applications/messages/with-attachment?applicationId=${applicationId}&content=${encodeURIComponent(content)}`;
    return axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  /**
   * Withdraw an application
   * @param {number} id - Application ID
   * @returns {Promise} Promise with updated application
   */
  withdrawApplication(id) {
    return axios.post(`/applications/${id}/withdraw`);
  }

  /**
   * Get recommended positions for the candidate
   * @returns {Promise} Promise with recommended positions
   */
  getRecommendedPositions() {
    return axios.get('/positions/recommended');
  }
}

export default new CandidateService();