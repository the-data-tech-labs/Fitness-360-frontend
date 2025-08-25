import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDumbbell,
  faAppleAlt,
  faOm,
  faBrain,
  faQuestionCircle,
  faPlus,
  faArrowLeft,
  faUsers,
  faComments
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";

const categories = [
  { 
    id: "all", 
    name: "All Posts", 
    icon: faComments,
    color: "text-violet-300",
    activeColor: "text-white",
    bgColor: "bg-violet-900/20",
    activeBg: "bg-violet-600"
  },
  { 
    id: "fitness", 
    name: "Fitness", 
    icon: faDumbbell,
    color: "text-purple-300",
    activeColor: "text-white",
    bgColor: "bg-purple-900/20",
    activeBg: "bg-purple-600"
  },
  { 
    id: "nutrition", 
    name: "Nutrition", 
    icon: faAppleAlt,
    color: "text-indigo-300",
    activeColor: "text-white",
    bgColor: "bg-indigo-900/20",
    activeBg: "bg-indigo-600"
  },
  { 
    id: "yoga", 
    name: "Yoga", 
    icon: faOm,
    color: "text-pink-300",
    activeColor: "text-white",
    bgColor: "bg-pink-900/20",
    activeBg: "bg-pink-600"
  },
  { 
    id: "mental_health", 
    name: "Mental Health", 
    icon: faBrain,
    color: "text-blue-300",
    activeColor: "text-white",
    bgColor: "bg-blue-900/20",
    activeBg: "bg-blue-600"
  },
  { 
    id: "qna", 
    name: "Q&A", 
    icon: faQuestionCircle,
    color: "text-teal-300",
    activeColor: "text-white",
    bgColor: "bg-teal-900/20",
    activeBg: "bg-teal-600"
  },
];

const Sidebar = ({ onCategorySelect, onCreatePost }) => {
  const [activeCategory, setActiveCategory] = useState("all");
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    onCategorySelect(categoryId);
  };

  const handleGoBack = () => {
    navigate("/services");
  };

  const containerVariants = {
    hidden: { x: -300, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-[400px] mt-1 bg-gradient-to-b from-slate-900 via-violet-900 to-slate-900 relative z-30 shadow-2xl border-r border-violet-800/30 flex flex-col min-h-screen"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 -left-10 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 -right-10 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="relative z-10 bg-gradient-to-r from-violet-800 to-purple-800 px-6 py-6 shadow-lg border-b border-violet-700/30"
      >
        <div className="flex items-center justify-between">
          {/* Back Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGoBack}
            className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200 border border-white/20"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-sm" />
          </motion.button>

          {/* Title */}
          <div className="text-center flex-1">
            <h2 className="text-xl font-semibold text-white">Categories</h2>
            <p className="text-violet-200 text-xs">Choose your topic</p>
          </div>

          {/* Activity Badge */}
          <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20">
            <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </motion.div>

      {/* Categories List */}
      <div className="flex-1 py-4 px-4 space-y-2">
        <AnimatePresence>
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              variants={itemVariants}
              whileHover={{ scale: 1.01, x: 2 }}
              whileTap={{ scale: 0.99 }}
              className="relative"
            >
              <button
                onClick={() => handleCategoryClick(category.id)}
                className={`w-full p-4 rounded-xl transition-all duration-200 flex items-center space-x-4 group ${
                  activeCategory === category.id
                    ? `${category.activeBg} shadow-lg shadow-violet-500/25`
                    : `${category.bgColor} hover:bg-violet-800/30 border border-violet-700/30 hover:border-violet-600/50`
                }`}
              >
                {/* Icon */}
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
                  activeCategory === category.id
                    ? "bg-white/20 backdrop-blur-sm"
                    : "bg-violet-800/50 border border-violet-600/30"
                }`}>
                  <FontAwesomeIcon 
                    icon={category.icon} 
                    className={`text-base ${
                      activeCategory === category.id ? category.activeColor : category.color
                    }`}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 text-left">
                  <h3 className={`font-medium text-base transition-colors duration-200 ${
                    activeCategory === category.id ? "text-white" : "text-violet-100"
                  }`}>
                    {category.name}
                  </h3>
                </div>

                {/* Active indicator */}
                {activeCategory === category.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 bg-white rounded-full"
                  />
                )}

                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-xl bg-violet-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Divider */}
      <div className="px-6 relative z-10">
        <div className="h-px bg-gradient-to-r from-transparent via-violet-600/50 to-transparent"></div>
      </div>

      {/* Create Post Button */}
      <motion.div
        variants={itemVariants}
        className="relative z-10 p-6"
      >
        <motion.button
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCreatePost}
          className="w-full p-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl hover:shadow-violet-500/25 transition-all duration-200 flex items-center justify-center space-x-3 group relative overflow-hidden"
        >
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-violet-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          
          {/* Content */}
          <div className="relative z-10 flex items-center space-x-3">
            <div className="w-6 h-6 bg-white/20 rounded-md flex items-center justify-center group-hover:rotate-90 transition-transform duration-300">
              <FontAwesomeIcon icon={faPlus} className="text-sm" />
            </div>
            <span className="text-base font-medium">Create New Post</span>
          </div>

          {/* Ripple effect */}
          <div className="absolute inset-0 bg-white/10 scale-0 group-hover:scale-100 rounded-xl transition-transform duration-500"></div>
        </motion.button>

        {/* Community stats */}
        <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-violet-300">
          <div className="flex items-center space-x-1">
            <FontAwesomeIcon icon={faUsers} className="text-violet-400" />
            <span>2.5K members</span>
          </div>
          <div className="w-1 h-1 bg-violet-500 rounded-full"></div>
          <div className="flex items-center space-x-1">
            <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse"></div>
            <span>Active</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Sidebar;
