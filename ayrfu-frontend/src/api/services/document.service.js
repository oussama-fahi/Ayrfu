// src/api/services/document.service.js
import axios from '../axios';

const documentService = {
  uploadClientDocument: async (clientId, formData) => {
    return axios.post(`/documents/clients/${clientId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  getClientDocuments: async (clientId) => {
    return axios.get(`/documents/clients/${clientId}`);
  },

  getDocumentById: async (id) => {
    return axios.get(`/documents/${id}`);
  },

  downloadDocument: async (id) => {
    return axios.get(`/documents/${id}/download`, {
      responseType: 'blob',
    });
  },

  deleteDocument: async (id) => {
    return axios.delete(`/documents/${id}`);
  }
};

export default documentService;