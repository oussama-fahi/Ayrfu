import {
  Box,
  CircularProgress,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import ServiceFormComponent from '../../components/forms/ServiceForm';
import { clearCurrentService, fetchServiceById } from '../../redux/slices/servicesSlice';

const ServiceFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentService, isLoading, error } = useSelector((state) => state.services);
  const [formKey, setFormKey] = useState(0);
  
  const isEditMode = !!id;
  
  useEffect(() => {
    if (isEditMode) {
      dispatch(fetchServiceById(id));
    }
    
    return () => {
      dispatch(clearCurrentService());
    };
  }, [dispatch, id, isEditMode]);
  
  useEffect(() => {
    // Force form re-render when currentService changes
    if (currentService) {
      setFormKey(prev => prev + 1);
    }
  }, [currentService]);
  
  const handleSuccess = () => {
    // Navigate back to services list after successful submission
    navigate('/admin/services');
  };
  
  if (isEditMode && isLoading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (isEditMode && error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }
  
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {isEditMode ? 'Edit Service' : 'Create New Service'}
      </Typography>
      
      <ServiceFormComponent 
        key={formKey}
        serviceId={isEditMode ? id : null}
        onSuccess={handleSuccess}
      />
    </Box>
  );
};

export default ServiceFormPage;