import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDumbbell, faAppleAlt, faChartLine, faFire, faBullseye,
  faCalendarAlt, faSpinner, faExclamationTriangle, faPlus,
  faHeart, faBolt, faWeight, faUtensils, faClock, faStopwatch,
  faRulerVertical, faGem, faStar
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';







const FitnessNutritionDashboard = ({ userData }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const backendUrl = process.env.REACT_APP_BACKEND_URL

  

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        const token = localStorage.getItem('access_token');
        
        const response = await axios.get(`${backendUrl}/highlights/analytics/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000,
        });

        if (response.data.status === 'success') {
          setDashboardData(response.data.data);
          setError(null);
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError('Failed to load dashboard data');
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [backendUrl]);


  // Enhanced color palette with dark violet theme
  const CHART_COLORS = ['#8b5cf6', '#a855f7', '#c084fc', '#d946ef', '#e879f9', '#fbbf24'];

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/95 backdrop-blur-md border border-violet-500/30 rounded-xl p-4 shadow-2xl shadow-violet-500/20">
          <p className="text-violet-200 font-medium">{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-white" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-violet-900 to-purple-900 flex items-center justify-center relative overflow-hidden">
        {/* Enhanced loading background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-40 w-80 h-80 bg-violet-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-ping"></div>
        </div>

        <div className="text-center relative z-10">
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-violet-500/50 animate-pulse">
              <FontAwesomeIcon icon={faSpinner} className="text-white text-3xl animate-spin" />
            </div>
            <div className="absolute -inset-4 bg-gradient-to-r from-violet-600 to-purple-600 rounded-3xl blur-xl opacity-30 animate-pulse"></div>
          </div>
          <h3 className="text-3xl font-bold bg-gradient-to-r from-violet-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent mb-4">
            Loading Your Dashboard
          </h3>
          <p className="text-violet-200 text-lg">Analyzing your health journey...</p>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-violet-900 to-purple-900 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-40 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-800/80 backdrop-blur-xl rounded-3xl p-10 border border-violet-500/30 shadow-2xl shadow-violet-500/20 text-center max-w-lg relative z-10"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-yellow-500/30">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-white text-3xl" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">No Data Available</h3>
          <p className="text-gray-300 mb-8 leading-relaxed">
            Create your first fitness or nutrition plan to see your personalized dashboard with beautiful analytics.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => window.location.href = '/fitness'}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 text-white rounded-2xl font-semibold hover:from-blue-700 hover:via-violet-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-3 shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105"
            >
              <FontAwesomeIcon icon={faDumbbell} className="text-lg" />
              <span>Create Fitness Plan</span>
            </button>
            <button
              onClick={() => window.location.href = '/nutrition'}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white rounded-2xl font-semibold hover:from-emerald-700 hover:via-green-700 hover:to-teal-700 transition-all duration-300 flex items-center justify-center space-x-3 shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105"
            >
              <FontAwesomeIcon icon={faAppleAlt} className="text-lg" />
              <span>Create Nutrition Plan</span>
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const { user_profile, fitness_analytics, nutrition_analytics } = dashboardData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-violet-900 to-purple-900 relative overflow-hidden">
      <ToastContainer position="top-right" autoClose={5000} theme="dark" className="z-[9999] mt-20" />

      {/* Enhanced animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-40 w-80 h-80 bg-violet-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-ping"></div>
        <div className="absolute top-3/4 left-1/4 w-48 h-48 bg-fuchsia-500/10 rounded-full blur-2xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-8">
            <div className="relative">
              <div className="w-28 h-28 bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-violet-500/50">
                <FontAwesomeIcon icon={faChartLine} className="text-white text-4xl" />
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-violet-600 to-purple-600 rounded-3xl blur-xl opacity-30 animate-pulse"></div>
              <div className="absolute top-2 right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faStar} className="text-white text-xs" />
              </div>
            </div>
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-violet-200 via-purple-200 to-indigo-200 bg-clip-text text-transparent mb-6">
            Your Health Dashboard
          </h1>
          <p className="text-xl text-violet-200 max-w-4xl mx-auto leading-relaxed">
            Comprehensive insights from your personalized fitness and nutrition journey with advanced analytics
          </p>
        </motion.div>

        {/* Enhanced User Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
        >
          {[
            {
              title: "Total Fitness Plans",
              value: user_profile.total_fitness_plans,
              icon: faDumbbell,
              gradient: "from-violet-600 via-purple-600 to-indigo-700",
              iconColor: "text-violet-300",
              shadowColor: "shadow-violet-500/30"
            },
            {
              title: "Total Nutrition Plans",
              value: user_profile.total_nutrition_plans,
              icon: faAppleAlt,
              gradient: "from-emerald-600 via-green-600 to-teal-700",
              iconColor: "text-emerald-300",
              shadowColor: "shadow-emerald-500/30"
            },
            {
              title: "Member Since",
              value: user_profile.member_since,
              icon: faCalendarAlt,
              gradient: "from-blue-600 via-indigo-600 to-violet-700",
              iconColor: "text-blue-300",
              shadowColor: "shadow-blue-500/30"
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`bg-gradient-to-br ${stat.gradient} rounded-3xl p-8 border border-white/10 shadow-2xl ${stat.shadowColor} backdrop-blur-sm hover:shadow-2xl hover:border-white/20 transition-all duration-300 relative overflow-hidden`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <FontAwesomeIcon icon={stat.icon} className={`${stat.iconColor} text-2xl`} />
                  </div>
                  <FontAwesomeIcon icon={faGem} className="text-white/30 text-lg" />
                </div>
                <p className="text-white/80 text-sm font-medium mb-2">{stat.title}</p>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Fitness Analytics Section */}
        {fitness_analytics ? (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <div className="flex items-center mb-10">
              <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-violet-500/30">
                <FontAwesomeIcon icon={faDumbbell} className="text-white text-xl" />
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-violet-200 to-purple-200 bg-clip-text text-transparent">
                Fitness Analytics
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

              {/* Enhanced Workout Overview Stats */}
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-gray-800/60 backdrop-blur-xl rounded-3xl p-8 border border-violet-500/30 shadow-2xl shadow-violet-500/20 hover:shadow-violet-500/40 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-full -translate-y-20 translate-x-20"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <FontAwesomeIcon icon={faChartLine} className="text-violet-400 mr-3" />
                    Workout Overview
                  </h3>
                  <div className="grid grid-cols-2 gap-6">
                    {[
                      { label: "Plan Duration", value: fitness_analytics.workout_overview.plan_duration, icon: faCalendarAlt },
                      { label: "Weekly Sessions", value: fitness_analytics.workout_overview.weekly_frequency, icon: faStopwatch },
                      { label: "Session Duration", value: `${fitness_analytics.workout_overview.session_duration} min`, icon: faClock },
                      { label: "Primary Focus", value: fitness_analytics.workout_overview.primary_focus, icon: faBullseye }
                    ].map((item, index) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gradient-to-br from-violet-600/20 to-purple-600/20 rounded-2xl p-6 text-center backdrop-blur-sm border border-violet-500/20 hover:border-violet-400/30 transition-all duration-300"
                      >
                        <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-violet-500/30">
                          <FontAwesomeIcon icon={item.icon} className="text-white" />
                        </div>
                        <p className="text-xs text-violet-300 mb-1 font-medium">{item.label}</p>
                        <p className="text-sm font-bold text-white">{item.value}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Enhanced Weekly Schedule */}
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-gray-800/60 backdrop-blur-xl rounded-3xl p-8 border border-indigo-500/30 shadow-2xl shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all duration-300"
              >
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <FontAwesomeIcon icon={faCalendarAlt} className="text-indigo-400 mr-3" />
                  Weekly Schedule
                </h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={fitness_analytics.weekly_schedule}>
                    <defs>
                      <linearGradient id="barGradient1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.3} />
                      </linearGradient>
                      <linearGradient id="barGradient2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#a855f7" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.3} />
                    <XAxis
                      dataKey="day"
                      stroke="#9ca3af"
                      fontSize={12}
                      tick={{ fill: '#d1d5db' }}
                    />
                    <YAxis
                      stroke="#9ca3af"
                      fontSize={12}
                      tick={{ fill: '#d1d5db' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      wrapperStyle={{ color: '#d1d5db' }}
                    />
                    <Bar
                      dataKey="duration"
                      fill="url(#barGradient1)"
                      name="Duration (min)"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="exercise_count"
                      fill="url(#barGradient2)"
                      name="Exercises"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Enhanced Exercise Categories */}
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-gray-800/60 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30 shadow-2xl shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300"
              >
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <FontAwesomeIcon icon={faBolt} className="text-yellow-400 mr-3" />
                  Exercise Categories
                </h3>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <defs>
                      {CHART_COLORS.map((color, index) => (
                        <linearGradient key={index} id={`pieGradient${index}`} x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor={color} stopOpacity={0.8} />
                          <stop offset="100%" stopColor={color} stopOpacity={0.4} />
                        </linearGradient>
                      ))}
                    </defs>
                    <Pie
                      data={Object.entries(fitness_analytics.exercise_categories).map(([key, value], index) => ({
                        name: key.charAt(0).toUpperCase() + key.slice(1),
                        value: value,
                        fill: `url(#pieGradient${index % CHART_COLORS.length})`
                      }))}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={110}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {Object.entries(fitness_analytics.exercise_categories).map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={`url(#pieGradient${index % CHART_COLORS.length})`}
                          stroke="#1f2937"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      wrapperStyle={{
                        color: '#d1d5db',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Enhanced Muscle Groups */}
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-gray-800/60 backdrop-blur-xl rounded-3xl p-8 border border-fuchsia-500/30 shadow-2xl shadow-fuchsia-500/20 hover:shadow-fuchsia-500/40 transition-all duration-300"
              >
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <FontAwesomeIcon icon={faWeight} className="text-fuchsia-400 mr-3" />
                  Target Muscle Groups
                </h3>
                <div className="space-y-5">
                  {Object.entries(fitness_analytics.muscle_groups).slice(0, 6).map(([muscle, count], index) => (
                    <motion.div
                      key={muscle}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-200 capitalize font-medium">{muscle}</span>
                        <span className="text-white font-bold text-lg">{count}</span>
                      </div>
                      <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden backdrop-blur-sm">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${Math.min((count / Math.max(...Object.values(fitness_analytics.muscle_groups))) * 100, 100)}%`
                          }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          className="bg-gradient-to-r from-fuchsia-500 via-purple-500 to-violet-500 h-full rounded-full shadow-lg shadow-fuchsia-500/30"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/60 backdrop-blur-xl rounded-3xl p-12 border border-violet-500/30 shadow-2xl shadow-violet-500/20 text-center mb-16 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-500/5"></div>
            <div className="relative z-10">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-violet-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/30">
                <FontAwesomeIcon icon={faDumbbell} className="text-white text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">No Fitness Data</h3>
              <p className="text-gray-300 mb-8 text-lg">Create a fitness plan to see your workout analytics here.</p>
              <button
                onClick={() => window.location.href = '/fitness'}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 text-white rounded-2xl font-semibold hover:from-blue-700 hover:via-violet-700 hover:to-purple-700 transition-all duration-300 flex items-center space-x-3 mx-auto shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105"
              >
                <FontAwesomeIcon icon={faPlus} className="text-lg" />
                <span>Create Fitness Plan</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* Enhanced Nutrition Analytics Section */}
        {nutrition_analytics ? (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <div className="flex items-center mb-10">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-emerald-500/30">
                <FontAwesomeIcon icon={faAppleAlt} className="text-white text-xl" />
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-200 to-green-200 bg-clip-text text-transparent">
                Nutrition Analytics
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

              {/* Enhanced Daily Nutrition Overview */}
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-gray-800/60 backdrop-blur-xl rounded-3xl p-8 border border-emerald-500/30 shadow-2xl shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-full -translate-y-20 translate-x-20"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <FontAwesomeIcon icon={faUtensils} className="text-emerald-400 mr-3" />
                    Daily Nutrition Target
                  </h3>
                  <div className="grid grid-cols-2 gap-6">
                    {[
                      { label: "Calories", value: nutrition_analytics.daily_nutrition.total_calories, icon: faFire, color: "from-orange-500 to-red-500" },
                      { label: "Protein", value: `${nutrition_analytics.daily_nutrition.protein_grams}g`, icon: faWeight, color: "from-red-500 to-pink-500" },
                      { label: "Carbs", value: `${nutrition_analytics.daily_nutrition.carbs_grams}g`, icon: faAppleAlt, color: "from-blue-500 to-indigo-500" },
                      { label: "Fats", value: `${nutrition_analytics.daily_nutrition.fats_grams}g`, icon: faHeart, color: "from-yellow-500 to-orange-500" }
                    ].map((item, index) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gradient-to-br from-emerald-600/20 to-green-600/20 rounded-2xl p-6 text-center backdrop-blur-sm border border-emerald-500/20 hover:border-emerald-400/30 transition-all duration-300"
                      >
                        <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                          <FontAwesomeIcon icon={item.icon} className="text-white" />
                        </div>
                        <p className="text-xs text-emerald-300 mb-1 font-medium">{item.label}</p>
                        <p className="text-lg font-bold text-white">{item.value}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Enhanced Macronutrient Distribution */}
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-gray-800/60 backdrop-blur-xl rounded-3xl p-8 border border-yellow-500/30 shadow-2xl shadow-yellow-500/20 hover:shadow-yellow-500/40 transition-all duration-300"
              >
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <FontAwesomeIcon icon={faChartLine} className="text-yellow-400 mr-3" />
                  Macronutrient Distribution
                </h3>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <defs>
                      <linearGradient id="proteinGradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#f72585" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#f72585" stopOpacity={0.4} />
                      </linearGradient>
                      <linearGradient id="carbsGradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.4} />
                      </linearGradient>
                      <linearGradient id="fatsGradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#ffb700" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#ffb700" stopOpacity={0.4} />
                      </linearGradient>
                    </defs>
                    <Pie
                      data={[
                        { name: 'Protein', value: nutrition_analytics.macronutrient_ratios.protein_percentage, fill: 'url(#proteinGradient)' },
                        { name: 'Carbs', value: nutrition_analytics.macronutrient_ratios.carbs_percentage, fill: 'url(#carbsGradient)' },
                        { name: 'Fats', value: nutrition_analytics.macronutrient_ratios.fats_percentage, fill: 'url(#fatsGradient)' }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={110}
                      paddingAngle={2}
                      dataKey="value"
                    />
                    <Tooltip
                      content={<CustomTooltip />}
                      formatter={(value) => [`${value}%`, 'Percentage']}
                    />
                    <Legend
                      wrapperStyle={{
                        color: '#d1d5db',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Enhanced Meal Distribution */}
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-gray-800/60 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30 shadow-2xl shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300"
              >
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <FontAwesomeIcon icon={faClock} className="text-purple-400 mr-3" />
                  Weekly Meal Distribution
                </h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={Object.entries(nutrition_analytics.meal_distribution).map(([meal, count]) => ({
                    meal: meal.charAt(0).toUpperCase() + meal.slice(1),
                    count
                  }))}>
                    <defs>
                      <linearGradient id="mealGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#06d6a0" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#06d6a0" stopOpacity={0.3} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.3} />
                    <XAxis
                      dataKey="meal"
                      stroke="#9ca3af"
                      fontSize={12}
                      tick={{ fill: '#d1d5db' }}
                    />
                    <YAxis
                      stroke="#9ca3af"
                      fontSize={12}
                      tick={{ fill: '#d1d5db' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="count"
                      fill="url(#mealGradient)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Enhanced BMI Information */}
              {nutrition_analytics.bmi_info && (
                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-gray-800/60 backdrop-blur-xl rounded-3xl p-8 border border-blue-500/30 shadow-2xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                      <FontAwesomeIcon icon={faRulerVertical} className="text-blue-400 mr-3" />
                      Health Metrics
                    </h3>
                    <div className="space-y-6">
                      {[
                        { label: "Current BMI", value: nutrition_analytics.bmi_info.current_bmi, color: "text-blue-400" },
                        { label: "BMI Category", value: nutrition_analytics.bmi_info.bmi_category, color: "text-emerald-400" },
                        { label: "Target Weight", value: nutrition_analytics.bmi_info.target_weight_range, color: "text-violet-400" }
                      ].map((item, index) => (
                        <motion.div
                          key={item.label}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-2xl p-6 backdrop-blur-sm border border-blue-500/20 hover:border-blue-400/30 transition-all duration-300"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-gray-200 font-medium">{item.label}</span>
                            <span className={`${item.color} font-bold text-lg`}>{item.value}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/60 backdrop-blur-xl rounded-3xl p-12 border border-emerald-500/30 shadow-2xl shadow-emerald-500/20 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5"></div>
            <div className="relative z-10">
              <div className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-green-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/30">
                <FontAwesomeIcon icon={faAppleAlt} className="text-white text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">No Nutrition Data</h3>
              <p className="text-gray-300 mb-8 text-lg">Create a nutrition plan to see your dietary analytics here.</p>
              <button
                onClick={() => window.location.href = '/nutrition'}
                className="px-8 py-4 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white rounded-2xl font-semibold hover:from-emerald-700 hover:via-green-700 hover:to-teal-700 transition-all duration-300 flex items-center space-x-3 mx-auto shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105"
              >
                <FontAwesomeIcon icon={faPlus} className="text-lg" />
                <span>Create Nutrition Plan</span>
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FitnessNutritionDashboard;
