// src/pages/client/ClientRequestDetailPage.jsx
import {
  Assignment as AssignmentIcon,
  AttachFile as AttachFileIcon,
  CloudUpload as CloudUploadIcon,
  Schedule as ScheduleIcon,
  Send as SendIcon
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
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

const ClientRequestDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState(null);
  const [sendingMessage, setSendingMessage] = useState(false);
  
  useEffect(() => {
    fetchRequestDetails();
  }, [id]);
  
  const fetchRequestDetails = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/service-requests/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setRequest(response.data);
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération des détails de la demande:', err);
      setError('Impossible de charger les détails de la demande. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSendMessage = async () => {
    if (!newMessage.trim() && !file) return;
    
    setSendingMessage(true);
    
    try {
      const token = localStorage.getItem('token');
      
      let response;
      const formData = new FormData();
      formData.append('content', newMessage);
      formData.append('requestId', id);
      
      if (file) {
        formData.append('file', file);
      }
      
      response = await axios.post('/api/service-requests/messages', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      
      // Mettre à jour les messages dans la demande
      setRequest({
        ...request,
        messages: [...request.messages, response.data]
      });
      
      setNewMessage('');
      setFile(null);
    } catch (err) {
      console.error('Erreur lors de l\'envoi du message:', err);
      setError('Erreur lors de l\'envoi du message. Veuillez réessayer.');
    } finally {
      setSendingMessage(false);
    }
  };
  
  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };
  
  const handleRemoveFile = () => {
    setFile(null);
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'primary';
      case 'IN_PROGRESS': return 'warning';
      case 'COMPLETED': return 'success';
      case 'CANCELLED': return 'error';
      default: return 'default';
    }
  };
  
  const getStatusLabel = (status) => {
    switch (status) {
      case 'PENDING': return 'En attente';
      case 'IN_PROGRESS': return 'En cours';
      case 'COMPLETED': return 'Terminé';
      case 'CANCELLED': return 'Annulé';
      default: return status;
    }
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Étapes de progression
  const steps = ['Demande reçue', 'En traitement', 'Terminé'];
  const getStepIndex = (status) => {
    switch (status) {
      case 'PENDING': return 0;
      case 'IN_PROGRESS': return 1;
      case 'COMPLETED': return 2;
      default: return 0;
    }
  };
  
  if (loading) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress color="secondary" />
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
          color="secondary" 
          onClick={() => navigate('/client/services')}
        >
          Retour aux services
        </Button>
      </Container>
    );
  }
  
  if (!request) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info" sx={{ mb: 4 }}>
          Demande non trouvée.
        </Alert>
        <Button 
          variant="contained" 
          color="secondary" 
          onClick={() => navigate('/client/services')}
        >
          Retour aux services
        </Button>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          Détails de la demande de service
        </Typography>
        <Chip 
          label={getStatusLabel(request.status)} 
          color={getStatusColor(request.status)} 
        />
      </Box>
      
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              {request.service.title}
            </Typography>
            <Typography variant="body1" paragraph>
              {request.service.description}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ScheduleIcon color="action" sx={{ mr: 1 }} />
              <Typography variant="body2">
                Demandé le: {formatDate(request.requestedAt)}
              </Typography>
            </Box>
            {request.assignedTo && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AssignmentIcon color="action" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  Assigné à: {request.assignedTo.name}
                </Typography>
              </Box>
            )}
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Stepper activeStep={getStepIndex(request.status)} alternativeLabel sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            
            {request.notes && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Notes:
                </Typography>
                <Typography variant="body2">
                  {request.notes}
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </Paper>
      
      <Typography variant="h5" gutterBottom>
        Messages et documents
      </Typography>
      
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ height: '350px', overflow: 'auto', mb: 3 }}>
          {request.messages && request.messages.length > 0 ? (
            <List>
              {request.messages.map((message) => (
                <ListItem 
                  key={message.id}
                  sx={{ 
                    bgcolor: message.sender.id === user.id ? 'rgba(46, 125, 50, 0.08)' : 'transparent',
                    borderRadius: 1,
                    mb: 1
                  }}
                >
                  <ListItemText 
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="subtitle2">
                          {message.sender.id === user.id ? 'Vous' : message.sender.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(message.sentAt)}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {message.content}
                        </Typography>
                        {message.attachmentUrl && (
                          <Box 
                            sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              mt: 1,
                              p: 1,
                              borderRadius: 1,
                              bgcolor: 'background.default'
                            }}
                            component="a"
                            href={message.attachmentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <AttachFileIcon fontSize="small" sx={{ mr: 1 }} />
                            <Typography variant="caption">
                              {message.attachmentName || 'Pièce jointe'}
                            </Typography>
                          </Box>
                        )}
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Typography color="text.secondary">
                Aucun message pour l'instant. Commencez la conversation !
              </Typography>
            </Box>
          )}
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        {file && (
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              p: 1,
              mb: 2,
              borderRadius: 1,
              bgcolor: 'background.default'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AttachFileIcon fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="body2">
                {file.name}
              </Typography>
            </Box>
            <Button 
              size="small" 
              color="error" 
              onClick={handleRemoveFile}
            >
              Supprimer
            </Button>
          </Box>
        )}
        
        <Grid container spacing={2} alignItems="center">
          <Grid item xs>
            <TextField
              fullWidth
              label="Votre message"
              multiline
              rows={3}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Tapez votre message ici..."
            />
          </Grid>
          <Grid item>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button
                component="label"
                variant="outlined"
                color="secondary"
                startIcon={<CloudUploadIcon />}
              >
                Joindre un fichier
                <input
                  type="file"
                  hidden
                  onChange={handleFileChange}
                />
              </Button>
              
              <Button
                variant="contained"
                color="secondary"
                startIcon={<SendIcon />}
                onClick={handleSendMessage}
                disabled={sendingMessage || (!newMessage.trim() && !file)}
              >
                Envoyer
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button 
          variant="outlined" 
          color="secondary" 
          onClick={() => navigate('/client/services')}
        >
          Retour aux services
        </Button>
        
        {request.status === 'PENDING' && (
          <Button 
            variant="outlined" 
            color="error"
            onClick={() => {/* Ajouter la logique d'annulation */}}
          >
            Annuler la demande
          </Button>
        )}
      </Box>
    </Container>
  );
};

export default ClientRequestDetailPage;