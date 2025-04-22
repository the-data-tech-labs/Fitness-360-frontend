import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import TopBar from "./components/TopBar";
import Dashboard from "./pages/Dashboard";
import Services from "./pages/Services";
import MyGoals from "./pages/MyGoals";
import Schedule from "./pages/Schedule";
import Achievements from "./pages/Achievements";
import Statistics from "./pages/Statistics";
import FitnessForm from "./pages/FitnessForm";
import NutritionForm from "./pages/NutritionForm";
import Community from "./pages/Community";
import PostDetail from "./pages/PostDetail";
import CreatePost from "./components/CreatePost";
import ProfileView from "./pages/ProfileView";
import MindfulMoments from "./pages/MindfulMoments";
import { DataProvider } from "./context/DataContext";
import Auth from "./pages/Auth";
import LoadingSpinner from "./components/LoadingSpinner";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
// Import the new password-related components
import ForgotPassword from "./pages/forgot-password";
import ResetPassword from "./pages/reset-password";
import ChangePassword from "./pages/change-password";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
      setIsLoggedIn(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (user) => {
    setIsLoggedIn(true);
    setUserData(user);
    localStorage.setItem("userData", JSON.stringify(user));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);
    localStorage.removeItem("userData");
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <DataProvider>
        <div>
          <TopBar isLoggedIn={isLoggedIn} userData={userData} handleLogout={handleLogout} />
          <Routes>
            <Route path="/" element={<Navigate to="/signin" />} />
            <Route path="/auth" element={<Auth handleLogin={handleLogin} />} />
            
            {/* Authentication Routes */}
            <Route path="/signin" element={<Signin handleLogin={handleLogin} />} />
            <Route path="/signup" element={<Signup handleLogin={handleLogin} />} />
            
            {/* Password Reset Routes */}
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:uidb64/:token" element={<ResetPassword />} />
            <Route 
              path="/change-password" 
              element={
                isLoggedIn ? 
                  <ChangePassword userData={userData} /> : 
                  <Navigate to="/signin" />
              } 
            />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={isLoggedIn ? <Dashboard userData={userData} /> : <Navigate to="/signin" />}
            />
            <Route
              path="/services"
              element={
                isLoggedIn ? (
                  <Services
                    isLoggedIn={isLoggedIn}
                    userData={userData}
                    isServicesInView={true}
                  />
                ) : (
                  <Navigate to="/signin" />
                )
              }
            />
            <Route
              path="/mindful-moments"
              element={isLoggedIn ? <MindfulMoments userData={userData} /> : <Navigate to="/signin" />}
            />
            <Route
              path="/goals"
              element={isLoggedIn ? <MyGoals userData={userData} /> : <Navigate to="/signin" />}
            />
            <Route
              path="/schedule"
              element={isLoggedIn ? <Schedule userData={userData} /> : <Navigate to="/signin" />}
            />
            <Route
              path="/achievements"
              element={isLoggedIn ? <Achievements userData={userData} /> : <Navigate to="/signin" />}
            />
            <Route
              path="/statistics"
              element={isLoggedIn ? <Statistics userData={userData} /> : <Navigate to="/signin" />}
            />
            <Route
              path="/fitness"
              element={isLoggedIn ? <FitnessForm userData={userData} /> : <Navigate to="/signin" />}
            />
            <Route
              path="/nutrition"
              element={isLoggedIn ? <NutritionForm userData={userData} /> : <Navigate to="/signin" />}
            />
            <Route
              path="/community"
              element={isLoggedIn ? <Community userData={userData} /> : <Navigate to="/signin" />}
            />
            <Route
              path="/profile"
              element={isLoggedIn ? <ProfileView userData={userData} /> : <Navigate to="/signin" />}
            />
            <Route
              path="/post/:id"
              element={isLoggedIn ? <PostDetail userData={userData} /> : <Navigate to="/signin" />}
            />
            <Route
              path="/create-post"
              element={isLoggedIn ? <CreatePost userData={userData} /> : <Navigate to="/signin" />}
            />

            {/* 404 Not Found Route */}
            <Route path="*" element={<h1>404 Not Found</h1>} />
          </Routes>
        </div>
      </DataProvider>
    </Router>
  );
}

export default App;