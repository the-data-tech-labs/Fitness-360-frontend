import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAppleAlt,
  faSearch,
  faFilter,
  faTrash,
  faEye,
  faCalendarAlt,
  faClock,
  faChartBar,
  faBullseye,
  faSpinner,
  faExclamationTriangle,
  faChevronLeft,
  faChevronRight,
  faTimes,
  faRefresh,
  faAward,
  faUtensils,
  faLeaf,
} from '@fortawesome/free-solid-svg-icons';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

const NutritionRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState('all');

  // Modal states
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  // ✅ Fixed: Get detail function with complete axios config
  const getNutritionRecommendationDetail = async (recommendationId) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`${backendUrl}/nutrition/recommendations/${recommendationId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 10000
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching nutrition recommendation detail:', error);
      throw error;
    }
  };

  // ✅ Fixed: Delete function with complete axios config
  const deleteNutritionRecommendation = async (recommendationId) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.delete(`${backendUrl}/nutrition/recommendations/${recommendationId}/delete/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 10000
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting nutrition recommendation:', error);
      throw error;
    }
  };

  // ✅ Fixed: Remove loading from dependencies to prevent infinite loop
  const fetchRecommendations = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem('access_token');

    try {
      const response = await axios.get(`${backendUrl}/nutrition/recommendations/`, {
        params: {
          page: currentPage,
          page_size: pageSize,
          search: searchQuery,
          filter: filterBy
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 10000
      });

      if (response.data.status === 'success') {
        setRecommendations(response.data.data.recommendations);
        setPagination(response.data.data.pagination);
        setFilters(response.data.data.filters);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      toast.error('Failed to fetch nutrition recommendations');
    } finally {
      setLoading(false);
    }
  }, [backendUrl, currentPage, pageSize, searchQuery, filterBy]);

  // ✅ Fixed: useEffect with proper dependencies
  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  // ✅ Fixed: Delete handler
  const handleDelete = async (recommendationId) => {
    try {
      setDeleting(recommendationId);
      await deleteNutritionRecommendation(recommendationId);
      toast.success('Nutrition plan deleted successfully');
      fetchRecommendations();
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting recommendation:', error);
      toast.error('Failed to delete nutrition plan');
    } finally {
      setDeleting(null);
    }
  };

  // ✅ Fixed: View detail handler
  const handleViewDetail = async (recommendationId) => {
    try {
      const response = await getNutritionRecommendationDetail(recommendationId);
      if (response.status === 'success') {
        setSelectedRecommendation(response.data);
        setShowDetailModal(true);
      }
    } catch (error) {
      console.error('Error fetching recommendation detail:', error);
      toast.error('Failed to load nutrition plan details');
    }
  };

  // ✅ Fixed: Search handler - only update state, don't call API directly
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setCurrentPage(1);
    // API will be called automatically via useEffect
  };

  // Enhanced table-based nutrition detail renderer
  const renderNutritionDetail = (data) => {
    if (!data) return null;

    // Helper function to render any object as a table
    const renderTable = (tableData, title = "", level = 0) => {
      const bgColor = level === 0 ? 'bg-emerald-800/50' : level === 1 ? 'bg-emerald-700/30' : 'bg-emerald-600/20';
      const textColor = level === 0 ? 'text-emerald-100' : level === 1 ? 'text-emerald-200' : 'text-emerald-300';

      return (
        <div className="mb-6">
          {title && (
            <h4 className="text-lg font-bold text-emerald-300 mb-3 capitalize flex items-center">
              <FontAwesomeIcon icon={faUtensils} className="mr-2" />
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
                            <div className="space-y-2">
                              {value.map((item, i) => (
                                <div key={i} className="bg-emerald-900/30 rounded p-2">
                                  {typeof item === 'object' ? (
                                    <div className="space-y-1">
                                      {Object.entries(item).map(([itemKey, itemValue]) => (
                                        <div key={itemKey} className="flex justify-between">
                                          <span className="text-emerald-400 text-sm">{itemKey.replace(/_/g, ' ')}:</span>
                                          <span className="text-emerald-100 text-sm">
                                            {Array.isArray(itemValue) ? itemValue.join(', ') : itemValue}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <span className="text-emerald-200">{item}</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {Object.entries(value).map(([subKey, subValue]) => (
                                <div key={subKey} className="bg-emerald-900/30 rounded p-2">
                                  <div className="flex justify-between items-start">
                                    <span className="text-emerald-400 text-sm font-medium">
                                      {subKey.replace(/_/g, ' ')}:
                                    </span>
                                    <span className="text-emerald-100 text-sm text-right max-w-xs">
                                      {typeof subValue === 'object' && subValue !== null ? (
                                        Array.isArray(subValue) ? (
                                          <div className="space-y-1">
                                            {subValue.map((item, idx) => (
                                              <div key={idx} className="text-xs bg-emerald-800/50 rounded px-2 py-1">
                                                {typeof item === 'object' ? JSON.stringify(item) : item}
                                              </div>
                                            ))}
                                          </div>
                                        ) : (
                                          <div className="space-y-1">
                                            {Object.entries(subValue).map(([nestedKey, nestedValue]) => (
                                              <div key={nestedKey} className="text-xs">
                                                <span className="text-emerald-300">{nestedKey}:</span> {nestedValue}
                                              </div>
                                            ))}
                                          </div>
                                        )
                                      ) : (
                                        subValue
                                      )}
                                    </span>
                                  </div>
                                </div>
                              ))}
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

    // Special renderer for meal plans
    const renderMealPlan = (mealPlan) => {
      if (!mealPlan || !mealPlan.sample_day_menu) return null;

      return (
        <div className="mb-6">
          <h4 className="text-lg font-bold text-emerald-300 mb-3 flex items-center">
            <FontAwesomeIcon icon={faUtensils} className="mr-2" />
            Daily Meal Schedule
          </h4>

          {/* Daily Structure Overview */}
          {mealPlan.daily_structure && (
            <div className="mb-4 bg-emerald-800/30 rounded-lg p-4">
              <h5 className="text-emerald-300 font-semibold mb-2">Daily Structure</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {Object.entries(mealPlan.daily_structure).map(([key, value]) => (
                  <div key={key} className="bg-emerald-900/50 rounded p-2">
                    <span className="text-emerald-400 text-sm">{key.replace(/_/g, ' ')}:</span>
                    <span className="text-emerald-100 text-sm ml-2">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Meal Schedule */}
          <div className="space-y-4">
            {Object.entries(mealPlan.sample_day_menu).map(([mealName, mealData]) => (
              <div key={mealName} className="bg-emerald-800/50 rounded-lg overflow-hidden">
                <div className="bg-emerald-700/50 px-4 py-2">
                  <h5 className="text-emerald-100 font-bold capitalize flex items-center">
                    <FontAwesomeIcon icon={faUtensils} className="mr-2 text-emerald-300" />
                    {mealName.replace(/_/g, ' ')}
                    {mealData.time && (
                      <span className="ml-auto text-emerald-300 text-sm">
                        <FontAwesomeIcon icon={faClock} className="mr-1" />
                        {mealData.time}
                      </span>
                    )}
                  </h5>
                </div>

                <div className="p-4">
                  <table className="w-full">
                    <tbody>
                      {Object.entries(mealData).map(([key, value]) => {
                        if (key === 'time') return null; // Already displayed in header

                        return (
                          <tr key={key} className="border-b border-emerald-600/20">
                            <td className="py-2 pr-4 text-emerald-400 font-medium w-1/3">
                              {key.replace(/_/g, ' ').charAt(0).toUpperCase() + key.replace(/_/g, ' ').slice(1)}:
                            </td>
                            <td className="py-2 text-emerald-100">
                              {Array.isArray(value) ? (
                                <div className="flex flex-wrap gap-1">
                                  {value.map((item, idx) => (
                                    <span key={idx} className="bg-emerald-900/50 rounded px-2 py-1 text-xs">
                                      {item}
                                    </span>
                                  ))}
                                </div>
                              ) : typeof value === 'object' && value !== null ? (
                                <div className="space-y-1">
                                  {Object.entries(value).map(([subKey, subValue]) => (
                                    <div key={subKey} className="text-sm">
                                      <span className="text-emerald-300">{subKey}:</span> {subValue}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                value
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    };

    // Special renderer for food recommendations
    const renderFoodRecommendations = (foodRecs) => {
      if (!foodRecs) return null;

      return (
        <div className="mb-6">
          <h4 className="text-lg font-bold text-emerald-300 mb-3 flex items-center">
            <FontAwesomeIcon icon={faAppleAlt} className="mr-2" />
            Food Recommendations
          </h4>

          {/* Power Foods */}
          {foodRecs.power_foods && (
            <div className="mb-4">
              <h5 className="text-emerald-300 font-semibold mb-2">Recommended Power Foods</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {foodRecs.power_foods.map((food, index) => (
                  <div key={index} className="bg-emerald-800/40 rounded-lg p-3">
                    <h6 className="text-emerald-200 font-bold mb-2">{food.food_item}</h6>
                    <table className="w-full text-sm">
                      <tbody>
                        {Object.entries(food).map(([key, value]) => {
                          if (key === 'food_item') return null;
                          return (
                            <tr key={key}>
                              <td className="text-emerald-400 pr-2 w-1/3">{key.replace(/_/g, ' ')}:</td>
                              <td className="text-emerald-100">
                                {Array.isArray(value) ? value.join(', ') : value}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Foods to Minimize */}
          {foodRecs.foods_to_minimize && (
            <div className="mb-4">
              <h5 className="text-emerald-300 font-semibold mb-2">Foods to Minimize</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {foodRecs.foods_to_minimize.map((food, index) => (
                  <div key={index} className="bg-red-900/30 rounded-lg p-3 border border-red-600/30">
                    <h6 className="text-red-200 font-bold mb-2">{food.food_item}</h6>
                    <table className="w-full text-sm">
                      <tbody>
                        {Object.entries(food).map(([key, value]) => {
                          if (key === 'food_item') return null;
                          return (
                            <tr key={key}>
                              <td className="text-red-400 pr-2 w-1/3">{key.replace(/_/g, ' ')}:</td>
                              <td className="text-red-100">
                                {Array.isArray(value) ? value.join(', ') : value}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    };

    // Special renderer for progress tracking
    const renderProgressTracking = (progress) => {
      if (!progress || !progress.weekly_milestones) return null;

      return (
        <div className="mb-6">
          <h4 className="text-lg font-bold text-emerald-300 mb-3 flex items-center">
            <FontAwesomeIcon icon={faAward} className="mr-2" />
            Progress Tracking Milestones
          </h4>

          <div className="space-y-4">
            {progress.weekly_milestones.map((milestone, index) => (
              <div key={index} className="bg-emerald-800/40 rounded-lg p-4">
                <h5 className="text-emerald-200 font-bold mb-3 flex items-center">
                  <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                  Week {milestone.week}
                </h5>

                <table className="w-full">
                  <tbody>
                    {Object.entries(milestone).map(([key, value]) => {
                      if (key === 'week') return null;
                      return (
                        <tr key={key} className="border-b border-emerald-600/20">
                          <td className="py-2 pr-4 text-emerald-400 font-medium w-1/3">
                            {key.replace(/_/g, ' ').charAt(0).toUpperCase() + key.replace(/_/g, ' ').slice(1)}:
                          </td>
                          <td className="py-2 text-emerald-100">
                            {Array.isArray(value) ? (
                              <ul className="list-disc list-inside space-y-1">
                                {value.map((item, idx) => (
                                  <li key={idx} className="text-sm">{item}</li>
                                ))}
                              </ul>
                            ) : (
                              value
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      );
    };

    return (
      <div className="space-y-6">
        {/* Client Assessment */}
        {data.client_assessment && (
          <div className="mb-6">
            <h4 className="text-lg font-bold text-emerald-300 mb-3 flex items-center">
              <FontAwesomeIcon icon={faChartBar} className="mr-2" />
              Client Assessment & Requirements
            </h4>

            {/* Current Status */}
            {data.client_assessment.current_status && (
              <div className="mb-4">
                <h5 className="text-emerald-300 font-semibold mb-2">Current Status</h5>
                {renderTable(data.client_assessment.current_status)}
              </div>
            )}

            {/* Caloric Requirements */}
            {data.client_assessment.caloric_requirements && (
              <div className="mb-4">
                <h5 className="text-emerald-300 font-semibold mb-2">Caloric Requirements</h5>
                {renderTable(data.client_assessment.caloric_requirements)}
              </div>
            )}

            {/* Macronutrient Targets */}
            {data.client_assessment.macronutrient_targets && (
              <div className="mb-4">
                <h5 className="text-emerald-300 font-semibold mb-2">Macronutrient Targets</h5>
                {renderTable(data.client_assessment.macronutrient_targets)}
              </div>
            )}
          </div>
        )}

        {/* Personalized Meal Plan */}
        {data.personalized_meal_plan && renderMealPlan(data.personalized_meal_plan)}

        {/* Food Recommendations */}
        {data.food_recommendations && renderFoodRecommendations(data.food_recommendations)}

        {/* Meal Preparation Strategy */}
        {data.meal_preparation_strategy && renderTable(data.meal_preparation_strategy, 'Meal Preparation Strategy')}

        {/* Progress Tracking */}
        {data.progress_tracking && renderProgressTracking(data.progress_tracking)}
      </div>
    );
  };

  if (loading && recommendations.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-r from-emerald-600 to-green-600 rounded-full flex items-center justify-center shadow-2xl">
              <FontAwesomeIcon icon={faSpinner} className="text-white text-2xl animate-spin" />
            </div>
            <div className="absolute -inset-4 bg-gradient-to-r from-emerald-600 to-green-600 rounded-full blur opacity-20 animate-pulse"></div>
          </div>
          <h3 className="text-xl font-semibold text-emerald-200 mt-6">Loading Your Nutrition Plans</h3>
          <p className="text-emerald-300 mt-2">Preparing your meal history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 relative overflow-hidden">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        theme="dark"
        className="z-[9999] mt-20"
        toastClassName="!bg-emerald-800 !text-emerald-100"
        progressClassName="!bg-emerald-400"
      />

      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-40 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl animate-ping"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center shadow-2xl">
              <FontAwesomeIcon icon={faAppleAlt} className="text-white text-3xl" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-300 via-green-300 to-teal-300 bg-clip-text text-transparent mb-4">
            My Nutrition Journey
          </h1>
          <p className="text-xl text-emerald-200 max-w-3xl mx-auto leading-relaxed">
            Track your nutrition progress and explore all your AI-generated meal plans
          </p>
        </motion.div>



        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-slate-800/80 via-emerald-900/60 to-slate-800/80 rounded-2xl p-6 border border-emerald-700/30 shadow-xl mb-8 backdrop-blur-sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400" />
              <input
                type="text"
                placeholder="Search by goal, diet type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearch}
                className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-emerald-600/30 rounded-xl text-white placeholder-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <FontAwesomeIcon icon={faFilter} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400" />
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-emerald-600/30 rounded-xl text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 appearance-none"
              >
                {filters?.available_filters?.map((filter) => (
                  <option key={filter.value} value={filter.value}>
                    {filter.label}
                  </option>
                )) || [
                    <option key="all" value="all">All Time</option>,
                    <option key="this_week" value="this_week">This Week</option>,
                    <option key="this_month" value="this_month">This Month</option>,
                    <option key="last_3_months" value="last_3_months">Last 3 Months</option>
                  ]}
              </select>
            </div>

            {/* Page Size */}
            <div className="relative">
              <select
                value={pageSize}
                onChange={(e) => setPageSize(parseInt(e.target.value))}
                className="w-full px-4 py-3 bg-slate-800/50 border border-emerald-600/30 rounded-xl text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 appearance-none"
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4">
            <button
              onClick={fetchRecommendations}
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg font-medium hover:from-emerald-700 hover:to-green-700 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
            >
              <FontAwesomeIcon icon={loading ? faSpinner : faRefresh} className={loading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>

            <p className="text-emerald-300 text-sm">
              Showing {recommendations.length} of {pagination?.total_count || 0} results
            </p>
          </div>
        </motion.div>

        {/* Recommendations List */}
        <AnimatePresence>
          {recommendations.length === 0 && !loading ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-20"
            >
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-6xl text-emerald-400 mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">No Nutrition Plans Found</h3>
              <p className="text-emerald-300 mb-6">
                {searchQuery || filterBy !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'Create your first nutrition plan to get started!'
                }
              </p>
              <button
                onClick={() => window.location.href = '/nutrition'}
                className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-bold hover:from-emerald-700 hover:to-green-700 transition-all duration-200"
              >
                Create New Plan
              </button>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {recommendations.map((recommendation, index) => (
                <motion.div
                  key={recommendation.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-slate-800/80 via-emerald-900/60 to-slate-800/80 rounded-2xl border border-emerald-700/30 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 backdrop-blur-sm"
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                      {/* Left Section - Main Info */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center">
                            <FontAwesomeIcon icon={faAppleAlt} className="text-white text-xl" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white">
                              Nutrition Plan #{recommendation.id}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-emerald-300">
                              <span className="flex items-center space-x-1">
                                <FontAwesomeIcon icon={faCalendarAlt} />
                                <span>{recommendation.created_date}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <FontAwesomeIcon icon={faClock} />
                                <span>{recommendation.created_time}</span>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                            <FontAwesomeIcon icon={faBullseye} className="text-emerald-400 mb-1" />
                            <p className="text-xs text-emerald-300">Goal</p>
                            <p className="text-sm font-semibold text-white capitalize">
                              {recommendation.profile_data.goal?.replace('_', ' ')}
                            </p>
                          </div>
                          <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                            <FontAwesomeIcon icon={faChartBar} className="text-emerald-400 mb-1" />
                            <p className="text-xs text-emerald-300">BMI</p>
                            <p className="text-sm font-semibold text-white">
                              {recommendation.bmi} ({recommendation.bmi_category})
                            </p>
                          </div>
                          <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                            <FontAwesomeIcon icon={faLeaf} className="text-emerald-400 mb-1" />
                            <p className="text-xs text-emerald-300">Diet</p>
                            <p className="text-sm font-semibold text-white capitalize">
                              {recommendation.profile_data.food_type}
                            </p>
                          </div>
                          <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                            <FontAwesomeIcon icon={faUtensils} className="text-emerald-400 mb-1" />
                            <p className="text-xs text-emerald-300">Meals</p>
                            <p className="text-sm font-semibold text-white">
                              {recommendation.meal_count || 'N/A'}
                            </p>
                          </div>
                        </div>

                        {/* Recommendation Summary */}
                        {recommendation.recommendation_summary && (
                          <div className="bg-emerald-900/30 rounded-lg p-4 mb-4">
                            <h4 className="text-emerald-300 font-medium mb-2">Plan Overview</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                              <div>
                                <span className="text-emerald-400">Calories:</span>
                                <span className="text-white ml-2">
                                  {recommendation.recommendation_summary.daily_calories}
                                </span>
                              </div>
                              <div>
                                <span className="text-emerald-400">Protein:</span>
                                <span className="text-white ml-2">
                                  {recommendation.recommendation_summary.macros?.protein}
                                </span>
                              </div>
                              <div>
                                <span className="text-emerald-400">Meals:</span>
                                <span className="text-white ml-2">
                                  {recommendation.recommendation_summary.total_meals}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right Section - Actions */}
                      <div className="flex flex-col space-y-3 lg:ml-6">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleViewDetail(recommendation.id)}
                          className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg font-medium hover:from-emerald-700 hover:to-green-700 transition-all duration-200 flex items-center space-x-2"
                        >
                          <FontAwesomeIcon icon={faEye} />
                          <span>View Plan</span>
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setShowDeleteConfirm(recommendation.id)}
                          disabled={deleting === recommendation.id}
                          className="px-6 py-2 bg-red-600/80 text-white rounded-lg font-medium hover:bg-red-700 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
                        >
                          <FontAwesomeIcon
                            icon={deleting === recommendation.id ? faSpinner : faTrash}
                            className={deleting === recommendation.id ? 'animate-spin' : ''}
                          />
                          <span>{deleting === recommendation.id ? 'Deleting...' : 'Delete'}</span>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {pagination?.total_pages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center space-x-4 mt-12"
          >
            <button
              onClick={() => setCurrentPage(pagination.previous_page)}
              disabled={!pagination.has_previous}
              className="px-4 py-2 bg-slate-700 text-emerald-300 rounded-lg font-medium hover:bg-slate-600 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
            >
              <FontAwesomeIcon icon={faChevronLeft} />
              <span>Previous</span>
            </button>

            <div className="flex items-center space-x-2">
              {[...Array(Math.min(5, pagination.total_pages))].map((_, index) => {
                const pageNum = Math.max(1, pagination.current_page - 2) + index;
                if (pageNum > pagination.total_pages) return null;

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 rounded-lg font-medium transition-all duration-200 ${pageNum === pagination.current_page
                      ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white'
                      : 'bg-slate-700 text-emerald-300 hover:bg-slate-600'
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage(pagination.next_page)}
              disabled={!pagination.has_next}
              className="px-4 py-2 bg-slate-700 text-emerald-300 rounded-lg font-medium hover:bg-slate-600 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
            >
              <span>Next</span>
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </motion.div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedRecommendation && (
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
              className="bg-gradient-to-br from-slate-800/90 to-emerald-900/80 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden border border-emerald-700/30 shadow-2xl backdrop-blur-md"
            >
              <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FontAwesomeIcon icon={faAppleAlt} className="text-2xl" />
                    <h2 className="text-2xl font-bold">Nutrition Plan Details</h2>
                  </div>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-200"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                {selectedRecommendation.parsed_recommendation ? (
                  renderNutritionDetail(selectedRecommendation.parsed_recommendation)
                ) : (
                  <div className="text-center py-12">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="text-4xl text-emerald-400 mb-4" />
                    <p className="text-emerald-300">Unable to parse nutrition plan details</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
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
              className="bg-gradient-to-br from-slate-800 to-emerald-900 rounded-2xl p-6 max-w-md w-full border border-emerald-700/30 shadow-2xl backdrop-blur-md"
            >
              <div className="text-center">
                <FontAwesomeIcon icon={faExclamationTriangle} className="text-4xl text-yellow-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Delete Nutrition Plan?</h3>
                <p className="text-emerald-300 mb-6">
                  This action cannot be undone. Your nutrition plan and all associated data will be permanently deleted.
                </p>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="flex-1 px-4 py-2 bg-slate-700 text-emerald-300 rounded-lg font-medium hover:bg-slate-600 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(showDeleteConfirm)}
                    disabled={deleting}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all duration-200 disabled:opacity-50"
                  >
                    {deleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NutritionRecommendations;
