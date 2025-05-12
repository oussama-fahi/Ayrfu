// src/pages/candidate/CandidateApplicationsPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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

// Import Redux actions
import { fetchCandidateProfile, fetchCandidateApplications } from '../../redux/slices/candidatesSlice';

/**
 * CandidateApplicationsPage - Shows a list of job applications made by the candidate
 * @returns {JSX.Element} The rendered component
 */
const CandidateApplicationsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get data from Redux store
  const { currentCandidate, applications, isLoading, error } = useSelector(state => state.candidates);

  // Local state for filtering and sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('appliedAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [pageLoading, setPageLoading] = useState(true);

  // Fetch data when component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        // First, ensure we have the candidate profile
        await dispatch(fetchCandidateProfile()).unwrap();
        
        // If we got here, the profile exists, fetch applications
        await dispatch(fetchCandidateApplications()).unwrap();
      } catch (err) {
        console.error('Error loading applications data:', err);
        // We'll handle missing candidate profile in the render
      } finally {
        setPageLoading(false);
      }
    };
    
    loadData();
  }, [dispatch]);

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
      case 'PENDING':
        return 'En attente';
      case 'REVIEWING':
      case 'IN_REVIEW':
        return 'En cours d\'examen';
      case 'INTERVIEW':
      case 'INTERVIEW_SCHEDULED':
      case 'INTERVIEW_COMPLETED':
        return 'Entretien';
      case 'ACCEPTED':
        return 'Acceptée';
      case 'REJECTED':
        return 'Refusée';
      case 'WITHDRAWN':
        return 'Retirée';
      default:
        return status;
    }
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
      case 'WITHDRAWN':
        return 'default';
      default:
        return 'default';
    }
  };

  // Filter and sort applications
  const getFilteredApplications = () => {
    if (!applications || applications.length === 0) return [];
    
    return applications
      .filter(app => {
        // Apply search filter
        if (searchQuery.trim()) {
          const searchLower = searchQuery.toLowerCase();
          return (
            app.position.title.toLowerCase().includes(searchLower) ||
            app.position.company?.toLowerCase().includes(searchLower) ||
            app.position.location.toLowerCase().includes(searchLower)
          );
        }
        return true;
      })
      .filter(app => {
        // Apply status filter
        if (statusFilter) {
          return app.status === statusFilter;
        }
        return true;
      })
      .sort((a, b) => {
        // Apply sorting
        let valA, valB;
        
        // Determine which values to compare based on sortBy
        switch (sortBy) {
          case 'appliedAt':
            valA = new Date(a.appliedAt);
            valB = new Date(b.appliedAt);
            break;
          case 'updatedAt':
            valA = new Date(a.updatedAt || a.appliedAt);
            valB = new Date(b.updatedAt || b.appliedAt);
            break;
          case 'position.title':
            valA = a.position.title;
            valB = b.position.title;
            break;
          case 'position.company':
            valA = a.position.company || '';
            valB = b.position.company || '';
            break;
          default:
            valA = a[sortBy];
            valB = b[sortBy];
        }
        
        // Apply sort direction
        if (sortDirection === 'asc') {
          return valA > valB ? 1 : -1;
        } else {
          return valA < valB ? 1 : -1;
        }
      });
  };

  const filteredApplications = getFilteredApplications();
  
  // If page is loading, show loading indicator
  if (pageLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // If candidate profile doesn't exist, show message
  const hasCandidateProfile = !!currentCandidate && !!currentCandidate.id;
  if (!hasCandidateProfile) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info" sx={{ mb: 4 }}>
          <Typography variant="body1">
            Vous devez compléter votre profil de candidat avant de pouvoir postuler à des offres d'emploi. 
            Veuillez postuler à une position ou mettre à jour votre profil.
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
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Mes candidatures</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate('/positions')}
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
                <MenuItem value="WITHDRAWN">Retirée</MenuItem>
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

      {isLoading ? (
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
                            <strong>Entreprise:</strong> {application.position.company || 'Non spécifié'}
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
          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ mt: 1, mb: 3 }}
          >
            {searchQuery || statusFilter
              ? "Essayez de modifier vos critères de recherche ou de filtrage"
              : "Vous n'avez pas encore soumis de candidature"}
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate('/positions')}
          >
            Parcourir les offres d'emploi
          </Button>
        </Paper>
      )}
    </Container>
  );
};

export default CandidateApplicationsPage;