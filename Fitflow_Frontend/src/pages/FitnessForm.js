import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

import axios from "axios";
import {
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Card,
  Grid,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
} from "@mui/material";
import {
  Print as PrintIcon,
  FitnessCenter as FitnessIcon,
  LocalDining as NutritionIcon,
  LocalDining,
  LocalDrink,
  AccessTime,
  AccessTime as TimeIcon,
  DirectionsRun as DirectionsRunIcon,
  FitnessCenter as FitnessCenterIcon,
  Toll as TollIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon ,
  Info as InfoIcon,
  Scale as BMIIcon,
  Category as CategoryIcon,
  ListAlt as WorkoutIcon,
  Restaurant as NutritionPlanIcon,
  CheckCircle as CheckCircleIcon,
  Whatshot as IntensityIcon,
  DirectionsRun as CardioIcon,
  FitnessCenter as StrengthIcon,
 
    TrendingUp as TrendingUpIcon,
    Cancel as CancelIcon,
    ListAlt as ListAltIcon
} from "@mui/icons-material";

const GENDER_CHOICES = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
];

const FITNESS_LEVEL_CHOICES = [
  { value: "beginner", label: "Beginner (No prior exercise experience)" },
  { value: "intermediate", label: "Intermediate (Exercises 2-3 times/week)" },
  { value: "advanced", label: "Advanced (Regular high-intensity training)" },
];

const ACTIVITY_LEVEL_CHOICES = [
  { value: "sedentary", label: "Sedentary (Little to no exercise)" },
  { value: "lightly_active", label: "Lightly Active (Light exercise 1-3 days/week)" },
  { value: "moderately_active", label: "Moderately Active (Moderate exercise 3-5 days/week)" },
  { value: "very_active", label: "Very Active (Hard exercise 6-7 days/week)" },
  { value: "extra_active", label: "Extra Active (Very hard exercise & physical job)" },
];

const GOAL_CHOICES = [
  { value: "weight_loss", label: "Weight Loss" },
  { value: "muscle_gain", label: "Muscle Gain" },
  { value: "strength", label: "Strength Training" },
  { value: "endurance", label: "Endurance Building" },
  { value: "flexibility", label: "Flexibility & Mobility" },
  { value: "general_fitness", label: "General Fitness" },
  { value: "maintenance", label: "Maintenance" },
];

const EXERCISE_SETTING_CHOICES = [
  { value: "gym", label: "Gym" },
  { value: "home", label: "Home" },
  { value: "outdoor", label: "Outdoor" },
  { value: "mixed", label: "Mixed" },
];

const SLEEP_PATTERN_CHOICES = [
  { value: "less_than_6", label: "Less than 6 hours" },
  { value: "6_to_8", label: "6-8 hours" },
  { value: "more_than_8", label: "More than 8 hours" },
];

