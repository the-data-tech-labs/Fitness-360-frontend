import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDumbbell,
  faUser,
  faWeight,
  faRulerVertical,
  faVenusMars,
  faBirthdayCake,
  faBolt,
  faBullseye,
  faMapMarkerAlt,
  faClock,
  faHeart,
  faMedkit,
  faExclamationTriangle,
  faSpinner,
  faChartBar,
  faPrint,
  faTimes,
  faCheck,
  faFire,
  faTrophy,
  faCalendarAlt,
  faInfoCircle,
  faArrowRight,
  faPlay,
  faStar,
  faGem,
  faShieldAlt,
  faStopwatch,
  faCalendarWeek,
  faListAlt,
  faFlag,
  faChevronDown,
  faChevronUp
} from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FitnessForm = ({ isLoggedIn, userData }) => {
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    weight: "",
    height: "",
    fitness_level: "",
    activity_level: "",
    goal: "",
    specific_area: "",
    target_timeline: "",
    medical_conditions: "",
    injuries_or_physical_limitation: "",
    exercise_setting: "",
    sleep_pattern: "",
    stress_level: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(true);
  const [recommendation, setRecommendation] = useState(null);
  const [parsedRecommendation, setParsedRecommendation] = useState(null);
  const [openWorkoutDialog, setOpenWorkoutDialog] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState(null);
  const [expandedDays, setExpandedDays] = useState({});
  const backendUrl = process.env.REACT_APP_BACKEND_URL

  // Helper functions to map profile data to form values
  const mapActivityToFitnessLevel = (activityLevel) => {
    const mapping = {
      'sedentary': 'beginner',
      'lightly_active': 'beginner',
      'moderately_active': 'intermediate',
      'very_active': 'advanced',
      'extra_active': 'advanced'
    };
    return mapping[activityLevel] || '';
  };

  const mapSleepHours = (sleepHours) => {
    if (!sleepHours) return '';

    const hours = parseInt(sleepHours);
    if (hours < 6) return 'less_than_6';
    if (hours >= 6 && hours <= 8) return '6_to_8';
    if (hours > 8) return 'more_than_8';
    return '';
  };

  const mapGoalFromProfile = (profileGoal) => {
    const mapping = {
      'lose_weight': 'weight_loss',
      'gain_muscle': 'muscle_gain',
      'build_strength': 'strength',
      'improve_endurance': 'endurance',
      'increase_flexibility': 'flexibility',
      'general_health': 'general_fitness',
      'maintain': 'maintenance'
    };
    return mapping[profileGoal] || profileGoal || '';
  };

  const mapExercisePreference = (preference) => {
    const mapping = {
      'gymnasium': 'gym',
      'home_workout': 'home',
      'outdoor_activities': 'outdoor',
      'mixed_settings': 'mixed'
    };
    return mapping[preference] || preference || '';
  };

  // Helper function to calculate profile completion percentage
  const calculateProfileCompletion = (profile) => {
    if (!profile) return 0;

    const fields = [
      'age', 'gender', 'weight', 'height', 'activity_level',
      'fitness_goal', 'medical_conditions', 'sleep_hours'
    ];

    const completedFields = fields.filter(field => profile[field] && profile[field] !== '');
    return Math.round((completedFields.length / fields.length) * 100);
  };

  // Parse the JSON recommendation
  const parseRecommendation = (recommendationText) => {
    try {
      const parsed = JSON.parse(recommendationText);
      setParsedRecommendation(parsed);
      return parsed;
    } catch (error) {
      console.error("Failed to parse recommendation JSON:", error);
      setParsedRecommendation(null);
      return null;
    }
  };

  // Enhanced profile data fetching and auto-fill
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) {
          toast.error("No authentication token found. Please log in.");
          setFetchingProfile(false);
          return;
        }

        const response = await axios.get(`${backendUrl}/api/profile/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        console.log("fitness response : ", response)
        if (response.data.success) {
          const profile = response.data.data;
          setProfileData(profile);

          // Enhanced auto-fill with all available profile fields
          setFormData((prevData) => ({
            ...prevData,
            // Basic Information
            age: profile.age?.toString() || "",
            gender: profile.gender || "",
            weight: profile.weight?.toString() || "",
            height: profile.height?.toString() || "",

            // Fitness-related fields from profile
            fitness_level: mapActivityToFitnessLevel(profile.activity_level) || "",
            activity_level: profile.activity_level || "",
            goal: mapGoalFromProfile(profile.fitness_goal) || mapGoalFromProfile(profile.goal) || "",

            // Health and preferences from profile
            medical_conditions: profile.medical_conditions || profile.health_conditions || "",
            injuries_or_physical_limitation: profile.injuries || profile.physical_limitations || "",
            sleep_pattern: mapSleepHours(profile.sleep_hours) || "",
            stress_level: profile.stress_level?.toString() || "5",

            // Exercise preferences
            exercise_setting: mapExercisePreference(profile.exercise_preference) || mapExercisePreference(profile.workout_location) || "",
            specific_area: profile.target_area || profile.focus_area || "",
            target_timeline: profile.timeline || profile.target_timeline || "",
          }));

          // Show success message with details of what was loaded
          const loadedFields = [];
          if (profile.age) loadedFields.push("age");
          if (profile.weight) loadedFields.push("weight");
          if (profile.height) loadedFields.push("height");
          if (profile.fitness_goal || profile.goal) loadedFields.push("fitness goal");
          if (profile.activity_level) loadedFields.push("activity level");
          if (profile.medical_conditions) loadedFields.push("medical conditions");
          if (profile.sleep_hours) loadedFields.push("sleep pattern");

          if (loadedFields.length > 0) {
            toast.success(`Profile data loaded`);
          } else {
            toast.info("Profile found but no fitness data available. Please fill the form manually.");
          }

        } else {
          toast.info("Profile not found. Please fill the form manually.");
        }
      } catch (err) {
        console.error("Error fetching profile data:", err);
        if (err.response?.status === 404) {
          toast.info("Profile not found. Please fill the form to create your fitness profile.");
        } else {
          toast.error("Failed to fetch profile data. Please fill the form manually.");
        }
      } finally {
        setFetchingProfile(false);
      }
    };

    if (isLoggedIn) {
      fetchProfileData();
    } else {
      setFetchingProfile(false);
    }
  }, [isLoggedIn, backendUrl]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Enhanced form submission with better validation and data processing
  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = ["age", "weight", "gender", "height", "fitness_level", "activity_level", "goal"];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      toast.error(`Please fill in the following fields: ${missingFields.join(", ")}`);

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
        gender: formData.gender === "Female" ? "female" : formData.gender === "Male" ? "male" : "other",
        // Convert string numbers to actual numbers
        age: parseInt(formData.age),
        weight: parseFloat(formData.weight),
        height: parseFloat(formData.height),
        stress_level: parseInt(formData.stress_level) || 5,
      };

      console.log("Sending enhanced profile data:", backendFormData);

      const response = await axios.post(
        `${backendUrl}/fitness/fitness-recommendation/`,
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
      if (response.data.recommendation_text) {
        parseRecommendation(response.data.recommendation_text);
      }

      toast.success(`Your personalized fitness plan is ready! Scroll down`);

    } catch (err) {
      console.error("Error fetching recommendation:", err);
      toast.error(err.response?.data?.detail || "Failed to get recommendations. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  const toggleDay = (dayIndex) => {
    setExpandedDays(prev => ({
      ...prev,
      [dayIndex]: !prev[dayIndex]
    }));
  };

  const formSteps = [
    {
      title: "Basic Information",
      icon: faUser,
      fields: ["age", "gender", "weight", "height"]
    },
    {
      title: "Fitness Profile",
      icon: faDumbbell,
      fields: ["fitness_level", "activity_level", "goal"]
    },
    {
      title: "Preferences & Health",
      icon: faHeart,
      fields: ["specific_area", "target_timeline", "medical_conditions", "injuries_or_physical_limitation", "exercise_setting", "sleep_pattern", "stress_level"]
    }
  ];

  const choices = {
    gender: [
      { value: "Male", label: "Male", icon: "♂️" },
      { value: "Female", label: "Female", icon: "♀️" },
      { value: "Other", label: "Other", icon: "⚧️" },
    ],
    fitness_level: [
      { value: "beginner", label: "Beginner", desc: "No prior exercise experience", icon: "🌱" },
      { value: "intermediate", label: "Intermediate", desc: "Exercises 2-3 times/week", icon: "💪" },
      { value: "advanced", label: "Advanced", desc: "Regular high-intensity training", icon: "🏆" },
    ],
    activity_level: [
      { value: "sedentary", label: "Sedentary", desc: "Little to no exercise", icon: "🛋️" },
      { value: "lightly_active", label: "Lightly Active", desc: "Light exercise 1-3 days/week", icon: "🚶" },
      { value: "moderately_active", label: "Moderately Active", desc: "Moderate exercise 3-5 days/week", icon: "🏃" },
      { value: "very_active", label: "Very Active", desc: "Hard exercise 6-7 days/week", icon: "🏋️" },
      { value: "extra_active", label: "Extra Active", desc: "Very hard exercise & physical job", icon: "💥" },
    ],
    goal: [
      { value: "weight_loss", label: "Weight Loss", desc: "Burn fat and lose weight", icon: "⚖️" },
      { value: "muscle_gain", label: "Muscle Gain", desc: "Build muscle mass", icon: "💪" },
      { value: "strength", label: "Strength Training", desc: "Increase overall strength", icon: "🏋️" },
      { value: "endurance", label: "Endurance Building", desc: "Improve cardiovascular fitness", icon: "🏃" },
      { value: "flexibility", label: "Flexibility & Mobility", desc: "Improve range of motion", icon: "🧘" },
      { value: "general_fitness", label: "General Fitness", desc: "Overall health improvement", icon: "🎯" },
      { value: "maintenance", label: "Maintenance", desc: "Maintain current fitness", icon: "⚖️" },
    ],
    exercise_setting: [
      { value: "gym", label: "Gym", icon: "🏋️" },
      { value: "home", label: "Home", icon: "🏠" },
      { value: "outdoor", label: "Outdoor", icon: "🌳" },
      { value: "mixed", label: "Mixed", icon: "🔄" },
    ],
    sleep_pattern: [
      { value: "less_than_6", label: "Less than 6 hours", icon: "😴" },
      { value: "6_to_8", label: "6-8 hours", icon: "😊" },
      { value: "more_than_8", label: "More than 8 hours", icon: "😌" },
    ],
  };

  // Enhanced WorkoutPlan component to display structured data
  const WorkoutPlan = ({ data }) => {
    if (!data || !data.workout_overview) {
      return (
        <div className="text-center py-12">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-4xl text-violet-400 mb-4" />
          <p className="text-violet-300">No workout plan available.</p>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {/* Plan Overview */}
        <div className="bg-gradient-to-r from-violet-600/20 to-purple-600/20 rounded-2xl p-6 border border-violet-500/30">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
            <FontAwesomeIcon icon={faDumbbell} className="mr-3 text-violet-400" />
            Workout Plan Overview
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center bg-slate-800/30 rounded-xl p-4">
              <FontAwesomeIcon icon={faCalendarWeek} className="text-2xl text-violet-400 mb-2" />
              <div className="text-lg font-bold text-white">{data.workout_overview.plan_duration || "8-12 weeks"}</div>
              <div className="text-sm text-violet-300">Duration</div>
            </div>
            <div className="text-center bg-slate-800/30 rounded-xl p-4">
              <FontAwesomeIcon icon={faFire} className="text-2xl text-orange-400 mb-2" />
              <div className="text-lg font-bold text-white">{data.workout_overview.weekly_frequency || "4-5 times"}</div>
              <div className="text-sm text-violet-300">Per Week</div>
            </div>
            <div className="text-center bg-slate-800/30 rounded-xl p-4">
              <FontAwesomeIcon icon={faStopwatch} className="text-2xl text-blue-400 mb-2" />
              <div className="text-lg font-bold text-white">{data.workout_overview.session_duration || "45-60 min"}</div>
              <div className="text-sm text-violet-300">Per Session</div>
            </div>
            <div className="text-center bg-slate-800/30 rounded-xl p-4">
              <FontAwesomeIcon icon={faFlag} className="text-2xl text-green-400 mb-2" />
              <div className="text-lg font-bold text-white">{data.workout_overview.intensity_level || "Progressive"}</div>
              <div className="text-sm text-violet-300">Intensity</div>
            </div>
          </div>
        </div>

        {/* Weekly Schedule */}
        {data.weekly_workout_schedule && data.weekly_workout_schedule.length > 0 && (
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-violet-600/30">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <FontAwesomeIcon icon={faListAlt} className="mr-2 text-violet-400" />
              Weekly Workout Schedule
            </h3>
            <div className="space-y-4">
              {data.weekly_workout_schedule.map((day, index) => (
                <motion.div
                  key={index}
                  className="bg-slate-700/50 rounded-xl border border-violet-600/20 overflow-hidden"
                >
                  <motion.div
                    className="p-4 cursor-pointer bg-gradient-to-r from-violet-600/10 to-purple-600/10 hover:from-violet-600/20 hover:to-purple-600/20 transition-all duration-200"
                    onClick={() => toggleDay(index)}
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl flex items-center justify-center">
                          <FontAwesomeIcon icon={faDumbbell} className="text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-white">{day.day}</h4>
                          <p className="text-violet-300">{day.workout_type} • {day.duration}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${day.intensity === 'High' ? 'bg-red-500/20 text-red-300' :
                            day.intensity === 'Moderate to High' ? 'bg-orange-500/20 text-orange-300' :
                              'bg-yellow-500/20 text-yellow-300'
                          }`}>
                          {day.intensity}
                        </span>
                        <FontAwesomeIcon
                          icon={expandedDays[index] ? faChevronUp : faChevronDown}
                          className="text-violet-400"
                        />
                      </div>
                    </div>
                  </motion.div>

                  <AnimatePresence>
                    {expandedDays[index] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="p-6 bg-slate-800/30">
                          <div className="grid gap-4">
                            {day.exercises && day.exercises.map((exercise, exIndex) => (
                              <motion.div
                                key={exIndex}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: exIndex * 0.1 }}
                                className="bg-slate-700/50 rounded-lg p-4 border border-violet-600/20"
                              >
                                <div className="flex justify-between items-start mb-3">
                                  <h5 className="text-lg font-semibold text-white">{exercise.name}</h5>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${exercise.category === 'cardio' ? 'bg-blue-500/20 text-blue-300' :
                                      exercise.category === 'strength' ? 'bg-orange-500/20 text-orange-300' :
                                        'bg-purple-500/20 text-purple-300'
                                    }`}>
                                    {exercise.category}
                                  </span>
                                </div>

                                <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                                  <div className="bg-slate-600/30 rounded p-2 text-center">
                                    <div className="text-violet-400 font-medium">Sets</div>
                                    <div className="text-white">{exercise.sets}</div>
                                  </div>
                                  <div className="bg-slate-600/30 rounded p-2 text-center">
                                    <div className="text-violet-400 font-medium">Reps</div>
                                    <div className="text-white">{exercise.reps}</div>
                                  </div>
                                  <div className="bg-slate-600/30 rounded p-2 text-center">
                                    <div className="text-violet-400 font-medium">Rest</div>
                                    <div className="text-white">{exercise.rest_between_sets}</div>
                                  </div>
                                </div>

                                {exercise.target_muscles && (
                                  <div className="mb-2">
                                    <span className="text-violet-400 text-sm font-medium">Target Muscles: </span>
                                    <span className="text-white text-sm">{exercise.target_muscles.join(", ")}</span>
                                  </div>
                                )}

                                {exercise.technique_notes && (
                                  <div className="mb-2">
                                    <span className="text-violet-400 text-sm font-medium">Technique: </span>
                                    <span className="text-violet-200 text-sm">{exercise.technique_notes}</span>
                                  </div>
                                )}

                                <div className="flex flex-wrap gap-2 mt-3">
                                  {exercise.beginner_modification && (
                                    <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full">
                                      Beginner: {exercise.beginner_modification}
                                    </span>
                                  )}
                                  {exercise.advanced_variation && (
                                    <span className="px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded-full">
                                      Advanced: {exercise.advanced_variation}
                                    </span>
                                  )}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Warm-up and Cool-down */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {data.warm_up_routine && (
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-violet-600/30">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <FontAwesomeIcon icon={faFire} className="mr-2 text-orange-400" />
                Warm-up Routine
              </h3>
              <div className="space-y-3">
                {data.warm_up_routine.map((warmup, index) => (
                  <div key={index} className="bg-slate-700/50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-white">{warmup.exercise}</h4>
                      <span className="text-orange-300 text-sm">{warmup.duration}</span>
                    </div>
                    <p className="text-violet-200 text-sm mb-1">{warmup.description}</p>
                    <p className="text-violet-300 text-xs">{warmup.purpose}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.cool_down_routine && (
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-violet-600/30">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <FontAwesomeIcon icon={faHeart} className="mr-2 text-blue-400" />
                Cool-down Routine
              </h3>
              <div className="space-y-3">
                {data.cool_down_routine.map((cooldown, index) => (
                  <div key={index} className="bg-slate-700/50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-white">{cooldown.exercise}</h4>
                      <span className="text-blue-300 text-sm">{cooldown.duration}</span>
                    </div>
                    <p className="text-violet-200 text-sm mb-1">{cooldown.description}</p>
                    <p className="text-violet-300 text-xs">{cooldown.purpose}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Safety Guidelines */}
        {data.workout_safety_guidelines && (
          <div className="bg-yellow-900/20 rounded-2xl p-6 border border-yellow-500/30">
            <h3 className="text-xl font-bold text-yellow-300 mb-4 flex items-center">
              <FontAwesomeIcon icon={faShieldAlt} className="mr-2" />
              Safety Guidelines
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.workout_safety_guidelines.map((guideline, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <FontAwesomeIcon icon={faCheck} className="text-yellow-400 mt-1 flex-shrink-0" />
                  <span className="text-yellow-100 text-sm">{guideline}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
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

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl">
              <FontAwesomeIcon icon={faDumbbell} className="text-white text-3xl" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-violet-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent mb-4">
            AI Fitness Planner
          </h1>
          <p className="text-xl text-violet-200 max-w-3xl mx-auto leading-relaxed">
            Get your personalized workout plan powered by advanced AI
          </p>

          {/* Enhanced Profile Status Banner */}
          {profileData && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 inline-flex items-center space-x-3 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-full px-6 py-3"
            >
              <FontAwesomeIcon icon={faCheck} className="text-green-400" />
              <span className="text-green-300 font-medium">
                Profile loaded! {calculateProfileCompletion(profileData)}% complete
              </span>
              {calculateProfileCompletion(profileData) < 100 && (
                <span className="text-green-200 text-sm">
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
              <div className="w-20 h-20 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
                <FontAwesomeIcon icon={faSpinner} className="text-white text-2xl animate-spin" />
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full blur opacity-20 animate-pulse"></div>
            </div>
            <h3 className="text-xl font-semibold text-violet-200 mt-6">Loading Your Profile</h3>
            <p className="text-violet-300 mt-2">Preparing your personalized experience...</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gradient-to-br from-slate-800 via-violet-900 to-slate-800 rounded-3xl p-8 border border-violet-700/30 shadow-2xl"
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
                            className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${isActive
                                ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg"
                                : isCompleted
                                  ? "bg-green-600 text-white"
                                  : "bg-slate-700 text-violet-300 border border-violet-600/30"
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
                            <div className={`w-16 h-1 mx-2 transition-all duration-300 ${isCompleted ? "bg-green-500" : "bg-slate-600"
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
                    <p className="text-violet-300">
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
                            <label className="block text-sm font-medium text-violet-300 mb-2">
                              <FontAwesomeIcon icon={faBirthdayCake} className="mr-2" />
                              Age
                            </label>
                            <input
                              type="number"
                              name="age"
                              value={formData.age}
                              onChange={handleChange}
                              className="w-full px-4 py-3 bg-slate-800/50 border border-violet-600/30 rounded-xl text-white placeholder-violet-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200"
                              placeholder="Enter your age"
                              required
                            />
                          </div>

                          {/* Weight */}
                          <div>
                            <label className="block text-sm font-medium text-violet-300 mb-2">
                              <FontAwesomeIcon icon={faWeight} className="mr-2" />
                              Weight (kg)
                            </label>
                            <input
                              type="number"
                              name="weight"
                              value={formData.weight}
                              onChange={handleChange}
                              className="w-full px-4 py-3 bg-slate-800/50 border border-violet-600/30 rounded-xl text-white placeholder-violet-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200"
                              placeholder="Enter your weight"
                              required
                            />
                          </div>

                          {/* Height */}
                          <div>
                            <label className="block text-sm font-medium text-violet-300 mb-2">
                              <FontAwesomeIcon icon={faRulerVertical} className="mr-2" />
                              Height (cm)
                            </label>
                            <input
                              type="number"
                              name="height"
                              value={formData.height}
                              onChange={handleChange}
                              className="w-full px-4 py-3 bg-slate-800/50 border border-violet-600/30 rounded-xl text-white placeholder-violet-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200"
                              placeholder="Enter your height"
                              required
                            />
                          </div>
                        </div>

                        {/* Gender Selection */}
                        <div>
                          <label className="block text-sm font-medium text-violet-300 mb-4">
                            <FontAwesomeIcon icon={faVenusMars} className="mr-2" />
                            Gender
                          </label>
                          <div className="grid grid-cols-3 gap-4">
                            {choices.gender.map((option) => (
                              <motion.label
                                key={option.value}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`relative cursor-pointer rounded-xl p-4 border-2 transition-all duration-300 ${formData.gender === option.value
                                    ? "border-violet-500 bg-violet-500/20"
                                    : "border-violet-600/30 bg-slate-800/30 hover:border-violet-500/50"
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

                    {/* Step 2: Fitness Profile */}
                    {currentStep === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="space-y-8"
                      >
                        {/* Fitness Level */}
                        <div>
                          <label className="block text-sm font-medium text-violet-300 mb-4">
                            <FontAwesomeIcon icon={faDumbbell} className="mr-2" />
                            Fitness Level
                          </label>
                          <div className="space-y-3">
                            {choices.fitness_level.map((option) => (
                              <motion.label
                                key={option.value}
                                whileHover={{ scale: 1.01 }}
                                className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${formData.fitness_level === option.value
                                    ? "border-violet-500 bg-violet-500/20"
                                    : "border-violet-600/30 bg-slate-800/30 hover:border-violet-500/50"
                                  }`}
                              >
                                <input
                                  type="radio"
                                  name="fitness_level"
                                  value={option.value}
                                  checked={formData.fitness_level === option.value}
                                  onChange={handleChange}
                                  className="sr-only"
                                />
                                <div className="text-2xl mr-4">{option.icon}</div>
                                <div>
                                  <div className="text-white font-medium">{option.label}</div>
                                  <div className="text-violet-300 text-sm">{option.desc}</div>
                                </div>
                              </motion.label>
                            ))}
                          </div>
                        </div>

                        {/* Activity Level */}
                        <div>
                          <label className="block text-sm font-medium text-violet-300 mb-4">
                            <FontAwesomeIcon icon={faBolt} className="mr-2" />
                            Activity Level
                          </label>
                          <div className="space-y-3">
                            {choices.activity_level.map((option) => (
                              <motion.label
                                key={option.value}
                                whileHover={{ scale: 1.01 }}
                                className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${formData.activity_level === option.value
                                    ? "border-violet-500 bg-violet-500/20"
                                    : "border-violet-600/30 bg-slate-800/30 hover:border-violet-500/50"
                                  }`}
                              >
                                <input
                                  type="radio"
                                  name="activity_level"
                                  value={option.value}
                                  checked={formData.activity_level === option.value}
                                  onChange={handleChange}
                                  className="sr-only"
                                />
                                <div className="text-2xl mr-4">{option.icon}</div>
                                <div>
                                  <div className="text-white font-medium">{option.label}</div>
                                  <div className="text-violet-300 text-sm">{option.desc}</div>
                                </div>
                              </motion.label>
                            ))}
                          </div>
                        </div>

                        {/* Goals */}
                        <div>
                          <label className="block text-sm font-medium text-violet-300 mb-4">
                            <FontAwesomeIcon icon={faBullseye} className="mr-2" />
                            Primary Goal
                          </label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {choices.goal.map((option) => (
                              <motion.label
                                key={option.value}
                                whileHover={{ scale: 1.02 }}
                                className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${formData.goal === option.value
                                    ? "border-violet-500 bg-violet-500/20"
                                    : "border-violet-600/30 bg-slate-800/30 hover:border-violet-500/50"
                                  }`}
                              >
                                <input
                                  type="radio"
                                  name="goal"
                                  value={option.value}
                                  checked={formData.goal === option.value}
                                  onChange={handleChange}
                                  className="sr-only"
                                />
                                <div className="text-2xl mr-4">{option.icon}</div>
                                <div>
                                  <div className="text-white font-medium">{option.label}</div>
                                  <div className="text-violet-300 text-sm">{option.desc}</div>
                                </div>
                              </motion.label>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 3: Preferences & Health */}
                    {currentStep === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="space-y-6"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Specific Area */}
                          <div>
                            <label className="block text-sm font-medium text-violet-300 mb-2">
                              <FontAwesomeIcon icon={faBullseye} className="mr-2" />
                              Specific Area (Optional)
                            </label>
                            <input
                              type="text"
                              name="specific_area"
                              value={formData.specific_area}
                              onChange={handleChange}
                              className="w-full px-4 py-3 bg-slate-800/50 border border-violet-600/30 rounded-xl text-white placeholder-violet-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200"
                              placeholder="e.g., abs, arms, legs"
                            />
                          </div>

                          {/* Target Timeline */}
                          <div>
                            <label className="block text-sm font-medium text-violet-300 mb-2">
                              <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                              Target Timeline (Optional)
                            </label>
                            <input
                              type="text"
                              name="target_timeline"
                              value={formData.target_timeline}
                              onChange={handleChange}
                              className="w-full px-4 py-3 bg-slate-800/50 border border-violet-600/30 rounded-xl text-white placeholder-violet-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200"
                              placeholder="e.g., 3 months, 6 weeks"
                            />
                          </div>
                        </div>

                        {/* Exercise Setting */}
                        <div>
                          <label className="block text-sm font-medium text-violet-300 mb-4">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                            Exercise Setting
                          </label>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {choices.exercise_setting.map((option) => (
                              <motion.label
                                key={option.value}
                                whileHover={{ scale: 1.02 }}
                                className={`flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${formData.exercise_setting === option.value
                                    ? "border-violet-500 bg-violet-500/20"
                                    : "border-violet-600/30 bg-slate-800/30 hover:border-violet-500/50"
                                  }`}
                              >
                                <input
                                  type="radio"
                                  name="exercise_setting"
                                  value={option.value}
                                  checked={formData.exercise_setting === option.value}
                                  onChange={handleChange}
                                  className="sr-only"
                                />
                                <div className="text-2xl mb-2">{option.icon}</div>
                                <div className="text-white font-medium text-center">{option.label}</div>
                              </motion.label>
                            ))}
                          </div>
                        </div>

                        {/* Sleep Pattern */}
                        <div>
                          <label className="block text-sm font-medium text-violet-300 mb-4">
                            <FontAwesomeIcon icon={faClock} className="mr-2" />
                            Sleep Pattern
                          </label>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {choices.sleep_pattern.map((option) => (
                              <motion.label
                                key={option.value}
                                whileHover={{ scale: 1.02 }}
                                className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${formData.sleep_pattern === option.value
                                    ? "border-violet-500 bg-violet-500/20"
                                    : "border-violet-600/30 bg-slate-800/30 hover:border-violet-500/50"
                                  }`}
                              >
                                <input
                                  type="radio"
                                  name="sleep_pattern"
                                  value={option.value}
                                  checked={formData.sleep_pattern === option.value}
                                  onChange={handleChange}
                                  className="sr-only"
                                />
                                <div className="text-2xl mr-4">{option.icon}</div>
                                <div className="text-white font-medium">{option.label}</div>
                              </motion.label>
                            ))}
                          </div>
                        </div>

                        {/* Stress Level */}
                        <div>
                          <label className="block text-sm font-medium text-violet-300 mb-2">
                            <FontAwesomeIcon icon={faHeart} className="mr-2" />
                            Stress Level (1-10)
                          </label>
                          <input
                            type="range"
                            name="stress_level"
                            min="1"
                            max="10"
                            value={formData.stress_level}
                            onChange={handleChange}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                          />
                          <div className="flex justify-between text-sm text-violet-300 mt-2">
                            <span>Low (1)</span>
                            <span className="text-white font-medium">{formData.stress_level || 5}</span>
                            <span>High (10)</span>
                          </div>
                        </div>

                        {/* Health Information */}
                        <div className="grid grid-cols-1 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-violet-300 mb-2">
                              <FontAwesomeIcon icon={faMedkit} className="mr-2" />
                              Medical Conditions (Optional)
                            </label>
                            <textarea
                              name="medical_conditions"
                              value={formData.medical_conditions}
                              onChange={handleChange}
                              rows={3}
                              className="w-full px-4 py-3 bg-slate-800/50 border border-violet-600/30 rounded-xl text-white placeholder-violet-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200 resize-none"
                              placeholder="Any medical conditions we should know about..."
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-violet-300 mb-2">
                              <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
                              Injuries or Physical Limitations (Optional)
                            </label>
                            <textarea
                              name="injuries_or_physical_limitation"
                              value={formData.injuries_or_physical_limitation}
                              onChange={handleChange}
                              rows={3}
                              className="w-full px-4 py-3 bg-slate-800/50 border border-violet-600/30 rounded-xl text-white placeholder-violet-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200 resize-none"
                              placeholder="Any injuries or limitations..."
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
                        className="px-6 py-3 bg-slate-700 text-violet-300 rounded-xl font-medium hover:bg-slate-600 transition-all duration-200 flex items-center space-x-2"
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
                        className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-medium hover:from-violet-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 ml-auto"
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
                        className="px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-bold hover:from-violet-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-3 ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
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
                  className="bg-gradient-to-br from-slate-800 via-violet-900 to-slate-800 rounded-3xl p-6 border border-violet-700/30 shadow-2xl"
                >
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <FontAwesomeIcon icon={faUser} className="mr-2 text-violet-400" />
                    Your Profile
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-violet-300">Name:</span>
                      <span className="text-white font-medium">
                        {profileData.full_name || profileData.first_name || profileData.user?.username || "Not set"}
                      </span>
                    </div>

                    {profileData.age && (
                      <div className="flex justify-between">
                        <span className="text-violet-300">Age:</span>
                        <span className="text-white font-medium">{profileData.age} years</span>
                      </div>
                    )}

                    {profileData.height && (
                      <div className="flex justify-between">
                        <span className="text-violet-300">Height:</span>
                        <span className="text-white font-medium">{profileData.height} cm</span>
                      </div>
                    )}

                    {profileData.weight && (
                      <div className="flex justify-between">
                        <span className="text-violet-300">Weight:</span>
                        <span className="text-white font-medium">{profileData.weight} kg</span>
                      </div>
                    )}

                    {profileData.bmi && (
                      <div className="flex justify-between">
                        <span className="text-violet-300">BMI:</span>
                        <span className="text-white font-medium">{profileData.bmi}</span>
                      </div>
                    )}

                    {profileData.activity_level && (
                      <div className="flex justify-between">
                        <span className="text-violet-300">Activity:</span>
                        <span className="text-white font-medium text-sm">
                          {profileData.activity_level.replace('_', ' ')}
                        </span>
                      </div>
                    )}

                    {profileData.fitness_goal && (
                      <div className="flex justify-between">
                        <span className="text-violet-300">Goal:</span>
                        <span className="text-white font-medium text-sm">
                          {profileData.fitness_goal.replace('_', ' ')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Profile Completion Status */}
                  <div className="mt-4 pt-4 border-t border-violet-600/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-violet-300 text-sm">Profile Completion</span>
                      <span className="text-white font-medium text-sm">
                        {calculateProfileCompletion(profileData)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-violet-500 to-purple-500 h-2 rounded-full transition-all duration-500"
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
                className="bg-gradient-to-br from-slate-800 via-violet-900 to-slate-800 rounded-3xl p-6 border border-violet-700/30 shadow-2xl"
              >
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <FontAwesomeIcon icon={faInfoCircle} className="mr-2 text-violet-400" />
                  Quick Tips
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <FontAwesomeIcon icon={faGem} className="text-violet-400 mt-1 flex-shrink-0" />
                    <p className="text-violet-200 text-sm">
                      Be honest about your fitness level for the best results
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <FontAwesomeIcon icon={faShieldAlt} className="text-violet-400 mt-1 flex-shrink-0" />
                    <p className="text-violet-200 text-sm">
                      Include any injuries to get safe exercise recommendations
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <FontAwesomeIcon icon={faStar} className="text-violet-400 mt-1 flex-shrink-0" />
                    <p className="text-violet-200 text-sm">
                      Your data is auto-filled from your profile for convenience
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Features Card */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-slate-800 via-violet-900 to-slate-800 rounded-3xl p-6 border border-violet-700/30 shadow-2xl"
              >
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <FontAwesomeIcon icon={faTrophy} className="mr-2 text-violet-400" />
                  What You'll Get
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <FontAwesomeIcon icon={faDumbbell} className="text-violet-400" />
                    <span className="text-violet-200 text-sm">Personalized workout plan</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FontAwesomeIcon icon={faChartBar} className="text-violet-400" />
                    <span className="text-violet-200 text-sm">BMI analysis & insights</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FontAwesomeIcon icon={faPrint} className="text-violet-400" />
                    <span className="text-violet-200 text-sm">Printable PDF plans</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FontAwesomeIcon icon={faShieldAlt} className="text-violet-400" />
                    <span className="text-violet-200 text-sm">Safety guidelines & tips</span>
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
              <h2 className="text-4xl font-bold bg-gradient-to-r from-violet-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent mb-4">
                Your Personalized Fitness Plan
              </h2>
              <p className="text-xl text-violet-200">
                AI-generated workout plan tailored just for you
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* BMI Card */}
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-gradient-to-br from-slate-800 via-violet-900 to-slate-800 rounded-3xl p-6 border border-violet-700/30 shadow-2xl"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">BMI Analysis</h3>
                    <p className="text-3xl font-bold text-blue-400 mb-2">
                      {recommendation?.bmi ? parseFloat(recommendation.bmi).toFixed(1) : "N/A"}
                    </p>
                    <p className="text-sm text-violet-300">{recommendation?.bmi_category || "N/A"}</p>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                    <FontAwesomeIcon icon={faChartBar} className="text-white text-2xl" />
                  </div>
                </div>
              </motion.div>

              {/* Workout Plan Card */}
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                onClick={() => setOpenWorkoutDialog(true)}
                className="bg-gradient-to-br from-slate-800 via-violet-900 to-slate-800 rounded-3xl p-6 border border-violet-700/30 shadow-2xl cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Workout Plan</h3>
                    <p className="text-violet-300 mb-4">
                      {parsedRecommendation?.workout_overview?.weekly_frequency || "Custom"} sessions per week
                    </p>
                    <div className="flex items-center text-violet-400 group-hover:text-violet-300 transition-colors">
                      <span className="mr-2">View Details</span>
                      <FontAwesomeIcon icon={faArrowRight} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl flex items-center justify-center">
                    <FontAwesomeIcon icon={faDumbbell} className="text-white text-2xl" />
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Workout Dialog */}
      <AnimatePresence>
        {openWorkoutDialog && (
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
              className="bg-gradient-to-br from-slate-800 to-violet-900 rounded-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden border border-violet-700/30 shadow-2xl"
            >
              <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FontAwesomeIcon icon={faDumbbell} className="text-2xl" />
                    <h2 className="text-2xl font-bold">Your Workout Plan</h2>
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
                      onClick={() => setOpenWorkoutDialog(false)}
                      className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-200"
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </motion.button>
                  </div>
                </div>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <WorkoutPlan data={parsedRecommendation} />
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
          background: linear-gradient(45deg, #8b5cf6, #a855f7);
          cursor: pointer;
          box-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
        }

        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #8b5cf6, #a855f7);
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
        }
      `}</style>
    </div>
  );
};

export default FitnessForm;
