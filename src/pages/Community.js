import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Feed from "../components/Feed";
import CreatePost from "../components/CreatePost";
import { Fab, CircularProgress, Snackbar } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { styled } from "@mui/system";
import "./Community.css";

const StyledFab = styled(Fab)({
  position: "fixed",
  bottom: "20px",
  right: "20px",
  backgroundColor: "#0095f6",
  "&:hover": {
    backgroundColor: "#0077cc",
  },
});

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState("all");
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const backendUrl = process.env.REACT_APP_BACKEND_URL
  // Fetch posts based on selected category
  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        alert("You need to be logged in to view posts.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const url =
          category === "all"
            ? `${backendUrl}/api/community/posts/`
            : `${backendUrl}/api/community/posts/?category=${category}`;

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error.response?.data || error.message);
        setError("Failed to fetch posts. Please check your login status.");
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [category, backendUrl]);

  const handleCreatePost = () => {
    setCreatePostOpen(true);
  };

  const handleCloseCreatePost = () => {
    setCreatePostOpen(false);
  };

  // Updated to add new post at the top
  const handlePostCreated = (newPost) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  const handleLikePost = async (postId) => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      alert("You need to be logged in to like/unlike posts.");
      return;
    }

    try {
      await axios.post(
        `${backendUrl}/api/community/posts/${postId}/like/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPosts(posts.map(post => 
        post.id === postId
          ? { 
              ...post, 
              is_liked: !post.is_liked,
              total_likes: post.is_liked ? post.total_likes - 1 : post.total_likes + 1
            }
          : post
      ));
    } catch (error) {
      console.error("Error liking/unliking post:", error.response?.data || error.message);
      alert("Failed to like/unlike post.");
    }
  };

  const handleDeletePost = async (postId) => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      alert("You need to be logged in to delete posts.");
      return;
    }

    try {
      await axios.delete(
        `${backendUrl}/api/community/posts/${postId}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error.response?.data || error.message);
      setError("Failed to delete post.");
      setSnackbarOpen(true);
    }
  };

  const handleEditPost = async (postId, newText) => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      alert("You need to be logged in to edit posts.");
      return;
    }

    try {
      await axios.put(
        `${backendUrl}/api/community/posts/${postId}/`,
        { text: newText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setPosts(posts.map(post => 
        post.id === postId ? { ...post, text: newText } : post
      ));
    } catch (error) {
      console.error("Error editing post:", error.response?.data || error.message);
      setError("Failed to edit post.");
      setSnackbarOpen(true);
    }
  };

  return (
    <div className="community-container flex" >
      
      <Sidebar onCategorySelect={setCategory} onCreatePost={handleCreatePost} />

      <div className="feed flex">
        {loading && (
          <div className="loading">
            <CircularProgress />
          </div>
        )}
        {error && (
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={() => setSnackbarOpen(false)}
            message={error}
          />
        )}
        <Feed 
          posts={posts} 
          onLikePost={handleLikePost}
          onDeletePost={handleDeletePost}
          onEditPost={handleEditPost}
        />
      </div>


      <StyledFab color="primary" aria-label="add" onClick={handleCreatePost}>
        <AddIcon />
      </StyledFab>


      <CreatePost open={createPostOpen} onClose={handleCloseCreatePost} onCreate={handlePostCreated} />
    </div>

  );
};

export default Community;