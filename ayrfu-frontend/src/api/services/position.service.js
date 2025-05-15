// src/api/services/position.service.js
import axios from '../axios';

const positionService = {
  // Get all positions
  getAllPositions() {
    return axios.get('/positions');
  },
  
  // Get all active positions
  getAllActivePositions() {
    return axios.get('/positions/active');
  },
  
  // Get position by ID
  getPositionById(id) {
    return axios.get(`/positions/${id}`);
  },
  
  // Create a new position
  createPosition(positionData) {
    return axios.post('/positions', positionData);
  },
  
  // Update a position
  updatePosition(id, positionData) {
    return axios.put(`/positions/${id}`, positionData);
  },
  
  // Activate a position
  activatePosition(id) {
    return axios.patch(`/positions/${id}/activate`);
  },
  
  // Deactivate a position
  deactivatePosition(id) {
    return axios.patch(`/positions/${id}/deactivate`);
  },
  
  // Delete a position
  deletePosition(id) {
    return axios.delete(`/positions/${id}`);
  },
  
  // Search positions by criteria
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
};

export default positionService;