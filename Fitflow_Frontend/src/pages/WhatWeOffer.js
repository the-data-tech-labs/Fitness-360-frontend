import React from "react";
import { Box, Typography, List, ListItem, ListItemText, Card } from "@mui/material";

const WhatWeOffer = () => {
  return (
    <Box
      sx={{
        background: "linear-gradient(90deg, #2e003e, #000000)", // Dark purple to black gradient for the background
        color: "#fff",
        padding: { xs: "30px 20px", md: "40px 30px" }, // Smaller padding for a compact layout
        display: "flex",
        flexDirection: { xs: "column", md: "row" }, // Stack vertically on small screens, horizontally on medium and above
        justifyContent: "center",
        alignItems: "center",
        minHeight: "auto", // Remove unnecessary height to make it shorter
      }}
    >
      {/* Left Side: Image */}
      <Box
        sx={{
          flex: 1,
          maxWidth: "45%", // Reduce the size of the image to make space for the text
          paddingRight: { xs: 0, md: "20px" },
          marginBottom: { xs: "20px", md: "0" }, // Space below image on small screens
        }}
      >
        <img
          src="whatweoffer.png" // Replace with your large image
          alt="Fitness"
          style={{
            width: "100%",
            height: "auto",
            objectFit: "cover", // Ensure the image covers the area without distortion
            borderRadius: "8px", // Rounded corners for a professional look
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", // Shadow for depth
          }}
        />
      </Box>

      {/* Right Side: Text Content */}
      <Box
        sx={{
          flex: 1,
          textAlign: "left",
          paddingLeft: { xs: 0, md: "30px" },
          maxWidth: "500px", // Restrict text width for better readability
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 600, // Slightly lighter than bold for a more professional feel
            marginBottom: "16px",
            color: "#d3a0f3", // Light purple title color
            fontSize: { xs: "1.8rem", md: "2.2rem" }, // Adjust font size based on screen size
            lineHeight: 1.3, // Tighten line height for a more professional look
          }}
        >
          What We Offer
        </Typography>
        <Typography
          variant="h5"
          sx={{
            marginBottom: "20px",
            color: "#fff",
            fontSize: { xs: "1rem", md: "1.1rem" }, // Adjust font size for different screen sizes
            lineHeight: 1.6, // Improved line height for readability
            fontWeight: 400, // Slightly lighter font weight for text body
          }}
        >
          We offer personalized fitness and nutrition plans that are designed to suit your unique needs and goals.
        </Typography>

        {/* List of Services */}
        <Card
          sx={{
            background: "rgba(255, 255, 255, 0.1)", // Subtle background for contrast
            borderRadius: "8px",
            padding: "16px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", // Shadow for depth
          }}
        >
          <List sx={{ color: "#fff" }}>
            <ListItem
              sx={{
                position: "relative",
                cursor: "pointer",
                padding: "12px",
                borderRadius: "8px",
                "&:hover .dropdown-text": {
                  display: "block", // Show dropdown text on hover
                },
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)", // Add hover effect on background color
                },
              }}
            >
              <ListItemText
                primary="Personalized Fitness Plans"
                sx={{
                  fontSize: "1rem",
                  lineHeight: 1.5,
                }}
              />
              <Box
                className="dropdown-text"
                sx={{
                  display: "none", // Hidden by default
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  background: "linear-gradient(90deg, #2e003e, #000000)", // Dark purple to black gradient
                  color: "#fff",
                  padding: "10px",
                  borderRadius: "8px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                  marginTop: "8px",
                  width: "100%",
                  fontSize: "0.9rem",
                  zIndex: 10,
                }}
              >
                Tailored fitness programs to help you reach your personal health and fitness goals.
              </Box>
            </ListItem>
            <ListItem
              sx={{
                position: "relative",
                cursor: "pointer",
                padding: "12px",
                borderRadius: "8px",
                "&:hover .dropdown-text": {
                  display: "block", // Show dropdown text on hover
                },
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)", // Add hover effect on background color
                },
              }}
            >
              <ListItemText
                primary="Nutrition Guidance"
                sx={{
                  fontSize: "1rem",
                  lineHeight: 1.5,
                }}
              />
              <Box
                className="dropdown-text"
                sx={{
                  display: "none", // Hidden by default
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  background: "linear-gradient(90deg, #2e003e, #000000)", // Dark purple to black gradient
                  color: "#fff",
                  padding: "10px",
                  borderRadius: "8px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                  marginTop: "8px",
                  width: "100%",
                  fontSize: "0.9rem",
                  zIndex: 10,
                }}
              >
                Expert advice to optimize your diet for better health and enhanced performance.
              </Box>
            </ListItem>
            <ListItem
              sx={{
                position: "relative",
                cursor: "pointer",
                padding: "12px",
                borderRadius: "8px",
                "&:hover .dropdown-text": {
                  display: "block", // Show dropdown text on hover
                },
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)", // Add hover effect on background color
                },
              }}
            >
              <ListItemText
                primary="Fitness Tracking"
                sx={{
                  fontSize: "1rem",
                  lineHeight: 1.5,
                }}
              />
              <Box
                className="dropdown-text"
                sx={{
                  display: "none", // Hidden by default
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  background: "linear-gradient(90deg, #2e003e, #000000)", // Dark purple to black gradient
                  color: "#fff",
                  padding: "10px",
                  borderRadius: "8px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                  marginTop: "8px",
                  width: "100%",
                  fontSize: "0.9rem",
                  zIndex: 10,
                }}
              >
                Track your progress with intuitive and easy-to-use fitness tracking tools.
              </Box>
            </ListItem>
            <ListItem
              sx={{
                position: "relative",
                cursor: "pointer",
                padding: "12px",
                borderRadius: "8px",
                "&:hover .dropdown-text": {
                  display: "block", // Show dropdown text on hover
                },
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)", // Add hover effect on background color
                },
              }}
            >
              <ListItemText
                primary="Motivational Support"
                sx={{
                  fontSize: "1rem",
                  lineHeight: 1.5,
                }}
              />
              <Box
                className="dropdown-text"
                sx={{
                  display: "none", // Hidden by default
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  background: "linear-gradient(90deg, #2e003e, #000000)", // Dark purple to black gradient
                  color: "#fff",
                  padding: "10px",
                  borderRadius: "8px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                  marginTop: "8px",
                  width: "100%",
                  fontSize: "0.9rem",
                  zIndex: 10,
                }}
              >
                Consistent support and a community-driven environment to help you stay on track.
              </Box>
            </ListItem>
          </List>
        </Card>
      </Box>
    </Box>
  );
};

export default WhatWeOffer;
 