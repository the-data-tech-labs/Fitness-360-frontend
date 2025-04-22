import React, { useState } from "react";
import axios from "axios";
import { IconButton, Typography, Box } from "@mui/material";
import { Favorite, FavoriteBorder } from "@mui/icons-material";

const LikeButton = ({ postId, initialLikes, isLikedByUser }) => {
    const [likes, setLikes] = useState(initialLikes);  // Stores like count
    const [liked, setLiked] = useState(isLikedByUser);  // Stores if user liked post
    const token = localStorage.getItem("access_token");  // Get user token

    // Handle Like/Unlike
    const handleLike = async () => {
        if (!token) {
            alert("You need to log in to like this post.");
            return;
        }

        try {
            const response = await axios.post(
                `http://localhost:8000/api/community/posts/${postId}/like/`, // Use backticks for template literals
                {},
                {
                    headers: { Authorization: `Bearer ${token}` }, // Use backticks for template literals
                }
            );

            setLiked(response.data.liked);
            setLikes(response.data.total_likes);
        } catch (error) {
            console.error("Error liking post:", error.response?.data || error.message);
            alert("Failed to like the post.");
        }
    };

    return (
        <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
            <IconButton onClick={handleLike} color={liked ? "error" : "default"}>
                {liked ? <Favorite /> : <FavoriteBorder />}  {/* Heart icon for like/unlike */}
            </IconButton>
            <Typography variant="body2">{likes} Likes</Typography>
        </Box>
    );
};

export default LikeButton;