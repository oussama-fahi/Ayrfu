import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from './redux/slices/authSlice';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import MainPage from './pages/public/MainPage';
import ApplicantsPage from './pages/public/ApplicantsPage';
import ClientsPage from './pages/public/ClientsPage';
import PositionDetailPage from './pages/public/PositionDetailPage';
import ServiceDetailPage from './pages/public/ServiceDetailPage';
import ApplyPage from './pages/public/ApplyPage';
import ContactPage from './pages/public/ContactPage';
import NotFoundPage from './pages/public/NotFoundPage';

// Admin Pages
import LoginPage from './pages/admin/LoginPage';
import Dashboard from './pages/admin/Dashboard';
import PositionManagement from './pages/admin/PositionManagement';
import PositionForm from './pages/admin/PositionForm';
import ServiceManagement from './pages/admin/ServiceManagement';
import ServiceForm from './pages/admin/ServiceForm';
import CandidateMessagesPage from './pages/admin/CandidateMessagesPage';
import ClientMessagesPage from './pages/admin/ClientMessagesPage';

// Routes
import ProtectedRoute from './routes/ProtectedRoute';

// Theme configuration
const theme = createTheme({
  palette: {
    primary: {
      main: '#5e35b1', // Main Purple
    },
    secondary: {
      main: '#2e7d32', // Green for client sections
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
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  
  useEffect(() => {
    if (token) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, token]);
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<MainPage />} />
            <Route path="applicants" element={<ApplicantsPage />} />
            <Route path="clients" element={<ClientsPage />} />
            <Route path="positions/:id" element={<PositionDetailPage />} />
            <Route path="services/:id" element={<ServiceDetailPage />} />
            <Route path="apply/:positionId?" element={<ApplyPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          
          {/* Admin Login */}
          <Route path="/admin/login" element={<LoginPage />} />
          
          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              
              <Route path="positions" element={<PositionManagement />} />
              <Route path="positions/create" element={<PositionForm />} />
              <Route path="positions/edit/:id" element={<PositionForm />} />
              
              <Route path="services" element={<ServiceManagement />} />
              <Route path="services/create" element={<ServiceForm />} />
              <Route path="services/edit/:id" element={<ServiceForm />} />
              
              <Route path="messages/candidates" element={<CandidateMessagesPage />} />
              <Route path="messages/clients" element={<ClientMessagesPage />} />
              
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Route>
          
          {/* Fallback redirect */}
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;