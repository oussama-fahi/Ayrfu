// src/pages/client/ClientServicesPage.jsx
import SearchIcon from '@mui/icons-material/Search';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  InputAdornment,
  Paper,
  TextField,
  Typography
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ClientServicesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    fetchServices();
  }, []);
  
  const fetchServices = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/services', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setServices(response.data);
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération des services:', err);
      setError('Impossible de charger les services. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const handleRequestService = (serviceId) => {
    navigate('/client/services/request', { state: { serviceId } });
  };
  
  // Filtrer les services en fonction de la recherche
  const filteredServices = services.filter(service => {
    if (!searchQuery.trim()) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      service.title.toLowerCase().includes(searchLower) ||
      service.description.toLowerCase().includes(searchLower) ||
      (service.keywords && service.keywords.some(keyword => keyword.toLowerCase().includes(searchLower)))
    );
  });
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Nos services
      </Typography>
      
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Rechercher un service..."
          value={searchQuery}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress color="secondary" />
        </Box>
      ) : filteredServices.length > 0 ? (
        <Grid container spacing={3}>
          {filteredServices.map((service) => (
            <Grid item xs={12} sm={6} md={4} key={service.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {service.imageUrl && (
                  <CardMedia
                    component="img"
                    height="140"
                    image={service.imageUrl}
                    alt={service.title}
                  />
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {service.title}
                  </Typography>
                  
                  {service.keywords && service.keywords.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      {service.keywords.map((keyword, index) => (
                        <Chip
                          key={index}
                          label={keyword}
                          size="small"
                          color="secondary"
                          variant="outlined"
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))}
                    </Box>
                  )}
                  
                  <Typography variant="body2" color="text.secondary">
                    {service.description}
                  </Typography>
                </CardContent>
                <Divider />
                <CardActions>
                  <Button
                    size="small"
                    onClick={() => navigate(`/services/${service.id}`)}
                  >
                    Détails
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="secondary"
                    onClick={() => handleRequestService(service.id)}
                  >
                    Demander ce service
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Aucun service trouvé
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            {searchQuery 
              ? "Essayez de modifier vos termes de recherche"
              : "Aucun service n'est disponible pour le moment"}
          </Typography>
        </Paper>
      )}
    </Container>
  );
};

export default ClientServicesPage;