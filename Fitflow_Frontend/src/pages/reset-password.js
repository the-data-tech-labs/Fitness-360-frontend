import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  CircularProgress,
  Container,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
    showPassword: false,
    showConfirmPassword: false
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { uidb64, token } = useParams();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClickShowPassword = () => {
    setFormData(prev => ({
      ...prev,
      showPassword: !prev.showPassword
    }));
  };

  const handleClickShowConfirmPassword = () => {
    setFormData(prev => ({
      ...prev,
      showConfirmPassword: !prev.showConfirmPassword
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    
    if (formData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axios.post(
        `http://localhost:8000/api/reset-password/${uidb64}/${token}/`,
        { 
          new_password: formData.newPassword 
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      toast.success("Password reset successfully! You can now sign in with your new password.");
      navigate('/signin');
    } catch (error) {
      const errorMsg = error.response?.data?.error || 
                     error.response?.data?.detail || 
                     'Password reset failed. The link may have expired.';
      
      toast.error(errorMsg);
      
      if (error.response?.status === 400) {
        navigate('/forgot-password');
      }
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
      padding: 3,
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
          Reset Your Password
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            margin="normal"
            required
            name="newPassword"
            label="New Password"
            type={formData.showPassword ? 'text' : 'password'}
            value={formData.newPassword}
            onChange={handleChange}
            inputProps={{ minLength: 8 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    edge="end"
                    sx={{ color: '#7b1fa2' }} // Purple icon
                  >
                    {formData.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            sx={{ mb: 2 }}
          />
          
          <TextField
            fullWidth
            margin="normal"
            required
            name="confirmPassword"
            label="Confirm Password"
            type={formData.showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowConfirmPassword}
                    edge="end"
                    sx={{ color: '#7b1fa2' }} // Purple icon
                  >
                    {formData.showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
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
              mt: 2,
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
              'Reset Password'
            )}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ResetPassword;