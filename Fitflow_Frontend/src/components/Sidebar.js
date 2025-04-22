import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import {
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Button,
    Typography,
    Divider,
    Box,
    ListItemIcon,
    IconButton, // Add IconButton for the arrow
} from "@mui/material";
import {
    FitnessCenter,
    Restaurant,
    SelfImprovement,
    Psychology,
    QuestionAnswer,
    PostAdd,
    ArrowBack, // Icon for the back button
} from "@mui/icons-material";
import { motion } from "framer-motion";

const categories = [
    { id: "all", name: "All Posts", icon: <PostAdd /> },
    { id: "fitness", name: "Fitness", icon: <FitnessCenter /> },
    { id: "nutrition", name: "Nutrition", icon: <Restaurant /> },
    { id: "yoga", name: "Yoga", icon: <SelfImprovement /> },
    { id: "mental_health", name: "Mental Health", icon: <Psychology /> },
    { id: "qna", name: "Q&A", icon: <QuestionAnswer /> },
];

const Sidebar = ({ onCategorySelect, onCreatePost }) => {
    const [activeCategory, setActiveCategory] = useState("all");
    const navigate = useNavigate(); // Hook for navigation

    const handleCategoryClick = (categoryId) => {
        setActiveCategory(categoryId);
        onCategorySelect(categoryId);
    };

    const handleGoBack = () => {
        navigate("/services"); // Navigate to the Services page
    };

    return (
        <Box
            sx={{
                width: "300px", // Increased width
                height: "100vh", // Full height of the viewport
                background: "#ffffff", // White background
                boxShadow: "2px 0 10px rgba(0, 0, 0, 0.1)", // Subtle shadow
                borderRight: "1px solid #e0e0e0", // Light border
                position: "fixed", // Fixed position to prevent overlapping
                top: 0,
                left: 0,
                zIndex: 1000, // Ensure sidebar is above other content
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* Sidebar Header with ArrowBack Icon */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "20px",
                    borderBottom: "1px solid #e0e0e0",
                    background: "linear-gradient(145deg, #405de6, #833ab4)",
                    borderRadius: "0 0 12px 12px",
                }}
            >
                {/* ArrowBack Icon */}
                <IconButton
                    onClick={handleGoBack}
                    sx={{
                        color: "#ffffff", // White color for the icon
                        "&:hover": {
                            background: "rgba(255, 255, 255, 0.1)", // Subtle hover effect
                        },
                    }}
                >
                    <ArrowBack />
                </IconButton>

                {/* Categories Text */}
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: "700", // Bold and professional
                        color: "#ffffff",
                        fontSize: "1.5rem", // Larger font size
                    }}
                >
                    Categories
                </Typography>

                {/* Empty Box to balance the layout */}
                <Box sx={{ width: "48px" }} /> {/* Matches the size of the IconButton */}
            </Box>

            {/* Category List */}
            <List
                sx={{
                    flex: 1,
                    overflowY: "auto", // Allow scrolling if content exceeds height
                    padding: "10px",
                }}
            >
                {categories.map((category) => (
                    <motion.div
                        key={category.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={() => handleCategoryClick(category.id)}
                                sx={{
                                    padding: "12px 16px",
                                    borderRadius: "8px",
                                    marginBottom: "8px",
                                    background:
                                        activeCategory === category.id
                                            ? "linear-gradient(145deg, #405de6, #833ab4)"
                                            : "transparent",
                                    "&:hover": {
                                        background:
                                            activeCategory === category.id
                                                ? "linear-gradient(145deg, #405de6, #833ab4)"
                                                : "#f5f5f5",
                                    },
                                    transition: "background 0.3s ease",
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        color:
                                            activeCategory === category.id ? "#ffffff" : "#405de6",
                                        fontSize: "1.5rem", // Larger icon size
                                    }}
                                >
                                    {category.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={category.name}
                                    primaryTypographyProps={{
                                        fontSize: "1.2rem", // Larger font size
                                        fontWeight: "600", // Semi-bold for professional look
                                        color:
                                            activeCategory === category.id ? "#ffffff" : "#262626",
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    </motion.div>
                ))}
            </List>

            {/* Divider */}
            <Divider sx={{ margin: "10px 0" }} />

            {/* Create Post Button */}
            <Box sx={{ padding: "16px" }}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                        onClick={onCreatePost}
                        variant="contained"
                        fullWidth
                        startIcon={<PostAdd />}
                        sx={{
                            borderRadius: "8px",
                            textTransform: "none",
                            background: "linear-gradient(145deg, #405de6, #833ab4)",
                            color: "#ffffff",
                            fontSize: "1.2rem", // Larger font size
                            fontWeight: "600", // Semi-bold for professional look
                            "&:hover": {
                                background: "linear-gradient(145deg, #374ec7, #6a2d9a)",
                            },
                            transition: "background 0.3s ease",
                        }}
                    >
                        Create Post
                    </Button>
                </motion.div>
            </Box>
        </Box>
    );
};

export default Sidebar;