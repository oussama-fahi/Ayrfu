// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import positionsReducer from './slices/positionsSlice';
import servicesReducer from './slices/servicesSlice';
import authReducer from './slices/authSlice';
import candidatesReducer from './slices/candidatesSlice';
import messagesReducer from './slices/messagesSlice';

export const store = configureStore({
  reducer: {
    positions: positionsReducer,
    services: servicesReducer,
    auth: authReducer,
    candidates: candidatesReducer,
    messages: messagesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;