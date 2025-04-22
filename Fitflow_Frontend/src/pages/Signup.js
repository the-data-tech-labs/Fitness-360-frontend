import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  InputAdornment,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

const Signup = ({ handleLogin }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Validation functions for sign-up form
  const validateUsername = (username) => {
    if (username.length < 4 || username.length > 20) {
      return "Username must be between 4 and 20 characters.";
    }
    if (!/^[A-Za-z0-9_-]+$/.test(username)) {
      return "Username can only contain letters, digits, underscores, and hyphens.";
    }
    if (!/[A-Z]/.test(username)) {
      return "Username must contain at least one uppercase letter.";
    }
    return "";
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address.";
    }
    return "";
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long.";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter.";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter.";
    }
    if (!/\d/.test(password)) {
      return "Password must contain at least one digit.";
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return "Password must contain at least one special character.";
    }
    return "";
  };

  const validateConfirmPassword = (confirm_password, password) => {
    if (confirm_password !== password) {
      return "Passwords do not match.";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Clear error on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    const usernameError = validateUsername(formData.username);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(formData.confirm_password, formData.password);

    if (usernameError || emailError || passwordError || confirmPasswordError) {
      setErrors({
        username: usernameError,
        email: emailError,
        password: passwordError,
        confirm_password: confirmPasswordError,
      });
      return;
    }

    setIsLoading(true);

    try {
      // Submit the initial sign-up data
      const response = await axios.post("http://127.0.0.1:8000/api/users/register/", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirm_password,
      });

      // Redirect to sign-in page after successful sign-up
      navigate("/Signin");
    } catch (err) {
      setIsLoading(false);
      console.error("Signup Error:", err.response?.data);
      if (err.response) {
        setErrors({
          username: err.response.data.username || "",
          email: err.response.data.email || "",
          password: err.response.data.password || "Signup failed",
          confirm_password: err.response.data.confirmPassword || "",
        });
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: "100%", maxWidth: "700px", textAlign: "center" }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: "bold",
            mb: 4,
            color: "#7b1fa2",
            fontSize: { xs: "28px", sm: "32px" },
          }}
        >
          Create Account
        </Typography>

        {errors.username || errors.email || errors.password || errors.confirm_password ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errors.username || errors.email || errors.password || errors.confirm_password}
          </Alert>
        ) : null}

        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              name="username"
              label="Username"
              variant="outlined"
              margin="normal"
              value={formData.username}
              onChange={handleChange}
              error={!!errors.username}
              helperText={errors.username}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FontAwesomeIcon icon={faUser} style={{ color: "#7b1fa2" }} />
                  </InputAdornment>
                ),
                style: { height: "60px", padding: "12px 14px" },
              }}
              inputProps={{
                style: { height: "36px", padding: "12px 14px" },
              }}
              required
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              name="email"
              label="Email"
              variant="outlined"
              margin="normal"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FontAwesomeIcon icon={faEnvelope} style={{ color: "#7b1fa2" }} />
                  </InputAdornment>
                ),
                style: { height: "60px", padding: "12px 14px" },
              }}
              inputProps={{
                style: { height: "36px", padding: "12px 14px" },
              }}
              required
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              name="password"
              label="Password"
              type="password"
              variant="outlined"
              margin="normal"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FontAwesomeIcon icon={faLock} style={{ color: "#7b1fa2" }} />
                  </InputAdornment>
                ),
                style: { height: "60px", padding: "12px 14px" },
              }}
              inputProps={{
                style: { height: "36px", padding: "12px 14px" },
              }}
              required
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              name="confirm_password"
              label="Confirm Password"
              type="password"
              variant="outlined"
              margin="normal"
              value={formData.confirm_password}
              onChange={handleChange}
              error={!!errors.confirm_password}
              helperText={errors.confirm_password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FontAwesomeIcon icon={faLock} style={{ color: "#7b1fa2" }} />
                  </InputAdornment>
                ),
                style: { height: "60px", padding: "12px 14px" },
              }}
              inputProps={{
                style: { height: "36px", padding: "12px 14px" },
              }}
              required
            />
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              backgroundColor: "#7b1fa2",
              color: "white",
              "&:hover": { backgroundColor: "#e91e63" },
              padding: "12px",
              fontSize: "16px",
              fontWeight: "bold",
              textTransform: "none",
              borderRadius: "8px",
            }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
          </Button>
        </form>
      </motion.div>
    </Box>
  );
};

export default Signup;