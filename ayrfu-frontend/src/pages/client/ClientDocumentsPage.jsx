// src/pages/client/ClientDocumentsPage.js
import {
  Clear as ClearIcon,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Description as DescriptionIcon,
  GetApp as DownloadIcon,
  FilterList as FilterListIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Fade,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  Snackbar,
  TextField,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { fetchCurrentClient } from '../../redux/slices/clientsSlice';
import {
  clearDocumentStatus,
  deleteDocument,
  downloadDocument,
  fetchClientDocuments,
  uploadDocument,
} from '../../redux/slices/documentsSlice';

const ClientDocumentsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();
    const theme = useTheme();
  
  
  const { documents, isLoading, error, uploadSuccess } = useSelector((state) => state.documents);
  const { currentClient, isLoading: clientLoading } = useSelector((state) => state.clients);

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  const [refreshing, setRefreshing] = useState(false);

  const [file, setFile] = useState(null);
  const [documentType, setDocumentType] = useState('');
  const [description, setDescription] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');

  const documentTypes = [
    'COMPANY_PROFILE',
    'FINANCIAL_REPORT', 
    'PORTFOLIO',
    'CONTRACT',
    'PROPOSAL',
    'INVOICE',
    'MESSAGE_ATTACHMENT',
    'OTHER'
  ];

  const documentTypeLabels = {
    'COMPANY_PROFILE': 'Company Profile',
    'FINANCIAL_REPORT': 'Financial Report',
    'PORTFOLIO': 'Portfolio',
    'CONTRACT': 'Contract',
    'PROPOSAL': 'Proposal',
    'INVOICE': 'Invoice',
    'MESSAGE_ATTACHMENT': 'Message Attachment',
    'OTHER': 'Other'
  };

  const fetchDocuments = useCallback(async () => {
    if (currentClient?.id) {
      try {
        console.log('Fetching documents for clientId:', currentClient.id);
        await dispatch(fetchClientDocuments(currentClient.id)).unwrap();
      } catch (err) {
        console.error("Error fetching documents:", err);
        setNotification({
          open: true,
          message: 'Failed to fetch documents',
          severity: 'error'
        });
      }
    }
  }, [dispatch, currentClient?.id]);

  useEffect(() => {
    const initializeData = async () => {
      if (user?.id && !currentClient) {
        try {
          console.log('Fetching client data for userId:', user.id);
          await dispatch(fetchCurrentClient()).unwrap();
        } catch (err) {
          console.error("Error fetching client:", err);
          setNotification({
            open: true,
            message: 'Failed to fetch client information',
            severity: 'error'
          });
        }
      }
    };

    initializeData();
  }, [dispatch, user?.id, currentClient]);

  useEffect(() => {
    if (currentClient?.id) {
      console.log('Current client loaded:', currentClient);
      fetchDocuments();
    }
  }, [currentClient?.id, fetchDocuments]);

  useEffect(() => {
    if (uploadSuccess) {
      setNotification({
        open: true,
        message: 'Document uploaded successfully',
        severity: 'success'
      });
      handleUploadDialogClose();
    }
  }, [uploadSuccess]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDocuments();
    setTimeout(() => setRefreshing(false), 500);
  };

  const handleUploadDialogOpen = () => {
    setUploadDialogOpen(true);
  };

  const handleUploadDialogClose = () => {
    setUploadDialogOpen(false);
    setFile(null);
    setDocumentType('');
    setDescription('');
    dispatch(clearDocumentStatus());
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

  const handleUploadDocument = async () => {
    if (!file || !documentType) {
      setNotification({
        open: true,
        message: 'Please select a file and document type',
        severity: 'error'
      });
      return;
    }

    if (!currentClient?.id) {
      setNotification({
        open: true,
        message: 'Client information not found',
        severity: 'error'
      });
      return;
    }

    setUploadLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentType', documentType);
      if (description) {
        formData.append('description', description);
      }

      console.log('Uploading document for clientId:', currentClient.id);
      await dispatch(uploadDocument({
        clientId: currentClient.id,
        formData
      })).unwrap();

      await fetchDocuments();
    } catch (err) {
      console.error('Error uploading document:', err);
      setNotification({
        open: true,
        message: 'Error uploading document',
        severity: 'error'
      });
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDeleteDocument = async () => {
    try {
      await dispatch(deleteDocument(selectedDocumentId)).unwrap();
      handleDeleteDialogClose();
      setNotification({
        open: true,
        message: 'Document deleted successfully',
        severity: 'success'
      });
      await fetchDocuments();
    } catch (err) {
      console.error('Error deleting document:', err);
      setNotification({
        open: true,
        message: 'Error deleting document',
        severity: 'error'
      });
    }
  };

  const handleDownloadDocument = (documentId) => {
    dispatch(downloadDocument(documentId));
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
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
    if (!filename) return <DescriptionIcon />;
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
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      if (!(doc.fileName.toLowerCase().includes(searchLower) ||
            (doc.description && doc.description.toLowerCase().includes(searchLower)))) {
        return false;
      }
    }

    if (typeFilter && doc.documentType !== typeFilter) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    let valueA, valueB;
    switch (sortBy) {
      case 'fileName':
        valueA = a.fileName;
        valueB = b.fileName;
        break;
      case 'documentType':
        valueA = a.documentType;
        valueB = b.documentType;
        break;
      case 'fileSize':
        valueA = a.fileSize;
        valueB = b.fileSize;
        break;
      case 'createdAt':
      default:
        valueA = new Date(a.createdAt);
        valueB = new Date(b.createdAt);
    }

    if (sortDirection === 'asc') {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  });

  if (clientLoading || (isLoading && !documents.length)) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Skeleton variant="rectangular" width={200} height={40} />
          <Skeleton variant="rectangular" width={150} height={36} />
        </Box>

        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Skeleton variant="rectangular" height={60} />
        </Paper>

        <Paper elevation={2}>
          <List>
            {[1, 2, 3, 4, 5].map((item) => (
              <React.Fragment key={item}>
                <ListItem>
                  <ListItemIcon>
                    <Skeleton variant="circular" width={40} height={40} />
                  </ListItemIcon>
                  <ListItemText
                    primary={<Skeleton variant="text" width="60%" />}
                    secondary={<Skeleton variant="text" width="40%" />}
                  />
                </ListItem>
                {item < 5 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </Container>
    );
  }

  if (!currentClient) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          Unable to load client information. Please try refreshing the page.
          {user?.id && <div>User ID: {user.id} - Client data not found</div>}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={theme.gradientTextStyle}>My Documents</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <IconButton 
            onClick={handleRefresh} 
            disabled={refreshing}
            sx={{ 
              bgcolor: 'background.paper', 
              boxShadow: 1,
              '&:hover': { boxShadow: 2 }
            }}
          >
            <RefreshIcon sx={{ 
              animation: refreshing ? 'spin 1s linear infinite' : 'none',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' }
              }
            }} />
          </IconButton>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<CloudUploadIcon />}
            onClick={handleUploadDialogOpen}
          >
            Upload Document
          </Button>
        </Box>
      </Box>

      {error && (
        <Fade in={!!error}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        </Fade>
      )}

      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              label="Search documents..."
              value={searchQuery}
              onChange={handleSearch}
              InputProps={{
                endAdornment: searchQuery ? (
                  <IconButton size="small" onClick={handleClearSearch}>
                    <ClearIcon />
                  </IconButton>
                ) : null
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Filter by type</InputLabel>
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                label="Filter by type"
              >
                <MenuItem value="">All types</MenuItem>
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
              <InputLabel>Sort by</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                label="Sort by"
              >
                <MenuItem value="createdAt">Upload date</MenuItem>
                <MenuItem value="fileName">File name</MenuItem>
                <MenuItem value="documentType">Document type</MenuItem>
                <MenuItem value="fileSize">File size</MenuItem>
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
              {sortDirection === 'asc' ? 'Ascending' : 'Descending'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {isLoading ? (
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
                    {getFileIcon(document.fileName)}
                  </ListItemIcon>
                  <ListItemText
                    primary={document.fileName}
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {documentTypeLabels[document.documentType] || document.documentType}
                        </Typography>
                        <Typography component="p" variant="body2">
                          Uploaded on {formatDate(document.createdAt)}
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
                      <Tooltip title="View">
                        <IconButton
                          edge="end"
                          aria-label="view"
                          onClick={() => window.open(`/api/documents/${document.id}/view`, '_blank')}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download">
                        <IconButton
                          edge="end"
                          aria-label="download"
                          onClick={() => handleDownloadDocument(document.id)}
                        >
                          <DownloadIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
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
          <DescriptionIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.3 }} />
          <Typography variant="h6" color="text.secondary">
            No documents found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            {searchQuery || typeFilter
              ? 'Try modifying your search or filter criteria'
              : 'Start by uploading some documents'
            }
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<CloudUploadIcon />}
            onClick={handleUploadDialogOpen}
            sx={{ mt: 3 }}
          >
            Upload Document
          </Button>
        </Paper>
      )}

      <Dialog
        open={uploadDialogOpen}
        onClose={handleUploadDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Upload a New Document</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Please select a file to upload and specify the document type.
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
                Select a file
                <input
                  type="file"
                  hidden
                  onChange={handleFileChange}
                />
              </Button>
              {file && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Selected file: {file.name}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined" required>
                <InputLabel>Document Type</InputLabel>
                <Select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  label="Document Type"
                >
                  <MenuItem value="">Select a type</MenuItem>
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
                label="Description (optional)"
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
            Cancel
          </Button>
          <Button
            onClick={handleUploadDocument}
            color="secondary"
            variant="contained"
            disabled={!file || !documentType || uploadLoading}
            startIcon={uploadLoading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
          >
            {uploadLoading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this document? This action is irreversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Cancel</Button>
          <Button onClick={handleDeleteDocument} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ClientDocumentsPage;