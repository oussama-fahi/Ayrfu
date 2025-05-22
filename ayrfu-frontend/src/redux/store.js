// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import applicationsReducer from './slices/applicationsSlice';
import authReducer from './slices/authSlice';
import candidatesReducer from './slices/candidatesSlice';
import documentsReducer from './slices/documentsSlice';
import messagesReducer from './slices/messagesSlice';
import positionsReducer from './slices/positionsSlice';
import servicesReducer from './slices/servicesSlice';
import serviceRequestsReducer from './slices/serviceRequestsSlice';
import conversationsReducer from './slices/conversationsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    candidates: candidatesReducer,
    positions: positionsReducer,
    services: servicesReducer,
    serviceRequests: serviceRequestsReducer,
    documents: documentsReducer,
    messages: messagesReducer,
    applications: applicationsReducer,
    conversations: conversationsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;