import React, { useState, useEffect } from 'react';
import { Alert, Snackbar } from '@mui/material';

const AlertMessage = ({ 
  message, 
  severity = 'info', 
  open = false, 
  autoHideDuration = 5000, 
  onClose 
}) => {
  const [isOpen, setIsOpen] = useState(open);
  
  useEffect(() => {
    setIsOpen(open);
  }, [open]);
  
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    
    setIsOpen(false);
    if (onClose) {
      onClose();
    }
  };
  
  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert 
        onClose={handleClose} 
        severity={severity} 
        variant="filled"
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default AlertMessage;