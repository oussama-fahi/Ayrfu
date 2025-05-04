import axios from '../axios';

class PositionService {
  getAllPositions() {
    return axios.get('/positions');
  }
  
  getAllActivePositions() {
    return axios.get('/positions/active');
  }
  
  getPositionById(id) {
    return axios.get(`/positions/${id}`);
  }
  
  createPosition(positionData) {
    return axios.post('/positions', positionData);
  }
  
  updatePosition(id, positionData) {
    return axios.put(`/positions/${id}`, positionData);
  }
  
  activatePosition(id) {
    return axios.patch(`/positions/${id}/activate`);
  }
  
  deactivatePosition(id) {
    return axios.patch(`/positions/${id}/deactivate`);
  }
  
  deletePosition(id) {
    return axios.delete(`/positions/${id}`);
  }
  
  searchPositions(criteria) {
    const { technology, location, experienceLevel, workModel, languages } = criteria;
    let queryParams = new URLSearchParams();
    
    if (technology) queryParams.append('technology', technology);
    if (location) queryParams.append('location', location);
    if (experienceLevel) queryParams.append('experienceLevel', experienceLevel);
    if (workModel) queryParams.append('workModel', workModel);
    
    if (languages && languages.length > 0) {
      languages.forEach(lang => queryParams.append('languages', lang));
    }
    
    return axios.get(`/positions/search?${queryParams.toString()}`);
  }
}

export default new PositionService();