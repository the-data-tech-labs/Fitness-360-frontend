import React, { useState } from "react";
import {
  Typography,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  Button,
  Collapse,
  LinearProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Slider,
  Snackbar,
  Alert,
  Avatar,
  Badge,
  Chip,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandLess,
  ExpandMore,
  EmojiEvents as EmojiEventsIcon,
  FitnessCenter as FitnessCenterIcon,
  Restaurant as RestaurantIcon,
  Favorite as FavoriteIcon,
  Notifications as NotificationsIcon,
  Star as StarIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

function MyGoals() {
  const primaryColor = "#673ab7";
  const [goals, setGoals] = useState([
    { id: 1, text: "Run 5k in under 30 minutes", progress: 0.6, status: "Active", category: "Fitness", weight: 70 },
    { id: 2, text: "Bench press your body weight", progress: 0.3, status: "Active", category: "Fitness", weight: 80 },
    { id: 3, text: "Lose 10 pounds", progress: 1, status: "Completed", category: "Nutrition", weight: 65 },
  ]);
  const [newGoal, setNewGoal] = useState("");
  const [expandedGoal, setExpandedGoal] = useState(null);
  const [achievementOpen, setAchievementOpen] = useState(false);
  const [completedGoal, setCompletedGoal] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [workoutType, setWorkoutType] = useState("");
  const [workoutDuration, setWorkoutDuration] = useState("");
  const [weightLogs, setWeightLogs] = useState([]);
  const [currentWeight, setCurrentWeight] = useState("");
  const [editGoal, setEditGoal] = useState(null);
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [points, setPoints] = useState(100);
  const [level, setLevel] = useState(1);
  const [userProfile, setUserProfile] = useState({
    name: "John Doe",
    age: 28,
    weight: 75,
    height: 180,
    fitnessLevel: "Intermediate",
  });

  // Nutrition Tracking State
  const [meals, setMeals] = useState([]);
  const [carbs, setCarbs] = useState(0);
  const [protein, setProtein] = useState(0);
  const [fat, setFat] = useState(0);
  const [data, setData] = useState([
    { name: "Carbs", value: 40 },
    { name: "Protein", value: 30 },
    { name: "Fat", value: 30 },
  ]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  // Log a meal and update macronutrient distribution
  const logMeal = () => {
    if (carbs === 0 && protein === 0 && fat === 0) {
      setError("Please enter macronutrient values");
      setSnackbarOpen(true);
      return;
    }
    const total = carbs + protein + fat;
    const newData = [
      { name: "Carbs", value: (carbs / total) * 100 },
      { name: "Protein", value: (protein / total) * 100 },
      { name: "Fat", value: (fat / total) * 100 },
    ];
    setData(newData); // Update pie chart data
    setMeals([...meals, { carbs, protein, fat }]); // Add meal to history
    setCarbs(0); // Reset input fields
    setProtein(0);
    setFat(0);
  };

  // Calculate total macronutrient intake for the day
  const totalCarbs = meals.reduce((sum, meal) => sum + meal.carbs, 0);
  const totalProtein = meals.reduce((sum, meal) => sum + meal.protein, 0);
  const totalFat = meals.reduce((sum, meal) => sum + meal.fat, 0);

  // Handle adding a new goal
  const handleAddGoal = () => {
    if (newGoal.trim() === "") {
      setError("Goal text cannot be empty");
      setSnackbarOpen(true);
      return;
    }
    const newGoalItem = {
      id: Date.now(),
      text: newGoal,
      progress: 0,
      status: "Active",
      category: "Fitness",
      weight: "",
    };
    setGoals([...goals, newGoalItem]);
    setNewGoal("");
    setPoints(points + 10); // Award points for adding a goal
  };

  // Handle deleting a goal
  const handleDeleteGoal = (id) => {
    setGoals(goals.filter((goal) => goal.id !== id));
  };

  // Handle toggling the expanded state of a goal
  const handleToggleExpand = (id) => {
    setExpandedGoal(expandedGoal === id ? null : id);
  };

  // Handle updating the progress of a goal
  const handleProgressChange = (id, newProgress) => {
    const parsedProgress = Math.min(1, Math.max(0, parseFloat(newProgress)));
    setGoals(
      goals.map((goal) => {
        if (goal.id === id) {
          const updatedGoal = { ...goal, progress: parsedProgress };
          if (parsedProgress === 1 && goal.status !== "Completed") {
            setCompletedGoal(updatedGoal);
            setAchievementOpen(true);
            setPoints(points + 50); // Award points for completing a goal
            return { ...updatedGoal, status: "Completed" };
          }
          return updatedGoal;
        }
        return goal;
      })
    );
  };

  // Handle updating the weight of a goal
  const handleWeightChange = (id, newWeight) => {
    if (isNaN(newWeight) || newWeight < 0) {
      setError("Weight must be a positive number");
      setSnackbarOpen(true);
      return;
    }
    setGoals(
      goals.map((goal) =>
        goal.id === id ? { ...goal, weight: newWeight } : goal
      )
    );
  };

  // Handle closing the achievement dialog
  const handleCloseAchievement = () => {
    setAchievementOpen(false);
    setCompletedGoal(null);
  };

  // Handle logging a workout
  const addWorkout = () => {
    if (!workoutType || !workoutDuration || isNaN(workoutDuration)) {
      setError("Please enter valid workout type and duration");
      setSnackbarOpen(true);
      return;
    }
    const newWorkout = {
      date: new Date().toLocaleDateString(),
      type: workoutType,
      duration: Number(workoutDuration),
    };
    setWorkouts((prevWorkouts) => [...prevWorkouts, newWorkout]);
    setWorkoutType("");
    setWorkoutDuration("");
    setPoints(points + 20); // Award points for logging a workout
  };

  // Handle logging weight
  const logWeight = () => {
    if (!currentWeight || isNaN(currentWeight)) {
      setError("Please enter a valid weight");
      setSnackbarOpen(true);
      return;
    }
    const newWeightLog = { date: new Date().toLocaleDateString(), weight: Number(currentWeight) };
    setWeightLogs((prevWeightLogs) => [...prevWeightLogs, newWeightLog]);
    setCurrentWeight("");
    setPoints(points + 10); // Award points for logging weight
  };

  // Handle editing a goal
  const handleEditGoal = (goal) => {
    setEditGoal(goal);
    setNewGoal(goal.text);
  };

  // Handle updating a goal
  const handleUpdateGoal = () => {
    if (newGoal.trim() === "") {
      setError("Goal text cannot be empty");
      setSnackbarOpen(true);
      return;
    }
    setGoals(goals.map((goal) => (goal.id === editGoal.id ? { ...goal, text: newGoal } : goal)));
    setEditGoal(null);
    setNewGoal("");
  };

  // Handle closing the snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Handle changing tabs
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ p: 4, bgcolor: "#f8f8ff", minHeight: "100vh", borderRadius: "12px" }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4, color: primaryColor, textAlign: "center" }}>
        My Fitness Goals
      </Typography>

      {/* User Profile Section */}
      <Card sx={{ mb: 2, borderRadius: "12px" }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar sx={{ bgcolor: primaryColor }}>
              <PersonIcon />
            </Avatar>
            <Box>
              <Typography variant="h6">{userProfile.name}</Typography>
              <Typography variant="body2">Level {level} | {points} Points</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Tabs for Navigation */}
      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Goals" />
        <Tab label="Workouts" />
        <Tab label="Nutrition" />
        <Tab label="Progress" />
      </Tabs>

      {/* Goals Tab */}
      {tabValue === 0 && (
        <Box>
          <Box sx={{ display: "flex", mb: 3, gap: 2 }}>
            <TextField
              label="Add a new goal"
              variant="outlined"
              fullWidth
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
            />
            <Button variant="contained" sx={{ bgcolor: primaryColor, color: "white" }} onClick={editGoal ? handleUpdateGoal : handleAddGoal}>
              {editGoal ? "Update Goal" : "Add Goal"}
            </Button>
          </Box>
          <List>
            {goals.map((goal) => (
              <Card key={goal.id} sx={{ mb: 2, borderRadius: "12px" }}>
                <ListItem button onClick={() => handleToggleExpand(goal.id)}>
                  <ListItemText
                    primary={goal.text}
                    secondary={
                      <>
                        <Typography variant="body2">Status: {goal.status}</Typography>
                        <Typography variant="body2">Weight: {goal.weight} kg</Typography>
                        <LinearProgress variant="determinate" value={goal.progress * 100} />
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" onClick={() => handleDeleteGoal(goal.id)}>
                      <DeleteIcon />
                    </IconButton>
                    <IconButton onClick={() => handleEditGoal(goal)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleToggleExpand(goal.id)}>
                      {expandedGoal === goal.id ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Collapse in={expandedGoal === goal.id} timeout="auto" unmountOnExit>
                  <CardContent>
                    <TextField
                      label="Weight (kg)"
                      type="number"
                      value={goal.weight}
                      onChange={(e) => handleWeightChange(goal.id, e.target.value)}
                      sx={{ mb: 2 }}
                    />
                    <Typography variant="body2">Progress:</Typography>
                    <Slider
                      value={goal.progress * 100}
                      onChange={(e, newValue) => handleProgressChange(goal.id, newValue / 100)}
                      valueLabelDisplay="auto"
                      sx={{ mb: 2 }}
                    />
                  </CardContent>
                </Collapse>
              </Card>
            ))}
          </List>
        </Box>
      )}

      {/* Workouts Tab */}
      {tabValue === 1 && (
        <Card sx={{ mb: 2, borderRadius: "12px" }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Workout Tracking
            </Typography>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Workout Type</InputLabel>
                <Select value={workoutType} onChange={(e) => setWorkoutType(e.target.value)} label="Workout Type">
                  <MenuItem value="Running">Running</MenuItem>
                  <MenuItem value="Yoga">Yoga</MenuItem>
                  <MenuItem value="Weightlifting">Weightlifting</MenuItem>
                  <MenuItem value="Cycling">Cycling</MenuItem>
                  <MenuItem value="Swimming">Swimming</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Duration (minutes)"
                type="number"
                value={workoutDuration}
                onChange={(e) => setWorkoutDuration(e.target.value)}
                fullWidth
              />
            </Box>
            <Button variant="contained" sx={{ bgcolor: primaryColor, color: "white" }} onClick={addWorkout}>
              Log Workout
            </Button>
            <List>
              {workouts.map((workout, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={`${workout.date}: ${workout.type}`}
                    secondary={`${workout.duration} minutes`}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {/* Nutrition Tab */}
      {tabValue === 2 && (
        <Card sx={{ mb: 2, borderRadius: "12px" }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Nutrition Tracking
            </Typography>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <TextField
                label="Carbs (g)"
                type="number"
                value={carbs}
                onChange={(e) => setCarbs(Number(e.target.value))}
                fullWidth
              />
              <TextField
                label="Protein (g)"
                type="number"
                value={protein}
                onChange={(e) => setProtein(Number(e.target.value))}
                fullWidth
              />
              <TextField
                label="Fat (g)"
                type="number"
                value={fat}
                onChange={(e) => setFat(Number(e.target.value))}
                fullWidth
              />
              <Button variant="contained" sx={{ bgcolor: primaryColor, color: "white" }} onClick={logMeal}>
                Log Meal
              </Button>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <PieChart width={300} height={300}>
                <Pie data={data} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" label>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </Box>
            <Typography variant="body1" sx={{ textAlign: "center" }}>
              Macronutrient Distribution
            </Typography>
            <Typography variant="body2" sx={{ textAlign: "center", mt: 2 }}>
              Daily Totals: Carbs: {totalCarbs}g, Protein: {totalProtein}g, Fat: {totalFat}g
            </Typography>
            <List>
              {meals.map((meal, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={`Meal ${index + 1}`}
                    secondary={`Carbs: ${meal.carbs}g, Protein: ${meal.protein}g, Fat: ${meal.fat}g`}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {/* Progress Tab */}
      {tabValue === 3 && (
        <Card sx={{ mb: 2, borderRadius: "12px" }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Weight Tracking
            </Typography>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <TextField
                label="Current Weight (kg)"
                type="number"
                value={currentWeight}
                onChange={(e) => setCurrentWeight(e.target.value)}
                fullWidth
              />
              <Button variant="contained" sx={{ bgcolor: primaryColor, color: "white" }} onClick={logWeight}>
                Log Weight
              </Button>
            </Box>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weightLogs}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="weight" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Achievement Dialog */}
      <Dialog open={achievementOpen} onClose={handleCloseAchievement}>
        <DialogTitle>
          <EmojiEventsIcon /> Achievement Unlocked!
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Congratulations! You've completed the goal: {completedGoal?.text}.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAchievement}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for Error Messages */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default MyGoals;