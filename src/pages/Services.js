import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDumbbell,
  faAppleAlt,
  faOm,
  faHome,
  faUsers,
  faTimes,
  faUser,
  faRulerVertical,
  faWeightScale,
  faVenusMars,
  faBirthdayCake,
  faCamera,
  faSave,
  faFire,
  faGem,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FitnessNutritionDashboard from "./FitnessNutritionDashboard";

function Services({ isLoggedIn, userData, isServicesInView }) {
  const [darkMode, ] = useState(false);
  const [fitnessOutput, ] = useState(null);
  const [nutritionOutput, ] = useState(null);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [profile, setProfile] = useState({
    name: userData?.username || "N/A",
    height: userData?.profile?.height || "N/A",
    weight: userData?.profile?.weight || "N/A",
    gender: userData?.profile?.gender || "Male",
    age: userData?.profile?.age || "20",
    profilePic: userData?.profile?.profilePic || "/static/images/avatar/1.jpg",
  });
  const [editProfile, setEditProfile] = useState({ ...profile });
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [hoveredService, setHoveredService] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const handleServiceClick = (serviceType, path) => {
    if (serviceType === "fitness") {
      navigate("/fitness");
    } else if (serviceType === "nutrition") {
      navigate("/nutrition");
    } else if (path) {
      navigate(path);
    }
  };

  const services = [
    // All features
    {
      title: "Fitness",
      icon: faDumbbell,
      description: "AI-powered personalized workout routines tailored to your goals",
      gradient: "from-blue-500 via-purple-500 to-pink-500",
      bgGradient: "from-blue-500/10 via-purple-500/10 to-pink-500/10",
      shadowColor: "shadow-blue-500/25",
      formType: "fitness",
      stats: "5K+ Workouts",
      accent: "text-blue-400"
    },
    {
      title: "Nutrition",
      icon: faAppleAlt,
      description: "Science-backed meal plans optimized for your lifestyle and preferences",
      gradient: "from-green-500 via-emerald-500 to-teal-500",
      bgGradient: "from-green-500/10 via-emerald-500/10 to-teal-500/10",
      shadowColor: "shadow-green-500/25",
      formType: "nutrition",
      stats: "3K+ Meals",
      accent: "text-green-400"
    },
    {
      title: "Meditation",
      icon: faOm,
      description: "Mindfulness sessions to reduce stress and enhance mental clarity",
      gradient: "from-purple-500 via-pink-500 to-rose-500",
      bgGradient: "from-purple-500/10 via-pink-500/10 to-rose-500/10",
      shadowColor: "shadow-purple-500/25",
      path: "/mindful-moments",
      stats: "2K+ Sessions",
      accent: "text-purple-400"
    },
  ];

 const sidebarItems = [
  { text: "Dashboard", icon: faHome, path: "/dashboard" },
  { text: "Community", icon: faUsers, path: "/community" },
  { text: "Profile", icon: faUser, path: "/profile" }, // Changed from faUsers to faUser
  { text: "Fitness History", icon: faDumbbell, path: "/fitness-history" }, // Changed from faUsers to faDumbbell
  { text: "Nutrition History", icon: faAppleAlt, path: "/nutrition-history" }, // Changed from faUsers to faAppleAlt
];
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { y: 60, opacity: 0, scale: 0.8 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const sidebarVariants = {
    hidden: { x: -300, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 20
      }
    }
  };

  

  const handleEditProfileClose = () => {
    setIsEditProfileModalOpen(false);
  };

  const handleEditProfileChange = (e) => {
    const { name, value } = e.target;
    setEditProfile({ ...editProfile, [name]: value });
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditProfile({ ...editProfile, profilePic: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditProfileSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("name", editProfile.name);
      formData.append("height", editProfile.height);
      formData.append("weight", editProfile.weight);
      formData.append("gender", editProfile.gender);
      formData.append("age", editProfile.age);
      if (profilePicFile) {
        formData.append("profilePic", profilePicFile);
      }

     
      setProfile({ ...editProfile });
      setIsEditProfileModalOpen(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Profile Update Error:", err.response?.data);
      toast.error("Failed to update profile. Please try again.");
    }
  };

 


  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-900' : 'bg-gray-50'} transition-colors duration-500`}>
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
        theme={darkMode ? "dark" : "light"}
        className="mt-16"
      />




      <div className="flex min-h-screen">
        {/* Enhanced Sidebar - CORRECTED VERSION */}
        <motion.div
          variants={sidebarVariants}
          initial="hidden"
          animate="visible"
          className="fixed inset-y-0 left-0 w-80 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden z-50"
        >
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 -left-20 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute bottom-1/4 -right-20 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
          </div>

          {/* Header */}
          <div className="relative z-10 p-6 border-b border-white/10">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
              className="flex items-center space-x-3"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <FontAwesomeIcon icon={faDumbbell} className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  FitFlow
                </h1>
                <p className="text-xs text-gray-300">Your Fitness Journey</p>
              </div>
            </motion.div>
          </div>

          

          {/* Navigation - FIXED VERSION */}
          <div className="relative z-10 mt-8 overflow-y-auto">
            {sidebarItems.map((item, index) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                whileHover={{ x: 8 }}
                className={`mx-4 mb-2 rounded-xl transition-all duration-300 ${location.pathname === item.path
                    ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30"
                    : "hover:bg-white/5"
                  }`}
              >
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Navigating to:', item.path); // Debug log
                    navigate(item.path);
                  }}
                  className="w-full flex items-center space-x-3 p-4 text-left text-white hover:text-purple-200 transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 rounded-xl"
                >
                  <FontAwesomeIcon icon={item.icon} className="text-purple-400" />
                  <span className="font-medium">{item.text}</span>
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>






        {/* Main Content */}
        <div className="ml-80 h-screen overflow-y-auto">
          {/* Animated Background */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 bg-gradient-to-r from-white via-purple-50 to-pink-50 border-b border-gray-200/50 backdrop-blur-sm"
          >
            <div className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                    FitFlow Dashboard
                  </h1>
                  <p className="text-gray-600 mt-2">Transform your fitness journey with AI-powered insights</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full px-4 py-2 border border-purple-500/20">
                    <div className="flex items-center space-x-2">
                      <FontAwesomeIcon icon={faFire} className="text-orange-500" />
                      <span className="text-sm font-medium text-gray-700">Self Motivation</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Services Section */}
          <div className="relative z-10 p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Choose Your Service</h2>
              <p className="text-gray-600">Select from our premium AI-powered wellness services</p>
            </motion.div>

            {/* Enhanced Service Cards */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
            >
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  variants={cardVariants}
                  whileHover={{ y: -12, scale: 1.02 }}
                  onHoverStart={() => setHoveredService(index)}
                  onHoverEnd={() => setHoveredService(null)}
                  className="group relative cursor-pointer"
                  onClick={() => handleServiceClick(service.formType, service.path)}
                >
                  {/* Glow effect */}
                  <div className={`absolute -inset-1 bg-gradient-to-r ${service.gradient} rounded-3xl blur opacity-0 group-hover:opacity-20 transition duration-500`}></div>

                  {/* Main card */}
                  <div className={`relative bg-gradient-to-br ${service.bgGradient} backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-white/30 transition-all duration-500 h-full min-h-[280px] ${hoveredService === index ? service.shadowColor + ' shadow-2xl' : 'shadow-lg'}`}>
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${service.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <FontAwesomeIcon icon={service.icon} className="text-white text-2xl" />
                      </div>
                      <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: hoveredService === index ? 1 : 0, x: hoveredService === index ? 0 : 10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <FontAwesomeIcon icon={faArrowRight} className={service.accent} />
                      </motion.div>
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-purple-700 transition-colors duration-300">
                      {service.title}
                    </h3>

                    <p className="text-gray-600 text-sm leading-relaxed mb-6">
                      {service.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 bg-white/30 rounded-full px-3 py-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-xs font-medium text-gray-700">{service.stats}</span>
                      </div>
                      <FontAwesomeIcon icon={faGem} className={`${service.accent} opacity-60 group-hover:opacity-100 transition-opacity duration-300`} />
                    </div>

                    {/* Hover overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-300 pointer-events-none`}></div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Output Display */}
            <AnimatePresence>
              {(fitnessOutput || nutritionOutput) && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  className="space-y-6"
                >
                  {fitnessOutput && (
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200/50 shadow-lg">
                      <div className="flex items-center space-x-3 mb-4">
                        <FontAwesomeIcon icon={faDumbbell} className="text-blue-600 text-xl" />
                        <h3 className="text-xl font-bold text-blue-800">Fitness Recommendation</h3>
                      </div>
                      <div className="max-h-96 overflow-auto bg-white/50 p-4 rounded-xl border border-blue-200/30">
                        <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                          {JSON.stringify(fitnessOutput, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}

                  {nutritionOutput && (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200/50 shadow-lg">
                      <div className="flex items-center space-x-3 mb-4">
                        <FontAwesomeIcon icon={faAppleAlt} className="text-green-600 text-xl" />
                        <h3 className="text-xl font-bold text-green-800">Nutrition Recommendation</h3>
                      </div>
                      <div className="max-h-96 overflow-auto bg-white/50 p-4 rounded-xl border border-green-200/30">
                        <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                          {JSON.stringify(nutritionOutput, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Dashboard Component */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <FitnessNutritionDashboard />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Enhanced Modals */}
      <AnimatePresence>
        {isEditProfileModalOpen && (
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
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
            >
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FontAwesomeIcon icon={faUser} className="text-2xl" />
                    <h2 className="text-2xl font-bold">Edit Profile</h2>
                  </div>
                  <button
                    onClick={handleEditProfileClose}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-200"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                {/* Profile Picture */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-2xl overflow-hidden">
                      {editProfile.profilePic ? (
                        <img src={editProfile.profilePic} alt={editProfile.name} className="w-full h-full object-cover" />
                      ) : (
                        editProfile.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-purple-700 transition-colors duration-200">
                      <FontAwesomeIcon icon={faCamera} className="text-white text-sm" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePicChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <div className="relative">
                      <FontAwesomeIcon icon={faUser} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
                      <input
                        type="text"
                        name="name"
                        value={editProfile.name}
                        onChange={handleEditProfileChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        placeholder="Your name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                    <div className="relative">
                      <FontAwesomeIcon icon={faBirthdayCake} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
                      <input
                        type="number"
                        name="age"
                        value={editProfile.age}
                        onChange={handleEditProfileChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        placeholder="Your age"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
                    <div className="relative">
                      <FontAwesomeIcon icon={faRulerVertical} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
                      <input
                        type="number"
                        name="height"
                        value={editProfile.height}
                        onChange={handleEditProfileChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        placeholder="Height in cm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                    <div className="relative">
                      <FontAwesomeIcon icon={faWeightScale} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
                      <input
                        type="number"
                        name="weight"
                        value={editProfile.weight}
                        onChange={handleEditProfileChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        placeholder="Weight in kg"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <div className="relative">
                      <FontAwesomeIcon icon={faVenusMars} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
                      <select
                        name="gender"
                        value={editProfile.gender}
                        onChange={handleEditProfileChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 appearance-none"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleEditProfileClose}
                    className="flex-1 py-3 px-6 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEditProfileSubmit}
                    className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <FontAwesomeIcon icon={faSave} />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Services;
