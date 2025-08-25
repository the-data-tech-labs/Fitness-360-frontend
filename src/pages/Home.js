import React, { useState, useEffect } from "react";
import axios from "axios";
import Post from "../components/Post";
import Sidebar from "../components/Sidebar";

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const backendUrl = process.env.REACT_APP_BACKEND_URL
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const url = selectedCategory === "all" 
                    ? `${backendUrl}/api/community/posts/` 
                    : `${backendUrl}/api/community/posts/?category=${selectedCategory}`;

                const response = await axios.get(url);
                setPosts(response.data);
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };

        fetchPosts();
    }, [selectedCategory, backendUrl]); 
    
    return (
        <div style={{ display: "flex" }}>
            <Sidebar onCategorySelect={setSelectedCategory} />
            <div style={{ flex: 1, padding: "20px" }}>
                {posts.length > 0 ? (
                    posts.map((post) => <Post key={post.id} post={post} />)
                ) : (
                    <p>No posts available in this category.</p>
                )}
            </div>
        </div>
    );
};

export default Home;