const FitnessForm = ({ isLoggedIn, userData }) => {
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    weight: "",
    height: "",
    fitness_level: "",
    activity_level: "",
    goal: "",
    specific_area: "",
    target_timeline: "",
    medical_conditions: "",
    injuries_or_physical_limitation: "",
    exercise_setting: "",
    sleep_pattern: "",
    stress_level: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(true);
  const [recommendation, setRecommendation] = useState(null);
  const [error, setError] = useState("");
  const [openWorkoutDialog, setOpenWorkoutDialog] = useState(false);
  const [openNutritionDialog, setOpenNutritionDialog] = useState(false);

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
            gender: response.data.gender || "",
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

    const requiredFields = ["age", "weight", "gender", "height", "fitness_level", "activity_level", "goal"];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      setError(`Please fill in the following fields: ${missingFields.join(", ")}`);
      return;
    }

    setLoading(true);
    setError("");
    setRecommendation(null);

    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        throw new Error("No authentication token found. Please log in.");
      }

      const backendFormData = {
        ...formData,
        gender: formData.gender === "Female" ? "female" : formData.gender === "Male" ? "male" : "other",
      };

      const response = await axios.post(
        "http://127.0.0.1:8000/fitness/fitness-recommendation/",
        backendFormData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.data) {
        throw new Error("No data received from the API.");
      }

      console.log("API Response:", response.data);
      setRecommendation(response.data);
    } catch (err) {
      console.error("Error fetching recommendation:", err.response?.data || err.message);
      setError(err.response?.data?.detail || "Failed to get recommendations. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenWorkoutDialog = () => {
    setOpenWorkoutDialog(true);
  };

  const handleCloseWorkoutDialog = () => {
    setOpenWorkoutDialog(false);
  };

  const handleOpenNutritionDialog = () => {
    setOpenNutritionDialog(true);
  };

  const handleCloseNutritionDialog = () => {
    setOpenNutritionDialog(false);
  };

  const handlePrint = () => {
    const printContent = document.getElementById("printable-content").innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  const parseWorkoutPlan = (workoutText) => {
    if (!workoutText) return null;
    
    const days = workoutText.split('\n').filter(line => line.trim() !== '');
    const parsedPlan = [];
    
    days.forEach(day => {
      const [dayLabel, ...workoutParts] = day.split(':');
      if (!dayLabel || workoutParts.length === 0) return;
      
      const workout = workoutParts.join(':').trim();
      const exercises = workout.split(';').map(ex => ex.trim()).filter(ex => ex);
      
      parsedPlan.push({
        day: dayLabel.trim(),
        exercises: exercises.map(exercise => {
          // Extract sets/reps
          const setsRepsMatch = exercise.match(/(\d+\s*sets\s*of\s*\d+\s*reps)/i);
          const setsReps = setsRepsMatch ? setsRepsMatch[0] : "";
          
          // Extract exercise name
          let exerciseName = exercise.replace(setsReps, '').trim();
          if (exerciseName.endsWith('-')) {
            exerciseName = exerciseName.slice(0, -1).trim();
          }
          
          // Extract duration
          const durationMatch = exercise.match(/(\d+\s*minutes)/i);
          const duration = durationMatch ? durationMatch[0] : "";
          
          // Determine type
          const type = exercise.toLowerCase().includes('cardio') || duration ? 'cardio' : 'strength';
          
          return {
            name: exerciseName,
            setsReps,
            duration,
            type
          };
        })
      });
    });
    
    return parsedPlan;
  };
  const [expandedDays, setExpandedDays] = React.useState({});

const toggleDay = (dayIndex) => {
  setExpandedDays(prev => ({
    ...prev,
    [dayIndex]: !prev[dayIndex]
  }));
};

const renderWorkoutTable = (workoutText) => {
  const parsedPlan = parseWorkoutPlan(workoutText);
  if (!parsedPlan || parsedPlan.length === 0) return <Typography>No workout plan available.</Typography>;

  return (
    <Box id="printable-content" sx={{ maxWidth: 1000, mx: 'auto' }}>
      {/* Plan Header */}
      <Box sx={{ 
        textAlign: "center", 
        mb: 4,
        p: 3,
        backgroundColor: '#f5f0ff',
        borderRadius: 2,
        boxShadow: 1
      }}>
        <Typography variant="h4" sx={{ 
          fontWeight: "bold", 
          color: "#4a0066",
          mb: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2
        }}>
          <FitnessCenterIcon fontSize="large" /> 
          Personalized Workout Plan
          <FitnessCenterIcon fontSize="large" />
        </Typography>
        <Typography variant="subtitle1" sx={{ color: '#666' }}>
          Based on your fitness profile and goals
        </Typography>
      </Box>

      {/* Key Metrics Summary */}
      <Box sx={{
        mb: 4,
        p: 2,
        backgroundColor: '#f8f5ff',
        borderRadius: 2,
        borderLeft: '4px solid #4a0066'
      }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: '#4a0066' }}>
          <InfoIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
          Plan Summary
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <Box sx={{ textAlign: 'center', p: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>Duration</Typography>
              <Typography variant="h6" sx={{ color: '#4a0066' }}>4-6 Weeks</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box sx={{ textAlign: 'center', p: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>Workouts/Week</Typography>
              <Typography variant="h6" sx={{ color: '#4a0066' }}>{parsedPlan.length}</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box sx={{ textAlign: 'center', p: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>Intensity</Typography>
              <Typography variant="h6" sx={{ color: '#4a0066' }}>
                {formData.fitness_level === 'beginner' ? 'Low-Medium' : 
                 formData.fitness_level === 'intermediate' ? 'Medium' : 'High'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box sx={{ textAlign: 'center', p: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>Primary Focus</Typography>
              <Typography variant="h6" sx={{ color: '#4a0066' }}>{formData.goal.replace(/_/g, ' ')}</Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Weekly Plan Overview */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ 
          fontWeight: 'bold', 
          mb: 2, 
          color: '#4a0066',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <ListAltIcon /> Weekly Workout Schedule
        </Typography>
        
        <TableContainer component={Paper} sx={{ mb: 3 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#4a0066' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', width: '20%' }}>Day</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', width: '40%' }}>Focus Area</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', width: '20%' }}>Type</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', width: '20%' }}>Duration</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {parsedPlan.map((dayPlan, index) => {
                const focusAreas = dayPlan.exercises.map(ex => ex.name).join(', ');
                const types = [...new Set(dayPlan.exercises.map(ex => ex.type))].join(', ');
                const durations = [...new Set(dayPlan.exercises.map(ex => ex.duration || ex.setsReps))].join(', ');
                
                return (
                  <TableRow key={index} hover>
                    <TableCell sx={{ fontWeight: 'medium' }}>{dayPlan.day}</TableCell>
                    <TableCell>{focusAreas}</TableCell>
                    <TableCell sx={{ textTransform: 'capitalize' }}>{types}</TableCell>
                    <TableCell>{durations}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Detailed Daily Workouts */}
      <Typography variant="h5" sx={{ 
        fontWeight: 'bold', 
        mb: 2, 
        color: '#4a0066',
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <FitnessCenterIcon /> Detailed Workout Plan
      </Typography>
      
      {parsedPlan.map((dayPlan, index) => (
        <Box key={index} sx={{ mb: 4 }}>
          {/* Day Header */}
          <Box sx={{ 
            backgroundColor: '#4a0066', 
            color: 'white', 
            p: 2, 
            borderRadius: '8px 8px 0 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {dayPlan.day}
            </Typography>
            <Chip 
              label={`${dayPlan.exercises.length} exercises`} 
              size="small"
              sx={{ color: '#4a0066', backgroundColor: 'white' }}
            />
          </Box>
          
          {/* Workout Table */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f0e5ff' }}>
                  <TableCell sx={{ fontWeight: 'bold', width: '40%' }}>Exercise</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>Sets/Reps</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>Duration</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dayPlan.exercises.map((exercise, exIndex) => (
                  <TableRow key={exIndex} hover>
                    <TableCell sx={{ fontWeight: 'medium' }}>{exercise.name}</TableCell>
                    <TableCell sx={{ textTransform: 'capitalize' }}>
                      <Chip 
                        label={exercise.type} 
                        size="small"
                        sx={{ 
                          backgroundColor: exercise.type === 'cardio' ? '#e3f2fd' : '#f3e5f5',
                          color: exercise.type === 'cardio' ? '#1565c0' : '#7b1fa2'
                        }}
                      />
                    </TableCell>
                    <TableCell>{exercise.setsReps || '-'}</TableCell>
                    <TableCell>{exercise.duration || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          {/* Workout Notes */}
          <Box sx={{ 
            backgroundColor: '#f9f5ff', 
            p: 2, 
            borderRadius: '0 0 8px 8px',
            borderTop: '1px solid #e0d0f0'
          }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
              <InfoIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: '18px' }} />
              Workout Notes:
            </Typography>
            <List dense sx={{ listStyleType: 'disc', pl: 2 }}>
              <ListItem sx={{ display: 'list-item', p: 0 }}>
                <ListItemText primary="Warm up for 5-10 minutes before starting" />
              </ListItem>
              <ListItem sx={{ display: 'list-item', p: 0 }}>
                <ListItemText primary="Rest 30-60 seconds between sets for strength exercises" />
              </ListItem>
              <ListItem sx={{ display: 'list-item', p: 0 }}>
                <ListItemText primary="Maintain proper form throughout all exercises" />
              </ListItem>
              <ListItem sx={{ display: 'list-item', p: 0 }}>
                <ListItemText primary="Cool down with stretching for 5-10 minutes after workout" />
              </ListItem>
            </List>
          </Box>
        </Box>
      ))}

      {/* General Guidelines */}
      <Box sx={{ 
        mt: 4, 
        p: 3, 
        backgroundColor: '#fff8e1', 
        borderRadius: 2,
        borderLeft: '4px solid #ffc107'
      }}>
        <Typography variant="h5" sx={{ 
          fontWeight: 'bold', 
          mb: 2, 
          color: '#4a0066',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <InfoIcon fontSize="large" /> General Guidelines
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#4a0066' }}>
              <CheckCircleIcon sx={{ color: 'green', mr: 1, verticalAlign: 'middle' }} />
              Do's
            </Typography>
            <List dense>
              {[
                "Perform exercises with proper form",
                "Increase weights gradually (5-10% per week)",
                "Stay hydrated during workouts",
                "Allow 48 hours rest for muscle groups",
                "Track your progress weekly"
              ].map((item, i) => (
                <ListItem key={`do-${i}`} sx={{ py: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckCircleIcon color="success" sx={{ fontSize: '16px' }} />
                  </ListItemIcon>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#4a0066' }}>
              <CancelIcon sx={{ color: 'red', mr: 1, verticalAlign: 'middle' }} />
              Don'ts
            </Typography>
            <List dense>
              {[
                "Don't skip warm-up or cool-down",
                "Avoid lifting too heavy too soon",
                "Don't sacrifice form for more reps",
                "Avoid training same muscle groups daily",
                "Don't ignore pain or discomfort"
              ].map((item, i) => (
                <ListItem key={`dont-${i}`} sx={{ py: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CancelIcon color="error" sx={{ fontSize: '16px' }} />
                  </ListItemIcon>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
      </Box>
      
      {/* Progression Plan */}
{/* Progression Plan */}
<Box sx={{ mt: 4, p: 3, backgroundColor: '#e8f5e9', borderRadius: 2 }}>
  <Typography variant="h5" sx={{ 
    fontWeight: 'bold', 
    mb: 2, 
    color: '#4a0066',
    display: 'flex',
    alignItems: 'center',
    gap: 1
  }}>
    <TrendingUpIcon /> Progression Plan
  </Typography>
  
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow sx={{ backgroundColor: '#4a0066' }}>
          <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Week</TableCell>
          <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Intensity</TableCell>
          <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Volume</TableCell>
          <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Progression</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {[1, 2, 3, 4].map((week) => (
          <TableRow key={week} hover>
            <TableCell sx={{ fontWeight: 'medium' }}>Week {week}</TableCell>
            <TableCell>
              {week === 1 ? 'Low-Medium' : 
               week === 2 ? 'Medium' : 
               week === 3 ? 'Medium-High' : 'High'}
            </TableCell>
            <TableCell>
              {week === 1 ? '2-3 sets per exercise' : 
               week === 2 ? '3 sets per exercise' : 
               week === 3 ? '3-4 sets per exercise' : '4 sets per exercise'}
            </TableCell>
            <TableCell>
              {week === 1 ? 'Learn proper form' : 
               week === 2 ? 'Increase weight 5-10%' : 
               week === 3 ? 'Increase reps or reduce rest' : 'Maximize intensity'}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
</Box>
    </Box>
  );
};
  const parseNutritionPlan = (nutritionText) => {
    // If we have specific nutrition text from the API, we could parse it here
    // For now, we'll use our structured data
    
    return [
      {
        category: "Balanced Diet",
        details: [
          "Focus on a balanced diet rich in protein, complex carbohydrates, and healthy fats",
          "Prioritize whole, unprocessed foods",
          "Include lean proteins (chicken, fish, tofu, legumes)",
          "Eat plenty of vegetables (aim for variety and color)",
          "Choose whole grains over refined grains",
          "Include healthy fats (avocados, nuts, olive oil)",
          "Limit sugary drinks and processed foods",
        ],
        icon: <LocalDining color="primary" />,
        color: "#e3f2fd"
      },
      {
        category: "Meal Timing",
        details: [
          "Eat every 3-4 hours to maintain energy levels",
          "Have a protein-rich meal/snack within 30 minutes after workout",
          "Don't skip breakfast",
          "Avoid heavy meals right before bedtime",
        ],
        icon: <AccessTime color="primary" />,
        color: "#e8f5e9"
      },
      {
        category: "Hydration",
        details: [
          "Drink at least 8 glasses of water daily",
          "Increase water intake during workouts",
          "Limit sugary drinks and alcohol",
          "Include herbal teas and infused waters for variety",
        ],
        icon: <LocalDrink color="primary" />,
        color: "#e0f7fa"
      },
      {
        category: "Portion Control",
        details: [
          "Use smaller plates to control portions",
          "Fill half your plate with vegetables",
          "Be mindful of serving sizes for grains and proteins",
          "Listen to your body's hunger cues",
        ],
        icon: <InfoIcon color="primary" />,
        color: "#f3e5f5"
      }
    ];
  };

  const renderNutritionTable = () => {
    const nutritionPlan = parseNutritionPlan();
    
    return (
      <Box id="printable-content">
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: "bold", color: "#4a0066", mb: 1 }}>
            Personalized Nutrition Plan
          </Typography>
          <Typography variant="subtitle1" sx={{ color: "#666" }}>
            Tailored to support your fitness goals
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
          {nutritionPlan.map((category, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Paper sx={{ 
                p: 3, 
                height: "100%",
                backgroundColor: category.color
              }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  {category.icon}
                  <Typography variant="h5" sx={{ 
                    fontWeight: "bold", 
                    ml: 1,
                    color: "#4a0066"
                  }}>
                    {category.category}
                  </Typography>
                </Box>
                
                <List dense>
                  {category.details.map((detail, idx) => (
                    <ListItem key={idx}>
                      <ListItemIcon>
                        <CheckCircleIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={detail} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          ))}
        </Grid>
        
        <Box sx={{ mt: 4, p: 3, backgroundColor: "#fff8e1", borderRadius: "8px" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1, color: "#4a0066" }}>
            <InfoIcon sx={{ verticalAlign: "middle", mr: 1 }} />
            Important Notes
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon><CheckCircleIcon color="primary" /></ListItemIcon>
              <ListItemText primary="This plan is a starting point - adjust based on your progress and preferences" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircleIcon color="primary" /></ListItemIcon>
              <ListItemText primary="Consult a registered dietitian for personalized nutritional advice" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircleIcon color="primary" /></ListItemIcon>
              <ListItemText primary="Focus on building sustainable habits for long-term success" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircleIcon color="primary" /></ListItemIcon>
              <ListItemText primary="Listen to your body and adjust portion sizes as needed" />
            </ListItem>
          </List>
        </Box>
        
        <Box sx={{ mt: 4, p: 3, backgroundColor: "#e8f5e9", borderRadius: "8px" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1, color: "#4a0066" }}>
            <InfoIcon sx={{ verticalAlign: "middle", mr: 1 }} />
            Sample Meal Plan
          </Typography>
          
          <TableContainer component={Paper} sx={{ mb: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#4a0066" }}>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Meal</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Option 1</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Option 2</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow hover>
                  <TableCell sx={{ fontWeight: "bold" }}>Breakfast</TableCell>
                  <TableCell>Oatmeal with berries and nuts</TableCell>
                  <TableCell>Scrambled eggs with whole wheat toast and avocado</TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell sx={{ fontWeight: "bold" }}>Mid-Morning Snack</TableCell>
                  <TableCell>Greek yogurt with honey</TableCell>
                  <TableCell>Handful of almonds and an apple</TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell sx={{ fontWeight: "bold" }}>Lunch</TableCell>
                  <TableCell>Grilled chicken with quinoa and roasted vegetables</TableCell>
                  <TableCell>Lentil soup with whole grain bread</TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell sx={{ fontWeight: "bold" }}>Afternoon Snack</TableCell>
                  <TableCell>Protein smoothie with banana and peanut butter</TableCell>
                  <TableCell>Hummus with carrot and cucumber sticks</TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell sx={{ fontWeight: "bold" }}>Dinner</TableCell>
                  <TableCell>Baked salmon with sweet potato and steamed broccoli</TableCell>
                  <TableCell>Stir-fried tofu with brown rice and mixed vegetables</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    );
  };

  const cardImages = {
    BMI: "/images/bmi.jpg",
    "BMI Category": "/images/bmi-category.png",
    "Workout Plan": "/images/workout.jpg",
    "Nutrition Plan": "/images/nutritionplan.jpg",
  };

  const recommendationCards = [
    {
      title: "BMI",
      value: recommendation?.bmi ? parseFloat(recommendation.bmi).toFixed(1) : "N/A",
      icon: <BMIIcon sx={{ fontSize: 40, color: "#4a0066" }} />,
      image: cardImages["BMI"],
    },
    {
      title: "BMI Category",
      value: recommendation?.bmi_category || "N/A",
      icon: <CategoryIcon sx={{ fontSize: 40, color: "#4a0066" }} />,
      image: cardImages["BMI Category"],
    },
    {
      title: "Workout Plan",
      value: "View Workout Plan",
      icon: <WorkoutIcon sx={{ fontSize: 40, color: "#4a0066" }} />,
      image: cardImages["Workout Plan"],
      onClick: handleOpenWorkoutDialog,
    },
    {
      title: "Nutrition Plan",
      value: "View Nutrition Plan",
      icon: <NutritionPlanIcon sx={{ fontSize: 40, color: "#4a0066" }} />,
      image: cardImages["Nutrition Plan"],
      onClick: handleOpenNutritionDialog,
    },
  ];

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#f5f5f5", padding: "20px" }}>
      <Paper sx={{ padding: "40px", borderRadius: "12px", boxShadow: 5, width: "80%", maxWidth: "1200px" }}>
        <Typography variant="h4" sx={{ mb: 4, color: "#4a0066", fontWeight: "bold" }}>
          Get Your Personalized Fitness Plan
        </Typography>

        {fetchingProfile ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
            <CircularProgress sx={{ color: "#4a0066" }} />
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    label="Gender"
                  >
                    {GENDER_CHOICES.map((choice) => (
                      <MenuItem key={choice.value} value={choice.value}>
                        {choice.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Weight (kg)"
                  name="weight"
                  type="number"
                  value={formData.weight}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Height (cm)"
                  name="height"
                  type="number"
                  value={formData.height}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Fitness Level</InputLabel>
                  <Select
                    name="fitness_level"
                    value={formData.fitness_level}
                    onChange={handleChange}
                    label="Fitness Level"
                  >
                    {FITNESS_LEVEL_CHOICES.map((choice) => (
                      <MenuItem key={choice.value} value={choice.value}>
                        {choice.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Activity Level</InputLabel>
                  <Select
                    name="activity_level"
                    value={formData.activity_level}
                    onChange={handleChange}
                    label="Activity Level"
                  >
                    {ACTIVITY_LEVEL_CHOICES.map((choice) => (
                      <MenuItem key={choice.value} value={choice.value}>
                        {choice.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Goal</InputLabel>
                  <Select
                    name="goal"
                    value={formData.goal}
                    onChange={handleChange}
                    label="Goal"
                  >
                    {GOAL_CHOICES.map((choice) => (
                      <MenuItem key={choice.value} value={choice.value}>
                        {choice.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Specific Area (optional)"
                  name="specific_area"
                  value={formData.specific_area}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Target Timeline (optional)"
                  name="target_timeline"
                  value={formData.target_timeline}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Medical Conditions (optional)"
                  name="medical_conditions"
                  value={formData.medical_conditions}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Injuries or Physical Limitations (optional)"
                  name="injuries_or_physical_limitation"
                  value={formData.injuries_or_physical_limitation}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Exercise Setting</InputLabel>
                  <Select
                    name="exercise_setting"
                    value={formData.exercise_setting}
                    onChange={handleChange}
                    label="Exercise Setting"
                  >
                    {EXERCISE_SETTING_CHOICES.map((choice) => (
                      <MenuItem key={choice.value} value={choice.value}>
                        {choice.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Sleep Pattern</InputLabel>
                  <Select
                    name="sleep_pattern"
                    value={formData.sleep_pattern}
                    onChange={handleChange}
                    label="Sleep Pattern"
                  >
                    {SLEEP_PATTERN_CHOICES.map((choice) => (
                      <MenuItem key={choice.value} value={choice.value}>
                        {choice.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Stress Level (1-10)"
                  name="stress_level"
                  type="number"
                  value={formData.stress_level}
                  onChange={handleChange}
                  fullWidth
                  inputProps={{ min: 1, max: 10 }}
                />
              </Grid>
            </Grid>

            <Button 
              type="submit" 
              variant="contained" 
              sx={{ 
                mt: 4, 
                backgroundColor: "#4a0066", 
                padding: "12px 30px", 
                borderRadius: "8px",
                "&:hover": {
                  backgroundColor: "#3a0055"
                }
              }}
            >
              Get Recommendation
            </Button>
          </form>
        )}

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress sx={{ color: "#4a0066" }} />
            <Typography sx={{ ml: 2 }}>Generating your personalized plan...</Typography>
          </Box>
        )}
        
        {error && (
          <Typography color="error" sx={{ mt: 2, fontWeight: "bold" }}>
            {error}
          </Typography>
        )}

        {recommendation && (
          <Box sx={{ mt: 5 }}>
            <Typography variant="h5" sx={{ mb: 4, fontWeight: "bold", color: "#4a0066" }}>
              Your Personalized Fitness Plan
            </Typography>
            <Grid container spacing={3}>
              {recommendationCards.map((card, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card
                    onClick={card.onClick}
                    sx={{
                      padding: "20px",
                      textAlign: "center",
                      borderRadius: "12px",
                      boxShadow: 3,
                      transition: "transform 0.3s, box-shadow 0.3s",
                      "&:hover": card.onClick ? {
                        transform: "translateY(-5px)",
                        boxShadow: 6,
                        cursor: "pointer"
                      } : {},
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between"
                    }}
                  >
                    <img
                      src={card.image}
                      alt={card.title}
                      style={{ 
                        width: "100%", 
                        height: "120px", 
                        objectFit: "cover", 
                        borderRadius: "8px",
                        marginBottom: "16px"
                      }}
                    />
                    <Box>
                      <Box sx={{ mt: 1 }}>
                        {card.icon}
                      </Box>
                      <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold", color: "#4a0066" }}>
                        {card.title}
                      </Typography>
                      <Typography 
                        sx={{ 
                          mt: 1, 
                          color: "#4a0066",
                          fontWeight: card.title.includes("BMI") ? "bold" : "normal",
                          fontSize: card.title.includes("BMI") ? "1.2rem" : "1rem"
                        }}
                      >
                        {card.value}
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Paper>

      {/* Workout Plan Dialog */}
      <Dialog 
        open={openWorkoutDialog} 
        onClose={handleCloseWorkoutDialog} 
        maxWidth="md" 
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "12px",
            padding: "16px"
          }
        }}
      >
        <DialogTitle sx={{ 
          fontWeight: "bold", 
          color: "#4a0066",
          fontSize: "1.5rem",
          display: "flex",
          alignItems: "center"
        }}>
          <FitnessIcon sx={{ mr: 1 }} />
          Workout Plan Details
        </DialogTitle>
        <DialogContent dividers>
          {recommendation?.recommendation_text ? (
            renderWorkoutTable(recommendation.recommendation_text)
          ) : (
            <Typography>No workout plan available.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            startIcon={<PrintIcon />}
            onClick={handlePrint}
            variant="outlined"
            sx={{ color: "#4a0066", borderColor: "#4a0066" }}
          >
            Print Plan
          </Button>
          <Button 
            onClick={handleCloseWorkoutDialog}
            variant="contained"
            sx={{ backgroundColor: "#4a0066" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Nutrition Plan Dialog */}
      <Dialog 
        open={openNutritionDialog} 
        onClose={handleCloseNutritionDialog} 
        maxWidth="md" 
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "12px",
            padding: "16px"
          }
        }}
      >
        <DialogTitle sx={{ 
          fontWeight: "bold", 
          color: "#4a0066",
          fontSize: "1.5rem",
          display: "flex",
          alignItems: "center"
        }}>
          <LocalDining sx={{ mr: 1 }} />
          Nutrition Plan Details
        </DialogTitle>
        <DialogContent dividers>
          {renderNutritionTable()}
        </DialogContent>
        <DialogActions>
          <Button 
            startIcon={<PrintIcon />}
            onClick={handlePrint}
            variant="outlined"
            sx={{ color: "#4a0066", borderColor: "#4a0066" }}
          >
            Print Plan
          </Button>
          <Button 
            onClick={handleCloseNutritionDialog}
            variant="contained"
            sx={{ backgroundColor: "#4a0066" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FitnessForm;