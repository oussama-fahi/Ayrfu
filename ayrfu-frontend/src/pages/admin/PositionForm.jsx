import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  CircularProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PositionFormComponent from '../../components/forms/PositionForm';
import { 
  fetchPositionById, 
  clearCurrentPosition
} from '../../redux/slices/positionsSlice';

const PositionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentPosition, isLoading, error } = useSelector((state) => state.positions);
  
  const [formKey, setFormKey] = useState(0);
  
  const isEditMode = !!id;
  
  useEffect(() => {
    if (isEditMode) {
      dispatch(fetchPositionById(id));
    }
    
    return () => {
      dispatch(clearCurrentPosition());
    };
  }, [dispatch, id, isEditMode]);
  
  useEffect(() => {
    // Force form re-render when currentPosition changes
    if (currentPosition) {
      setFormKey(prev => prev + 1);
    }
  }, [currentPosition]);
  
  const handleSuccess = () => {
    // Navigate back to positions list after successful submission
    navigate('/admin/positions');
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
        {isEditMode ? 'Edit Position' : 'Create New Position'}
      </Typography>
      
      <PositionFormComponent 
        key={formKey}
        positionId={isEditMode ? id : null}
        onSuccess={handleSuccess}
      />
    </Box>
  );
};

export default PositionForm;