import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
  faUser,
  faEdit,
  faSave,
  faTimes,
  faCamera,
  faArrowLeft,
  faRulerVertical,
  faWeightScale,
  faVenusMars,
  faBirthdayCake,
  faEnvelope,
  faShield,
  faCheck,
  faEye,
  faEyeSlash,
  faLock,
  faKey,
  faTrash,
  faCrown,
  faCalendarAlt,
  faDumbbell,
  faBullseye,
  faBolt
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const ProfileView = ({ userData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const backendUrl = process.env.REACT_APP_BACKEND_URL

  const [profile, setProfile] = useState({
    user: {
      id: "",
      username: "",
      email: "",
      first_name: "",
      last_name: "",
      date_joined: ""
    },
    phone: "",
    location: "",
    bio: "",
    height: "",
    weight: "",
    gender: "Male",
    age: "",
    fitness_goal: "",
    activity_level: "",
    profile_picture: null,
    profile_picture_url: null,
    full_name: "",
    bmi: null,
    profile_completed: false
  });

  // Add this to your existing state
  const [deletePasswordInput, setDeletePasswordInput] = useState("");

  // Update the delete confirmation handler
  const handleDeleteAccount = async () => {
    if (!deletePasswordInput.trim()) {
      toast.error("Please enter your password to confirm account deletion");
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.delete(
        `${backendUrl}/api/delete-account/`,
        {
          data: { password: deletePasswordInput },
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        toast.success(response.data.message || "Account deleted successfully");

        // Clear all stored data
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("userData");

        // Redirect to home or login page after a short delay
        setTimeout(() => {
          navigate("/signin");
        }, 2000);

        setShowDeleteConfirm(false);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to delete account. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };


  const [editProfile, setEditProfile] = useState({
    phone: "",
    location: "",
    bio: "",
    height: "",
    weight: "",
    gender: "Male",
    age: "",
    fitness_goal: "",
    activity_level: "",
    profile_picture: null
  });

  const [editUserData, setEditUserData] = useState({
    first_name: "",
    last_name: "",
    email: ""
  });

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirmPassword: ""
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const navigate = useNavigate();
  const  fetchProfile = useCallback (async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(`${backendUrl}/api/profile/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response)

      if (response.data.success) {
        const profileData = response.data.data;
        setProfile(profileData);

        // Set edit profile data
        setEditProfile({
          phone: profileData.phone || "",
          location: profileData.location || "",
          bio: profileData.bio || "",
          height: profileData.height || "",
          weight: profileData.weight || "",
          gender: profileData.gender || "Male",
          age: profileData.age || "",
          fitness_goal: profileData.fitness_goal || "",
          activity_level: profileData.activity_level || "",
          profile_picture: profileData.profile_picture
        });

        // Set user data for editing
        setEditUserData({
          first_name: profileData.user?.first_name || "",
          last_name: profileData.user?.last_name || "",
          email: profileData.user?.email || ""
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile data");
    }
  }, [backendUrl])
  
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  

  // Handle input changes for profile data
  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setEditProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle input changes for user data
  const handleUserInputChange = (e) => {
    const { name, value } = e.target;
    setEditUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle profile picture change
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("File size must be less than 5MB");
        return;
      }

      setProfilePicFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save profile changes
  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const formData = new FormData();

      // Append profile data
      Object.keys(editProfile).forEach(key => {
        if (editProfile[key] && key !== 'profile_picture') {
          formData.append(key, editProfile[key]);
        }
      });

      // Append user data
      Object.keys(editUserData).forEach(key => {
        if (editUserData[key]) {
          formData.append(key, editUserData[key]);
        }
      });

      // Append profile picture if changed
      if (profilePicFile) {
        formData.append("profile_picture", profilePicFile);
      }

      const response = await axios.put(
        `${backendUrl}/api/profile/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setProfile(response.data.data);
        setIsEditing(false);
        setProfilePicFile(null);
        setPreviewImage(null);
        toast.success(response.data.message || "Profile updated successfully!");
      }

    } catch (error) {
      console.error("Profile update error:", error);
      const errorMessage = error.response?.data?.message || "Failed to update profile. Please try again.";
      toast.error(errorMessage);

      // Display validation errors if any
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        Object.keys(errors).forEach(field => {
          errors[field].forEach(message => {
            toast.error(`${field}: ${message}`);
          });
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async () => {
    if (passwordData.new_password !== passwordData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    if (passwordData.new_password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.post(
        `${backendUrl}/api/change-password/`,
        {
          current_password: passwordData.current_password,
          new_password: passwordData.new_password
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setPasswordData({ current_password: "", new_password: "", confirmPassword: "" });
        setShowPasswordForm(false);
        toast.success(response.data.message || "Password changed successfully!");
      }

    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to change password. Please check your current password.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    // Reset to original values
    setEditProfile({
      phone: profile.phone || "",
      location: profile.location || "",
      bio: profile.bio || "",
      height: profile.height || "",
      weight: profile.weight || "",
      gender: profile.gender || "Male",
      age: profile.age || "",
      fitness_goal: profile.fitness_goal || "",
      activity_level: profile.activity_level || "",
      profile_picture: profile.profile_picture
    });

    setEditUserData({
      first_name: profile.user?.first_name || "",
      last_name: profile.user?.last_name || "",
      email: profile.user?.email || ""
    });

    setIsEditing(false);
    setProfilePicFile(null);
    setPreviewImage(null);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  // Helper function to format goal/activity level
  const formatChoice = (value) => {
    if (!value) return "Not specified";
    return value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-900 to-slate-900 relative overflow-hidden">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        theme="dark"
        className="z-[9999] mt-20"
      />

      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-40 w-80 h-80 bg-violet-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-ping"></div>
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-2 z-40 bg-gradient-to-r from-slate-800/90 via-violet-800/90 to-slate-800/90 backdrop-blur-md border-b border-violet-700/30 shadow-xl"
      >
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(-1)}
                className="w-12 h-12 bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 rounded-xl flex items-center justify-center transition-all duration-200 border border-violet-500/30"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </motion.button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
                  Profile Settings
                </h1>
                <p className="text-violet-300">Manage your account and preferences</p>
              </div>
            </div>

            {!isEditing && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(true)}
                className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-medium hover:from-violet-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 border border-violet-500/30"
              >
                <FontAwesomeIcon icon={faEdit} />
                <span>Edit Profile</span>
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto px-6 py-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div variants={cardVariants} className="lg:col-span-1">
            <div className="bg-gradient-to-br from-slate-800 via-violet-900 to-slate-800 rounded-3xl p-8 border border-violet-700/30 shadow-2xl">
              {/* Profile Picture Section */}
              <div className="text-center mb-8">
                <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-violet-500/30 shadow-2xl">
                    {previewImage || profile.profile_picture_url ? (
                      <img
                        src={previewImage || profile.profile_picture_url}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-violet-500 to-purple-500 flex items-center justify-center">
                        <FontAwesomeIcon icon={faUser} className="text-white text-4xl" />
                      </div>
                    )}
                  </div>

                  {isEditing && (
                    <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-violet-600 hover:bg-violet-700 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 border-2 border-slate-800 shadow-lg">
                      <FontAwesomeIcon icon={faCamera} className="text-white text-sm" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePicChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <h2 className="text-2xl font-bold text-white mt-4">
                  {profile.full_name || profile.user?.username || "User"}
                </h2>
                <p className="text-violet-300">@{profile.user?.username}</p>

                {/* Membership Badge */}
                <div className="mt-4 inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-full px-4 py-2">
                  <FontAwesomeIcon icon={faCrown} className="text-yellow-400" />
                  <span className="text-yellow-300 font-medium">Premium Member</span>
                </div>

                {/* BMI Display */}
                {profile.bmi && (
                  <div className="mt-4 bg-violet-800/30 rounded-xl p-3 border border-violet-600/30">
                    <div className="text-violet-300 text-sm">BMI</div>
                    <div className="text-white font-semibold text-lg">{profile.bmi}</div>
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-violet-800/30 rounded-xl p-4 text-center border border-violet-600/30">
                  <FontAwesomeIcon icon={faCalendarAlt} className="text-violet-400 text-xl mb-2" />
                  <div className="text-white font-semibold">Member Since</div>
                  <div className="text-violet-300 text-sm">{formatDate(profile.user?.date_joined)}</div>
                </div>
                <div className="bg-violet-800/30 rounded-xl p-4 text-center border border-violet-600/30">
                  <FontAwesomeIcon
                    icon={profile.profile_completed ? faCheck : faExclamationTriangle}
                    className={`text-xl mb-2 ${profile.profile_completed ? "text-green-400" : "text-orange-400"}`}
                  />
                  <div className="text-white font-semibold">Profile</div>
                  <div className="text-violet-300 text-sm">
                    {profile.profile_completed ? "Complete" : "Incomplete"}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Profile Information */}
          <motion.div variants={cardVariants} className="lg:col-span-2 space-y-8">
            {/* Personal Information */}
            <div className="bg-gradient-to-br from-slate-800 via-violet-900 to-slate-800 rounded-3xl p-8 border border-violet-700/30 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                  <FontAwesomeIcon icon={faUser} className="text-violet-400" />
                  <span>Personal Information</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-violet-300 mb-2">First Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="first_name"
                      value={editUserData.first_name}
                      onChange={handleUserInputChange}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-violet-600/30 rounded-xl text-white placeholder-violet-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200"
                      placeholder="Enter first name"
                    />
                  ) : (
                    <div className="w-full px-4 py-3 bg-slate-800/30 border border-violet-700/30 rounded-xl text-violet-200">
                      {profile.user?.first_name || "Not specified"}
                    </div>

                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-violet-300 mb-2">Last Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="last_name"
                      value={editUserData.last_name}
                      onChange={handleUserInputChange}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-violet-600/30 rounded-xl text-white placeholder-violet-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200"
                      placeholder="Enter last name"
                    />
                  ) : (
                    <div className="w-full px-4 py-3 bg-slate-800/30 border border-violet-700/30 rounded-xl text-violet-200">
                      {profile.user?.last_name || "Not specified"}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-violet-300 mb-2">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={editUserData.email}
                      onChange={handleUserInputChange}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-violet-600/30 rounded-xl text-white placeholder-violet-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200"
                      placeholder="Enter email"
                    />
                  ) : (
                    <div className="w-full px-4 py-3 bg-slate-800/30 border border-violet-700/30 rounded-xl text-violet-200 flex items-center space-x-2">
                      <FontAwesomeIcon icon={faEnvelope} className="text-violet-400" />
                      <span>{profile.user?.email}</span>
                    </div>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-violet-300 mb-2">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={editProfile.phone}
                      onChange={handleProfileInputChange}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-violet-600/30 rounded-xl text-white placeholder-violet-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200"
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <div className="w-full px-4 py-3 bg-slate-800/30 border border-violet-700/30 rounded-xl text-violet-200">
                      {profile.phone || "Not specified"}
                    </div>
                  )}
                </div>

                {/* Location */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-violet-300 mb-2">Location</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="location"
                      value={editProfile.location}
                      onChange={handleProfileInputChange}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-violet-600/30 rounded-xl text-white placeholder-violet-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200"
                      placeholder="Enter your location"
                    />
                  ) : (
                    <div className="w-full px-4 py-3 bg-slate-800/30 border border-violet-700/30 rounded-xl text-violet-200">
                      {profile.location || "Not specified"}
                    </div>
                  )}
                </div>

                {/* Bio */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-violet-300 mb-2">Bio</label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={editProfile.bio}
                      onChange={handleProfileInputChange}
                      rows={3}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-violet-600/30 rounded-xl text-white placeholder-violet-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200 resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <div className="w-full px-4 py-3 bg-slate-800/30 border border-violet-700/30 rounded-xl text-violet-200 min-h-[80px]">
                      {profile.bio || "No bio available"}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Fitness Information */}
            <div className="bg-gradient-to-br from-slate-800 via-violet-900 to-slate-800 rounded-3xl p-8 border border-violet-700/30 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                  <FontAwesomeIcon icon={faDumbbell} className="text-violet-400" />
                  <span>Fitness Profile</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Age */}
                <div>
                  <label className="block text-sm font-medium text-violet-300 mb-2">Age</label>
                  {isEditing ? (
                    <div className="relative">
                      <FontAwesomeIcon icon={faBirthdayCake} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-violet-400" />
                      <input
                        type="number"
                        name="age"
                        value={editProfile.age}
                        onChange={handleProfileInputChange}
                        className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-violet-600/30 rounded-xl text-white placeholder-violet-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200"
                        placeholder="Enter age"
                        min="13"
                        max="120"
                      />
                    </div>
                  ) : (
                    <div className="w-full px-4 py-3 bg-slate-800/30 border border-violet-700/30 rounded-xl text-violet-200">
                      {profile.age ? `${profile.age} years` : "Not specified"}
                    </div>
                  )}
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-violet-300 mb-2">Gender</label>
                  {isEditing ? (
                    <div className="relative">
                      <FontAwesomeIcon icon={faVenusMars} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-violet-400" />
                      <select
                        name="gender"
                        value={editProfile.gender}
                        onChange={handleProfileInputChange}
                        className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-violet-600/30 rounded-xl text-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200 appearance-none"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  ) : (
                    <div className="w-full px-4 py-3 bg-slate-800/30 border border-violet-700/30 rounded-xl text-violet-200">
                      {profile.gender}
                    </div>
                  )}
                </div>

                {/* Height */}
                <div>
                  <label className="block text-sm font-medium text-violet-300 mb-2">Height (cm)</label>
                  {isEditing ? (
                    <div className="relative">
                      <FontAwesomeIcon icon={faRulerVertical} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-violet-400" />
                      <input
                        type="number"
                        name="height"
                        value={editProfile.height}
                        onChange={handleProfileInputChange}
                        className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-violet-600/30 rounded-xl text-white placeholder-violet-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200"
                        placeholder="Enter height"
                        min="50"
                        max="300"
                      />
                    </div>
                  ) : (
                    <div className="w-full px-4 py-3 bg-slate-800/30 border border-violet-700/30 rounded-xl text-violet-200">
                      {profile.height ? `${profile.height} cm` : "Not specified"}
                    </div>
                  )}
                </div>

                {/* Weight */}
                <div>
                  <label className="block text-sm font-medium text-violet-300 mb-2">Weight (kg)</label>
                  {isEditing ? (
                    <div className="relative">
                      <FontAwesomeIcon icon={faWeightScale} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-violet-400" />
                      <input
                        type="number"
                        name="weight"
                        value={editProfile.weight}
                        onChange={handleProfileInputChange}
                        className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-violet-600/30 rounded-xl text-white placeholder-violet-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200"
                        placeholder="Enter weight"
                        min="20"
                        max="500"
                      />
                    </div>
                  ) : (
                    <div className="w-full px-4 py-3 bg-slate-800/30 border border-violet-700/30 rounded-xl text-violet-200">
                      {profile.weight ? `${profile.weight} kg` : "Not specified"}
                    </div>
                  )}
                </div>

                {/* Fitness Goal */}
                <div>
                  <label className="block text-sm font-medium text-violet-300 mb-2">Fitness Goal</label>
                  {isEditing ? (
                    <div className="relative">
                      <FontAwesomeIcon icon={faBullseye} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-violet-400" />
                      <select
                        name="fitness_goal"
                        value={editProfile.fitness_goal}
                        onChange={handleProfileInputChange}
                        className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-violet-600/30 rounded-xl text-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200 appearance-none"
                      >
                        <option value="">Select goal</option>
                        <option value="weight_loss">Weight Loss</option>
                        <option value="muscle_gain">Muscle Gain</option>
                        <option value="endurance">Endurance</option>
                        <option value="strength">Strength</option>
                        <option value="general_fitness">General Fitness</option>
                      </select>
                    </div>
                  ) : (
                    <div className="w-full px-4 py-3 bg-slate-800/30 border border-violet-700/30 rounded-xl text-violet-200">
                      {formatChoice(profile.fitness_goal)}
                    </div>
                  )}
                </div>

                {/* Activity Level */}
                <div>
                  <label className="block text-sm font-medium text-violet-300 mb-2">Activity Level</label>
                  {isEditing ? (
                    <div className="relative">
                      <FontAwesomeIcon icon={faBolt} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-violet-400" />
                      <select
                        name="activity_level"
                        value={editProfile.activity_level}
                        onChange={handleProfileInputChange}
                        className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-violet-600/30 rounded-xl text-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200 appearance-none"
                      >
                        <option value="">Select level</option>
                        <option value="sedentary">Sedentary</option>
                        <option value="lightly_active">Lightly Active</option>
                        <option value="moderately_active">Moderately Active</option>
                        <option value="very_active">Very Active</option>
                        <option value="extremely_active">Extremely Active</option>
                      </select>
                    </div>
                  ) : (
                    <div className="w-full px-4 py-3 bg-slate-800/30 border border-violet-700/30 rounded-xl text-violet-200">
                      {formatChoice(profile.activity_level)}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-medium hover:from-violet-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faSave} />
                      <span>Save Changes</span>
                    </>
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCancel}
                  className="flex-1 px-6 py-4 bg-slate-700 text-violet-300 rounded-xl font-medium hover:bg-slate-600 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <FontAwesomeIcon icon={faTimes} />
                  <span>Cancel</span>
                </motion.button>
              </motion.div>
            )}

            {/* Security Section */}
            {!isEditing && (
              <div className="bg-gradient-to-br from-slate-800 via-violet-900 to-slate-800 rounded-3xl p-8 border border-violet-700/30 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                    <FontAwesomeIcon icon={faShield} className="text-violet-400" />
                    <span>Security Settings</span>
                  </h3>
                </div>

                <div className="space-y-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowPasswordForm(true)}
                    className="w-full flex items-center justify-between p-4 bg-slate-800/30 hover:bg-slate-800/50 border border-violet-700/30 rounded-xl transition-all duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <FontAwesomeIcon icon={faLock} className="text-violet-400" />
                      <span className="text-white font-medium">Change Password</span>
                    </div>
                    <FontAwesomeIcon icon={faKey} className="text-violet-400" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full flex items-center justify-between p-4 bg-red-900/20 hover:bg-red-900/30 border border-red-600/30 rounded-xl transition-all duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <FontAwesomeIcon icon={faTrash} className="text-red-400" />
                      <span className="text-red-400 font-medium">Delete Account</span>
                    </div>
                    <FontAwesomeIcon icon={faTrash} className="text-red-400" />
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Password Change Modal */}
      <AnimatePresence>
        {showPasswordForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="bg-gradient-to-br from-slate-800 to-violet-900 rounded-2xl p-6 w-full max-w-md border border-violet-700/30 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                  <FontAwesomeIcon icon={faLock} className="text-violet-400" />
                  <span>Change Password</span>
                </h3>
                <button
                  onClick={() => setShowPasswordForm(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-200"
                >
                  <FontAwesomeIcon icon={faTimes} className="text-violet-300" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-violet-300 mb-2">Current Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      value={passwordData.current_password}
                      onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                      className="w-full px-4 py-3 pr-12 bg-slate-800/50 border border-violet-600/30 rounded-xl text-white placeholder-violet-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-violet-400 hover:text-violet-300"
                    >
                      <FontAwesomeIcon icon={showPasswords.current ? faEyeSlash : faEye} />
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-violet-300 mb-2">New Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      value={passwordData.new_password}
                      onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                      className="w-full px-4 py-3 pr-12 bg-slate-800/50 border border-violet-600/30 rounded-xl text-white placeholder-violet-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-violet-400 hover:text-violet-300"
                    >
                      <FontAwesomeIcon icon={showPasswords.new ? faEyeSlash : faEye} />
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-violet-300 mb-2">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full px-4 py-3 pr-12 bg-slate-800/50 border border-violet-600/30 rounded-xl text-white placeholder-violet-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-violet-400 hover:text-violet-300"
                    >
                      <FontAwesomeIcon icon={showPasswords.confirm ? faEyeSlash : faEye} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowPasswordForm(false)}
                  className="flex-1 px-4 py-3 bg-slate-700 text-violet-300 rounded-xl font-medium hover:bg-slate-600 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordChange}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-medium hover:from-violet-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faCheck} />
                      <span>Update Password</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      {/* Enhanced Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="bg-gradient-to-br from-slate-800 to-red-900 rounded-2xl p-6 w-full max-w-md border border-red-700/30 shadow-2xl"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FontAwesomeIcon icon={faTrash} className="text-red-400 text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Delete Account</h3>
                <p className="text-red-300 mb-4">
                  This action cannot be undone. All your data will be permanently deleted.
                </p>
              </div>

              {/* Warning List */}
              <div className="bg-red-900/20 border border-red-600/30 rounded-xl p-4 mb-6">
                <h4 className="text-red-300 font-semibold mb-3 flex items-center">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
                  What will be deleted:
                </h4>
                <ul className="text-red-200 text-sm space-y-1">
                  <li>• Your profile and personal information</li>
                  <li>• All your posts and comments</li>
                  <li>• Your fitness and nutrition data</li>
                  <li>• Your account settings and preferences</li>
                  <li>• Your workout and meal plans</li>
                </ul>
              </div>

              {/* Password Confirmation */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-red-300 mb-2">
                  Enter your password to confirm:
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={deletePasswordInput}
                    onChange={(e) => setDeletePasswordInput(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-red-600/30 rounded-xl text-white placeholder-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200"
                    placeholder="Enter your password"
                    disabled={isLoading}
                  />
                  <FontAwesomeIcon
                    icon={faLock}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-400"
                  />
                </div>
              </div>

              {/* Type DELETE Confirmation */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-red-300 mb-2">
                  Type <span className="font-bold text-red-400">DELETE</span> to confirm:
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-red-600/30 rounded-xl text-white placeholder-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200"
                  placeholder="Type DELETE"
                  disabled={isLoading}
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeletePasswordInput("");
                    setDeleteConfirmText("");
                  }}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-slate-700 text-violet-300 rounded-xl font-medium hover:bg-slate-600 transition-all duration-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={isLoading || !deletePasswordInput.trim() || deleteConfirmText !== "DELETE"}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-medium hover:from-red-700 hover:to-red-800 transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faTrash} />
                      <span>Delete Account</span>
                    </>
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

export default ProfileView;
