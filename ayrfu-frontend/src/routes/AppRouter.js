import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import AdminLayout from '../components/layout/AdminLayout';
import HomePage from '../pages/public/HomePage';
import ApplicantsPage from '../pages/public/ApplicantsPage';
import ClientsPage from '../pages/public/ClientsPage';
import PositionsPage from '../pages/public/PositionsPage';
import ServicesPage from '../pages/public/ServicesPage';
import ContactPage from '../pages/public/ContactPage';
import LoginPage from '../pages/public/LoginPage';
import NotFoundPage from '../pages/public/NotFoundPage';
import DashboardPage from '../pages/admin/DashboardPage';
import ManagePositionsPage from '../pages/admin/ManagePositionsPage';
import ManageServicesPage from '../pages/admin/ManageServicesPage';
import ManageMessagesPage from '../pages/admin/ManageMessagesPage';
import ProtectedRoute from './ProtectedRoute';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/applicants" element={<ApplicantsPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/positions" element={<PositionsPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>
        
        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<DashboardPage />} />
            <Route path="/admin/positions" element={<ManagePositionsPage />} />
            <Route path="/admin/services" element={<ManageServicesPage />} />
            <Route path="/admin/messages" element={<ManageMessagesPage />} />
          </Route>
        </Route>
        
        {/* Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;