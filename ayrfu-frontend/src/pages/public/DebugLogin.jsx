// src/pages/public/DebugLogin.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Box,
  Alert,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  TextareaAutosize
} from '@mui/material';

const DebugLogin = () => {
  const [url, setUrl] = useState('/api/auth/login');
  const [method, setMethod] = useState('POST');
  const [contentType, setContentType] = useState('application/json');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [additionalHeaders, setAdditionalHeaders] = useState('');
  const [requestBody, setRequestBody] = useState('');
  const [withCredentials, setWithCredentials] = useState(false);
  
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Generate request body based on current inputs
  const generateRequestBody = () => {
    const body = JSON.stringify({
      email: email,
      password: password
    }, null, 2);
    
    setRequestBody(body);
  };
  
  // Parse headers from string to object
  const parseHeaders = () => {
    try {
      if (!additionalHeaders.trim()) return {};
      
      const headers = {};
      const headerLines = additionalHeaders.split('\n');
      
      headerLines.forEach(line => {
        if (!line.trim()) return;
        
        const [key, value] = line.split(':').map(part => part.trim());
        if (key && value) {
          headers[key] = value;
        }
      });
      
      return headers;
    } catch (err) {
      console.error('Error parsing headers:', err);
      return {};
    }
  };
  
  const handleSendRequest = async () => {
    setIsLoading(true);
    setResponse(null);
    setError(null);
    
    try {
      const headers = {
        'Content-Type': contentType,
        ...parseHeaders()
      };
      
      const requestOptions = {
        method,
        url,
        headers,
        withCredentials
      };
      
      if (method !== 'GET' && requestBody) {
        requestOptions.data = JSON.parse(requestBody);
      }
      
      console.log('Sending request with options:', requestOptions);
      
      const result = await axios(requestOptions);
      
      setResponse({
        status: result.status,
        statusText: result.statusText,
        headers: result.headers,
        data: result.data
      });
      
      // If login was successful and returned a token, store it
      if (result.data && result.data.token) {
        localStorage.setItem('token', result.data.token);
        console.log('Token stored in localStorage');
      }
      
    } catch (err) {
      console.error('Request failed:', err);
      
      setError({
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          API Request Debugger
        </Typography>
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Request Configuration
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Method</InputLabel>
              <Select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                label="Method"
              >
                <MenuItem value="GET">GET</MenuItem>
                <MenuItem value="POST">POST</MenuItem>
                <MenuItem value="PUT">PUT</MenuItem>
                <MenuItem value="DELETE">DELETE</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </Box>
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Content Type</InputLabel>
            <Select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              label="Content Type"
            >
              <MenuItem value="application/json">application/json</MenuItem>
              <MenuItem value="application/x-www-form-urlencoded">application/x-www-form-urlencoded</MenuItem>
              <MenuItem value="multipart/form-data">multipart/form-data</MenuItem>
            </Select>
          </FormControl>
          
          <FormControlLabel
            control={
              <Switch
                checked={withCredentials}
                onChange={(e) => setWithCredentials(e.target.checked)}
              />
            }
            label="Include credentials (cookies, HTTP authentication)"
          />
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Authentication
          </Typography>
          
          <TextField
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          <Button 
            variant="outlined" 
            onClick={generateRequestBody}
            sx={{ mb: 2 }}
          >
            Generate Request Body
          </Button>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Additional Headers (one per line, format: Key: Value)
          </Typography>
          
          <TextareaAutosize
            minRows={3}
            placeholder="X-Custom-Header: value"
            style={{ width: '100%', padding: '8px' }}
            value={additionalHeaders}
            onChange={(e) => setAdditionalHeaders(e.target.value)}
          />
        </Box>
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Request Body (JSON)
          </Typography>
          
          <TextareaAutosize
            minRows={5}
            placeholder='{"email": "user@example.com", "password": "password"}'
            style={{ width: '100%', padding: '8px', fontFamily: 'monospace' }}
            value={requestBody}
            onChange={(e) => setRequestBody(e.target.value)}
          />
        </Box>
        
        <Button
          variant="contained"
          color="primary"
          onClick={handleSendRequest}
          disabled={isLoading}
        >
          {isLoading ? 'Sending...' : 'Send Request'}
        </Button>
        
        <Divider sx={{ my: 4 }} />
        
        <Box>
          <Typography variant="h6" gutterBottom>
            Response
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Error: {error.message}
              </Typography>
              {error.status && (
                <Typography variant="body2">
                  Status: {error.status} {error.statusText}
                </Typography>
              )}
              {error.data && (
                <>
                  <Typography variant="body2" sx={{ mt: 1, mb: 1 }}>
                    Response Data:
                  </Typography>
                  <Box 
                    component="pre"
                    sx={{ 
                      maxHeight: 300, 
                      overflow: 'auto',
                      backgroundColor: '#f5f5f5',
                      p: 2,
                      borderRadius: 1
                    }}
                  >
                    {JSON.stringify(error.data, null, 2)}
                  </Box>
                </>
              )}
            </Alert>
          )}
          
          {response && (
            <Alert severity="success" sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Status: {response.status} {response.statusText}
              </Typography>
              
              <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>
                Response Data:
              </Typography>
              <Box 
                component="pre"
                sx={{ 
                  maxHeight: 300, 
                  overflow: 'auto',
                  backgroundColor: '#f5f5f5',
                  p: 2,
                  borderRadius: 1
                }}
              >
                {JSON.stringify(response.data, null, 2)}
              </Box>
            </Alert>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default DebugLogin;