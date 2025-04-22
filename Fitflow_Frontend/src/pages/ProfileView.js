import React, { useContext } from 'react';
import { Typography, Box, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper } from '@mui/material';
import { DataContext } from '../context/DataContext'; // Import DataContext

function ProfileView() {
  const { fitnessData, nutritionData } = useContext(DataContext); // Get data from context

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        User Profile and Data:
      </Typography>

      {fitnessData && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
            Fitness Data:
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Exercise</TableCell>
                  <TableCell>Reps</TableCell>
                  <TableCell>Sets</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fitnessData.exercises.map((exercise, index) => (
                  <TableRow key={index}>
                    <TableCell>{exercise.name}</TableCell>
                    <TableCell>{exercise.reps}</TableCell>
                    <TableCell>{exercise.sets}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {nutritionData && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Nutrition Data:
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Meal</TableCell>
                    <TableCell>Calories</TableCell>
                    <TableCell>Protein</TableCell>
                    <TableCell>Carbs</TableCell>
                    <TableCell>Fat</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {nutritionData.meals.map((meal, index) => (
                    <TableRow key={index}>
                      <TableCell>{meal.name}</TableCell>
                      <TableCell>{meal.calories}</TableCell>
                      <TableCell>{meal.protein}</TableCell>
                      <TableCell>{meal.carbs}</TableCell>
                      <TableCell>{meal.fat}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
    </Box>
  );
}

export default ProfileView;