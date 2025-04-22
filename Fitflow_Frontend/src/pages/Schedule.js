import React, { useState } from "react";
import {
  Typography,
  Box,
  Paper,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { Delete as DeleteIcon, Save as SaveIcon, Edit as EditIcon } from "@mui/icons-material";

const dummySchedule = [
  { id: 1, day: "Monday", activity: "30-minute Cardio", time: "7:00 AM", isEditing: false },
  { id: 2, day: "Tuesday", activity: "Strength Training (Upper Body)", time: "6:00 PM", isEditing: false },
  { id: 3, day: "Wednesday", activity: "Rest Day", time: "All Day", isEditing: false },
];

function Schedule() {
  const [schedule, setSchedule] = useState(dummySchedule);
  const primaryColor = "#673ab7";

  const handleDeleteActivity = (id) => {
    setSchedule(schedule.filter((item) => item.id !== id));
  };

  const handleEditClick = (id) => {
    setSchedule(schedule.map(item => item.id === id ? { ...item, isEditing: true } : item));
  };

  const handleSaveClick = (id) => {
    setSchedule(schedule.map(item => item.id === id ? { ...item, isEditing: false } : item));
  };

  const handleInputChange = (id, field, value) => {
    setSchedule(schedule.map(item => item.id === id ? { ...item, [field]: value } : item));
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
        My Schedule
      </Typography>

      <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: "12px" }}>
        <Table aria-label="schedule table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", color: primaryColor, fontSize: "1rem" }}>Day</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: primaryColor, fontSize: "1rem" }}>Activity</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: primaryColor, fontSize: "1rem" }}>Time</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: primaryColor, fontSize: "1rem" }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schedule.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  {item.isEditing ? (
                    <TextField size="small" value={item.day} onChange={(e) => handleInputChange(item.id, 'day', e.target.value)} />
                  ) : (
                    item.day
                  )}
                </TableCell>
                <TableCell>
                  {item.isEditing ? (
                    <TextField size="small" value={item.activity} onChange={(e) => handleInputChange(item.id, 'activity', e.target.value)} />
                  ) : (
                    item.activity
                  )}
                </TableCell>
                <TableCell>
                  {item.isEditing ? (
                    <TextField size="small" value={item.time} onChange={(e) => handleInputChange(item.id, 'time', e.target.value)} />
                  ) : (
                    item.time
                  )}
                </TableCell>
                <TableCell align="right">
                  {item.isEditing ? (
                    <Tooltip title="Save">
                      <IconButton aria-label="save" onClick={() => handleSaveClick(item.id)} sx={{ color: primaryColor }}>
                        <SaveIcon />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Edit">
                      <IconButton aria-label="edit" onClick={() => handleEditClick(item.id)} sx={{ color: primaryColor }}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Delete">
                    <IconButton aria-label="delete" onClick={() => handleDeleteActivity(item.id)} sx={{ color: primaryColor }}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Schedule;