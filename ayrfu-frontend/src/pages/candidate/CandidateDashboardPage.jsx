// src/pages/candidate/CandidateDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  CircularProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  Alert,
  Divider,
  Paper
} from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Redux actions
import { 
  fetchCandidateProfile, 
  fetchCandidateApplications 
} from '../../redux/slices/candidatesSlice';
import { fetchActivePositions } from '../../redux/slices/positionsSlice';
import { fetchUnreadMessages } from '../../redux/slices/messagesSlice';

/**
 * CandidateDashboardPage component - Dashboard for candidates showing applications and recommendations
 * @returns {JSX.Element} The rendered component
 */
const CandidateDashboardPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get data from Redux store
  const { user } = useSelector(state => state.auth);
  const { currentCandidate, applications, isLoading: candidateLoading, error: candidateError } = useSelector(state => state.candidates);
  const { positions, isLoading: positionsLoading } = useSelector(state => state.positions);
  const { unreadMessages, isLoading: messagesLoading } = useSelector(state => state.messages);

  const [isPageLoading, setIsPageLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    recentApplications: [],
    applicationStats: {
      total: 0,
      pending: 0,
      reviewing: 0,
      interview: 0,
      accepted: 0,
      rejected: 0
    },
    recentMessages: [],
    openPositions: []
  });

  // Fetch necessary data when component mounts
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Fetch candidate profile (this may fail if candidate record doesn't exist yet)
        dispatch(fetchCandidateProfile());
        
        // These API calls should succeed even if candidate profile doesn't exist
        dispatch(fetchActivePositions());
        dispatch(fetchUnreadMessages());
        
        // Applications will be fetched only if candidate profile exists
        // We'll handle this in the next useEffect
      } catch (err) {
        console.error('Error loading initial dashboard data:', err);
      }
    };

    loadDashboardData();
  }, [dispatch]);

  // After we know if candidate profile exists, fetch applications if it does
  useEffect(() => {
    if (currentCandidate && currentCandidate.id) {
      dispatch(fetchCandidateApplications(currentCandidate.id));
    }
  }, [dispatch, currentCandidate]);

  // Process the data once everything is loaded
  useEffect(() => {
    if (!candidateLoading && !positionsLoading && !messagesLoading) {
      // If we have applications (candidate exists), calculate stats
      if (applications.length > 0) {
        const applicationStats = {
          total: applications.length,
          pending: applications.filter(app => app.status === 'PENDING').length,
          reviewing: applications.filter(app => app.status === 'REVIEWING' || app.status === 'IN_REVIEW').length,
          interview: applications.filter(app => app.status === 'INTERVIEW' || app.status === 'INTERVIEW_SCHEDULED' || app.status === 'INTERVIEW_COMPLETED').length,
          accepted: applications.filter(app => app.status === 'ACCEPTED').length,
          rejected: applications.filter(app => app.status === 'REJECTED').length
        };

        setDashboardData({
          recentApplications: applications.slice(0, 5),
          applicationStats,
          recentMessages: unreadMessages || [],
          openPositions: positions || []
        });
      } else {
        // No applications, but we still have open positions
        setDashboardData({
          recentApplications: [],
          applicationStats: {
            total: 0,
            pending: 0,
            reviewing: 0,
            interview: 0,
            accepted: 0,
            rejected: 0
          },
          recentMessages: unreadMessages || [],
          openPositions: positions || []
        });
      }
      
      setIsPageLoading(false);
    }
  }, [candidateLoading, positionsLoading, messagesLoading, applications, positions, unreadMessages]);

  // Prepare pie chart data for application statistics
  const pieChartData = [
    { name: 'En attente', value: dashboardData.applicationStats.pending, color: '#1976D2' },
    { name: 'En examen', value: dashboardData.applicationStats.reviewing, color: '#9C27B0' },
    { name: 'Entretien', value: dashboardData.applicationStats.interview, color: '#FF9800' },
    { name: 'Acceptée', value: dashboardData.applicationStats.accepted, color: '#4CAF50' },
    { name: 'Refusée', value: dashboardData.applicationStats.rejected, color: '#F44336' }
  ].filter(item => item.value > 0);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'primary';
      case 'REVIEWING':
      case 'IN_REVIEW':
        return 'secondary';
      case 'INTERVIEW':
      case 'INTERVIEW_SCHEDULED':
      case 'INTERVIEW_COMPLETED':
        return 'warning';
      case 'ACCEPTED':
        return 'success';
      case 'REJECTED':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'PENDING':
        return 'En attente';
      case 'REVIEWING':
      case 'IN_REVIEW':
        return 'En examen';
      case 'INTERVIEW':
      case 'INTERVIEW_SCHEDULED':
      case 'INTERVIEW_COMPLETED':
        return 'Entretien';
      case 'ACCEPTED':
        return 'Acceptée';
      case 'REJECTED':
        return 'Refusée';
      default:
        return status;
    }
  };

  // Show loading state while fetching data
  if (isPageLoading) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>Chargement du tableau de bord...</Typography>
      </Container>
    );
  }

  // Special case: User has CANDIDATE role but no candidate profile yet
  const hasCandidateProfile = !!currentCandidate && !!currentCandidate.id;
  const welcomeMessage = user?.fullName || 'Candidat';

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Bienvenue, {welcomeMessage}</Typography>

      {/* Show alert if no candidate profile exists */}
      {!hasCandidateProfile && candidateError && (
        <Alert severity="info" sx={{ mb: 4 }}>
          <Typography variant="body1">
            Il semble que votre profil de candidat n'est pas encore complet. Pour accéder à toutes les fonctionnalités, 
            veuillez postuler à une position ou compléter votre profil.
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Button 
              variant="contained" 
              onClick={() => navigate('/positions')} 
              sx={{ mr: 2 }}
            >
              Voir les offres d'emploi
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/user/profile')}
            >
              Compléter mon profil
            </Button>
          </Box>
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Résumé des candidatures */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>État des candidatures</Typography>
            {dashboardData.applicationStats.total > 0 ? (
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} candidature(s)`, 'Nombre']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 5 }}>
                <Typography variant="body1" color="text.secondary">
                  Vous n'avez pas encore soumis de candidature.
                </Typography>
                <Button variant="contained" onClick={() => navigate('/positions')} sx={{ mt: 2 }}>
                  Parcourir les offres d'emploi
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Candidatures récentes */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Candidatures récentes</Typography>
              <Button 
                variant="outlined" 
                size="small" 
                onClick={() => navigate('/candidate/applications')}
                disabled={!hasCandidateProfile}
              >
                Voir tout
              </Button>
            </Box>
            {dashboardData.recentApplications.length > 0 ? (
              <List>
                {dashboardData.recentApplications.map((application) => (
                  <React.Fragment key={application.id}>
                    <ListItem 
                      button 
                      onClick={() => navigate(`/candidate/applications/${application.id}`)}
                      sx={{ py: 2 }}
                    >
                      <ListItemText 
                        primary={application.position.title} 
                        secondary={`Postuler le: ${formatDate(application.appliedAt)}`} 
                      />
                      <Chip 
                        label={getStatusLabel(application.status)} 
                        color={getStatusColor(application.status)} 
                        size="small" 
                      />
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Box sx={{ textAlign: 'center', py: 5 }}>
                <Typography variant="body1" color="text.secondary">
                  Vous n'avez pas encore soumis de candidature.
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={() => navigate('/positions')} 
                  sx={{ mt: 2 }}
                >
                  Parcourir les offres d'emploi
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Postes recommandés */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Postes recommandés</Typography>
            {dashboardData.openPositions.length > 0 ? (
              <Grid container spacing={3}>
                {dashboardData.openPositions.slice(0, 3).map((position) => (
                  <Grid item xs={12} md={4} key={position.id}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>{position.title}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {position.technology} • {position.location} • {position.workModel}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          {position.description && position.description.length > 100
                            ? `${position.description.substring(0, 100)}...`
                            : position.description}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button size="small" onClick={() => navigate(`/positions/${position.id}`)}>
                          Voir détails
                        </Button>
                        <Button 
                          size="small" 
                          variant="contained" 
                          onClick={() => navigate(`/apply/${position.id}`)}
                        >
                          Postuler
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="body1" color="text.secondary">
                  Aucun poste recommandé disponible pour le moment.
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={() => navigate('/positions')} 
                  sx={{ mt: 2 }}
                >
                  Parcourir tous les postes
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Messages récents */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Messages récents</Typography>
              <Button 
                variant="outlined" 
                size="small" 
                onClick={() => navigate('/candidate/messages')}
                disabled={!hasCandidateProfile}
              >
                Voir tout
              </Button>
            </Box>
            {dashboardData.recentMessages.length > 0 ? (
              <List>
                {dashboardData.recentMessages.map((message) => (
                  <React.Fragment key={message.id}>
                    <ListItem 
                      button 
                      onClick={() => navigate('/candidate/messages', { state: { selectedMessage: message.id }})}
                      sx={{ 
                        py: 2, 
                        bgcolor: !message.read ? 'rgba(25, 118, 210, 0.08)' : 'transparent' 
                      }}
                    >
                      <ListItemText 
                        primary={message.senderName}
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="text.primary">
                              {formatDate(message.sentAt)}
                            </Typography>
                            <Typography component="p" variant="body2">
                              {message.content && message.content.length > 100
                                ? `${message.content.substring(0, 100)}...`
                                : message.content}
                            </Typography>
                          </>
                        } 
                      />
                      {!message.read && (
                        <Chip label="Nouveau" size="small" color="primary" />
                      )}
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="body1" color="text.secondary">
                  Aucun message disponible.
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CandidateDashboardPage;