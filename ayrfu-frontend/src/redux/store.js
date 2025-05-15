// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import candidatesReducer from './slices/candidatesSlice';
import positionsReducer from './slices/positionsSlice';
import servicesReducer from './slices/servicesSlice';
import messagesReducer from './slices/messagesSlice';
import applicationsReducer from './slices/applicationsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    candidates: candidatesReducer,
    positions: positionsReducer,
    services: servicesReducer,
    messages: messagesReducer,
    applications: applicationsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for file objects
    }),
});

export default store;