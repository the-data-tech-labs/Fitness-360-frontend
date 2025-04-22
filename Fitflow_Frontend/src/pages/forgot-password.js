import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  CircularProgress,
  Container
} from '@mui/material';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post(
        'http://localhost:8000/api/forgot-password/',
        { email }
      );
      toast.success("Password reset link sent to your email. Please check your inbox.");
      navigate('/signin');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white' // Plain white background
    }}>
      <Box sx={{ 
        width: '100%',
        maxWidth: 400,
        padding: 4,
        textAlign: 'center'
      }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ 
          mb: 3,
          color: '#7b1fa2', // Purple color to match your theme
          fontWeight: 'bold'
        }}>
          Forgot Password
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
          Enter your email and we'll send you a link to reset your password
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            required
            name="email"
            label="Email Address"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 3 }}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ 
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 'bold',
              backgroundColor: '#7b1fa2', // Purple button
              '&:hover': {
                backgroundColor: '#6a1b9a' // Darker purple on hover
              }
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Send Reset Link'
            )}
          </Button>
          
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Button
              onClick={() => navigate('/signin')}
              sx={{
                color: '#7b1fa2', // Purple text
                textTransform: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                  backgroundColor: 'transparent'
                }
              }}
            >
              Back to Sign In
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default ForgotPassword;