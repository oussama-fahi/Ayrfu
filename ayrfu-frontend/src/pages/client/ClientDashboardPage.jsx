import BusinessIcon from '@mui/icons-material/Business';
import DescriptionIcon from '@mui/icons-material/Description';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import { Box, Button, CircularProgress, Grid, Paper, Stack, Typography, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import DocumentUploadForm from '../../components/documents/DocumentUploadForm';
import { fetchCurrentClient } from '../../redux/slices/clientsSlice';
import { fetchConversations } from '../../redux/slices/conversationsSlice';
import { downloadDocument, fetchRecentDocuments } from '../../redux/slices/documentsSlice';
import { fetchUnreadMessages } from '../../redux/slices/messagesSlice';
import { getCurrentClientServiceRequests } from '../../redux/slices/serviceRequestsSlice';
import { fetchActiveServices } from '../../redux/slices/servicesSlice';

const ClientDashboardPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();

  const { user } = useSelector(state => state.auth);
  const { currentClient } = useSelector(state => state.clients);
  const { serviceRequests, isLoading: requestsLoading } = useSelector(state => state.serviceRequests);
  const { services, isLoading: servicesLoading } = useSelector(state => state.services);
  const { messages, isLoading: messagesLoading } = useSelector(state => state.messages);
  const { documents, isLoading: documentsLoading } = useSelector(state => state.documents);

  const isLoading = requestsLoading || servicesLoading || messagesLoading || documentsLoading;
  const [documentUploadOpen, setDocumentUploadOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchCurrentClient());
    dispatch(getCurrentClientServiceRequests({}));
    dispatch(fetchActiveServices());
    dispatch(fetchRecentDocuments());
    dispatch(fetchUnreadMessages());
    dispatch(fetchConversations());
  }, [dispatch]);

  const requestStats = {
    total: serviceRequests?.length || 0,
    pending: serviceRequests?.filter(req => req.status === 'PENDING').length || 0,
    inProgress: serviceRequests?.filter(req => req.status === 'IN_REVIEW' || req.status === 'ACCEPTED').length || 0,
    completed: serviceRequests?.filter(req => req.status === 'COMPLETED').length || 0,
    rejected: serviceRequests?.filter(req => req.status === 'REJECTED').length || 0
  };

  const pieChartData = [
    { name: 'Pending', value: requestStats.pending, color: theme.palette.primary.main },
    { name: 'In Progress', value: requestStats.inProgress, color: theme.palette.warning.main },
    { name: 'Completed', value: requestStats.completed, color: theme.palette.success.main },
    { name: 'Rejected', value: requestStats.rejected, color: theme.palette.error.main }
  ].filter(item => item.value > 0);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'primary';
      case 'IN_REVIEW': return 'warning';
      case 'ACCEPTED': return 'info';
      case 'COMPLETED': return 'success';
      case 'REJECTED': return 'error';
      default: return 'default';
    }
  };

  const handleOpenDocumentUpload = () => {
    setDocumentUploadOpen(true);
  };

  const handleCloseDocumentUpload = (success) => {
    setDocumentUploadOpen(false);
    if (success) {
      dispatch(fetchRecentDocuments());
    }
  };

  const handleDownloadDocument = (documentId) => {
    dispatch(downloadDocument(documentId));
  };

  if (isLoading) {
    return (
      <Box sx={{ py: 4, textAlign: 'center', height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box>
          <CircularProgress color="secondary" size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>Loading your dashboard data...</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      <Paper elevation={0} sx={{
        p: 4, mb: 4, borderRadius: 2,
        background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.light, 0.8)} 0%, ${alpha(theme.palette.secondary.main, 0.8)} 100%)`,
        color: 'white', position: 'relative', overflow: 'hidden'
      }}>
        <Box sx={{ position: 'absolute', top: 0, right: 0, width: '30%', height: '100%', opacity: 0.1 }}>
          <BusinessIcon sx={{ fontSize: 180, position: 'absolute', top: '50%', right: -20, transform: 'translateY(-50%)' }} />
        </Box>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={7}>
            <Typography variant="h4" fontWeight="bold" sx={theme.gradientTextStyle} gutterBottom>
              Welcome back, {currentClient?.companyName || user?.fullName || 'Client'}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, maxWidth: '90%'}} color="inherit" >
              Manage your service requests, documents, and communications with UDDAN all in one place.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<MiscellaneousServicesIcon />}
                onClick={() => navigate('/client/services')}
                sx={{ px: 3, py: 1.2, color: 'white', background: theme.palette.primary.main, '&:hover': { background: theme.palette.primary.dark } }}
              >
                Browse Services
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                size="large"
                startIcon={<RequestQuoteIcon />}
                onClick={() => navigate('/client/requests')}
                sx={{ px: 3, py: 1.2, borderColor: 'white', '&:hover': { background: 'rgba(255,255,255,0.1)', borderColor: 'white' } }}
              >
                View Requests
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                <Paper
                  elevation={6}
                  sx={{
                    p: 1.5, bgcolor: 'white', color: 'text.primary', borderRadius: 2,
                    width: 120, height: 120, display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s',
                    '&:hover': { transform: 'scale(1.05)' }, cursor: 'pointer'
                  }}
                  onClick={() => navigate('/client/services')}
                >
                  <MiscellaneousServicesIcon color="secondary" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="body2" align="center">
                    <strong>{services?.length || 0}</strong><br />Services
                  </Typography>
                </Paper>
                <Paper
                  elevation={6}
                  sx={{
                    p: 1.5, bgcolor: 'white', color: 'text.primary', borderRadius: 2,
                    width: 120, height: 120, display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s',
                    '&:hover': { transform: 'scale(1.05)' }, cursor: 'pointer'
                  }}
                  onClick={() => navigate('/client/requests')}
                >
                  <RequestQuoteIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="body2" align="center">
                    <strong>{requestStats.total}</strong><br />Requests
                  </Typography>
                </Paper>
                <Paper
                  elevation={6}
                  sx={{
                    p: 1.5, bgcolor: 'white', color: 'text.primary', borderRadius: 2,
                    width: 120, height: 120, display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s',
                    '&:hover': { transform: 'scale(1.05)' }, cursor: 'pointer'
                  }}
                  onClick={() => navigate('/client/documents')}
                >
                  <DescriptionIcon color="info" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="body2" align="center">
                    <strong>{documents?.length || 0}</strong><br />Documents
                  </Typography>
                </Paper>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <DocumentUploadForm
        open={documentUploadOpen}
        onClose={handleCloseDocumentUpload}
        clientId={currentClient?.id || user?.id}
      />
    </Box>
  );
};

export default ClientDashboardPage;