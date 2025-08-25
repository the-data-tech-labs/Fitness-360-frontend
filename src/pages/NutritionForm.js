import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAppleAlt,
  faUser,
  faWeight,
  faRulerVertical,
  faVenusMars,
  faBirthdayCake,
  faBullseye,
  faMapMarkerAlt,
  faHeart,
  faMedkit,
  faExclamationTriangle,
  faSpinner,
  faChartBar,
  faPrint,
  faTimes,
  faCheck,
  faTrophy,
  faCalendarAlt,
  faInfoCircle,
  faArrowRight,
  faPlay,
  faStar,
  faShieldAlt,
  faChevronDown,
  faChevronUp,
  faUtensils,
  faLeaf,
  faTable
} from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NutritionForm = ({ isLoggedIn, userData }) => {
  const [formData, setFormData] = useState({
    age: "",
    gender: "Male",
    weight: "",
    height: "",
    veg_or_nonveg: "Veg",
    goal: "Gain muscles",
    disease: "",
    country: "India",
    state: "Maharashtra",
    allergics: "",
    food_type: "Veg",
    Target_timeline: "3 months",
  });

  const [loading, setLoading] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(true);
  const [recommendation, setRecommendation] = useState(null);
  const [parsedRecommendation, setParsedRecommendation] = useState(null);
  const [openNutritionDialog, setOpenNutritionDialog] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  const backendUrl = process.env.REACT_APP_BACKEND_URL
  // Helper functions to map profile data to form values
  const mapGenderToForm = (gender) => {
    const mapping = {
      'male': 'Male',
      'female': 'Female',
      'other': 'Other'
    };
    return mapping[gender?.toLowerCase()] || gender || 'Male';
  };

  const mapGoalFromProfile = (profileGoal) => {
    const mapping = {
      'weight_loss': 'Lose weight',
      'muscle_gain': 'Gain muscles',
      'maintenance': 'Maintain physique',
      'general_fitness': 'Maintain physique'
    };
    return mapping[profileGoal] || profileGoal || 'Gain muscles';
  };

  const calculateProfileCompletion = (profile) => {
    if (!profile) return 0;
    
    const fields = [
      'age', 'gender', 'weight', 'height', 'activity_level', 
      'fitness_goal', 'medical_conditions', 'allergies'
    ];
    
    const completedFields = fields.filter(field => profile[field] && profile[field] !== '');
    return Math.round((completedFields.length / fields.length) * 100);
  };

  // Parse the JSON recommendation
  const parseRecommendation = (recommendationData) => {
    try {
      if (typeof recommendationData === 'string') {
        const parsed = JSON.parse(recommendationData);
        setParsedRecommendation(parsed);
        return parsed;
      } else {
        setParsedRecommendation(recommendationData);
        return recommendationData;
      }
    } catch (error) {
      console.error("Failed to parse recommendation:", error);
      setParsedRecommendation(null);
      return null;
    }
  };

  useEffect(() => {
    
    const fetchProfileData = async () => {
      console.log("Starting fetchProfileData function");
      
      try {
        const accessToken = localStorage.getItem("access_token");
        console.log("Access token:", accessToken ? "Found" : "Not found");
        
        if (!accessToken) {
          console.log("No access token found, skipping profile fetch");
          toast.error("No authentication token found. Please log in.");
          setFetchingProfile(false);
          return;
        }

        console.log("Making API call to profile endpoint");
        
        const response = await axios.get(`${backendUrl}/api/profile/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        

        if (response.data && response.data.success) {
          const profile = response.data.data;
          console.log("Profile data received:", profile);
          setProfileData(profile);

          // Enhanced auto-fill with all available profile fields
          setFormData((prevData) => ({
            ...prevData,
            // Basic Information
            age: profile.age?.toString() || "",
            gender: mapGenderToForm(profile.gender) || "Male",
            weight: profile.weight?.toString() || "",
            height: profile.height?.toString() || "",

            // Health and preferences from profile
            disease: profile.medical_conditions || profile.health_conditions || "",
            allergics: profile.allergies || profile.allergics || "",
            
            // Goal mapping
            goal: mapGoalFromProfile(profile.fitness_goal) || mapGoalFromProfile(profile.goal) || "Gain muscles",
            
            // Location data
            country: profile.country || "India",
            state: profile.state || "Maharashtra",
          }));

          // Show success message with details of what was loaded
          const loadedFields = [];
          if (profile.age) loadedFields.push("age");
          if (profile.weight) loadedFields.push("weight");
          if (profile.height) loadedFields.push("height");
          if (profile.fitness_goal || profile.goal) loadedFields.push("fitness goal");
          if (profile.medical_conditions) loadedFields.push("medical conditions");
          if (profile.allergies) loadedFields.push("allergies");

          if (loadedFields.length > 0) {
            toast.success(`Profile data loaded`);
          } else {
            toast.info("Profile found but no nutrition data available. Please fill the form manually.");
          }

        } else {
          console.log("Profile API returned unsuccessful response:", response.data);
          toast.info("Profile not found. Please fill the form manually.");
        }
      } catch (err) {
        console.error("Error fetching profile data:", err);
        
        if (err.response?.status === 404) {
          toast.info("Profile not found. Please fill the form to create your nutrition profile.");
        } else if (err.response?.status === 401) {
          toast.error("Authentication failed. Please log in again.");
        } else {
          toast.error("Failed to fetch profile data. Please fill the form manually.");
        }
      } finally {
        console.log("Setting fetchingProfile to false");
        setFetchingProfile(false);
      }
    };


    
    if (isLoggedIn) {
      console.log("User is logged in, fetching profile data");
      fetchProfileData();
    } else {
      console.log("User not logged in, skipping profile fetch");
      setFetchingProfile(false);
    }
    
  }, [isLoggedIn, backendUrl]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Enhanced form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = ['age', 'gender', 'weight', 'height', 'allergics', 'disease' ];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      toast.error(`Please fill all the fields : ${missingFields}`);
      
      // Auto-focus first missing field
      const firstMissingField = document.querySelector(`[name="${missingFields[0]}"]`);
      if (firstMissingField) {
        firstMissingField.focus();
      }
      
      return;
    }

    setLoading(true);
    setRecommendation(null);
    setParsedRecommendation(null);

    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        throw new Error("No authentication token found. Please log in.");
      }

      const backendFormData = {
        ...formData,
        // Convert string numbers to actual numbers
        age: parseInt(formData.age),
        weight: parseFloat(formData.weight), 
        height: parseFloat(formData.height),
      };

      console.log("Sending nutrition data:", backendFormData);

      const response = await axios.post(
        `${backendUrl}/nutrition/`,
        backendFormData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.data) {
        toast.error("No data received from the API.");
        return;
      }

      setRecommendation(response.data);
      if (response.data.data && response.data.data.recommendation) {
        parseRecommendation(response.data.data.recommendation);
      }
      toast.success(`Your personalized nutrition plan is ready! Scroll down to see`);
      
    } catch (err) {
      console.error("Error fetching recommendation:", err);
      toast.error(err.response?.data?.detail || "Failed to get recommendations. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (sectionIndex) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionIndex]: !prev[sectionIndex]
    }));
  };

  const formSteps = [
    {
      title: "Basic Information",
      icon: faUser,
      fields: ["age", "gender", "weight", "height"]
    },
    {
      title: "Dietary Preferences",
      icon: faAppleAlt,
      fields: ["veg_or_nonveg", "food_type", "goal"]
    },
    {
      title: "Health & Location",
      icon: faHeart,
      fields: ["disease", "allergics", "country", "state", "Target_timeline"]
    }
  ];

  const choices = {
    gender: [
      { value: "Male", label: "Male", icon: "♂️" },
      { value: "Female", label: "Female", icon: "♀️" },
      { value: "Other", label: "Other", icon: "⚧️" },
    ],
    veg_or_nonveg: [
      { value: "Veg", label: "Vegetarian", desc: "Plant-based diet only", icon: "🌱" },
      { value: "Non-Veg", label: "Non-Vegetarian", desc: "Includes meat and fish", icon: "🍖" },
      { value: "Veg & Non-Veg", label: "Mixed Diet", desc: "Both vegetarian and non-vegetarian", icon: "🥗" },
    ],
    food_type: [
      { value: "Veg", label: "Vegetarian", icon: "🌱" },
      { value: "Non-Veg", label: "Non-Vegetarian", icon: "🍖" },
    ],
    goal: [
      { value: "Gain muscles", label: "Gain Muscle", desc: "Build lean muscle mass", icon: "💪" },
      { value: "Lose weight", label: "Weight Loss", desc: "Reduce body fat", icon: "⚖️" },
      { value: "Maintain physique", label: "Maintenance", desc: "Maintain current weight", icon: "🎯" },
    ],
    Target_timeline: [
      { value: "1 month", label: "1 Month", icon: "⚡" },
      { value: "3 months", label: "3 Months", icon: "📅" },
      { value: "6 months", label: "6 Months", icon: "⏰" },
      { value: "1 year", label: "1 Year", icon: "🗓️" },
    ],
  };

  // Enhanced NutritionPlan component with table format
  const NutritionPlan = ({ data }) => {
    if (!data) {
      return (
        <div className="text-center py-12">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-4xl text-emerald-400 mb-4" />
          <p className="text-emerald-300">No nutrition plan available.</p>
        </div>
      );
    }

    const renderTable = (tableData, title = "", level = 0) => {
      const bgColor = level === 0 ? 'bg-emerald-800/50' : level === 1 ? 'bg-emerald-700/30' : 'bg-emerald-600/20';
      const textColor = level === 0 ? 'text-emerald-100' : level === 1 ? 'text-emerald-200' : 'text-emerald-300';
      
      return (
        <div className="mb-6">
          {title && (
            <h4 className="text-lg font-bold text-emerald-300 mb-3 capitalize flex items-center">
              <FontAwesomeIcon icon={faTable} className="mr-2" />
              {title.replace(/_/g, ' ')}
            </h4>
          )}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse rounded-lg overflow-hidden shadow-lg">
              <tbody>
                {typeof tableData === 'object' && tableData !== null ? (
                  Object.entries(tableData).map(([key, value], index) => (
                    <tr key={index} className={`${bgColor} border-b border-emerald-600/20 hover:bg-emerald-700/40 transition-colors`}>
                      <td className="px-4 py-3 font-semibold text-emerald-200 border-r border-emerald-600/20 w-1/3">
                        {key.replace(/_/g, ' ').charAt(0).toUpperCase() + key.replace(/_/g, ' ').slice(1)}
                      </td>
                      <td className={`px-4 py-3 ${textColor}`}>
                        {typeof value === 'object' && value !== null ? (
                          Array.isArray(value) ? (
                            <ul className="list-disc list-inside space-y-1">
                              {value.map((item, i) => (
                                <li key={i}>
                                  {typeof item === 'object' ? (
                                    <div className="mt-2">
                                      {renderTable(item, '', level + 1)}
                                    </div>
                                  ) : (
                                    item
                                  )}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <div className="mt-2">
                              {renderTable(value, '', level + 1)}
                            </div>
                          )
                        ) : (
                          <span className="break-words">{value || 'N/A'}</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className={bgColor}>
                    <td className={`px-4 py-3 ${textColor} text-center`} colSpan="2">
                      {tableData || 'No data available'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      );
    };

    const renderSection = (title, content, index) => {
      return (
        <motion.div
          key={index}
          className="bg-slate-800/60 rounded-2xl border border-emerald-600/30 overflow-hidden mb-6 shadow-xl"
        >
          <motion.div
            className="p-4 cursor-pointer bg-gradient-to-r from-emerald-600/20 to-teal-600/20 hover:from-emerald-600/30 hover:to-teal-600/30 transition-all duration-200"
            onClick={() => toggleSection(index)}
            whileHover={{ x: 4 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                  <FontAwesomeIcon icon={faUtensils} className="text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-emerald-100">{title}</h4>
                  <p className="text-emerald-300 text-sm">Click to view details</p>
                </div>
              </div>
              <FontAwesomeIcon 
                icon={expandedSections[index] ? faChevronUp : faChevronDown}
                className="text-emerald-400 text-xl"
              />
            </div>
          </motion.div>

          <AnimatePresence>
            {expandedSections[index] && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="p-6 bg-slate-800/40">
                  {renderTable(content, '', 0)}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      );
    };

    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-emerald-300 mb-2">
            Comprehensive Nutrition Analysis
          </h3>
          <p className="text-emerald-400">Click on any section to view detailed information</p>
        </div>
        {Object.entries(data).map(([key, value], index) => 
          renderSection(
            key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), 
            value, 
            index
          )
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-900 relative overflow-hidden">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        theme="dark"
        className="z-[9999] mt-20"
        toastClassName="!bg-emerald-800 !text-emerald-100"
        progressClassName="!bg-emerald-400"
      />

      {/* Pure Green Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-40 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-500/10 rounded-full blur-3xl animate-ping"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-2xl">
              <FontAwesomeIcon icon={faAppleAlt} className="text-white text-3xl" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-300 via-teal-300 to-green-300 bg-clip-text text-transparent mb-4">
            AI Nutrition Planner
          </h1>
          <p className="text-xl text-emerald-200 max-w-3xl mx-auto leading-relaxed">
            Get your personalized nutrition plan powered by advanced AI
          </p>
          
          {/* Enhanced Profile Status Banner */}
          {profileData && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 inline-flex items-center space-x-3 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border border-emerald-500/30 rounded-full px-6 py-3"
            >
              <FontAwesomeIcon icon={faCheck} className="text-emerald-400" />
              <span className="text-emerald-300 font-medium">
                Profile loaded! {calculateProfileCompletion(profileData)}% complete
              </span>
              {calculateProfileCompletion(profileData) < 100 && (
                <span className="text-emerald-200 text-sm">
                  ({Math.ceil((8 - calculateProfileCompletion(profileData) / 12.5))} fields missing)
                </span>
              )}
            </motion.div>
          )}
        </motion.div>

        {fetchingProfile ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full flex items-center justify-center shadow-2xl">
                <FontAwesomeIcon icon={faSpinner} className="text-white text-2xl animate-spin" />
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full blur opacity-20 animate-pulse"></div>
            </div>
            <h3 className="text-xl font-semibold text-emerald-200 mt-6">Loading Your Profile</h3>
            <p className="text-emerald-300 mt-2">Preparing your personalized experience...</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gradient-to-br from-slate-800/80 via-emerald-900/60 to-slate-800/80 rounded-3xl p-8 border border-emerald-700/30 shadow-2xl backdrop-blur-sm"
              >
                {/* Progress Steps */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-6">
                    {formSteps.map((step, index) => {
                      const stepNumber = index + 1;
                      const isActive = currentStep === stepNumber;
                      const isCompleted = currentStep > stepNumber;
                      
                      return (
                        <div key={stepNumber} className="flex items-center">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${
                              isActive
                                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg"
                                : isCompleted
                                ? "bg-emerald-600 text-white"
                                : "bg-slate-700 text-emerald-300 border border-emerald-600/30"
                            }`}
                            onClick={() => setCurrentStep(stepNumber)}
                          >
                            {isCompleted ? (
                              <FontAwesomeIcon icon={faCheck} />
                            ) : (
                              <FontAwesomeIcon icon={step.icon} />
                            )}
                          </motion.div>
                          {index < formSteps.length - 1 && (
                            <div className={`w-16 h-1 mx-2 transition-all duration-300 ${
                              isCompleted ? "bg-emerald-500" : "bg-slate-600"
                            }`} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {formSteps[currentStep - 1].title}
                    </h3>
                    <p className="text-emerald-300">
                      Step {currentStep} of {formSteps.length}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <AnimatePresence mode="wait">
                    {/* Step 1: Basic Information */}
                    {currentStep === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="space-y-6"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Age */}
                          <div>
                            <label className="block text-sm font-medium text-emerald-300 mb-2">
                              <FontAwesomeIcon icon={faBirthdayCake} className="mr-2" />
                              Age
                            </label>
                            <input
                              type="number"
                              name="age"
                              value={formData.age}
                              onChange={handleChange}
                              className="w-full px-4 py-3 bg-slate-800/50 border border-emerald-600/30 rounded-xl text-white placeholder-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
                              placeholder="Enter your age"
                              required
                            />
                          </div>

                          {/* Weight */}
                          <div>
                            <label className="block text-sm font-medium text-emerald-300 mb-2">
                              <FontAwesomeIcon icon={faWeight} className="mr-2" />
                              Weight (kg)
                            </label>
                            <input
                              type="number"
                              name="weight"
                              value={formData.weight}
                              onChange={handleChange}
                              className="w-full px-4 py-3 bg-slate-800/50 border border-emerald-600/30 rounded-xl text-white placeholder-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
                              placeholder="Enter your weight"
                              required
                            />
                          </div>

                          {/* Height */}
                          <div>
                            <label className="block text-sm font-medium text-emerald-300 mb-2">
                              <FontAwesomeIcon icon={faRulerVertical} className="mr-2" />
                              Height (cm)
                            </label>
                            <input
                              type="number"
                              name="height"
                              value={formData.height}
                              onChange={handleChange}
                              className="w-full px-4 py-3 bg-slate-800/50 border border-emerald-600/30 rounded-xl text-white placeholder-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
                              placeholder="Enter your height"
                              required
                            />
                          </div>
                        </div>

                        {/* Gender Selection */}
                        <div>
                          <label className="block text-sm font-medium text-emerald-300 mb-4">
                            <FontAwesomeIcon icon={faVenusMars} className="mr-2" />
                            Gender
                          </label>
                          <div className="grid grid-cols-3 gap-4">
                            {choices.gender.map((option) => (
                              <motion.label
                                key={option.value}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`relative cursor-pointer rounded-xl p-4 border-2 transition-all duration-300 ${
                                  formData.gender === option.value
                                    ? "border-emerald-500 bg-emerald-500/20 shadow-lg"
                                    : "border-emerald-600/30 bg-slate-800/30 hover:border-emerald-500/50"
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="gender"
                                  value={option.value}
                                  checked={formData.gender === option.value}
                                  onChange={handleChange}
                                  className="sr-only"
                                />
                                <div className="text-center">
                                  <div className="text-2xl mb-2">{option.icon}</div>
                                  <div className="text-white font-medium">{option.label}</div>
                                </div>
                              </motion.label>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 2: Dietary Preferences */}
                    {currentStep === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="space-y-8"
                      >
                        {/* Dietary Preference */}
                        <div>
                          <label className="block text-sm font-medium text-emerald-300 mb-4">
                            <FontAwesomeIcon icon={faLeaf} className="mr-2" />
                            Dietary Preference
                          </label>
                          <div className="space-y-3">
                            {choices.veg_or_nonveg.map((option) => (
                              <motion.label
                                key={option.value}
                                whileHover={{ scale: 1.01 }}
                                className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                                  formData.veg_or_nonveg === option.value
                                    ? "border-emerald-500 bg-emerald-500/20 shadow-lg"
                                    : "border-emerald-600/30 bg-slate-800/30 hover:border-emerald-500/50"
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="veg_or_nonveg"
                                  value={option.value}
                                  checked={formData.veg_or_nonveg === option.value}
                                  onChange={handleChange}
                                  className="sr-only"
                                />
                                <div className="text-2xl mr-4">{option.icon}</div>
                                <div>
                                  <div className="text-white font-medium">{option.label}</div>
                                  <div className="text-emerald-300 text-sm">{option.desc}</div>
                                </div>
                              </motion.label>
                            ))}
                          </div>
                        </div>

                        {/* Food Type */}
                        <div>
                          <label className="block text-sm font-medium text-emerald-300 mb-4">
                            <FontAwesomeIcon icon={faUtensils} className="mr-2" />
                            Food Type
                          </label>
                          <div className="grid grid-cols-2 gap-4">
                            {choices.food_type.map((option) => (
                              <motion.label
                                key={option.value}
                                whileHover={{ scale: 1.02 }}
                                className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                                  formData.food_type === option.value
                                    ? "border-emerald-500 bg-emerald-500/20 shadow-lg"
                                    : "border-emerald-600/30 bg-slate-800/30 hover:border-emerald-500/50"
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="food_type"
                                  value={option.value}
                                  checked={formData.food_type === option.value}
                                  onChange={handleChange}
                                  className="sr-only"
                                />
                                <div className="text-2xl mr-4">{option.icon}</div>
                                <div className="text-white font-medium">{option.label}</div>
                              </motion.label>
                            ))}
                          </div>
                        </div>

                        {/* Goals */}
                        <div>
                          <label className="block text-sm font-medium text-emerald-300 mb-4">
                            <FontAwesomeIcon icon={faBullseye} className="mr-2" />
                            Primary Goal
                          </label>
                          <div className="space-y-3">
                            {choices.goal.map((option) => (
                              <motion.label
                                key={option.value}
                                whileHover={{ scale: 1.01 }}
                                className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                                  formData.goal === option.value
                                    ? "border-emerald-500 bg-emerald-500/20 shadow-lg"
                                    : "border-emerald-600/30 bg-slate-800/30 hover:border-emerald-500/50"
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="goal"
                                  required
                                  value={option.value}
                                  checked={formData.goal === option.value}
                                  onChange={handleChange}
                                  className="sr-only"
                                />
                                <div className="text-2xl mr-4">{option.icon}</div>
                                <div>
                                  <div className="text-white font-medium">{option.label}</div>
                                  <div className="text-emerald-300 text-sm">{option.desc}</div>
                                </div>
                              </motion.label>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 3: Health & Location */}
                    {currentStep === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="space-y-6"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Country */}
                          <div>
                            <label className="block text-sm font-medium text-emerald-300 mb-2">
                              <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                              Country
                            </label>
                            <input
                              type="text"
                              name="country"
                              required
                              value={formData.country}
                              onChange={handleChange}
                              className="w-full px-4 py-3 bg-slate-800/50 border border-emerald-600/30 rounded-xl text-white placeholder-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
                              placeholder="Enter your country"
                            />
                          </div>

                          {/* State */}
                          <div>
                            <label className="block text-sm font-medium text-emerald-300 mb-2">
                              <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                              State
                            </label>
                            <input
                              type="text"
                              name="state"
                              required
                              value={formData.state}
                              onChange={handleChange}
                              className="w-full px-4 py-3 bg-slate-800/50 border border-emerald-600/30 rounded-xl text-white placeholder-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
                              placeholder="Enter your state"
                            />
                          </div>
                        </div>

                        {/* Target Timeline */}
                        <div>
                          <label className="block text-sm font-medium text-emerald-300 mb-4">
                            <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                            Target Timeline
                          </label>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {choices.Target_timeline.map((option) => (
                              <motion.label
                                key={option.value}
                                whileHover={{ scale: 1.02 }}
                                className={`flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                                  formData.Target_timeline === option.value
                                    ? "border-emerald-500 bg-emerald-500/20 shadow-lg"
                                    : "border-emerald-600/30 bg-slate-800/30 hover:border-emerald-500/50"
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="Target_timeline"
                                  value={option.value}
                                  checked={formData.Target_timeline === option.value}
                                  onChange={handleChange}
                                  required
                                  className="sr-only"
                                />
                                <div className="text-2xl mb-2">{option.icon}</div>
                                <div className="text-white font-medium text-center">{option.label}</div>
                              </motion.label>
                            ))}
                          </div>
                        </div>

                        {/* Health Information */}
                        <div className="grid grid-cols-1 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-emerald-300 mb-2">
                              <FontAwesomeIcon icon={faMedkit} className="mr-2" />
                              Medical Conditions (Optional)
                            </label>
                            <textarea
                              name="disease"
                              value={formData.disease}
                              onChange={handleChange}
                              rows={3}
                              required
                              className="w-full px-4 py-3 bg-slate-800/50 border border-emerald-600/30 rounded-xl text-white placeholder-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 resize-none"
                              placeholder="Any medical conditions we should know about..."
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-emerald-300 mb-2">
                              <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
                              Food Allergies (Optional)
                            </label>
                            <textarea
                              name="allergics"
                              value={formData.allergics}
                              onChange={handleChange}
                              rows={3}
                              required
                              className="w-full px-4 py-3 bg-slate-800/50 border border-emerald-600/30 rounded-xl text-white placeholder-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 resize-none"
                              placeholder="Any food allergies or restrictions..."
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-8">
                    {currentStep > 1 && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => setCurrentStep(currentStep - 1)}
                        className="px-6 py-3 bg-slate-700 text-emerald-300 rounded-xl font-medium hover:bg-slate-600 transition-all duration-200 flex items-center space-x-2"
                      >
                        <span>Previous</span>
                      </motion.button>
                    )}

                    {currentStep < formSteps.length ? (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => setCurrentStep(currentStep + 1)}
                        className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-medium hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 flex items-center space-x-2 ml-auto"
                      >
                        <span>Next</span>
                        <FontAwesomeIcon icon={faArrowRight} />
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 flex items-center space-x-3 ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <>
                            <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                            <span>Generating Plan...</span>
                          </>
                        ) : (
                          <>
                            <FontAwesomeIcon icon={faPlay} />
                            <span>Generate My Plan</span>
                          </>
                        )}
                      </motion.button>
                    )}
                  </div>
                </form>
              </motion.div>
            </div>

            {/* Enhanced Sidebar with Profile and Tips */}
            <div className="lg:col-span-1 space-y-6">
              {/* Enhanced Profile Card */}
              {profileData && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-gradient-to-br from-slate-800/80 via-emerald-900/60 to-slate-800/80 rounded-3xl p-6 border border-emerald-700/30 shadow-2xl backdrop-blur-sm"
                >
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <FontAwesomeIcon icon={faUser} className="mr-2 text-emerald-400" />
                    Your Profile
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-emerald-300">Name:</span>
                      <span className="text-white font-medium">
                        {profileData.full_name || profileData.first_name || profileData.user?.username || "Not set"}
                      </span>
                    </div>
                    
                    {profileData.age && (
                      <div className="flex justify-between">
                        <span className="text-emerald-300">Age:</span>
                        <span className="text-white font-medium">{profileData.age} years</span>
                      </div>
                    )}
                    
                    {profileData.height && (
                      <div className="flex justify-between">
                        <span className="text-emerald-300">Height:</span>
                        <span className="text-white font-medium">{profileData.height} cm</span>
                      </div>
                    )}
                    
                    {profileData.weight && (
                      <div className="flex justify-between">
                        <span className="text-emerald-300">Weight:</span>
                        <span className="text-white font-medium">{profileData.weight} kg</span>
                      </div>
                    )}
                    
                    {profileData.bmi && (
                      <div className="flex justify-between">
                        <span className="text-emerald-300">BMI:</span>
                        <span className="text-white font-medium">{profileData.bmi}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Profile Completion Status */}
                  <div className="mt-4 pt-4 border-t border-emerald-600/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-emerald-300 text-sm">Profile Completion</span>
                      <span className="text-white font-medium text-sm">
                        {calculateProfileCompletion(profileData)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${calculateProfileCompletion(profileData)}%` }}
                      ></div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Tips Card */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-slate-800/80 via-emerald-900/60 to-slate-800/80 rounded-3xl p-6 border border-emerald-700/30 shadow-2xl backdrop-blur-sm"
              >
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <FontAwesomeIcon icon={faInfoCircle} className="mr-2 text-emerald-400" />
                  Nutrition Tips
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <FontAwesomeIcon icon={faLeaf} className="text-emerald-400 mt-1 flex-shrink-0" />
                    <p className="text-emerald-200 text-sm">
                      Include your dietary preferences for culturally appropriate meals
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <FontAwesomeIcon icon={faShieldAlt} className="text-emerald-400 mt-1 flex-shrink-0" />
                    <p className="text-emerald-200 text-sm">
                      Mention any allergies to get safe food recommendations
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <FontAwesomeIcon icon={faStar} className="text-emerald-400 mt-1 flex-shrink-0" />
                    <p className="text-emerald-200 text-sm">
                      Your profile data is auto-filled for your convenience
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Features Card */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-slate-800/80 via-emerald-900/60 to-slate-800/80 rounded-3xl p-6 border border-emerald-700/30 shadow-2xl backdrop-blur-sm"
              >
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <FontAwesomeIcon icon={faTrophy} className="mr-2 text-emerald-400" />
                  What You'll Get
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <FontAwesomeIcon icon={faAppleAlt} className="text-emerald-400" />
                    <span className="text-emerald-200 text-sm">Personalized meal plans</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FontAwesomeIcon icon={faChartBar} className="text-emerald-400" />
                    <span className="text-emerald-200 text-sm">BMI analysis & calorie needs</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FontAwesomeIcon icon={faUtensils} className="text-emerald-400" />
                    <span className="text-emerald-200 text-sm">Food recommendations</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FontAwesomeIcon icon={faShieldAlt} className="text-emerald-400" />
                    <span className="text-emerald-200 text-sm">Safety guidelines & tips</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {/* Recommendation Results */}
        {recommendation && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12"
          >
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-300 via-teal-300 to-green-300 bg-clip-text text-transparent mb-4">
                Your Personalized Nutrition Plan
              </h2>
              <p className="text-xl text-emerald-200">
                AI-generated nutrition plan tailored just for you
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* BMI Card */}
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-gradient-to-br from-slate-800/80 via-emerald-900/60 to-slate-800/80 rounded-3xl p-6 border border-emerald-700/30 shadow-2xl backdrop-blur-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">BMI Analysis</h3>
                    <p className="text-3xl font-bold text-teal-400 mb-2">
                      {recommendation?.data?.bmi ? parseFloat(recommendation.data.bmi).toFixed(1) : "N/A"}
                    </p>
                    <p className="text-sm text-emerald-300">{recommendation?.data?.bmi_category || "N/A"}</p>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                    <FontAwesomeIcon icon={faChartBar} className="text-white text-2xl" />
                  </div>
                </div>
              </motion.div>

              {/* Nutrition Plan Card */}
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                onClick={() => setOpenNutritionDialog(true)}
                className="bg-gradient-to-br from-slate-800/80 via-emerald-900/60 to-slate-800/80 rounded-3xl p-6 border border-emerald-700/30 shadow-2xl cursor-pointer group backdrop-blur-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Nutrition Plan</h3>
                    <p className="text-emerald-300 mb-4">
                      Complete meal planning and recommendations
                    </p>
                    <div className="flex items-center text-emerald-400 group-hover:text-emerald-300 transition-colors">
                      <span className="mr-2">View Details</span>
                      <FontAwesomeIcon icon={faArrowRight} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center">
                    <FontAwesomeIcon icon={faAppleAlt} className="text-white text-2xl" />
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Nutrition Dialog */}
      <AnimatePresence>
        {openNutritionDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="bg-gradient-to-br from-slate-800/90 to-emerald-900/80 rounded-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden border border-emerald-700/30 shadow-2xl backdrop-blur-md"
            >
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FontAwesomeIcon icon={faAppleAlt} className="text-2xl" />
                    <h2 className="text-2xl font-bold">Your Comprehensive Nutrition Plan</h2>
                  </div>
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => window.print()}
                      className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                    >
                      <FontAwesomeIcon icon={faPrint} />
                      <span>Print</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setOpenNutritionDialog(false)}
                      className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-200"
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </motion.button>
                  </div>
                </div>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <NutritionPlan data={parsedRecommendation} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #10b981, #14b8a6);
          cursor: pointer;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
        }

        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #10b981, #14b8a6);
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
        }
      `}</style>
    </div>
  );
};

export default NutritionForm;
