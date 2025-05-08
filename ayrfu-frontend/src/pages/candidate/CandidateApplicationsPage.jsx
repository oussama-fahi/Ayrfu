// src/pages/candidate/CandidateApplicationsPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Grid,
  Box,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Visibility as VisibilityIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';

const CandidateApplicationsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('appliedAt');
  const [sortDirection, setSortDirection] = useState('desc');
  
  useEffect(() => {
    fetchApplications();
  }, [statusFilter, sortBy, sortDirection]);
  
  const fetchApplications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      let url = '/api/applications/my-applications';
      
      // Ajouter les paramètres de filtrage et de tri
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      params.append('sort', sortBy);
      params.append('direction', sortDirection);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setApplications(response.data);
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération des candidatures:', err);
      setError('Impossible de charger vos candidatures. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const handleViewApplication = (applicationId) => {
    navigate(`/candidate/applications/${applicationId}`);
  };
  
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };
  
  const handleSortByChange = (e) => {
    setSortBy(e.target.value);
  };
  
  const handleSortDirectionToggle = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const getStatusLabel = (status) => {
    switch (status) {
      case 'PENDING': return 'En attente';
      case 'REVIEWING': return 'En cours d\'examen';
      case 'INTERVIEW': return 'Entretien';
      case 'ACCEPTED': return 'Acceptée';
      case 'REJECTED': return 'Refusée';
      default: return status;
    }
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
  
  // Filtrer les candidatures en fonction de la recherche
  const filteredApplications = applications.filter(app => {
    if (!searchQuery.trim()) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      app.position.title.toLowerCase().includes(searchLower) ||
      app.position.company.toLowerCase().includes(searchLower) ||
      app.position.location.toLowerCase().includes(searchLower)
    );
  });
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          Mes candidatures
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/applicants')}
        >
          Parcourir les offres d'emploi
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Rechercher par poste, entreprise, lieu..."
              value={searchQuery}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchQuery ? (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchQuery('')}>
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ) : null
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Filtrer par statut</InputLabel>
              <Select
                value={statusFilter}
                onChange={handleStatusFilterChange}
                label="Filtrer par statut"
              >
                <MenuItem value="">Tous les statuts</MenuItem>
                <MenuItem value="PENDING">En attente</MenuItem>
                <MenuItem value="REVIEWING">En cours d'examen</MenuItem>
                <MenuItem value="INTERVIEW">Entretien</MenuItem>
                <MenuItem value="ACCEPTED">Acceptée</MenuItem>
                <MenuItem value="REJECTED">Refusée</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Trier par</InputLabel>
              <Select
                value={sortBy}
                onChange={handleSortByChange}
                label="Trier par"
              >
                <MenuItem value="appliedAt">Date de candidature</MenuItem>
                <MenuItem value="updatedAt">Dernière mise à jour</MenuItem>
                <MenuItem value="position.title">Titre du poste</MenuItem>
                <MenuItem value="position.company">Entreprise</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={1}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleSortDirectionToggle}
              startIcon={<FilterListIcon />}
              sx={{ height: '56px' }}
            >
              {sortDirection === 'asc' ? 'ASC' : 'DESC'}
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredApplications.length > 0 ? (
        <Paper elevation={2}>
          <List sx={{ width: '100%' }}>
            {filteredApplications.map((application, index) => (
              <React.Fragment key={application.id}>
                <ListItem
                  alignItems="flex-start"
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="voir"
                      onClick={() => handleViewApplication(application.id)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  }
                  sx={{ py: 2 }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="h6" component="span">
                          {application.position.title}
                        </Typography>
                        <Chip
                          label={getStatusLabel(application.status)}
                          color={getStatusColor(application.status)}
                          size="small"
                        />
                      </Box>
                    }
                    secondary={
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2" component="span" display="block">
                            <strong>Entreprise:</strong> {application.position.company}
                          </Typography>
                          <Typography variant="body2" component="span" display="block">
                            <strong>Localisation:</strong> {application.position.location}
                          </Typography>
                          <Typography variant="body2" component="span" display="block">
                            <strong>Type:</strong> {application.position.workModel}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2" component="span" display="block">
                            <strong>Candidature soumise le:</strong> {formatDate(application.appliedAt)}
                          </Typography>
                          {application.updatedAt && (
                            <Typography variant="body2" component="span" display="block">
                              <strong>Dernière mise à jour:</strong> {formatDate(application.updatedAt)}
                            </Typography>
                          )}
                          {application.interviewDate && (
                            <Typography variant="body2" component="span" display="block">
                              <strong>Date d'entretien:</strong> {formatDate(application.interviewDate)}
                            </Typography>
                          )}
                        </Grid>
                      </Grid>
                    }
                  />
                </ListItem>
                {index < filteredApplications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      ) : (
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Aucune candidature trouvée
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
            {searchQuery || statusFilter
              ? "Essayez de modifier vos critères de recherche ou de filtrage"
              : "Vous n'avez pas encore soumis de candidature"}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/applicants')}
          >
            Parcourir les offres d'emploi
          </Button>
        </Paper>
      )}
    </Container>
  );
};

export default CandidateApplicationsPage;