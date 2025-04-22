import React, { useState } from "react";
import { InputAdornment } from "@mui/material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  RadioGroup,
  Radio,
  FormControlLabel,
  Button,
  Stepper,
  Step,
  StepLabel,
  LinearProgress,
  Box,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRulerVertical, faWeightScale } from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const AdditionalInfoPopup = ({ open, onClose, onSubmit }) => {
  const [additionalData, setAdditionalData] = useState({
    height: "",
    weight: "",
    gender: "",
    age: 18, // Default age
  });
  const [errors, setErrors] = useState({
    height: "",
    weight: "",
    gender: "",
    age: "",
  });
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();

  const steps = ["Height", "Weight", "Gender", "Age"];

  const validateHeight = (height) => {
    if (isNaN(height) || height <= 0) {
      return "Please enter a valid height.";
    }
    return "";
  };

  const validateWeight = (weight) => {
    if (isNaN(weight) || weight <= 0) {
      return "Please enter a valid weight.";
    }
    return "";
  };

  const validateAge = (age) => {
    if (isNaN(age) || age <= 0) {
      return "Please enter a valid age.";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdditionalData({ ...additionalData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = () => {
    const heightError = validateHeight(additionalData.height);
    const weightError = validateWeight(additionalData.weight);
    const ageError = validateAge(additionalData.age);

    if (heightError || weightError || ageError || !additionalData.gender) {
      setErrors({
        height: heightError,
        weight: weightError,
        age: ageError,
        gender: !additionalData.gender ? "Please select a gender." : "",
      });
      return;
    }

    onSubmit(additionalData); // Pass data to parent component
    onClose(); // Close the popup
    navigate("/dashboard"); // Redirect to Dashboard
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Please tell us your height
            </Typography>
            <TextField
              fullWidth
              name="height"
              label="Height (cm)"
              variant="outlined"
              value={additionalData.height}
              onChange={handleChange}
              error={!!errors.height}
              helperText={errors.height}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FontAwesomeIcon icon={faRulerVertical} style={{ color: "#7b1fa2" }} />
                  </InputAdornment>
                ),
              }}
              required
            />
          </Box>
        );
      case 1:
        return (
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Please tell us your weight
            </Typography>
            <TextField
              fullWidth
              name="weight"
              label="Weight (kg)"
              variant="outlined"
              value={additionalData.weight}
              onChange={handleChange}
              error={!!errors.weight}
              helperText={errors.weight}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FontAwesomeIcon icon={faWeightScale} style={{ color: "#7b1fa2" }} />
                  </InputAdornment>
                ),
              }}
              required
            />
          </Box>
        );
      case 2:
        return (
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Please select your gender
            </Typography>
            <RadioGroup
              name="gender"
              value={additionalData.gender}
              onChange={handleChange}
              sx={{ justifyContent: "center" }}
            >
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel value="female" control={<Radio />} label="Female" />
              <FormControlLabel value="other" control={<Radio />} label="Other" />
            </RadioGroup>
            {errors.gender && (
              <Typography variant="caption" color="error">
                {errors.gender}
              </Typography>
            )}
          </Box>
        );
      case 3:
        return (
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Please tell us your age
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
              }}
            >
              <Button
                onClick={() => {
                  const newAge = Math.max(17, additionalData.age - 1);
                  handleChange({
                    target: { name: "age", value: newAge },
                  });
                }}
                sx={{ minWidth: "40px" }}
              >
                ▲
              </Button>
              <Typography variant="h5">{additionalData.age}</Typography>
              <Button
                onClick={() => {
                  const newAge = Math.min(100, additionalData.age + 1);
                  handleChange({
                    target: { name: "age", value: newAge },
                  });
                }}
                sx={{ minWidth: "40px" }}
              >
                ▼
              </Button>
            </Box>
            {errors.age && (
              <Typography variant="caption" color="error">
                {errors.age}
              </Typography>
            )}
          </Box>
        );
      default:
        return "Unknown step";
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          padding: "24px",
          background: "#ffffff",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <DialogTitle>
        <Typography
          variant="h6"
          component="h2"
          sx={{
            fontWeight: "bold",
            color: "#7b1fa2",
            textAlign: "center",
            fontSize: "24px",
          }}
        >
          Additional Information
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <LinearProgress
          variant="determinate"
          value={((activeStep + 1) / steps.length) * 100}
          sx={{ mb: 2 }}
        />
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ mt: 2 }}>
              {getStepContent(activeStep)}
            </Box>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
      <DialogActions sx={{ padding: "16px 24px" }}>
        <Button
          onClick={handleBack}
          disabled={activeStep === 0}
          color="secondary"
          sx={{
            borderRadius: "8px",
            padding: "8px 16px",
            textTransform: "none",
            fontWeight: "bold",
          }}
        >
          Back
        </Button>
        {activeStep === steps.length - 1 ? (
          <Button
            onClick={handleSubmit}
            color="primary"
            sx={{
              borderRadius: "8px",
              padding: "8px 16px",
              textTransform: "none",
              fontWeight: "bold",
              backgroundColor: "#7b1fa2",
              "&:hover": { backgroundColor: "#e91e63" },
            }}
          >
            Submit
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            color="primary"
            sx={{
              borderRadius: "8px",
              padding: "8px 16px",
              textTransform: "none",
              fontWeight: "bold",
              backgroundColor: "#7b1fa2",
              "&:hover": { backgroundColor: "#e91e63" },
            }}
          >
            Next
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AdditionalInfoPopup;