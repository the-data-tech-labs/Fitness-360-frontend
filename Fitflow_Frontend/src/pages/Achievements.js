import React, { useState } from "react";
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

function Achievements() {
  const primaryColor = "#673ab7";  // Consistent theme color
  const [achievements, setAchievements] = useState([
    {
      title: "First Workout!",
      description: "Completed your first workout on FitFlow.",
      icon: <CheckCircleIcon />,
    },
    {
      title: "5 Workouts Completed",
      description: "You've reached 5 workouts.",
      icon: <EmojiEventsIcon />,
    },
    {
      title: "Consistent Week",
      description: "Worked out for 7 consecutive days.",
      icon: <EmojiEventsIcon />,
    },
  ]);

  return (
    <Box sx={{ p: 4, bgcolor: "#f8f8ff", minHeight: "100vh", borderRadius: "12px" }}> {/* Updated main box */}
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4, color: primaryColor, textAlign: "center", fontFamily: "'Poppins', sans-serif" }}>
        My Achievements
      </Typography>

      <Grid container spacing={3} justifyContent="center"> {/* Added justifyContent */}
        {achievements.map((achievement, index) => (
          <Grid item xs={12} sm={6} md={4} key={index} sx={{ mt: 2 }}>  {/* Add margin-top here */}
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",  // Stack avatar and content vertically
                alignItems: "flex-start",   // Align items to the start of the card
                p: 3,
                borderRadius: "15px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0 6px 15px rgba(0,0,0,0.25)",
                },
                bgcolor: "white",
                height: "100%",
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                <Avatar sx={{ bgcolor: primaryColor, color: "white", mr: 2, width: 50, height: 50 }}>
                  {achievement.icon}
                </Avatar>
                <Box>
                  <Typography variant="h6" component="div" sx={{ fontWeight: "bold", color: primaryColor, mb: 0.5 }}>
                    {achievement.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ fontSize: "0.9rem" }}>
                    {achievement.description}
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Achievements;