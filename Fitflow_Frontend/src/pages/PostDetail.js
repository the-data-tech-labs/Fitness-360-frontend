import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Typography, TextField, Button, Card, CardContent } from "@mui/material";

const PostDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [newComment, setNewComment] = useState("");
    const token = localStorage.getItem("access_token");

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8000/api/community/posts/${id}/`
                );
                setPost(response.data);
            } catch (error) {
                console.error("Error fetching post:", error);
            }
        };

        fetchPost();
    }, [id]);

    const handleAddComment = async () => {
        if (!newComment.trim()) {
            alert("Comment cannot be empty!");
            return;
        }

        if (!token) {
            alert("You need to be logged in to add a comment.");
            return;
        }

        try {
            const response = await axios.post(
                `http://localhost:8000/api/community/posts/${id}/comments/`,
                { text: newComment },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setPost((prevPost) => ({
                ...prevPost,
                comments: [...(prevPost.comments || []), response.data],
            }));
            setNewComment("");
        } catch (error) {
            console.error("Error adding comment:", error);
            alert("Failed to add comment.");
        }
    };

    if (!post) return <Typography>Loading...</Typography>;

    return (
        <Card sx={{ maxWidth: 600, margin: "20px auto", padding: 2 }}>
            <CardContent>
                <Typography variant="h5">@{post.user.username}</Typography>
                <Typography variant="body1">{post.text}</Typography>

                {/* Display Image (if available) */}
                {post.image && (
                    <img
                        src={post.image}
                        alt="Post"
                        style={{ maxWidth: "100%", borderRadius: "4px", marginTop: "10px" }}
                    />
                )}

                {/* Comments Section */}
                <Typography variant="h6" sx={{ mt: 2 }}>
                    Comments:
                </Typography>
                {post.comments?.length > 0 ? (
                    post.comments.map((comment) => (
                        <Typography key={comment.id} sx={{ mt: 1, p: 1, borderBottom: "1px solid #ddd" }}>
                            <strong>@{comment.user.username}</strong>: {comment.text}
                        </Typography>
                    ))
                ) : (
                    <Typography variant="body2" sx={{ color: "#888" }}>No comments yet.</Typography>
                )}

                {/* Add Comment Section */}
                <TextField
                    fullWidth
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    multiline
                    rows={2}
                    sx={{ mt: 2 }}
                />
                <Button onClick={handleAddComment} variant="contained" color="primary" sx={{ mt: 1 }}>
                    Comment
                </Button>
            </CardContent>
        </Card>
    );
};

export default PostDetail;
