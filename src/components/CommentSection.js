import { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button, Typography, Box, Avatar, CircularProgress, Snackbar } from "@mui/material";

const CommentSection = ({ postId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const token = localStorage.getItem("access_token");
    const backendUrl = process.env.REACT_APP_BACKEND_URL
    // Fetch comments


    useEffect(() => {
        const fetchComments = async () => {
            if (!token) {
                setError("You need to be logged in to view comments.");
                setSnackbarOpen(true);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const response = await axios.get(
                    `${backendUrl}/api/community/posts/${postId}/comments/`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                );
                setComments(response.data);
            } catch (error) {
                console.error("Error fetching comments:", error);
                setError(error.response?.data?.detail || "Failed to fetch comments.");
                setSnackbarOpen(true);
            } finally {
                setLoading(false);
            }
        };
        fetchComments()
    }, [postId, backendUrl, token]);

    // Handle adding a new comment
    const handleAddComment = async () => {
        if (!newComment.trim()) {
            setError("Comment cannot be empty!");
            setSnackbarOpen(true);
            return;
        }

        if (!token) {
            setError("You need to be logged in to add a comment.");
            setSnackbarOpen(true);
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(
                `${backendUrl}/api/community/posts/${postId}/comments/`,
                { text: newComment },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            setComments([response.data, ...comments]); // New comment at top
            setNewComment("");
        } catch (error) {
            console.error("Error adding comment:", error);
            setError(error.response?.data?.detail || "Failed to add comment.");
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                mt: 2,
                p: 2,
                border: "1px solid #e0e0e0",
                borderRadius: "12px",
                background: "#ffffff",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
        >
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#262626", mb: 2 }}>
                Comments
            </Typography>

            {loading && <CircularProgress size={24} />}

            {comments.length > 0 ? (
                comments.map((comment) => (
                    <Box
                        key={comment.id}
                        sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 2,
                            mb: 2,
                            p: 1,
                        }}
                    >
                        <Avatar
                            src={comment.user?.profile_picture || ""}
                            alt={comment.user?.username}
                            sx={{ width: 40, height: 40 }}
                        />
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                                @{comment.user?.username}
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 0.5 }}>
                                {comment.text}
                            </Typography>
                            <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mt: 0.5 }}>
                                {new Date(comment.created_at).toLocaleString()}
                            </Typography>
                        </Box>
                    </Box>
                ))
            ) : (
                !loading && (
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        No comments yet. Be the first to comment!
                    </Typography>
                )
            )}

            <Box sx={{ mt: 3 }}>
                <TextField
                    fullWidth
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    multiline
                    rows={2}
                    disabled={loading}
                    sx={{
                        mb: 1,
                        "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                        },
                    }}
                />
                <Button
                    onClick={handleAddComment}
                    variant="contained"
                    disabled={loading || !newComment.trim()}
                    sx={{
                        borderRadius: "8px",
                        textTransform: "none",
                        background: "linear-gradient(145deg, #405de6, #833ab4)",
                        "&:hover": {
                            background: "linear-gradient(145deg, #374ec7, #6a2d9a)",
                        },
                    }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Post Comment"}
                </Button>
            </Box>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                message={error}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            />
        </Box>
    );
};

export default CommentSection;