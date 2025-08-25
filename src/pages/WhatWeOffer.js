import  { useState } from "react";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDumbbell,
  faAppleAlt,
  faChartLine,
  faHeart,
  faArrowRight,
  faStar,
  faGem
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

const WhatWeOffer = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();
  const services = [
    {
      title: "Personalized Fitness Plans",
      description: "AI-powered fitness programs tailored specifically to your body type, goals, and lifestyle for maximum results.",
      icon: faDumbbell,
      gradient: "from-blue-500 via-purple-500 to-pink-500",
      bgGradient: "from-blue-500/10 via-purple-500/10 to-pink-500/10",
      shadowColor: "shadow-blue-500/25",
      stats: "10K+ Plans Created"
    },
    {
      title: "Expert Nutrition Guidance",
      description: "Science-backed nutrition strategies with meal planning and macro tracking to fuel your transformation journey.",
      icon: faAppleAlt,
      gradient: "from-green-500 via-emerald-500 to-teal-500",
      bgGradient: "from-green-500/10 via-emerald-500/10 to-teal-500/10",
      shadowColor: "shadow-green-500/25",
      stats: "98% Success Rate"
    },
    {
      title: "Advanced Progress Tracking",
      description: "Real-time analytics and AI insights to monitor your progress with detailed reports and milestone celebrations.",
      icon: faChartLine,
      gradient: "from-orange-500 via-red-500 to-pink-500",
      bgGradient: "from-orange-500/10 via-red-500/10 to-pink-500/10",
      shadowColor: "shadow-orange-500/25",
      stats: "50+ Metrics Tracked"
    },
    {
      title: "24/7 Community Support",
      description: "Join a thriving community of fitness enthusiasts with expert coaches available around the clock for guidance.",
      icon: faHeart,
      gradient: "from-pink-500 via-rose-500 to-red-500",
      bgGradient: "from-pink-500/10 via-rose-500/10 to-red-500/10",
      shadowColor: "shadow-pink-500/25",
      stats: "50K+ Members"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 60, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-ping"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side: Enhanced Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -100, rotateY: -15 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 1, type: "spring", stiffness: 80 }}
            className="relative"
          >
            <div className="relative group">
              {/* Glowing border effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
              
              {/* Main image container */}
              <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl overflow-hidden">
                <img
                  src="WhatWeOffer3.png"
                  alt="Fitness Transformation"
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Overlay with stats */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center justify-between">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl px-4 py-2 border border-white/20">
                      <div className="flex items-center space-x-2">
                        <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
                        <span className="text-white font-semibold">4.9/5 Rating</span>
                      </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl px-4 py-2 border border-white/20">
                      <div className="flex items-center space-x-2">
                        <FontAwesomeIcon icon={faGem} className="text-purple-400" />
                        <span className="text-white font-semibold">100K+ Users</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25"
            >
              <FontAwesomeIcon icon={faDumbbell} className="text-white text-xl" />
            </motion.div>
          </motion.div>

          {/* Right Side: Enhanced Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Header Section */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full px-4 py-2 border border-purple-500/20">
                <FontAwesomeIcon icon={faGem} className="text-purple-400" />
                <span className="text-purple-300 font-medium">Premium Features</span>
              </div>
              
              <h2 className="text-5xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                  What We
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  Offer
                </span>
              </h2>
              
              <p className="text-xl text-gray-300 leading-relaxed max-w-xl">
                Transform your fitness journey with our{" "}
                <span className="text-purple-400 font-semibold">AI-powered platform</span> that delivers
                personalized plans, expert guidance, and a supportive community to help you achieve extraordinary results.
              </p>
            </motion.div>

            {/* Services Grid */}
            <motion.div variants={itemVariants} className="grid sm:grid-cols-2 gap-6">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  onHoverStart={() => setHoveredCard(index)}
                  onHoverEnd={() => setHoveredCard(null)}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative"
                >
                  {/* Card glow effect */}
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${service.gradient} rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500`}></div>
                  
                  {/* Main card */}
                  <div className={`relative bg-gradient-to-br ${service.bgGradient} backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-500 ${hoveredCard === index ? service.shadowColor + ' shadow-xl' : ''} h-full`}>
                    {/* Icon and title */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${service.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <FontAwesomeIcon
                          icon={service.icon}
                          className="text-white text-xl"
                        />
                      </div>
                      <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: hoveredCard === index ? 1 : 0, x: hoveredCard === index ? 0 : 10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <FontAwesomeIcon icon={faArrowRight} className="text-purple-400" />
                      </motion.div>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-200 transition-colors duration-300">
                      {service.title}
                    </h3>
                    
                    {/* Stats badge */}
                    <div className="inline-flex items-center space-x-2 bg-white/5 rounded-full px-3 py-1 mb-4">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-gray-300 font-medium">{service.stats}</span>
                    </div>

                    {/* Description with reveal effect */}
                    <div className="overflow-hidden">
                      <motion.p
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ 
                          height: hoveredCard === index ? "auto" : 0,
                          opacity: hoveredCard === index ? 1 : 0
                        }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="text-gray-300 text-sm leading-relaxed"
                      >
                        {service.description}
                      </motion.p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Enhanced CTA Section */}
            <motion.div variants={itemVariants} className="pt-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl font-bold text-white shadow-lg hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <span onClick={()=>navigate('/services')}>Start Your Journey</span>
                    <FontAwesomeIcon 
                      icon={faArrowRight} 
                      className="group-hover:translate-x-1 transition-transform duration-300" 
                    />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-pink-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center px-8 py-4 bg-white/5 backdrop-blur-sm rounded-2xl font-bold text-white border border-white/20 hover:bg-white/10 hover:border-white/30 transition-all duration-300"
                >
                  <span className="flex items-center space-x-2">
                    <span>Learn More</span>
                    <FontAwesomeIcon icon={faGem} className="text-purple-400" />
                  </span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent"></div>
    </div>
  );
};

export default WhatWeOffer;
