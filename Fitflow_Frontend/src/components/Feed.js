import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  IconButton,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button
} from "@mui/material";
import {
  Favorite,
  FavoriteBorder,
  Comment,
  Edit,
  Delete,
  Close
} from "@mui/icons-material";
import { motion } from "framer-motion";
import CommentSection from "./CommentSection";

const Feed = ({ posts, onLikePost, onDeletePost, onEditPost }) => {
  const [expandedComments, setExpandedComments] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [postToDelete, setPostToDelete] = useState(null);

  const handleCommentClick = (postId) => {
    setExpandedComments(expandedComments === postId ? null : postId);
  };

  const handleEditClick = (post) => {
    setEditingPost(post.id);
    setEditedText(post.text);
  };

  const handleSaveEdit = () => {
    onEditPost(editingPost, editedText);
    setEditingPost(null);
  };

  const handleDeleteClick = (postId) => {
    setPostToDelete(postId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    onDeletePost(postToDelete);
    setDeleteDialogOpen(false);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, padding: 2 }}>
      {posts.map((post) => (
        <motion.div
          key={post.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card
            sx={{
              borderRadius: "16px",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
              background: "#ffffff",
              overflow: "hidden",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                boxShadow: "0 12px 32px rgba(0, 0, 0, 0.2)",
              },
              width: "100%",
              maxWidth: "1200px",
              margin: "0 auto",
            }}
          >
            <CardContent>
              {/* Post Header */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                <Avatar
                  src={post.user.profile_picture || ""}
                  alt={post.user.username}
                  sx={{ width: 56, height: 56, border: "2px solid #e0e0e0" }}
                />
                <Typography variant="h5" sx={{ fontWeight: "bold", color: "#262626" }}>
                  @{post.user.username}
                </Typography>
              </Box>

              {/* Post Content - Edit Mode or View Mode */}
              {editingPost === post.id ? (
                <TextField
                  fullWidth
                  multiline
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  sx={{ mb: 3 }}
                />
              ) : (
                <Typography variant="body1" sx={{ color: "#262626", mb: 3, fontSize: "1.1rem" }}>
                  {post.text}
                </Typography>
              )}

              {/* Post Media */}
              {post.image && (
                <img
                  src={post.image}
                  alt="Post"
                  style={{
                    width: "100%",
                    borderRadius: "12px",
                    marginBottom: "16px",
                    objectFit: "cover",
                    maxHeight: "500px",
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
                    maxHeight: "500px",
                  }}
                />
              )}

              {/* Post Actions */}
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
                <Box>
                  <IconButton
                    onClick={() => onLikePost(post.id)}
                    sx={{
                      color: post.is_liked ? "#ff4081" : "#bdbdbd",
                      "&:hover": { color: "#ff4081" },
                    }}
                  >
                    {post.is_liked ? <Favorite /> : <FavoriteBorder />}
                  </IconButton>
                  <Typography variant="body2" sx={{ display: "inline", ml: 1, color: "#262626", fontSize: "1rem" }}>
                    {post.likes.length} Likes
                  </Typography>

                  <IconButton
                    onClick={() => handleCommentClick(post.id)}
                    sx={{
                      color: expandedComments === post.id ? "#405de6" : "#bdbdbd",
                      "&:hover": { color: "#405de6" },
                      ml: 1
                    }}
                  >
                    <Comment />
                  </IconButton>
                  <Typography variant="body2" sx={{ display: "inline", ml: 1, color: "#262626", fontSize: "1rem" }}>
                    {post.comments.length} Comments
                  </Typography>
                </Box>

                {/* Edit/Delete Buttons (visible only to post owner) */}
                {post.user.username === localStorage.getItem("username") && (
                  <Box>
                    {editingPost === post.id ? (
                      <>
                        <Button onClick={() => setEditingPost(null)} sx={{ color: "text.secondary" }}>
                          Cancel
                        </Button>
                        <Button onClick={handleSaveEdit} sx={{ color: "primary.main" }}>
                          Save
                        </Button>
                      </>
                    ) : (
                      <>
                        <IconButton
                          onClick={() => handleEditClick(post)}
                          sx={{ color: "#405de6", "&:hover": { color: "#374ec7" } }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteClick(post.id)}
                          sx={{ color: "#ff4081", "&:hover": { color: "#d81b60" } }}
                        >
                          <Delete />
                        </IconButton>
                      </>
                    )}
                  </Box>
                )}
              </Box>

              {/* Comment Section */}
              <Collapse in={expandedComments === post.id}>
                <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid #f0f0f0" }}>
                  <CommentSection postId={post.id} />
                </Box>
              </Collapse>
            </CardContent>
          </Card>
        </motion.div>
      ))}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Post</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this post? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Feed;