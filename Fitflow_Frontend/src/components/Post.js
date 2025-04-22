import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  TextField,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Avatar,
} from "@mui/material";
import { ThumbUp, ThumbUpOutlined, Comment, Edit, Delete } from "@mui/icons-material";
import { motion } from "framer-motion";

const Post = ({ post, onLikePost }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(post.text);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [likes, setLikes] = useState(post.total_likes || 0);
  const [liked, setLiked] = useState(post.is_liked);
  const [showComments, setShowComments] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const storedToken = localStorage.getItem("access_token");
  const loggedInUser = localStorage.getItem("username");

  // Toggle comments visibility
  const handleCommentClick = () => {
    setShowComments(!showComments);
  };

  useEffect(() => {
    if (showComments) {
      const fetchComments = async () => {
        setLoading(true);
        setError(null);

        try {
          const response = await axios.get(
            `http://localhost:8000/api/community/posts/${post.id}/comments/`,
            {
              headers: { Authorization: `Bearer ${storedToken}` },
            }
          );
          setComments(response.data);
        } catch (error) {
          console.error("Error fetching comments:", error);
          setError("Failed to fetch comments.");
        } finally {
          setLoading(false);
        }
      };
      fetchComments();
    }
  }, [showComments, post.id, storedToken]);

  const handleLike = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `http://localhost:8000/api/community/posts/${post.id}/like/`,
        {},
        { headers: { Authorization: `Bearer ${storedToken}` } }
      );

      setLiked(response.data.liked);
      setLikes(response.data.total_likes);
      onLikePost(post.id); // Notify parent component
    } catch (error) {
      console.error("Error liking post:", error);
      setError("Failed to like/unlike post.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    setLoading(true);
    setError(null);

    try {
      await axios.put(
        `http://localhost:8000/api/community/posts/${post.id}/`,
        { text: editedText },
        { headers: { Authorization: `Bearer ${storedToken}` } }
      );
      setIsEditing(false);
    } catch (error) {
      console.error("Error editing post:", error);
      setError("Failed to edit post.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      await axios.delete(
        `http://localhost:8000/api/community/posts/${post.id}/`,
        { headers: { Authorization: `Bearer ${storedToken}` } }
      );
      alert("Post deleted successfully!");
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting post:", error);
      setError("Failed to delete post.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return alert("Comment cannot be empty!");

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `http://localhost:8000/api/community/posts/${post.id}/comments/`,
        { text: newComment },
        { headers: { Authorization: `Bearer ${storedToken}` } }
      );
      setComments([...comments, response.data]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
      setError("Failed to add comment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card
        sx={{
          marginBottom: "20px",
          borderRadius: "16px",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
          background: "#ffffff",
          overflow: "hidden",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            boxShadow: "0 12px 32px rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        <CardContent>
          {/* Post Header */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Avatar
              src={post.user.profile_picture || ""}
              alt={post.user.username}
              sx={{ width: 48, height: 48, border: "2px solid #e0e0e0" }}
            />
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#262626" }}>
              @{post.user.username}
            </Typography>
          </Box>

          {/* Post Text */}
          {isEditing ? (
            <TextField
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              fullWidth
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  borderColor: "#e0e0e0",
                  "&:hover fieldset": {
                    borderColor: "#bdbdbd",
                  },
                },
              }}
            />
          ) : (
            <Typography variant="body1" sx={{ color: "#262626", mb: 2 }}>
              {post.text}
            </Typography>
          )}

          {/* Post Image or Video */}
          {post.image && (
            <img
              src={post.image}
              alt="Post"
              style={{
                width: "100%",
                borderRadius: "12px",
                marginBottom: "16px",
                objectFit: "cover",
                maxHeight: "300px",
              }}
            />
          )}
          {post.video && (
            <video
              controls
              src={post.video}
              style={{
                width: "100%",
                borderRadius: "12px",
                marginBottom: "16px",
                maxHeight: "300px",
              }}
            />
          )}

          {/* Like and Comment Buttons */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
            <Box>
              <IconButton
                onClick={handleLike}
                sx={{
                  color: liked ? "#ff4081" : "#bdbdbd",
                  "&:hover": { color: "#ff4081" },
                }}
              >
                {liked ? <ThumbUp /> : <ThumbUpOutlined />}
              </IconButton>
              <Typography variant="body2" sx={{ display: "inline", ml: 1, color: "#262626" }}>
                {likes} Likes
              </Typography>

              <IconButton
                onClick={handleCommentClick}
                sx={{
                  color: showComments ? "#405de6" : "#bdbdbd",
                  "&:hover": { color: "#405de6" },
                }}
              >
                <Comment />
              </IconButton>
              <Typography variant="body2" sx={{ display: "inline", ml: 1, color: "#262626" }}>
                {comments.length} Comments
              </Typography>
            </Box>

            {/* Edit and Delete Buttons (for post owner) */}
            {post.user.username === loggedInUser && (
              <Box>
                <IconButton
                  onClick={() => setIsEditing(!isEditing)}
                  sx={{ color: "#405de6", "&:hover": { color: "#374ec7" } }}
                >
                  <Edit />
                </IconButton>
                <IconButton
                  onClick={() => setDeleteDialogOpen(true)}
                  sx={{ color: "#ff4081", "&:hover": { color: "#d81b60" } }}
                >
                  <Delete />
                </IconButton>
              </Box>
            )}
          </Box>

          {/* Comments Section */}
          {showComments && (
            <Box sx={{ mt: 2 }}>
              {loading && <Typography>Loading comments...</Typography>}
              {error && (
                <Typography color="error" variant="body2">
                  {error}
                </Typography>
              )}
              {comments.map((comment) => (
                <Box
                  key={comment.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mt: 1,
                    p: 1,
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <Avatar
                    src={comment.user.profile_picture || ""}
                    alt={comment.user.username}
                    sx={{ width: 32, height: 32 }}
                  />
                  <Typography variant="body2" sx={{ color: "#262626" }}>
                    <strong>@{comment.user.username}</strong>: {comment.text}
                  </Typography>
                </Box>
              ))}
              <TextField
                fullWidth
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                multiline
                rows={2}
                sx={{
                  mt: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    borderColor: "#e0e0e0",
                    "&:hover fieldset": {
                      borderColor: "#bdbdbd",
                    },
                  },
                }}
              />
              <Button
                onClick={handleAddComment}
                variant="contained"
                sx={{
                  mt: 1,
                  borderRadius: "8px",
                  textTransform: "none",
                  background: "linear-gradient(145deg, #405de6, #833ab4)",
                  color: "#ffffff",
                  "&:hover": { background: "linear-gradient(145deg, #374ec7, #6a2d9a)" },
                }}
              >
                Add Comment
              </Button>
            </Box>
          )}
        </CardContent>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          aria-labelledby="delete-dialog-title"
        >
          <DialogTitle id="delete-dialog-title">Delete Post</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this post? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDelete} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
    </motion.div>
  );
};

export default Post;