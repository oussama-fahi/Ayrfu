import axios from '../axios';

class CandidateService {
  getAllCandidates() {
    return axios.get('/candidates');
  }
  
  getCandidateById(id) {
    return axios.get(`/candidates/${id}`);
  }
  
  getCandidateByEmail(email) {
    return axios.get(`/candidates/email/${email}`);
  }
  
  createCandidate(candidateData) {
    return axios.post('/candidates', candidateData);
  }
  
  updateCandidate(id, candidateData) {
    return axios.put(`/candidates/${id}`, candidateData);
  }
  
  deleteCandidate(id) {
    return axios.delete(`/candidates/${id}`);
  }
  
  uploadCV(id, file) {
    const formData = new FormData();
    formData.append('file', file);
    
    return axios.post(`/candidates/${id}/cv`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
  
  applyForPosition(id, applicationData) {
    return axios.post(`/candidates/${id}/applications`, applicationData);
  }
  
  getCandidateApplications(id) {
    return axios.get(`/candidates/${id}/applications`);
  }
}

export default new CandidateService();