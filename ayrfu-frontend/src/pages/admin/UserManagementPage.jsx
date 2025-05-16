// src/pages/admin/UserManagementPage.jsx
import {
  Add as AddIcon,
  Business as BusinessIcon,
  Clear as ClearIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Person as PersonIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import {
  Alert,
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
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

const UserManagementPage = () => {
  const { user } = useAuth();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // États pour la pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // États pour le formulaire utilisateur
  const [formData, setFormData] = useState({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: '',
    isActive: true
  });
  
  const roleOptions = [
    { value: 'ROLE_CANDIDATE', label: 'Candidat' },
    { value: 'ROLE_CLIENT', label: 'Client' }
  ];
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Filtrer pour garder uniquement les candidats et clients (pas les admin/super-user)
      const filteredUsers = response.data.filter(user => 
        !user.roles.some(role => role === 'ROLE_ADMIN' || role === 'ROLE_SUPER_USER' || 
                          role.name === 'ROLE_ADMIN' || role.name === 'ROLE_SUPER_USER')
      );
      
      setUsers(filteredUsers);
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération des utilisateurs:', err);
      setError('Impossible de charger les utilisateurs. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleOpenCreateDialog = () => {
    setFormData({
      id: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: 'ROLE_CANDIDATE',
      isActive: true
    });
    setOpenDialog(true);
  };
  
  const handleOpenEditDialog = (user) => {
    setSelectedUser(user);
    setFormData({
      id: user.id,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      password: '',
      role: user.roles.find(role => role === 'ROLE_CANDIDATE' || role === 'ROLE_CLIENT' || 
                          role.name === 'ROLE_CANDIDATE' || role.name === 'ROLE_CLIENT') || 'ROLE_CANDIDATE',
      isActive: user.isActive !== undefined ? user.isActive : true
    });
    setOpenDialog(true);
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
  };
  
  const handleOpenDeleteDialog = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };
  
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedUser(null);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSaveUser = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const userData = {
        ...formData,
        roles: [formData.role]
      };
      
      if (!userData.id) {
        // Création d'un nouvel utilisateur
        const response = await axios.post('/api/admin/users', userData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setUsers([...users, response.data]);
        setNotification({
          open: true,
          message: 'Utilisateur créé avec succès',
          severity: 'success'
        });
      } else {
        // Mise à jour d'un utilisateur existant
        const response = await axios.put(`/api/admin/users/${userData.id}`, userData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setUsers(users.map(user => (user.id === userData.id ? response.data : user)));
        setNotification({
          open: true,
          message: 'Utilisateur mis à jour avec succès',
          severity: 'success'
        });
      }
      
      handleCloseDialog();
    } catch (err) {
      console.error('Erreur lors de la sauvegarde de l\'utilisateur:', err);
      setNotification({
        open: true,
        message: 'Erreur lors de la sauvegarde de l\'utilisateur',
        severity: 'error'
      });
    }
  };
  
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/admin/users/${selectedUser.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUsers(users.filter(user => user.id !== selectedUser.id));
      setNotification({
        open: true,
        message: 'Utilisateur supprimé avec succès',
        severity: 'success'
      });
      handleCloseDeleteDialog();
    } catch (err) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', err);
      setNotification({
        open: true,
        message: 'Erreur lors de la suppression de l\'utilisateur',
        severity: 'error'
      });
    }
  };
  
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const getRoleLabel = (role) => {
    if (typeof role === 'object' && role.name) {
      role = role.name;
    }
    
    switch (role) {
      case 'ROLE_CANDIDATE':
        return 'Candidat';
      case 'ROLE_CLIENT':
        return 'Client';
      default:
        return role;
    }
  };
  
  const getRoleColor = (role) => {
    if (typeof role === 'object' && role.name) {
      role = role.name;
    }
    
    switch (role) {
      case 'ROLE_CANDIDATE':
        return 'primary';
      case 'ROLE_CLIENT':
        return 'secondary';
      default:
        return 'default';
    }
  };
  
  const getRoleIcon = (role) => {
    if (typeof role === 'object' && role.name) {
      role = role.name;
    }
    
    switch (role) {
      case 'ROLE_CANDIDATE':
        return <PersonIcon fontSize="small" />;
      case 'ROLE_CLIENT':
        return <BusinessIcon fontSize="small" />;
      default:
        return <PersonIcon fontSize="small" />;
    }
  };
  
  // Filtrer et trier les utilisateurs
  const filteredUsers = users.filter(user => {
    if (!searchQuery) return true;
    
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    return (
      fullName.includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });
  
  // Paginer les résultats
  const displayedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  
  const isCreateDisabled = !formData.firstName || !formData.lastName || !formData.email || (!selectedUser && !formData.password);
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          Gestion des utilisateurs
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenCreateDialog}
        >
          Ajouter un utilisateur
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Paper elevation={2} sx={{ width: '100%', mb: 4 }}>
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Rechercher par nom ou e-mail..."
            value={searchQuery}
            onChange={handleSearch}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
              endAdornment: searchQuery ? (
                <IconButton size="small" onClick={() => setSearchQuery('')}>
                  <ClearIcon />
                </IconButton>
              ) : null
            }}
            size="small"
          />
        </Box>
      </Paper>
      
      <Paper elevation={2}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Nom</TableCell>
                <TableCell>E-mail</TableCell>
                <TableCell>Rôle</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : displayedUsers.length > 0 ? (
                displayedUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      {user.firstName} {user.lastName}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {Array.isArray(user.roles) && user.roles.some(role => 
                        role === 'ROLE_CANDIDATE' || role === 'ROLE_CLIENT' || 
                        (typeof role === 'object' && (role.name === 'ROLE_CANDIDATE' || role.name === 'ROLE_CLIENT'))
                      ) && (
                        <Chip
                          icon={getRoleIcon(user.roles.find(role => 
                            role === 'ROLE_CANDIDATE' || role === 'ROLE_CLIENT' ||
                            (typeof role === 'object' && (role.name === 'ROLE_CANDIDATE' || role.name === 'ROLE_CLIENT'))
                          ))}
                          label={getRoleLabel(user.roles.find(role => 
                            role === 'ROLE_CANDIDATE' || role === 'ROLE_CLIENT' ||
                            (typeof role === 'object' && (role.name === 'ROLE_CANDIDATE' || role.name === 'ROLE_CLIENT'))
                          ))}
                          color={getRoleColor(user.roles.find(role => 
                            role === 'ROLE_CANDIDATE' || role === 'ROLE_CLIENT' ||
                            (typeof role === 'object' && (role.name === 'ROLE_CANDIDATE' || role.name === 'ROLE_CLIENT'))
                          ))}
                          size="small"
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.isActive ? 'Actif' : 'Inactif'}
                        color={user.isActive ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Tooltip title="Modifier">
                          <IconButton onClick={() => handleOpenEditDialog(user)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Supprimer">
                          <IconButton
                            color="error"
                            onClick={() => handleOpenDeleteDialog(user)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      {searchQuery
                        ? 'Aucun utilisateur trouvé correspondant à votre recherche'
                        : 'Aucun utilisateur disponible'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          component="div"
          count={filteredUsers.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Lignes par page"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Paper>
      
      {/* Dialogue pour créer/modifier un utilisateur */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedUser ? 'Modifier l\'utilisateur' : 'Ajouter un nouvel utilisateur'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="firstName"
                label="Prénom"
                value={formData.firstName}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="lastName"
                label="Nom"
                value={formData.lastName}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="email"
                label="Adresse e-mail"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="password"
                label={selectedUser ? "Nouveau mot de passe (laisser vide pour ne pas changer)" : "Mot de passe"}
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                fullWidth
                required={!selectedUser}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Rôle</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  label="Rôle"
                >
                  {roleOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {selectedUser && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Statut</InputLabel>
                  <Select
                    name="isActive"
                    value={formData.isActive}
                    onChange={handleInputChange}
                    label="Statut"
                  >
                    <MenuItem value={true}>Actif</MenuItem>
                    <MenuItem value={false}>Inactif</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button
            onClick={handleSaveUser}
            color="primary"
            variant="contained"
            disabled={isCreateDisabled}
          >
            {selectedUser ? 'Enregistrer' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Dialogue de confirmation de suppression */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer l'utilisateur {selectedUser?.firstName} {selectedUser?.lastName} ?
            Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Annuler</Button>
          <Button onClick={handleDeleteUser} color="error" variant="contained">
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
        <Alert onClose={handleCloseNotification} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UserManagementPage;