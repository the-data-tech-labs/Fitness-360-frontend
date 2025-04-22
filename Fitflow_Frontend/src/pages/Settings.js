import React, { useState } from "react";
import {
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Avatar,
  IconButton,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";

function Settings() {
  const primaryColor = "#673ab7";  // Purple accent color
  const [profile, setProfile] = useState({
    name: "Richard Jones",
    email: "richard.jones@example.com",
    profilePicture: "/static/images/avatar/1.jpg",
  });
  const [notifications, setNotifications] = useState({
    emailAchievements: true,
    emailReminders: false,
    pushUpdates: true,
  });
  const [theme, setTheme] = useState("light");

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleNotificationsChange = (e) => {
    setNotifications({ ...notifications, [e.target.name]: e.target.checked });
  };

  const handleThemeChange = (e) => {
    setTheme(e.target.value);
  };

  return (
    <Box sx={{ p: 4, bgcolor: "#f8f8ff", minHeight: "100vh", borderRadius: "12px" }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4, color: primaryColor, textAlign: "center", fontFamily: "'Poppins', sans-serif" }}>
        Settings
      </Typography>

      <Grid container spacing={3}>

        {/* Profile Settings */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, borderRadius: "15px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", bgcolor: "white" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: primaryColor }}>Profile</Typography>

            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar alt={profile.name} src={profile.profilePicture} sx={{ width: 56, height: 56, mr: 2 }} />
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>{profile.name}</Typography>
                <Typography variant="body2">{profile.email}</Typography>
              </Box>
              <IconButton sx={{ ml: 'auto' }}> {/* Styling: added margin-left */}
                <EditIcon color="primary" />
              </IconButton>
            </Box>
            <TextField
              label="Name"
              name="name"
              value={profile.name}
              onChange={handleProfileChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Email"
              name="email"
              value={profile.email}
              onChange={handleProfileChange}
              fullWidth
              margin="normal"
            />

            <Button variant="contained" sx={{ mt: 3, bgcolor: primaryColor, color: "white" }}>Update Profile</Button>
          </Card>
        </Grid>

        {/* Notification Settings */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, borderRadius: "15px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", bgcolor: "white" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: primaryColor }}>Notifications</Typography>
            <FormControlLabel
              control={<Switch checked={notifications.emailAchievements} onChange={handleNotificationsChange} name="emailAchievements" color="secondary" />}
              label="Email for Achievements"
            />
            <FormControlLabel
              control={<Switch checked={notifications.emailReminders} onChange={handleNotificationsChange} name="emailReminders" color="secondary" />}
              label="Email Reminders"
            />
            <FormControlLabel
              control={<Switch checked={notifications.pushUpdates} onChange={handleNotificationsChange} name="pushUpdates" color="secondary" />}
              label="Push Notifications for Updates"
            />
          </Card>
        </Grid>

        {/* Theme Selection */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, borderRadius: "15px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", bgcolor: "white" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: primaryColor }}>Theme</Typography>
            <TextField
              select
              label="Select Theme"
              value={theme}
              onChange={handleThemeChange}
              fullWidth
              sx={{ bgcolor: "white" }}
            >
              <MenuItem value="light">Light</MenuItem>
              <MenuItem value="dark">Dark</MenuItem>
              <MenuItem value="system">System Default</MenuItem>
            </TextField>
          </Card>
        </Grid>

        {/* Account Management (Delete Account) */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, borderRadius: "15px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", bgcolor: "white" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: primaryColor }}>Account Management</Typography>
            <Button variant="outlined" color="error" startIcon={<DeleteIcon />} sx={{ borderColor: "#f44336", color: "#f44336" }}>Delete Account</Button>
          </Card>
        </Grid>

      </Grid>
    </Box>
  );
}

export default Settings;