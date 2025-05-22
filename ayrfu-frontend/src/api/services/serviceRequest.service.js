import axios from '../axios';

const serviceRequestService = {
  createServiceRequest: async (requestData) => {
    return axios.post('/service-requests', requestData);
  },

  getServiceRequestById: async (id) => {
    return axios.get(`/service-requests/${id}`);
  },

  getServiceRequestsByClient: async (clientId, page = 0, size = 20) => {
    return axios.get(`/service-requests/clients/${clientId}?page=${page}&size=${size}`);
  },

  getCurrentClientServiceRequests: async (page = 0, size = 20) => {
    return axios.get(`/service-requests/my-requests?page=${page}&size=${size}`);
  },

  getServiceRequestsByStatus: async (status, page = 0, size = 20) => {
    return axios.get(`/service-requests/status/${status}?page=${page}&size=${size}`);
  },

  updateServiceRequestStatus: async (id, status) => {
    return axios.patch(`/service-requests/${id}/status?status=${status}`);
  },

  deleteServiceRequest: async (id) => {
    return axios.delete(`/service-requests/${id}`);
  }
};

export default serviceRequestService;