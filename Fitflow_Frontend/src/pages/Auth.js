import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, keyframes } from "@mui/material";
import Signin from "./Signin";
import Signup from "./Signup";

// Define keyframes for animations
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const slideInLeft = keyframes`
  0% { transform: translateX(-100%); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
`;

const slideInRight = keyframes`
  0% { transform: translateX(100%); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
`;

const Auth = ({ handleLogin }) => {
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  // Function to handle successful login/signup and navigate to Dashboard
  const onSuccessfulAuth = (user) => {
    handleLogin(user);
    navigate("/dashboard"); // Redirect to Dashboard after authentication
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Color Block Container - Covers the entire page */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          overflow: "hidden",
        }}
      >
        {/* Left Side - Gradient Background with Text and Button */}
        <Box
          sx={{
            width: "50%",
            height: "100%",
            background: "linear-gradient(135deg, #7b1fa2, #e91e63, #ff4081, #7b1fa2)",
            backgroundSize: "400% 400%",
            animation: `${gradientAnimation} 10s ease infinite, ${slideInLeft} 1s ease-out`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            textAlign: "center",
            color: "white",
            transition: "transform 0.7s cubic-bezier(0.4, 0, 0.2, 1), clip-path 0.7s cubic-bezier(0.4, 0, 0.2, 1)", // Smooth transition with cubic-bezier
            transform: isActive ? "translateX(100%)" : "translateX(0)",
            clipPath: isActive
              ? "polygon(0 0, 75% 0, 100% 50%, 75% 100%, 0 100%)"
              : "polygon(25% 0, 100% 0, 100% 100%, 25% 100%, 0 50%)",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              mb: 2,
              fontSize: "2.5rem",
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
            }}
          >
            {isActive ? "Already a Member?" : "Not a Member?"}
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, fontSize: "1.2rem", opacity: 0.9 }}>
            {isActive
              ? "Please sign in to access the admin panel."
              : "Please sign up to unlock the content."}
          </Typography>

          <Button
            variant="outlined"
            sx={{
              color: "white",
              borderColor: "white",
              "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
              mt: 4,
              fontSize: "1.1rem",
              padding: "10px 30px",
              borderRadius: "25px",
              textTransform: "none",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.3)",
              },
            }}
            onClick={handleToggle}
          >
            {isActive ? "Sign In" : "Sign Up"}
          </Button>
        </Box>

        {/* Right Side - Form */}
        <Box
          sx={{
            width: "50%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
            animation: `${slideInRight} 1s ease-out`,
            transition: "transform 0.7s cubic-bezier(0.4, 0, 0.2, 1), clip-path 0.7s cubic-bezier(0.4, 0, 0.2, 1)", // Smooth transition with cubic-bezier
            transform: isActive ? "translateX(-100%)" : "translateX(0)",
            clipPath: isActive
              ? "polygon(25% 0, 100% 0, 100% 100%, 25% 100%, 0 50%)"
              : "polygon(0 0, 75% 0, 100% 50%, 75% 100%, 0 100%)",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          {isActive ? (
            <Signup handleLogin={onSuccessfulAuth} isActive={isActive} onClick={handleToggle} />
          ) : (
            <Signin handleLogin={onSuccessfulAuth} isActive={isActive} onClick={handleToggle} />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Auth;