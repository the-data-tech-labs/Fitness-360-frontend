import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Card,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Modal,
  IconButton,
} from "@mui/material";
import {
  Restaurant as MealPlanIcon,
  Assessment as NutritionalAnalysisIcon,
  LocalDining as FoodRecommendationsIcon,
  ListAlt as PreparationGuidelinesIcon,
  LocalDrink as HydrationIcon,
  FitnessCenter as ProgressMonitoringIcon,
  Info as SpecialInstructionsIcon,
  Print as PrintIcon,
} from "@mui/icons-material";

const NutritionForm = ({ isLoggedIn, userData }) => {
  const [formData, setFormData] = useState({
    age: "",
    gender: "Male",
    weight: "",
    height: "",
    veg_or_nonveg: "Veg",
    goal: "Gain muscles",
    disease: "",
    country: "India",
    state: "Maharashtra",
    allergics: "",
    food_type: "Veg",
    Target_timeline: "3 months",
  });

  const [loading, setLoading] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(true);
  const [recommendation, setRecommendation] = useState(null);
  const [error, setError] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) {
          throw new Error("No authentication token found. Please log in.");
        }

        const response = await axios.get("http://127.0.0.1:8000/api/profile/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.data) {
          setFormData((prevData) => ({
            ...prevData,
            age: response.data.age || "",
            gender: response.data.gender || "Male",
            weight: response.data.weight || "",
            height: response.data.height || "",
          }));
        }
      } catch (err) {
        console.error("Error fetching profile data:", err.response?.data || err.message);
        setError("Failed to fetch profile data. Please try again.");
      } finally {
        setFetchingProfile(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setRecommendation(null);
    setOpenModal(false);

    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        throw new Error("No authentication token found. Please log in.");
      }

      const response = await axios.post("http://127.0.0.1:8000/nutrition/", formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setRecommendation(response.data.data.recommendation);
    } catch (err) {
      setError("Failed to get recommendations. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  // Function to highlight important text with yellow background
  const highlightText = (text) => {
    const importantWords = ["calories", "protein", "carbs", "fats", "fiber", "water", "time", "exercise"];
    return text.split(" ").map((word, index) =>
      importantWords.includes(word.toLowerCase()) ? (
        <span key={index} style={{ fontWeight: "bold", backgroundColor: "#ffff00", padding: "2px 4px", borderRadius: "4px" }}>
          {word}{" "}
        </span>
      ) : (
        <span key={index}>{word} </span>
      )
    );
  };

  // Render nested data in a vertical table format with yellow background for important suggestions
const renderNestedData = (data) => {
  // Helper function to capitalize first letters
  const formatKey = (str) => {
    return str.replace(/_/g, ' ')
             .split(' ')
             .map(word => word.charAt(0).toUpperCase() + word.slice(1))
             .join(' ');
  };

  if (Array.isArray(data)) {
    return (
      <Box sx={{ pl: 2 }}>
        {data.map((item, index) => (
          <Box key={index} sx={{ mb: 1 }}>
            {typeof item === "object" ? renderNestedData(item) : (
              <Typography variant="body2">
                {highlightText(item)}
              </Typography>
            )}
          </Box>
        ))}
      </Box>
    );
  } else if (typeof data === "object" && data !== null) {
    // Daily Targets and similar structured data
    if (data.hasOwnProperty('total calories') || data.hasOwnProperty('protein grams')) {
      return (
        <Box sx={{ width: "100%", mb: 4 }}>
          <Typography variant="h6" sx={{ 
            fontWeight: 'bold', 
            mb: 2,
            textAlign: 'center',
            color: '#4a0066',
            fontSize: '1.2rem',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            {data.title || "Daily Targets"}
          </Typography>
          <TableContainer component={Paper} sx={{ 
            boxShadow: 0, 
            border: '1px solid #e0e0e0',
            width: '100%',
            maxWidth: '600px',
            mx: 'auto'
          }}>
            <Table size="small" sx={{ width: "100%" }}>
              <TableBody>
                {Object.entries(data).map(([key, value]) => (
                  <TableRow key={key} sx={{ '&:last-child td': { borderBottom: 0 } }}>
                    <TableCell sx={{ 
                      fontWeight: 'bold', 
                      width: '50%',
                      borderRight: '1px solid #e0e0e0',
                      backgroundColor: '#f9f9f9',
                      color: '#4a0066'
                    }}>
                      {formatKey(key)}
                    </TableCell>
                    <TableCell sx={{ 
                      textAlign: 'center',
                      fontWeight: '600',
                      color: '#333'
                    }}>
                      {typeof value === 'object' ? renderNestedData(value) : value}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      );
    }

    // Meal schedule sections
    if (data.time || data.items) {
      return (
        <Box sx={{ width: "100%", mb: 4 }}>
          {data.time && (
            <Typography variant="subtitle1" sx={{ 
              fontWeight: 'bold', 
              mb: 1,
              textAlign: 'center',
              color: '#4a0066',
              fontSize: '1.1rem'
            }}>
              {data.time}
            </Typography>
          )}
          
          {data.items && (
            <TableContainer component={Paper} sx={{ 
              boxShadow: 0, 
              border: '1px solid #e0e0e0',
              mb: 2,
              width: '100%',
              maxWidth: '600px',
              mx: 'auto'
            }}>
              <Table size="small">
                <TableBody>
                  <TableRow sx={{ '&:last-child td': { borderBottom: 0 } }}>
                    <TableCell sx={{ 
                      fontWeight: 'bold', 
                      width: '30%',
                      borderRight: '1px solid #e0e0e0',
                      backgroundColor: '#f9f9f9',
                      color: '#4a0066'
                    }}>
                      Items
                    </TableCell>
                    <TableCell sx={{ color: '#333' }}>
                      {data.items}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
          
          {(data.macros || data["total calories"]) && (
            <TableContainer component={Paper} sx={{ 
              boxShadow: 0, 
              border: '1px solid #e0e0e0',
              width: '100%',
              maxWidth: '600px',
              mx: 'auto'
            }}>
              <Table size="small">
                <TableBody>
                  {data["total calories"] && (
                    <TableRow sx={{ '&:last-child td': { borderBottom: 0 } }}>
                      <TableCell sx={{ 
                        fontWeight: 'bold', 
                        width: '50%',
                        borderRight: '1px solid #e0e0e0',
                        backgroundColor: '#f9f9f9',
                        color: '#4a0066'
                      }}>
                        Total Calories
                      </TableCell>
                      <TableCell sx={{ 
                        textAlign: 'center',
                        fontWeight: '600',
                        color: '#333'
                      }}>
                        {data["total calories"]}
                      </TableCell>
                    </TableRow>
                  )}
                  {data.macros && Object.entries(data.macros).map(([macroKey, macroValue]) => (
                    <TableRow key={macroKey} sx={{ '&:last-child td': { borderBottom: 0 } }}>
                      <TableCell sx={{ 
                        fontWeight: 'bold', 
                        width: '50%',
                        borderRight: '1px solid #e0e0e0',
                        backgroundColor: '#f9f9f9',
                        color: '#4a0066'
                      }}>
                        {formatKey(macroKey)}
                      </TableCell>
                      <TableCell sx={{ 
                        textAlign: 'center',
                        fontWeight: '600',
                        color: '#333'
                      }}>
                        {macroValue}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      );
    }

    // Default rendering for other nested objects
    return (
      <Box sx={{ width: "100%", mb: 4 }}>
        {Object.entries(data).map(([key, value]) => (
          <Box key={key} sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ 
              fontWeight: 'bold', 
              mb: 1,
              textAlign: 'center',
              color: '#4a0066',
              fontSize: '1.1rem'
            }}>
              {formatKey(key)}
            </Typography>
            <TableContainer component={Paper} sx={{ 
              boxShadow: 0, 
              border: '1px solid #e0e0e0',
              width: '100%',
              maxWidth: '600px',
              mx: 'auto'
            }}>
              <Table size="small">
                <TableBody>
                  {typeof value === 'object' ? (
                    <TableRow>
                      <TableCell colSpan={2}>
                        {renderNestedData(value)}
                      </TableCell>
                    </TableRow>
                  ) : (
                    <TableRow sx={{ '&:last-child td': { borderBottom: 0 } }}>
                      <TableCell sx={{ 
                        textAlign: 'center',
                        fontWeight: '600',
                        color: '#333',
                        width: '100%'
                      }}>
                        {value}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ))}
      </Box>
    );
  } else {
    return (
      <Typography variant="body2">
        {highlightText(data)}
      </Typography>
    );
  }
};

  const handleOpenModal = (key, value) => {
    setSelectedPlan({ key, value });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handlePrintModal = () => {
    const printContent = document.getElementById("modal-print-content").innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  const getIconForTitle = (title) => {
    switch (title) {
      case "meal_plan":
        return <MealPlanIcon sx={{ fontSize: 40, color: "#4a0066" }} />;
      case "nutritional_analysis":
        return <NutritionalAnalysisIcon sx={{ fontSize: 40, color: "#4a0066" }} />;
      case "food_recommendations":
        return <FoodRecommendationsIcon sx={{ fontSize: 40, color: "#4a0066" }} />;
      case "preparation_guidelines":
        return <PreparationGuidelinesIcon sx={{ fontSize: 40, color: "#4a0066" }} />;
      case "hydration_and_supplements":
        return <HydrationIcon sx={{ fontSize: 40, color: "#4a0066" }} />;
      case "progress_monitoring":
        return <ProgressMonitoringIcon sx={{ fontSize: 40, color: "#4a0066" }} />;
      case "special_instructions":
        return <SpecialInstructionsIcon sx={{ fontSize: 40, color: "#4a0066" }} />;
      default:
        return null;
    }
  };

  const cardImages = {
    meal_plan: "/images/meal_plan.jpg",
    nutritional_analysis: "/images/nutritional_analysis.jpg",
    food_recommendations: "/images/food_recommendations.jpg",
    preparation_guidelines: "/images/preparation_guidelines.jpg",
    hydration_and_supplements: "/images/hydration_and_supplements.jpg",
    progress_monitoring: "/images/progress_monitoring.jpg",
    special_instructions: "/images/special_instructions.jpg",
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#f5f5f5", padding: "20px" }}>
      <Paper sx={{ padding: "40px", borderRadius: "12px", boxShadow: 5, width: "80%", maxWidth: "1200px" }}>
        <Typography variant="h4" sx={{ mb: 4, color: "#4a0066", fontWeight: "bold" }}>
          Get Your Personalized Nutrition Plan
        </Typography>

        {fetchingProfile ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
            <CircularProgress sx={{ color: "#4a0066" }} />
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {Object.keys(formData).map((key) => (
                <Grid item xs={12} sm={6} key={key}>
                  {key === "gender" || key === "veg_or_nonveg" || key === "goal" || key === "food_type" || key === "Target_timeline" ? (
                    <FormControl fullWidth variant="outlined">
                      <InputLabel
                        shrink={true}
                        sx={{
                          backgroundColor: "background.paper",
                          padding: "0 4px",
                        }}
                      >
                        {key.replace(/_/g, " ").toUpperCase()}
                      </InputLabel>
                      <Select
                        name={key}
                        value={formData[key]}
                        onChange={handleChange}
                        label={key.replace(/_/g, " ").toUpperCase()}
                        sx={{
                          "& .MuiSelect-select": {
                            textAlign: "left",
                          },
                        }}
                      >
                        {key === "gender" &&
                          ["Male", "Female"].map((option) => (
                            <MenuItem key={option} value={option} sx={{ textAlign: "left" }}>
                              {option}
                            </MenuItem>
                          ))}
                        {key === "veg_or_nonveg" &&
                          ["Veg", "Non-Veg", "Veg & Non-Veg"].map((option) => (
                            <MenuItem key={option} value={option} sx={{ textAlign: "left" }}>
                              {option}
                            </MenuItem>
                          ))}
                        {key === "goal" &&
                          ["Gain muscles", "Lose weight", "Maintain physique"].map((option) => (
                            <MenuItem key={option} value={option} sx={{ textAlign: "left" }}>
                              {option}
                            </MenuItem>
                          ))}
                        {key === "food_type" &&
                          ["Veg", "Non-Veg"].map((option) => (
                            <MenuItem key={option} value={option} sx={{ textAlign: "left" }}>
                              {option}
                            </MenuItem>
                          ))}
                        {key === "Target_timeline" &&
                          ["1 month", "3 months", "6 months", "1 year"].map((option) => (
                            <MenuItem key={option} value={option} sx={{ textAlign: "left" }}>
                              {option}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  ) : (
                    <TextField
                      label={key.replace(/_/g, " ").toUpperCase()}
                      name={key}
                      type={key === "age" || key === "weight" || key === "height" ? "number" : "text"}
                      value={formData[key]}
                      onChange={handleChange}
                      fullWidth
                      required
                    />
                  )}
                </Grid>
              ))}
            </Grid>

            {/* Centered "Get Recommendation" Button */}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: "#4a0066",
                  padding: "12px 30px",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "#3a0050",
                  },
                }}
              >
                Get Recommendation
              </Button>
            </Box>
          </form>
        )}

        {loading && <CircularProgress sx={{ mt: 3, color: "#4a0066" }} />}
        {error && (
          <Typography color="error" sx={{ mt: 2, fontWeight: "bold" }}>
            {error}
          </Typography>
        )}

        {recommendation && (
          <Box sx={{ mt: 5 }}>
            <Typography variant="h5" sx={{ mb: 4, fontWeight: "bold", color: "#4a0066" }}>
              Your Personalized Nutrition Plan
            </Typography>
            <Grid container spacing={3}>
              {Object.entries(recommendation).map(([key, value], index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    sx={{
                      padding: "20px",
                      textAlign: "center",
                      borderRadius: "12px",
                      boxShadow: 3,
                      transition: "transform 0.3s, box-shadow 0.3s",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: 6,
                      },
                    }}
                  >
                    {/* Card Image */}
                    <img
                      src={cardImages[key]}
                      alt={key.replace(/_/g, " ")}
                      style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "8px" }}
                    />
                    {/* Icon below the image */}
                    <Box sx={{ mt: 2 }}>
                      {getIconForTitle(key)}
                    </Box>
                    <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold", color: "#4a0066" }}>
                      {key.replace(/_/g, " ")}
                    </Typography>
                    {value.time && (
                      <Box
                        sx={{
                          backgroundColor: "#fff3e0",
                          borderRadius: "8px",
                          p: 1,
                          mt: 2,
                        }}
                      >
                        <Typography variant="body1" sx={{ fontWeight: "bold", color: "#4a0066" }}>
                          Time: {value.time}
                        </Typography>
                      </Box>
                    )}
                    {value.items && (
                      <Box
                        sx={{
                          backgroundColor: "#fff3e0",
                          borderRadius: "8px",
                          p: 1,
                          mt: 2,
                        }}
                      >
                        <Typography variant="body1" sx={{ fontWeight: "bold", color: "#4a0066" }}>
                          Items: {value.items}
                        </Typography>
                      </Box>
                    )}
                    <Button
                      variant="contained"
                      sx={{
                        mt: 2,
                        backgroundColor: "#4a0066",
                        padding: "8px 20px",
                        borderRadius: "8px",
                      }}
                      onClick={() => handleOpenModal(key, value)}
                    >
                      See Plan
                    </Button>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="plan-details-modal"
          aria-describedby="plan-details-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "90%",
              maxWidth: "900px",
              bgcolor: "background.paper",
              boxShadow: 24,
              borderRadius: "12px",
              p: 4,
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <Typography
              variant="h5"
              sx={{ mb: 3, fontWeight: "bold", color: "#4a0066" }}
            >
              {selectedPlan?.key.replace(/_/g, " ")}
            </Typography>
            <Box id="modal-print-content" sx={{ overflowX: 'auto' }}>
              {selectedPlan && renderNestedData(selectedPlan.value)}
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
              <Button
                variant="contained"
                startIcon={<PrintIcon />}
                sx={{
                  mr: 2,
                  backgroundColor: "#4a0066",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "#3a0050",
                  },
                }}
                onClick={handlePrintModal}
              >
                Print
              </Button>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#4a0066",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "#3a0050",
                  },
                }}
                onClick={handleCloseModal}
              >
                Close
              </Button>
            </Box>
          </Box>
        </Modal>
      </Paper>
    </Box>
  );
};

export default NutritionForm;