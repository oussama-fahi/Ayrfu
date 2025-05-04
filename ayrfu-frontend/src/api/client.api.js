import axios from './axios';

const ClientAPI = {
  create: async (clientData) => {
    const response = await axios.post('/clients', clientData);
    return response.data;
  },
  
  getById: async (id) => {
    const response = await axios.get(`/clients/${id}`);
    return response.data;
  },
  
  getByEmail: async (email) => {
    const response = await axios.get(`/clients/email/${email}`);
    return response.data;
  },
  
  update: async (id, clientData) => {
    const response = await axios.put(`/clients/${id}`, clientData);
    return response.data;
  }
};

export default ClientAPI;