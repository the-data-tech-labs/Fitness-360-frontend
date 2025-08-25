import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";
import TopBar from "./components/TopBar";
import Dashboard from "./pages/Dashboard";
import Services from "./pages/Services";
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
import FitnessRecommendations from "./pages/FitnessRecommendations";
import NutritionRecommendations from "./pages/NutritionRecommendations";


const ConditionalTopBar = ({ isLoggedIn, userData, handleLogout }) => {
  const location = useLocation();
  

  const authRoutes = ['/signin', '/signup', '/auth'];
  const isAuthRoute = authRoutes.includes(location.pathname);
  
  // Don't render TopBar on auth routes
  if (isAuthRoute) {
    return null;
  }
  
  return <TopBar isLoggedIn={isLoggedIn} userData={userData} handleLogout={handleLogout} />;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = () => {
      // Check for stored user data
      const storedUserData = localStorage.getItem("userData");
      const accessToken = localStorage.getItem("access_token");
      
      console.log("Checking auth status:", { 
        hasUserData: !!storedUserData, 
        hasToken: !!accessToken 
      });

      if (storedUserData && accessToken) {
        try {
          const parsedUserData = JSON.parse(storedUserData);
          setUserData(parsedUserData);
          setIsLoggedIn(true);
          console.log("User already logged in:", parsedUserData);
        } catch (error) {
          console.error("Error parsing stored user data:", error);
          // Clear corrupted data
          localStorage.removeItem("userData");
          localStorage.removeItem("access_token");
        }
      }
      
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const handleLogin = (user) => {
    console.log("Handling login:", user);
    setIsLoggedIn(true);
    setUserData(user);
    localStorage.setItem("userData", JSON.stringify(user));
  };

  const handleLogout = () => {
    console.log("Handling logout");
    setIsLoggedIn(false);
    setUserData(null);
    localStorage.removeItem("userData");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Router basename="/">
      <DataProvider>
        <div>
          {/* Conditional TopBar - hidden on auth routes */}
          <ConditionalTopBar isLoggedIn={isLoggedIn} userData={userData} handleLogout={handleLogout} />
          
          <Routes>
            {/* Root route */}
            <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Navigate to="/signin" replace />} />
            
            {/* Auth routes */}
            <Route path="/signin" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Signin handleLogin={handleLogin} />} />
            <Route path="/signup" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Signup handleLogin={handleLogin} />} />
            <Route path="/auth" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Auth handleLogin={handleLogin} />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={isLoggedIn ? <Dashboard userData={userData} /> : <Navigate to="/signin" replace />} />
            <Route path="/services" element={isLoggedIn ? <Services isLoggedIn={isLoggedIn} userData={userData} isServicesInView={true} /> : <Navigate to="/signin" replace />} />
            <Route path="/fitness-history" element={isLoggedIn ? <FitnessRecommendations userData={userData} /> : <Navigate to="/signin" replace />} />
            <Route path="/nutrition-history" element={isLoggedIn ? <NutritionRecommendations userData={userData} /> : <Navigate to="/signin" replace />} />
            <Route path="/mindful-moments" element={isLoggedIn ? <MindfulMoments userData={userData} /> : <Navigate to="/signin" replace />} />
            <Route path="/fitness" element={isLoggedIn ? <FitnessForm isLoggedIn={isLoggedIn} userData={userData} /> : <Navigate to="/signin" replace />} />
            <Route path="/nutrition" element={isLoggedIn ? <NutritionForm isLoggedIn={isLoggedIn} userData={userData} /> : <Navigate to="/signin" replace />} />
            <Route path="/community" element={isLoggedIn ? <Community userData={userData} /> : <Navigate to="/signin" replace />} />
            <Route path="/profile" element={isLoggedIn ? <ProfileView userData={userData} /> : <Navigate to="/signin" replace />} />
            <Route path="/post/:id" element={isLoggedIn ? <PostDetail userData={userData} /> : <Navigate to="/signin" replace />} />
            <Route path="/create-post" element={isLoggedIn ? <CreatePost userData={userData} /> : <Navigate to="/signin" replace />} />

            {/* 404 Not Found Route */}
            <Route path="*" element={<h1>404 Not Found</h1>} />
          </Routes>
        </div>
      </DataProvider>
    </Router>
  );
}

export default App;
