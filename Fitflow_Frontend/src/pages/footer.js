import React from 'react';
import { Box, Typography, Link, Grid, IconButton } from '@mui/material';
import { Facebook, Instagram, Twitter, LinkedIn } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#010314', // Dark background for the footer itself
        color: '#fff',
        padding: '40px 20px', // Padding around the footer content
        mt: '20px', // Adding a small gap between the footer and the content above
        boxSizing: 'border-box',
        position: 'relative', // To add a gradient overlay to the top
      }}
    >
      {/* Gradient Background to add purple and black gradient at the top */}
      <Box
        sx={{
          position: 'absolute',
          top: -20, // This moves the gradient effect above the footer with a little gap
          left: 0,
          width: '100%',
          height: '30px', // Adjust the height of the gradient gap
          background: 'linear-gradient(to top, #4a0066, #010314)', // Purple to black gradient
        }}
      />
      
      <Grid container spacing={3} justifyContent="center">
        {/* Left Section: Contact Info */}
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            FitFlow
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Your journey to fitness and nutrition starts here.
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Email: <Link href="mailto:support@fitflow.com" color="inherit" sx={{ textDecoration: 'none' }}>support@fitflow.com</Link>
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Phone: +123 456 7890
          </Typography>
        </Grid>

        {/* Middle Section: Links */}
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            Quick Links
          </Typography>
          <Box>
            <Link href="#" color="inherit" sx={{ display: 'block', mb: 1, textDecoration: 'none', '&:hover': { color: '#9c4bff' } }}>
              Home
            </Link>
            <Link href="#services-section" color="inherit" sx={{ display: 'block', mb: 1, textDecoration: 'none', '&:hover': { color: '#9c4bff' } }}>
              Services
            </Link>
            <Link href="#about" color="inherit" sx={{ display: 'block', mb: 1, textDecoration: 'none', '&:hover': { color: '#9c4bff' } }}>
              About Us
            </Link>
            <Link href="#contact" color="inherit" sx={{ display: 'block', mb: 1, textDecoration: 'none', '&:hover': { color: '#9c4bff' } }}>
              Contact
            </Link>
          </Box>
        </Grid>

        {/* Right Section: Social Media Links */}
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            Follow Us
          </Typography>
          <Box>
            <IconButton
              href="https://facebook.com"
              target="_blank"
              color="inherit"
              sx={{ '&:hover': { color: '#9c4bff' } }}
            >
              <Facebook />
            </IconButton>
            <IconButton
              href="https://instagram.com"
              target="_blank"
              color="inherit"
              sx={{ '&:hover': { color: '#9c4bff' } }}
            >
              <Instagram />
            </IconButton>
            <IconButton
              href="https://twitter.com"
              target="_blank"
              color="inherit"
              sx={{ '&:hover': { color: '#9c4bff' } }}
            >
              <Twitter />
            </IconButton>
            <IconButton
              href="https://linkedin.com"
              target="_blank"
              color="inherit"
              sx={{ '&:hover': { color: '#9c4bff' } }}
            >
              <LinkedIn />
            </IconButton>
          </Box>
        </Grid>
      </Grid>

      {/* Copyright Section */}
      <Box
        sx={{
          borderTop: '1px solid #444', // Adding a border for separation
          textAlign: 'center',
          paddingTop: '20px',
          marginTop: '30px',
        }}
      >
        <Typography variant="body2">
          &copy; {new Date().getFullYear()} FitFlow. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
