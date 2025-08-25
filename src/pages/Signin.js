import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLock,
  faRulerVertical,
  faWeightScale,
  faVenusMars,
  faBirthdayCake,
  faEye,
  faEyeSlash,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signin = ({ handleLogin }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });
  const [error, setError] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACKEND_URL

  // State for additional info and pop-up
  const [additionalData, setAdditionalData] = useState({
    height: "",
    weight: "",
    gender: "",
    age: "",
  });
  const [additionalErrors, setAdditionalErrors] = useState({
    height: "",
    weight: "",
    gender: "",
    age: "",
  });
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);

  useEffect(() => {
    const rememberMe = localStorage.getItem("rememberMe");
    const username = localStorage.getItem("username");
    if (rememberMe === "true" && username) {
      setFormData((prevData) => ({
        ...prevData,
        username: username,
        rememberMe: true,
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    
    // Clear specific field error on change
    if (error[name]) {
      setError({ ...error, [name]: "" });
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError({ username: "", password: "" });

    // Basic validation
    if (!formData.username.trim()) {
      setError({ username: "Username is required", password: "" });
      setIsLoading(false);
      return;
    }

    if (!formData.password) {
      setError({ username: "", password: "Password is required" });
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${backendUrl}/api/users/login/`, {
        username: formData.username,
        password: formData.password,
      });

      // Handle successful login
      if (response.data.success) {
        const userData = response.data.user;
        
        // Save tokens to localStorage
        localStorage.setItem("access_token", userData.token);
        localStorage.setItem("refresh_token", userData.refresh);

        // Handle "Remember Me" functionality
        if (formData.rememberMe) {
          localStorage.setItem("rememberMe", "true");
          localStorage.setItem("username", formData.username);
        } else {
          localStorage.removeItem("rememberMe");
          localStorage.removeItem("username");
        }

        toast.success(response.data.message || "Login successful!");

        
        try {
          const profileResponse = await axios.get(`${backendUrl}/api/profile/`, {
            headers: { Authorization: `Bearer ${userData.token}` },
          });

          const profile = profileResponse.data.profile;
          
          
          if (!profile.height || !profile.weight || !profile.gender || !profile.age) {
            setIsPopupOpen(true);
            setAdditionalData({
              height: profile.height || "",
              weight: profile.weight || "",
              gender: profile.gender || "",
              age: profile.age || "",
            });
            setIsLoading(false);
            return;
          }

          // Call handleLogin to update isLoggedIn state in App.js
          handleLogin({
            username: formData.username,
            accessToken: userData.token,
            refreshToken: userData.refresh,
            profile: profile,
          });

          navigate("/dashboard");
        } catch (profileErr) {
          console.error("Profile fetch error:", profileErr);
          
          handleLogin({
            username: formData.username,
            accessToken: userData.token,
            refreshToken: userData.refresh,
          });
          navigate("/dashboard");
        }
      } else {
        toast.error(response.data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login Error:", err.response?.data);
      
      if (err.response?.data) {
        const backendData = err.response.data;
        
        // Handle backend message
        if (backendData.message) {
          toast.error(backendData.message);
        }
        
        // Handle field-specific errors
        const fieldErrors = { username: "", password: "" };
        
        if (backendData.details) {
          const errorMessage = backendData.details;
          
          if (errorMessage.toLowerCase().includes("username")) {
            fieldErrors.username = errorMessage;
          } else if (errorMessage.toLowerCase().includes("password")) {
            fieldErrors.password = errorMessage;
          } else {
            toast.error(errorMessage);
          }
        }
        
        setError(fieldErrors);
      } else {
        toast.error("Network error. Please check your connection and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };



  const handleAdditionalChange = (e) => {
    const { name, value } = e.target;
    setAdditionalData({ ...additionalData, [name]: value });
    
    // Clear specific field error on change
    if (additionalErrors[name]) {
      setAdditionalErrors({ ...additionalErrors, [name]: "" });
    }
  };

  const handleAdditionalSubmit = async () => {
    const accessToken = localStorage.getItem("access_token");

    // Validate inputs
    const heightError = validateHeight(additionalData.height);
    const weightError = validateWeight(additionalData.weight);
    const ageError = validateAge(additionalData.age);
    const genderError = !additionalData.gender ? "Please select a gender." : "";

    const newErrors = {
      height: heightError,
      weight: weightError,
      age: ageError,
      gender: genderError,
    };

    setAdditionalErrors(newErrors);

    if (heightError || weightError || ageError || genderError) {
      toast.error("Please fix the validation errors before submitting.");
      return;
    }

    setIsSubmittingProfile(true);

    try {
      const response = await axios.put(
        `${backendUrl}/api/profile/`,
        {
          height: parseFloat(additionalData.height),
          weight: parseFloat(additionalData.weight),
          gender: additionalData.gender,
          age: parseInt(additionalData.age),
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message || "Profile updated successfully!");

        // Fetch updated profile data
        const profileResponse = await axios.get(`${backendUrl}/api/profile/`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        // Update user data and close popup
        handleLogin({
          username: formData.username,
          accessToken: accessToken,
          refreshToken: localStorage.getItem("refresh_token"),
          profile: profileResponse.data.profile,
        });

        setIsPopupOpen(false);
        navigate("/dashboard");
      } else {
        toast.error(response.data.message || "Failed to update profile.");
      }
    } catch (err) {
      console.error("Additional Info Error:", err.response?.data);
      
      if (err.response?.data) {
        const backendData = err.response.data;
        
        if (backendData.message) {
          toast.error(backendData.message);
        }
        
        if (backendData.errors) {
          setAdditionalErrors(backendData.errors);
        }
      } else {
        toast.error("Network error. Please try again.");
      }
    } finally {
      setIsSubmittingProfile(false);
    }
  };

  // Validation functions
  const validateHeight = (height) => {
    const numHeight = parseFloat(height);
    if (isNaN(numHeight) || numHeight <= 0 || numHeight > 300) {
      return "Please enter a valid height between 1-300 cm.";
    }
    return "";
  };

  const validateWeight = (weight) => {
    const numWeight = parseFloat(weight);
    if (isNaN(numWeight) || numWeight <= 0 || numWeight > 500) {
      return "Please enter a valid weight between 1-500 kg.";
    }
    return "";
  };

  const validateAge = (age) => {
    const numAge = parseInt(age);
    if (isNaN(numAge) || numAge <= 0 || numAge > 120) {
      return "Please enter a valid age between 1-120 years.";
    }
    return "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4 py-8 w-full">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="mt-16"
      />

      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <FontAwesomeIcon icon={faUser} className="text-white text-2xl" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignIn} className="space-y-6">
            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faUser} className="text-purple-500" />
                </div>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-all duration-200 ${
                    error.username
                      ? "border-red-300 focus:border-red-500 bg-red-50"
                      : "border-gray-200 focus:border-purple-500 bg-gray-50 focus:bg-white"
                  }`}
                  placeholder="Enter your username"
                  required
                />
              </div>
              {error.username && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-1 flex items-center"
                >
                  <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                  {error.username}
                </motion.p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faLock} className="text-purple-500" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-12 py-3 border-2 rounded-lg focus:outline-none transition-all duration-200 ${
                    error.password
                      ? "border-red-300 focus:border-red-500 bg-red-50"
                      : "border-gray-200 focus:border-purple-500 bg-gray-50 focus:bg-white"
                  }`}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-purple-500 hover:text-purple-700"
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
              {error.password && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-1 flex items-center"
                >
                  <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                  {error.password}
                </motion.p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-purple-300"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing In...
                </div>
              ) : (
                "Sign In"
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/signup")}
                className="text-purple-600 hover:text-purple-800 font-semibold transition-colors duration-200"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Profile Completion Modal */}
      <AnimatePresence>
        {isPopupOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Complete Your Profile</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Please provide some additional information to personalize your experience.
                  </p>
                </div>
                <button
                  onClick={() => setIsPopupOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <FontAwesomeIcon icon={faTimes} size="lg" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Height Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Height (cm)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FontAwesomeIcon icon={faRulerVertical} className="text-purple-500" />
                    </div>
                    <input
                      type="number"
                      name="height"
                      value={additionalData.height}
                      onChange={handleAdditionalChange}
                      className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-all duration-200 ${
                        additionalErrors.height
                          ? "border-red-300 focus:border-red-500 bg-red-50"
                          : "border-gray-200 focus:border-purple-500 bg-gray-50 focus:bg-white"
                      }`}
                      placeholder="Enter your height"
                      min="1"
                      max="300"
                      required
                    />
                  </div>
                  {additionalErrors.height && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-1 flex items-center"
                    >
                      <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                      {additionalErrors.height}
                    </motion.p>
                  )}
                </div>

                {/* Weight Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight (kg)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FontAwesomeIcon icon={faWeightScale} className="text-purple-500" />
                    </div>
                    <input
                      type="number"
                      name="weight"
                      value={additionalData.weight}
                      onChange={handleAdditionalChange}
                      className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-all duration-200 ${
                        additionalErrors.weight
                          ? "border-red-300 focus:border-red-500 bg-red-50"
                          : "border-gray-200 focus:border-purple-500 bg-gray-50 focus:bg-white"
                      }`}
                      placeholder="Enter your weight"
                      min="1"
                      max="500"
                      step="0.1"
                      required
                    />
                  </div>
                  {additionalErrors.weight && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-1 flex items-center"
                    >
                      <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                      {additionalErrors.weight}
                    </motion.p>
                  )}
                </div>

                {/* Gender Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FontAwesomeIcon icon={faVenusMars} className="text-purple-500" />
                    </div>
                    <select
                      name="gender"
                      value={additionalData.gender}
                      onChange={handleAdditionalChange}
                      className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-all duration-200 appearance-none ${
                        additionalErrors.gender
                          ? "border-red-300 focus:border-red-500 bg-red-50"
                          : "border-gray-200 focus:border-purple-500 bg-gray-50 focus:bg-white"
                      }`}
                      required
                    >
                      <option value="">Select your gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                  {additionalErrors.gender && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-1 flex items-center"
                    >
                      <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                      {additionalErrors.gender}
                    </motion.p>
                  )}
                </div>

                {/* Age Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FontAwesomeIcon icon={faBirthdayCake} className="text-purple-500" />
                    </div>
                    <input
                      type="number"
                      name="age"
                      value={additionalData.age}
                      onChange={handleAdditionalChange}
                      className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-all duration-200 ${
                        additionalErrors.age
                          ? "border-red-300 focus:border-red-500 bg-red-50"
                          : "border-gray-200 focus:border-purple-500 bg-gray-50 focus:bg-white"
                      }`}
                      placeholder="Enter your age"
                      min="1"
                      max="120"
                      required
                    />
                  </div>
                  {additionalErrors.age && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-1 flex items-center"
                    >
                      <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                      {additionalErrors.age}
                    </motion.p>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 p-6 border-t border-gray-200">
                <button
                  onClick={() => setIsPopupOpen(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Skip for Now
                </button>
                <button
                  onClick={handleAdditionalSubmit}
                  disabled={isSubmittingProfile}
                  className={`flex-1 py-2 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
                    isSubmittingProfile
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  }`}
                >
                  {isSubmittingProfile ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Saving...
                    </div>
                  ) : (
                    "Save & Continue"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Signin;
