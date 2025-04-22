import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { Logout as LogoutIcon, Settings as SettingsIcon, Person as PersonIcon } from "@mui/icons-material";

const TopBar = ({ isLoggedIn, userData, handleLogout }) => {
  const [anchorEl, setAnchorEl] = useState(null); // For dropdown menu
  const navigate = useNavigate();

  // Open dropdown menu
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close dropdown menu
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Handle logout
  const handleLogoutClick = () => {
    handleLogout(); // Call the logout function passed from App.js
    handleMenuClose(); // Close the dropdown menu
    navigate("/"); // Redirect to the homepage
  };

  return (
    <AppBar
      position="static"
      sx={{
        background: "linear-gradient(to right, #010314, #010314)", // Black background
        boxShadow: "none", // Remove shadow
        borderBottom: "4px solid #6a0080", // Purple border line
      }}
    >
      <Toolbar>
        {/* Logo */}
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            fontWeight: "bold",
            textDecoration: "none",
            color: "#d3a0f3", // Light purple for FitFlow text color
            fontSize: "24px", // Adjust the font size for a modern look
          }}
        >
          FitFlow
        </Typography>

        {/* Navigation Links */}
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Button
            color="inherit"
            component={Link}
            to="/Dashboard"
            sx={{
              "&:hover": {
                backgroundColor: "#6a0080", // Darker purple for hover effect
                transform: "scale(1.2)", // Scaling the button
                transition: "all 0.3s ease", // Smooth transition for scaling and background color
              },
              textTransform: "none", // Remove uppercase transformation
            }}
          >
            Home
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/Services"
            sx={{
              "&:hover": {
                backgroundColor: "#6a0080",
                transform: "scale(1.2)",
                transition: "all 0.3s ease",
              },
              textTransform: "none",
            }}
          >
            Services
          </Button>

          {/* User Menu (Conditional Rendering) */}
          {isLoggedIn ? (
            <>
              <IconButton onClick={handleMenuOpen} sx={{ color: "white" }}>
                <Avatar sx={{ bgcolor: "white", color: "#6a0080" }}>
                  {userData?.username?.charAt(0) || "U"} {/* Display first letter of username */}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                sx={{ mt: 1 }}
              >
                {/* User Details */}
                <MenuItem disabled>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      {userData?.username || "User"}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      {userData?.email || "user@example.com"}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      Height: {userData?.height || "N/A"} cm
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      Weight: {userData?.weight || "N/A"} kg
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      Gender: {userData?.gender || "N/A"}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      Age: {userData?.age || "N/A"}
                    </Typography>
                  </Box>
                </MenuItem>

                {/* Profile Link */}
                <MenuItem onClick={() => navigate("/profile")}>
                  <PersonIcon sx={{ mr: 1 }} /> Profile
                </MenuItem>

                {/* Settings Link */}
                <MenuItem onClick={() => navigate("/settings")}>
                  <SettingsIcon sx={{ mr: 1 }} /> Settings
                </MenuItem>

                {/* Logout Option */}
                <MenuItem onClick={() => navigate("/Auth")}>
                  <LogoutIcon sx={{ mr: 1 }} /> Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              {/* Sign Up and Login Buttons */}
              <Button
                color="inherit"
                component={Link}
                to="/auth" // Updated to point to /auth
                sx={{
                  "&:hover": {
                    backgroundColor: "#6a0080",
                    transform: "scale(1.2)",
                    transition: "all 0.3s ease",
                  },
                  textTransform: "none",
                }}
              >
                Signup / Login
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;