// src/pages/client/ClientDocumentsPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  Tooltip,
  Snackbar
} from '@mui/material';
import {
  Description as DescriptionIcon,
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon,
  Visibility as VisibilityIcon,
  GetApp as DownloadIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';

const ClientDocumentsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  
  // États pour le téléversement
  const [file, setFile] = useState(null);
  const [documentType, setDocumentType] = useState('');
  const [description, setDescription] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);
  
  // États pour le filtrage et la recherche
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [sortBy, setSortBy] = useState('uploadedAt');
  const [sortDirection, setSortDirection] = useState('desc');
  
  const documentTypes = [
    'IDENTIFICATION',
    'ADDRESS_PROOF',
    'FINANCIAL',
    'CONTRACT',
    'INVOICE',
    'REPORT',
    'OTHER'
  ];
  
  const documentTypeLabels = {
    'IDENTIFICATION': 'Pièce d\'identité',
    'ADDRESS_PROOF': 'Justificatif de domicile',
    'FINANCIAL': 'Document financier',
    'CONTRACT': 'Contrat',
    'INVOICE': 'Facture',
    'REPORT': 'Rapport',
    'OTHER': 'Autre'
  };
  
  useEffect(() => {
    fetchDocuments();
  }, [typeFilter, sortBy, sortDirection]);
  
  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      let url = '/api/documents/client';
      
      // Ajouter les paramètres de filtrage et de tri
      const params = new URLSearchParams();
      if (typeFilter) params.append('type', typeFilter);
      params.append('sort', sortBy);
      params.append('direction', sortDirection);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setDocuments(response.data);
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération des documents:', err);
      setError('Impossible de charger les documents. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleUploadDialogOpen = () => {
    setUploadDialogOpen(true);
  };
  
  const handleUploadDialogClose = () => {
    setUploadDialogOpen(false);
    setFile(null);
    setDocumentType('');
    setDescription('');
  };
  
  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };
  
  const handleDeleteDialogOpen = (documentId) => {
    setSelectedDocumentId(documentId);
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setSelectedDocumentId(null);
  };
  
  const handleDeleteDocument = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/documents/${selectedDocumentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setDocuments(documents.filter(doc => doc.id !== selectedDocumentId));
      handleDeleteDialogClose();
      setNotification({
        open: true,
        message: 'Document supprimé avec succès',
        severity: 'success'
      });
    } catch (err) {
      console.error('Erreur lors de la suppression du document:', err);
      setNotification({
        open: true,
        message: 'Erreur lors de la suppression du document',
        severity: 'error'
      });
    }
  };
  
  const handleUploadDocument = async () => {
    if (!file || !documentType) {
      setNotification({
        open: true,
        message: 'Veuillez sélectionner un fichier et un type de document',
        severity: 'error'
      });
      return;
    }
    
    setUploadLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentType', documentType);
      formData.append('description', description);
      
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      
      setDocuments([response.data, ...documents]);
      handleUploadDialogClose();
      setNotification({
        open: true,
        message: 'Document téléversé avec succès',
        severity: 'success'
      });
    } catch (err) {
      console.error('Erreur lors du téléversement du document:', err);
      setNotification({
        open: true,
        message: 'Erreur lors du téléversement du document',
        severity: 'error'
      });
    } finally {
      setUploadLoading(false);
    }
  };
  
  const handleSearch = (event) => {
    event.preventDefault();
    
    if (searchQuery.trim()) {
      const filtered = documents.filter(doc => 
        doc.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setDocuments(filtered);
    } else {
      fetchDocuments();
    }
  };
  
  const handleClearSearch = () => {
    setSearchQuery('');
    fetchDocuments();
  };
  
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const getFileIcon = (filename) => {
    const extension = filename.split('.').pop().toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return <DescriptionIcon style={{ color: '#e53935' }} />;
      case 'doc':
      case 'docx':
        return <DescriptionIcon style={{ color: '#1565c0' }} />;
      case 'xls':
      case 'xlsx':
        return <DescriptionIcon style={{ color: '#01e8c8' }} />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <DescriptionIcon style={{ color: '#f57c00' }} />;
      default:
        return <DescriptionIcon />;
    }
  };
  
  const filteredDocuments = documents.filter(doc => {
    if (searchQuery.trim()) {
      return (
        doc.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    return true;
  });
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Mes documents</Typography>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<CloudUploadIcon />}
          onClick={handleUploadDialogOpen}
        >
          Téléverser un document
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex' }}>
              <TextField
                fullWidth
                variant="outlined"
                label="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  endAdornment: searchQuery ? (
                    <IconButton size="small" onClick={handleClearSearch}>
                      <ClearIcon />
                    </IconButton>
                  ) : null
                }}
              />
              <Button 
                type="submit" 
                variant="contained" 
                color="secondary" 
                sx={{ ml: 1 }}
              >
                <SearchIcon />
              </Button>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Filtrer par type</InputLabel>
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                label="Filtrer par type"
              >
                <MenuItem value="">Tous les types</MenuItem>
                {documentTypes.map(type => (
                  <MenuItem key={type} value={type}>
                    {documentTypeLabels[type]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Trier par</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                label="Trier par"
              >
                <MenuItem value="uploadedAt">Date de téléversement</MenuItem>
                <MenuItem value="filename">Nom de fichier</MenuItem>
                <MenuItem value="documentType">Type de document</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <Button 
              fullWidth
              variant="outlined" 
              color="secondary"
              onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
              startIcon={<FilterListIcon />}
            >
              {sortDirection === 'asc' ? 'Croissant' : 'Décroissant'}
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
          <CircularProgress color="secondary" />
        </Box>
      ) : filteredDocuments.length > 0 ? (
        <Paper elevation={2}>
          <List>
            {filteredDocuments.map((document, index) => (
              <React.Fragment key={document.id}>
                <ListItem>
                  <ListItemIcon>
                    {getFileIcon(document.filename)}
                  </ListItemIcon>
                  <ListItemText
                    primary={document.filename}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          {documentTypeLabels[document.documentType] || document.documentType}
                        </Typography>
                        <Typography component="p" variant="body2">
                          Téléversé le {formatDate(document.uploadedAt)}
                        </Typography>
                        {document.description && (
                          <Typography component="p" variant="body2">
                            {document.description}
                          </Typography>
                        )}
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Box>
                      <Tooltip title="Voir">
                        <IconButton
                          edge="end"
                          aria-label="view"
                          onClick={() => window.open(`/api/documents/view/${document.id}`, '_blank')}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Télécharger">
                        <IconButton
                          edge="end"
                          aria-label="download"
                          onClick={() => window.open(`/api/documents/download/${document.id}`, '_blank')}
                        >
                          <DownloadIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleDeleteDialogOpen(document.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < filteredDocuments.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      ) : (
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Aucun document trouvé
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            {searchQuery || typeFilter
              ? 'Essayez de modifier vos critères de recherche ou de filtrage'
              : 'Commencez par téléverser des documents'}
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<CloudUploadIcon />}
            onClick={handleUploadDialogOpen}
            sx={{ mt: 3 }}
          >
            Téléverser un document
          </Button>
        </Paper>
      )}
      
      {/* Dialog de téléversement */}
      <Dialog open={uploadDialogOpen} onClose={handleUploadDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Téléverser un nouveau document</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Veuillez sélectionner un fichier à téléverser et spécifier le type de document.
          </DialogContentText>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                startIcon={<CloudUploadIcon />}
                sx={{ py: 1.5 }}
              >
                Sélectionner un fichier
                <input type="file" hidden onChange={handleFileChange} />
              </Button>
              {file && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Fichier sélectionné : {file.name}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Type de document</InputLabel>
                <Select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  label="Type de document"
                  required
                >
                  <MenuItem value="">Sélectionner un type</MenuItem>
                  {documentTypes.map(type => (
                    <MenuItem key={type} value={type}>
                      {documentTypeLabels[type]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description (facultatif)"
                variant="outlined"
                multiline
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUploadDialogClose} disabled={uploadLoading}>
            Annuler
          </Button>
          <Button
            onClick={handleUploadDocument}
            color="secondary"
            variant="contained"
            disabled={!file || !documentType || uploadLoading}
            startIcon={uploadLoading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
          >
            {uploadLoading ? 'Téléversement en cours...' : 'Téléverser'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Dialog de confirmation de suppression */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer ce document ? Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>
            Annuler
          </Button>
          <Button onClick={handleDeleteDocument} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};
export default ClientDocumentsPage;