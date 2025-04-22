import React from "react";
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const dummyWorkoutData = [
  { name: "Week 1", Cardio: 3, Strength: 2, Yoga: 1 },
  { name: "Week 2", Cardio: 4, Strength: 3, Yoga: 2 },
  { name: "Week 3", Cardio: 5, Strength: 4, Yoga: 3 },
  { name: "Week 4", Cardio: 4, Strength: 3, Yoga: 2 },
];

const dummyNutritionData = [
  { name: "Week 1", Calories: 2000, Protein: 150, Carbs: 250 },
  { name: "Week 2", Calories: 2500, Protein: 180, Carbs: 300 },
  { name: "Week 3", Calories: 3000, Protein: 200, Carbs: 350 },
  { name: "Week 4", Calories: 2800, Protein: 190, Carbs: 320 },
];

const dummyOverallData = [
  { name: "Start", Progress: 0 },
  { name: "End", Progress: 85 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]; // Pie chart colors

function Statistics() {
  const primaryColor = "#673ab7"; // Purple accent color

  // Calculate totals and averages from nutrition data
  const totalCalories = dummyNutritionData.reduce((sum, week) => sum + week.Calories, 0);
  const avgProtein = dummyNutritionData.reduce((sum, week) => sum + week.Protein, 0) / dummyNutritionData.length;
  const avgCarbs = dummyNutritionData.reduce((sum, week) => sum + week.Carbs, 0) / dummyNutritionData.length;

  // Calculate the over all progress
  const totalWorkout = dummyWorkoutData.reduce((total, day) => total + day.Cardio + day.Strength + day.Yoga, 0) / dummyWorkoutData.length;

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Box sx={{ p: 4, bgcolor: "#f8f8ff", minHeight: "100vh", borderRadius: "12px" }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          mb: 4,
          color: primaryColor,
          textAlign: "center",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        My Statistics
      </Typography>

      <Grid container spacing={3}>
        {/* Workout Progress - Bar Chart */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, borderRadius: "15px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", bgcolor: "white" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: primaryColor }}>Workout Progress</Typography>
            <BarChart width={500} height={300} data={dummyWorkoutData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis dataKey="name" stroke="#555" />
              <YAxis stroke="#555" />
              <Tooltip wrapperStyle={{ backgroundColor: "white", padding: "8px", border: "1px solid #ddd", borderRadius: "5px" }} labelStyle={{ color: primaryColor, fontWeight: "bold" }} />
              <Legend />
              <Bar dataKey="Cardio" stackId="a" fill="#8884d8" />
              <Bar dataKey="Strength" stackId="a" fill="#82ca9d" />
              <Bar dataKey="Yoga" stackId="a" fill="#ffc658" />
            </BarChart>
          </Card>
        </Grid>

        {/* Nutrition Progress - Line Chart */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, borderRadius: "15px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", bgcolor: "white" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: primaryColor }}>Nutrition Progress</Typography>
            <LineChart width={500} height={300} data={dummyNutritionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis dataKey="name" stroke="#555" />
              <YAxis stroke="#555" />
              <Tooltip wrapperStyle={{ backgroundColor: "white", padding: "8px", border: "1px solid #ddd", borderRadius: "5px" }} labelStyle={{ color: primaryColor, fontWeight: "bold" }} />
              <Legend />
              <Line type="monotone" dataKey="Calories" stroke={primaryColor} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="Protein" stroke="#82ca9d" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="Carbs" stroke="#ffc658" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
            </LineChart>
          </Card>
        </Grid>

        {/* Overall Progress - Pie Chart */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, borderRadius: "15px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", bgcolor: "white", display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: primaryColor, textAlign: "center" }}>Overall Progress</Typography>
            <PieChart width={300} height={300}>
              <Pie
                dataKey="Progress"
                isAnimationActive={false}
                data={dummyOverallData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                labelLine={false}
                label={renderCustomizedLabel}
              >
                {
                  dummyOverallData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))
                }
              </Pie>
              <Tooltip />
            </PieChart>
            <Typography variant="body1" sx={{ mt: 2, color: primaryColor, fontWeight: "bold" }}>{`${dummyOverallData[1].Progress}%`}</Typography>
          </Card>
        </Grid>

        {/* Key Metrics */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, borderRadius: "15px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", bgcolor: "white", height: "100%" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: primaryColor }}>Key Metrics</Typography>
            <Typography variant="body1" sx={{ fontSize: "1rem", color: "#333", mb: 1 }}>Total Workouts: <span style={{ fontWeight: "bold", color: primaryColor }}>{totalWorkout}</span></Typography>
            <Typography variant="body1" sx={{ fontSize: "1rem", color: "#333", mb: 1 }}>Average Protein Intake: <span style={{ fontWeight: "bold", color: primaryColor }}>{avgProtein.toFixed(1)}g</span></Typography>
            <Typography variant="body1" sx={{ fontSize: "1rem", color: "#333", mb: 1 }}>Average Carbs Intake: <span style={{ fontWeight: "bold", color: primaryColor }}>{avgCarbs.toFixed(1)}g</span></Typography>
            <Typography variant="body1" sx={{ fontSize: "1rem", color: "#333" }}>Overall Progress: <span style={{ fontWeight: "bold", color: primaryColor }}>{dummyOverallData[1].Progress}%</span></Typography>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Statistics;