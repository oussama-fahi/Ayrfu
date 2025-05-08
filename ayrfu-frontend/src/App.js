import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, CircularProgress } from '@mui/material';

// Import Auth Provider
import { AuthProvider } from './hooks/useAuth';
import { useAuth } from './hooks/useAuth';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import CandidateLayout from './layouts/CandidateLayout';
import ClientLayout from './layouts/ClientLayout';

// Public Pages
import MainPage from './pages/public/MainPage';
import ApplicantsPage from './pages/public/ApplicantsPage';
import ClientsPage from './pages/public/ClientsPage';
import PositionDetailPage from './pages/public/PositionDetailPage';
import ServiceDetailPage from './pages/public/ServiceDetailPage';
import ApplyPage from './pages/public/ApplyPage';
import ContactPage from './pages/public/ContactPage';
import NotFoundPage from './pages/public/NotFoundPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import PositionsPage from './pages/public/PositionsPage';

// User Pages
import UserProfilePage from './pages/user/UserProfilePage';
import UserApplicationsPage from './pages/user/UserApplicationsPage';

// Candidate Pages
import CandidateDashboardPage from './pages/candidate/CandidateDashboardPage';
import CandidateApplicationsPage from './pages/candidate/CandidateApplicationsPage';
import CandidateApplicationDetailPage from './pages/candidate/CandidateApplicationDetailPage';
import CandidateMessagesPage from './pages/candidate/CandidateMessagesPage';

// Client Pages
import ClientDashboardPage from './pages/client/ClientDashboardPage';
import ClientServicesPage from './pages/client/ClientServicesPage';
import ClientServiceRequestPage from './pages/client/ClientServiceRequestPage';
import ClientRequestDetailPage from './pages/client/ClientRequestDetailPage';
import ClientMessagesPage from './pages/client/ClientMessagesPage';
import ClientDocumentsPage from './pages/client/ClientDocumentsPage';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import PositionManagement from './pages/admin/PositionManagement';
import PositionForm from './pages/admin/PositionForm';
import ServiceManagement from './pages/admin/ServiceManagement';
import ServiceForm from './pages/admin/ServiceForm';
import AdminCandidateMessagesPage from './pages/admin/AdminCandidateMessagesPage';
import AdminClientMessagesPage from './pages/admin/AdminClientMessagesPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import SuperAdminUserManagementPage from './pages/admin/SuperAdminUserManagementPage';

// Protected Route Components
const AuthRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

const RoleRoute = ({ children, roles = [] }) => {
  const { user, hasRole, isLoading, isAuthenticated } = useAuth();
  
  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Check if user has any of the required roles
  const hasRequiredRole = roles.length === 0 || roles.some(role => hasRole(role));
  
  if (!hasRequiredRole) {
    // Redirect based on user's role
    if (hasRole('ROLE_ADMIN') || hasRole('ROLE_SUPER_USER')) {
      return <Navigate to="/admin/dashboard" />;
    } else if (hasRole('ROLE_CANDIDATE')) {
      return <Navigate to="/candidate/dashboard" />;
    } else if (hasRole('ROLE_CLIENT')) {
      return <Navigate to="/client/dashboard" />;
    }
    return <Navigate to="/" />;
  }
  
  return children;
};

// Theme configuration
const theme = createTheme({
  palette: {
    primary: {
      main: '#007aff', // Main Purple
    },
    secondary: {
      main: '#01e8c8', // Green for client sections
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<MainPage />} />
              <Route path="applicants" element={<ApplicantsPage />} />
              <Route path="clients" element={<ClientsPage />} />
              <Route path="positions" element={<PositionsPage />} />
              <Route path="positions/:id" element={<PositionDetailPage />} />
              <Route path="services/:id" element={<ServiceDetailPage />} />
              <Route path="apply/:positionId?" element={<ApplyPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              
              {/* Protected User Routes */}
              <Route path="user">
                <Route 
                  path="profile" 
                  element={
                    <AuthRoute>
                      <UserProfilePage />
                    </AuthRoute>
                  } 
                />
                <Route 
                  path="applications" 
                  element={
                    <AuthRoute>
                      <UserApplicationsPage />
                    </AuthRoute>
                  } 
                />
              </Route>
              
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* Admin Login Page (outside of admin layout) */}
            <Route path="/admin/login" element={<LoginPage />} />

            {/* Candidate Routes */}
            <Route 
              path="/candidate" 
              element={
                <RoleRoute roles={['ROLE_CANDIDATE']}>
                  <CandidateLayout />
                </RoleRoute>
              }
            >
              <Route index element={<Navigate to="/candidate/dashboard" replace />} />
              <Route path="dashboard" element={<CandidateDashboardPage />} />
              <Route path="applications" element={<CandidateApplicationsPage />} />
              <Route path="applications/:id" element={<CandidateApplicationDetailPage />} />
              <Route path="messages" element={<CandidateMessagesPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* Client Routes */}
            <Route 
              path="/client" 
              element={
                <RoleRoute roles={['ROLE_CLIENT']}>
                  <ClientLayout />
                </RoleRoute>
              }
            >
              <Route index element={<Navigate to="/client/dashboard" replace />} />
              <Route path="dashboard" element={<ClientDashboardPage />} />
              <Route path="services" element={<ClientServicesPage />} />
              <Route path="services/request" element={<ClientServiceRequestPage />} />
              <Route path="requests/:id" element={<ClientRequestDetailPage />} />
              <Route path="messages" element={<ClientMessagesPage />} />
              <Route path="documents" element={<ClientDocumentsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* Admin Routes (all protected) */}
            <Route 
              path="/admin" 
              element={
                <RoleRoute roles={['ROLE_ADMIN', 'ROLE_SUPER_USER']}>
                  <AdminLayout />
                </RoleRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="positions" element={<PositionManagement />} />
              <Route path="positions/create" element={<PositionForm />} />
              <Route path="positions/edit/:id" element={<PositionForm />} />
              <Route path="services" element={<ServiceManagement />} />
              <Route path="services/create" element={<ServiceForm />} />
              <Route path="services/edit/:id" element={<ServiceForm />} />
              <Route path="messages/candidates" element={<AdminCandidateMessagesPage />} />
              <Route path="messages/clients" element={<AdminClientMessagesPage />} />
              <Route path="users" element={<UserManagementPage />} />
              <Route 
                path="admins" 
                element={
                  <RoleRoute roles={['ROLE_SUPER_USER']}>
                    <SuperAdminUserManagementPage />
                  </RoleRoute>
                } 
              />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;