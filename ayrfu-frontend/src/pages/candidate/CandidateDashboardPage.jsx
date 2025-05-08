// src/pages/candidate/CandidateDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';

const CandidateDashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        
        // Récupérer les données des candidatures
        const applicationsResponse = await axios.get('/api/applications/my-applications', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Récupérer les messages récents
        const messagesResponse = await axios.get('/api/messages/recent/candidate', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Récupérer les postes ouverts recommandés
        const positionsResponse = await axios.get('/api/positions/recommended', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Calculer les statistiques des candidatures
        const applications = applicationsResponse.data || [];
        const applicationStats = {
          total: applications.length,
          pending: applications.filter(app => app.status === 'PENDING').length,
          reviewing: applications.filter(app => app.status === 'REVIEWING').length,
          interview: applications.filter(app => app.status === 'INTERVIEW').length,
          accepted: applications.filter(app => app.status === 'ACCEPTED').length,
          rejected: applications.filter(app => app.status === 'REJECTED').length
        };
        
        setDashboardData({
          recentApplications: applications.slice(0, 5),
          applicationStats,
          recentMessages: messagesResponse.data || [],
          openPositions: positionsResponse.data || []
        });
      } catch (err) {
        console.error('Erreur lors de la récupération des données du tableau de bord:', err);
        setError('Impossible de charger les données du tableau de bord. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  // Préparer les données du graphique
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
      case 'PENDING': return 'primary';
      case 'REVIEWING': return 'secondary';
      case 'INTERVIEW': return 'warning';
      case 'ACCEPTED': return 'success';
      case 'REJECTED': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'PENDING': return 'En attente';
      case 'REVIEWING': return 'En examen';
      case 'INTERVIEW': return 'Entretien';
      case 'ACCEPTED': return 'Acceptée';
      case 'REJECTED': return 'Refusée';
      default: return status;
    }
  };
  
  if (loading) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Chargement du tableau de bord...
        </Typography>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Bienvenue, {user?.fullName || 'Candidat'}
      </Typography>
      
      <Grid container spacing={4}>
        {/* Résumé des candidatures */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              État des candidatures
            </Typography>
            
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
                <Button 
                  variant="contained" 
                  onClick={() => navigate('/applicants')}
                  sx={{ mt: 2 }}
                >
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
              <Typography variant="h6">
                Candidatures récentes
              </Typography>
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => navigate('/candidate/applications')}
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
                        secondary={`Postuler le : ${formatDate(application.appliedAt)}`}
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
                  onClick={() => navigate('/applicants')}
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
            <Typography variant="h6" gutterBottom>
              Postes recommandés
            </Typography>
            
            {dashboardData.openPositions.length > 0 ? (
              <Grid container spacing={3}>
                {dashboardData.openPositions.map((position) => (
                  <Grid item xs={12} md={4} key={position.id}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {position.title}
                        </Typography>
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
                        <Button 
                          size="small" 
                          onClick={() => navigate(`/positions/${position.id}`)}
                        >
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
                  onClick={() => navigate('/applicants')}
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
              <Typography variant="h6">
                Messages récents
              </Typography>
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => navigate('/candidate/messages')}
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
                      onClick={() => navigate('/candidate/messages', { state: { selectedMessage: message.id } })}
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