// src/pages/candidate/CandidateApplicationDetailPage.jsx
import {
  Business as BusinessIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  Event as EventIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  Send as SendIcon,
  Work as WorkIcon
} from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const CandidateApplicationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [withdrawDialog, setWithdrawDialog] = useState(false);
  
  useEffect(() => {
    fetchApplicationDetails();
  }, [id]);
  
  const fetchApplicationDetails = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/applications/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setApplication(response.data);
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération des détails de la candidature:', err);
      setError('Impossible de charger les détails de la candidature. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    setSendingMessage(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/applications/messages', {
        applicationId: id,
        content: newMessage
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Mettre à jour les messages dans la candidature
      setApplication({
        ...application,
        messages: [...application.messages, response.data]
      });
      
      setNewMessage('');
    } catch (err) {
      console.error('Erreur lors de l\'envoi du message:', err);
      setError('Erreur lors de l\'envoi du message. Veuillez réessayer.');
    } finally {
      setSendingMessage(false);
    }
  };
  
  const handleOpenWithdrawDialog = () => {
    setWithdrawDialog(true);
  };
  
  const handleCloseWithdrawDialog = () => {
    setWithdrawDialog(false);
  };
  
  const handleWithdrawApplication = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/applications/${id}/withdraw`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Mettre à jour le statut de la candidature
      setApplication({
        ...application,
        status: 'WITHDRAWN'
      });
      
      handleCloseWithdrawDialog();
    } catch (err) {
      console.error('Erreur lors du retrait de la candidature:', err);
      setError('Erreur lors du retrait de la candidature. Veuillez réessayer.');
      handleCloseWithdrawDialog();
    }
  };
  
  const getStatusLabel = (status) => {
    switch (status) {
      case 'PENDING': return 'En attente';
      case 'REVIEWING': return 'En cours d\'examen';
      case 'INTERVIEW': return 'Entretien';
      case 'ACCEPTED': return 'Acceptée';
      case 'REJECTED': return 'Refusée';
      case 'WITHDRAWN': return 'Retirée';
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
      case 'WITHDRAWN': return 'default';
      default: return 'default';
    }
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Étapes de progression
  const steps = ['Candidature soumise', 'En cours d\'examen', 'Entretien', 'Décision'];
  const getActiveStep = (status) => {
    switch (status) {
      case 'PENDING': return 0;
      case 'REVIEWING': return 1;
      case 'INTERVIEW': return 2;
      case 'ACCEPTED':
      case 'REJECTED':
      case 'WITHDRAWN':
        return 3;
      default: return 0;
    }
  };
  
  if (loading) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Chargement des détails...
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
        <Button 
          variant="contained" 
          onClick={() => navigate('/candidate/applications')}
        >
          Retour à mes candidatures
        </Button>
      </Container>
    );
  }
  
  if (!application) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info" sx={{ mb: 4 }}>
          Candidature non trouvée.
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => navigate('/candidate/applications')}
        >
          Retour à mes candidatures
        </Button>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          Détails de ma candidature
        </Typography>
        <Chip 
          label={getStatusLabel(application.status)} 
          color={getStatusColor(application.status)} 
          size="large"
        />
      </Box>
      
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>
              {application.position.title}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <BusinessIcon color="action" sx={{ mr: 1 }} />
              <Typography variant="body1">
                {application.position.company}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocationIcon color="action" sx={{ mr: 1 }} />
              <Typography variant="body1">
                {application.position.location}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <WorkIcon color="action" sx={{ mr: 1 }} />
              <Typography variant="body1">
                {application.position.workModel}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ScheduleIcon color="action" sx={{ mr: 1 }} />
              <Typography variant="body1">
                Candidature soumise le {formatDate(application.appliedAt)}
              </Typography>
            </Box>
            
            {application.interviewDate && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EventIcon color="action" sx={{ mr: 1 }} />
                <Typography variant="body1">
                  Entretien programmé le {formatDate(application.interviewDate)}
                </Typography>
              </Box>
            )}
            
            {application.status === 'ACCEPTED' && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="body1" color="success.main">
                  Candidature acceptée le {formatDate(application.updatedAt)}
                </Typography>
              </Box>
            )}
            
            {application.status === 'REJECTED' && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CancelIcon color="error" sx={{ mr: 1 }} />
                <Typography variant="body1" color="error.main">
                  Candidature refusée le {formatDate(application.updatedAt)}
                </Typography>
              </Box>
            )}
            
            {application.status === 'WITHDRAWN' && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CancelIcon color="action" sx={{ mr: 1 }} />
                <Typography variant="body1" color="text.secondary">
                  Candidature retirée le {formatDate(application.updatedAt)}
                </Typography>
              </Box>
            )}
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Stepper activeStep={getActiveStep(application.status)} alternativeLabel sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            
            {application.notes && (
              <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Notes:
                </Typography>
                <Typography variant="body2">
                  {application.notes}
                </Typography>
              </Paper>
            )}
            
            {application.status === 'PENDING' && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleOpenWithdrawDialog}
                >
                  Retirer ma candidature
                </Button>
              </Box>
            )}
          </Grid>
        </Grid>
      </Paper>
      
      <Typography variant="h5" gutterBottom>
        Messages
      </Typography>
      
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ height: '300px', overflow: 'auto', mb: 3 }}>
          {application.messages && application.messages.length > 0 ? (
            <List>
              {application.messages.map((message) => (
                <ListItem key={message.id} alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: message.senderId === user.id ? 'primary.main' : 'secondary.main' }}>
                      {message.sender.name[0].toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="subtitle2">
                          {message.sender.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(message.sentAt)}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                        sx={{ display: 'inline', mt: 1 }}
                      >
                        {message.content}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Typography color="text.secondary">
                Aucun message pour l'instant.
              </Typography>
            </Box>
          )}
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
          <TextField
            fullWidth
            label="Votre message"
            multiline
            rows={3}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={application.status === 'WITHDRAWN'}
            sx={{ mr: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            endIcon={<SendIcon />}
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || sendingMessage || application.status === 'WITHDRAWN'}
            sx={{ height: '56px' }}
          >
            Envoyer
          </Button>
        </Box>
      </Paper>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/candidate/applications')}
        >
          Retour à mes candidatures
        </Button>
        
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => navigate(`/positions/${application.position.id}`)}
        >
          Voir l'offre d'emploi
        </Button>
      </Box>
      
      {/* Dialogue de confirmation pour retirer la candidature */}
      <Dialog
        open={withdrawDialog}
        onClose={handleCloseWithdrawDialog}
      >
        <DialogTitle>Confirmer le retrait</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir retirer votre candidature pour le poste de {application.position.title} ?
            Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseWithdrawDialog}>Annuler</Button>
          <Button onClick={handleWithdrawApplication} color="error">
            Retirer ma candidature
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CandidateApplicationDetailPage;