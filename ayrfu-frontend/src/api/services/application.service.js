import axios from '../axios';

class ApplicationService {
  getAllApplications() {
    return axios.get('/applications');
  }
  
  getApplicationById(id) {
    return axios.get(`/applications/${id}`);
  }
  
  createApplication(candidateId, applicationData) {
    return axios.post(`/applications/candidates/${candidateId}`, applicationData);
  }
  
  getApplicationsByCandidate(candidateId) {
    return axios.get(`/applications/candidates/${candidateId}`);
  }
  
  getApplicationsByPosition(positionId) {
    return axios.get(`/applications/positions/${positionId}`);
  }
  
  getApplicationsByStatus(status) {
    return axios.get(`/applications/status/${status}`);
  }
  
  updateApplicationStatus(id, status) {
    return axios.patch(`/applications/${id}/status?status=${status}`);
  }
  
  deleteApplication(id) {
    return axios.delete(`/applications/${id}`);
  }
}

export default new ApplicationService();