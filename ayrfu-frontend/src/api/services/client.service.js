//src/api/services/client.service.js
import axios from '../axios';

const clientService = {
  getAllClients: async () => {
    return axios.get('/clients');
  },

  getClientById: async (id) => {
    return axios.get(`/clients/${id}`);
  },

  getClientByEmail: async (email) => {
    return axios.get(`/clients/email/${email}`);
  },

  getCurrentClient: async () => {
    return axios.get('/users/profile/client');
  },

  createClient: async (clientData) => {
    return axios.post('/clients', clientData);
  },

  updateClient: async (id, clientData) => {
    return axios.put(`/clients/${id}`, clientData);
  },

  deleteClient: async (id) => {
    return axios.delete(`/clients/${id}`);
  }
};

export default clientService;