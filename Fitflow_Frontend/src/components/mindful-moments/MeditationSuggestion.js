import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, CircularProgress, Alert } from '@mui/material';
// import AccessTimeIcon from '@mui/icons-material/AccessTime';
import InsightsIcon from '@mui/icons-material/Insights';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import PsychologyIcon from '@mui/icons-material/Psychology';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SpaIcon from '@mui/icons-material/Spa';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
const MeditationSuggestion = () => {
  const [experienceText, setExperienceText] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiError, setApiError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setApiError(null);
    setRecommendations([]);
    
    try {
      const response = await fetch('http://127.0.0.1:8000/meditation/experiences/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          experience_text: experienceText
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle backend validation errors
        const errorMsg = data.detail || data.message || 'Failed to get recommendations';
        throw new Error(errorMsg);
      }

      if (!data.recommendations || data.recommendations.length === 0) {
        setApiError('Received empty recommendations from server');
      } else {
        setRecommendations(data.recommendations);
      }
    } catch (err) {
      console.error('API Error:', err);
      setError(err.message || 'Failed to fetch recommendations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Meditation Guide
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
        Share your current state for guided meditation suggestions
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            placeholder="Describe your current state of mind, feelings, or what you're going through..."
            value={experienceText}
            onChange={(e) => setExperienceText(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={isLoading}
            sx={{ mb: 2 }}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Get Meditation Recommendations'}
          </Button>
        </form>

        {(error || apiError) && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error || apiError}
          </Alert>
        )}
      </Paper>

      {recommendations.length > 0 ? (
  <Box sx={{ mt: 4, px: { xs: 2, md: 4 } }}>
    <Typography variant="h4" sx={{ 
      fontWeight: 700,
      color: '#2D3748',
      mb: 4,
      textAlign: 'center',
      fontFamily: 'inherit',
      position: 'relative',
      '&:after': {
        content: '""',
        display: 'block',
        width: 80,
        height: 4,
        bgcolor: '#6a0080',
        mx: 'auto',
        mt: 2,
        borderRadius: 2
      }
    }}>
      Your Personalized Meditation Prescriptions
    </Typography>
    
    <Box sx={{ display: 'grid', gap: 4 }}>
      {recommendations.map((rec) => (
        <Paper 
          key={rec.id} 
          elevation={0}
          sx={{ 
            p: 4,
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            backgroundColor: '#FFFFFF',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
            borderLeft: '4px solid #6a0080'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ 
              fontWeight: 600,
              color: '#6a0080',
              fontSize: '1.25rem'
            }}>
              {rec.meditation_type}
            </Typography>
            
            <Box sx={{
              bgcolor: '#6a0080',
              color: '#FFFFFF',
              px: 2.5,
              py: 1,
              borderRadius: '20px',
              fontSize: '0.9rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center'
            }}>
              <AccessTimeIcon sx={{ fontSize: '1rem', mr: 1 }} />
              {rec.duration_minutes} min
            </Box>
          </Box>
          
          <Box sx={{ 
            mb: 3,
            borderLeft: '3px solid #6a0080',
            pl: 3
          }}>
            <Typography variant="h6" sx={{
              fontWeight: 700,
              color: '#6a0080',
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              fontSize: '1.1rem'
            }}>
              <SpaIcon sx={{ mr: 1.5, fontSize: '1.5rem', color: '#6a0080' }} />
              Therapeutic Benefits
            </Typography>
            <Typography variant="body1" sx={{ 
              color: '#4A5568',
              lineHeight: 1.7,
              fontSize: '1rem'
            }}>
              {rec.benefits}
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="h6" sx={{
              fontWeight: 700,
              color: '#6a0080',
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              fontSize: '1.1rem'
            }}>
              <SelfImprovementIcon sx={{ mr: 1.5, fontSize: '1.5rem', color: '#6a0080' }} />
              Practice Guidelines
            </Typography>
            <Box sx={{
              backgroundColor: '#F3E5F5',
              p: 3,
              borderRadius: '8px',
              '& p': {
                mb: 2,
                lineHeight: 1.7,
                color: '#2D3748'
              }
            }}>
              {rec.how_to_perform.split('\n\n').map((para, i) => (
                <Typography key={i} component="p">
                  {para}
                </Typography>
              ))}
            </Box>
          </Box>
        </Paper>
      ))}
    </Box>
  </Box>
) : !isLoading && !error && !apiError && (
  <Box sx={{ 
    textAlign: 'center',
    mt: 4,
    p: 6,
    border: '1px dashedrgb(239, 229, 241)',
    borderRadius: '35px',
    maxWidth: 950,
    mx: 'auto',
    backgroundColor: '#F3E5F5'
  }}>
    <SpaIcon sx={{ fontSize: '3rem', color: '#6a0080', mb: 2 }} />
    <Typography variant="h6" sx={{ color: '#2D3748', mb: 1, fontWeight: 600 }}>
      Ready for Your Meditation Journey
    </Typography>
    <Typography variant="body1" sx={{ color: '#718096' }}>
      Share your current state to receive personalized guidance.
    </Typography>
  </Box>
)}
    </Box>
  );
};

export default MeditationSuggestion;