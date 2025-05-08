// src/pages/client/ClientServiceRequestPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Box,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Divider,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardMedia,
  Chip
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  NavigateNext as NextIcon,
  NavigateBefore as BackIcon,
  Check as CheckIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';

const ClientServiceRequestPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const [activeStep, setActiveStep] = useState(0);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  
  // Formulaire de demande
  const [formData, setFormData] = useState({
    serviceId: '',
    description: '',
    urgency: 'NORMAL',
    preferredStartDate: '',
    additionalInfo: '',
    termsAccepted: false
  });
  
  const steps = ['Sélection du service', 'Détails de la demande', 'Confirmation'];
  
  useEffect(() => {
    fetchServices();
    
    // Si un serviceId est passé via l'état de navigation, le pré-sélectionner
    if (location.state?.serviceId) {
      setFormData(prev => ({ ...prev, serviceId: location.state.serviceId }));
      fetchServiceDetails(location.state.serviceId);
      setActiveStep(1); // Passer directement à l'étape 2
    }
  }, [location]);
  
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
  
  const fetchServiceDetails = async (serviceId) => {
    if (!serviceId) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/services/${serviceId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSelectedService(response.data);
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération des détails du service:', err);
      setError('Impossible de charger les détails du service. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    
    if (name === 'termsAccepted') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    // Si le service change, charger ses détails
    if (name === 'serviceId' && value) {
      fetchServiceDetails(value);
    }
  };
  
  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };
  
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  const handleSubmit = async () => {
    setSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      
      const requestData = new FormData();
      requestData.append('serviceId', formData.serviceId);
      requestData.append('description', formData.description);
      requestData.append('urgency', formData.urgency);
      
      if (formData.preferredStartDate) {
        requestData.append('preferredStartDate', formData.preferredStartDate);
      }
      
      if (formData.additionalInfo) {
        requestData.append('additionalInfo', formData.additionalInfo);
      }
      
      if (file) {
        requestData.append('file', file);
      }
      
      const response = await axios.post('/api/service-requests', requestData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      
      // Rediriger vers la page de détails de la demande
      navigate(`/client/requests/${response.data.id}`);
    } catch (err) {
      console.error('Erreur lors de la soumission de la demande:', err);
      setError('Erreur lors de la soumission de la demande. Veuillez réessayer.');
      setActiveStep(1); // Retourner à l'étape du formulaire
    } finally {
      setSubmitting(false);
    }
  };
  
  const isNextDisabled = () => {
    if (activeStep === 0) {
      return !formData.serviceId;
    } else if (activeStep === 1) {
      return !formData.description || !formData.termsAccepted;
    }
    return false;
  };
  
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Sélectionnez le service que vous souhaitez demander
            </Typography>
            
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Service</InputLabel>
              <Select
                name="serviceId"
                value={formData.serviceId}
                onChange={handleInputChange}
                label="Service"
                required
              >
                <MenuItem value="">Sélectionnez un service</MenuItem>
                {services.map(service => (
                  <MenuItem key={service.id} value={service.id}>
                    {service.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            {selectedService && (
              <Card sx={{ mb: 3 }}>
                {selectedService.imageUrl && (
                  <CardMedia
                    component="img"
                    height="140"
                    image={selectedService.imageUrl}
                    alt={selectedService.title}
                  />
                )}
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {selectedService.title}
                  </Typography>
                  
                  {selectedService.keywords && selectedService.keywords.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      {selectedService.keywords.map((keyword, index) => (
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
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {selectedService.description}
                  </Typography>
                  
                  {selectedService.price && (
                    <Typography variant="subtitle1" color="primary">
                      Prix estimé: {selectedService.price}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            )}
          </Box>
        );
      
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Détails de votre demande
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  name="description"
                  label="Description de votre demande"
                  multiline
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  placeholder="Veuillez décrire en détail ce dont vous avez besoin..."
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Urgence</InputLabel>
                  <Select
                    name="urgency"
                    value={formData.urgency}
                    onChange={handleInputChange}
                    label="Urgence"
                  >
                    <MenuItem value="LOW">Basse</MenuItem>
                    <MenuItem value="NORMAL">Normale</MenuItem>
                    <MenuItem value="HIGH">Haute</MenuItem>
                    <MenuItem value="CRITICAL">Critique</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  name="preferredStartDate"
                  label="Date de début souhaitée"
                  type="date"
                  value={formData.preferredStartDate}
                  onChange={handleInputChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: new Date().toISOString().split('T')[0] }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  name="additionalInfo"
                  label="Informations supplémentaires"
                  multiline
                  rows={3}
                  value={formData.additionalInfo}
                  onChange={handleInputChange}
                  fullWidth
                  placeholder="Toute information complémentaire qui pourrait être utile..."
                />
              </Grid>
              
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                  fullWidth
                  sx={{ py: 1.5 }}
                >
                  {file ? 'Changer de fichier' : 'Joindre un document'}
                  <input type="file" hidden onChange={handleFileChange} />
                </Button>
                {file && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Fichier sélectionné : {file.name}
                  </Typography>
                )}
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="termsAccepted"
                        checked={formData.termsAccepted}
                        onChange={handleInputChange}
                        required
                      />
                    }
                    label="J'accepte les conditions générales de service"
                  />
                </FormGroup>
              </Grid>
            </Grid>
          </Box>
        );
      
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Récapitulatif de votre demande
            </Typography>
            
            <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">Service :</Typography>
                  <Typography variant="body1">{selectedService?.title}</Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">Urgence :</Typography>
                  <Typography variant="body1">
                    {formData.urgency === 'LOW' ? 'Basse' :
                     formData.urgency === 'NORMAL' ? 'Normale' :
                     formData.urgency === 'HIGH' ? 'Haute' : 'Critique'}
                  </Typography>
                </Grid>
                
                {formData.preferredStartDate && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1">Date de début souhaitée :</Typography>
                    <Typography variant="body1">
                      {new Date(formData.preferredStartDate).toLocaleDateString()}
                    </Typography>
                  </Grid>
                )}
                
                <Grid item xs={12}>
                  <Typography variant="subtitle1">Description :</Typography>
                  <Typography variant="body1" paragraph>
                    {formData.description}
                  </Typography>
                </Grid>
                
                {formData.additionalInfo && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">Informations supplémentaires :</Typography>
                    <Typography variant="body1" paragraph>
                      {formData.additionalInfo}
                    </Typography>
                  </Grid>
                )}
                
                {file && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">Document joint :</Typography>
                    <Typography variant="body1">{file.name}</Typography>
                  </Grid>
                )}
              </Grid>
            </Paper>
            
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                En soumettant cette demande, vous acceptez d'être contacté par notre équipe pour discuter des détails et des prochaines étapes.
              </Typography>
            </Alert>
          </Box>
        );
      
      default:
        return null;
    }
  };
  
  if (loading && activeStep === 0) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress color="secondary" />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Chargement des services disponibles...
        </Typography>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Demande de service
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        <Box>
          {renderStepContent(activeStep)}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              startIcon={<BackIcon />}
            >
              Retour
            </Button>
            
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                color="secondary"
                onClick={handleSubmit}
                endIcon={submitting ? <CircularProgress size={20} /> : <CheckIcon />}
                disabled={submitting}
              >
                {submitting ? 'Envoi en cours...' : 'Soumettre la demande'}
              </Button>
            ) : (
              <Button
                variant="contained"
                color="secondary"
                onClick={handleNext}
                endIcon={<NextIcon />}
                disabled={isNextDisabled()}
              >
                Suivant
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ClientServiceRequestPage;