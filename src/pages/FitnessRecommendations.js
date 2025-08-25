import  { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faDumbbell,
    faSearch,
    faFilter,
    faTrash,
    faEye,
    faCalendarAlt,
    faClock,
    faChartBar,
    faUser,
    faBullseye,
    faFire,
    faSpinner,
    faExclamationTriangle,
    faChevronLeft,
    faChevronRight,
    faTimes,
    faRefresh,
    faStar,
    faHeart,
    faAward,
    faStopwatch,
    faRedo,
    faListAlt,
    faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FitnessRecommendations = () => {
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    // State declarations
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(null);
    const [pagination, setPagination] = useState({});
    const [filters, setFilters] = useState({});

    // Filter and search states
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterBy, setFilterBy] = useState('all');

    // Modal states
    const [selectedRecommendation, setSelectedRecommendation] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

    // ✅ Fixed: Get fitness recommendation detail using direct axios
    const getFitnessRecommendationDetail = async (recommendationId) => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.get(`${backendUrl}/fitness/recommendations/${recommendationId}/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: 10000
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching recommendation detail:', error);
            throw error;
        }
    };

    // ✅ Fixed: Delete fitness recommendation using direct axios
    const deleteFitnessRecommendation = async (recommendationId) => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.delete(`${backendUrl}/fitness/recommendations/${recommendationId}/delete/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: 10000
            });
            return response.data;
        } catch (error) {
            console.error('Error deleting recommendation:', error);
            throw error;
        }
    };

    // ✅ Fixed: Fetch recommendations with proper dependencies and no infinite loop
    const fetchRecommendations = useCallback(async () => {
        setLoading(true);
        const token = localStorage.getItem('access_token');

        try {
            const response = await axios.get(`${backendUrl}/fitness/recommendations/`, {
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
            toast.error('Failed to fetch recommendations');
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
            await deleteFitnessRecommendation(recommendationId);
            toast.success('Recommendation deleted successfully');
            fetchRecommendations(); // Refresh the list
            setShowDeleteConfirm(null);
        } catch (error) {
            console.error('Error deleting recommendation:', error);
            toast.error('Failed to delete recommendation');
        } finally {
            setDeleting(null);
        }
    };

    // ✅ Fixed: View detail handler
    const handleViewDetail = async (recommendationId) => {
        try {
            const response = await getFitnessRecommendationDetail(recommendationId);
            if (response.status === 'success') {
                setSelectedRecommendation(response.data);
                setShowDetailModal(true);
            }
        } catch (error) {
            console.error('Error fetching recommendation detail:', error);
            toast.error('Failed to load recommendation details');
        }
    };

    // ✅ Fixed: Search handler - only update state, don't call API directly
    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        setCurrentPage(1);
       
    };


    // Enhanced detail renderer for comprehensive fitness plan display
    const renderFitnessDetail = (data) => {
        if (!data) return null;

        const renderSection = (title, content, icon, bgColor = "bg-violet-900/30") => (
            <div className="mb-8">
                <h3 className="text-2xl font-bold text-violet-300 mb-4 flex items-center">
                    <FontAwesomeIcon icon={icon} className="mr-3" />
                    {title}
                </h3>
                <div className={`${bgColor} rounded-xl p-6 border border-violet-700/30`}>
                    {content}
                </div>
            </div>
        );

        const renderTable = (tableData, columns = 2) => (
            <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-4`}>
                {Object.entries(tableData).map(([key, value]) => (
                    <div key={key} className="bg-slate-700/50 rounded-lg p-4">
                        <div className="text-violet-400 text-sm font-medium mb-2 capitalize">
                            {key.replace(/_/g, ' ')}
                        </div>
                        <div className="text-white font-semibold">
                            {Array.isArray(value) ? (
                                <div className="space-y-1">
                                    {value.map((item, idx) => (
                                        <div key={idx} className="text-sm bg-violet-800/50 rounded px-2 py-1">
                                            {typeof item === 'object' ? JSON.stringify(item, null, 2) : item}
                                        </div>
                                    ))}
                                </div>
                            ) : typeof value === 'object' && value !== null ? (
                                <div className="space-y-2">
                                    {Object.entries(value).map(([subKey, subValue]) => (
                                        <div key={subKey} className="text-sm">
                                            <span className="text-violet-300">{subKey.replace(/_/g, ' ')}:</span>
                                            <span className="ml-2">{subValue}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                value || 'N/A'
                            )}
                        </div>
                    </div>
                ))}
            </div>
        );

        const renderWorkoutSchedule = (schedule) => {
            if (!Array.isArray(schedule)) return null;

            return (
                <div className="space-y-4">
                    {schedule.map((day, index) => (
                        <div key={index} className="bg-slate-800/60 rounded-xl p-6 border border-violet-600/30">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-xl font-bold text-white flex items-center">
                                    <FontAwesomeIcon icon={faCalendarAlt} className="text-violet-400 mr-2" />
                                    {day.day}
                                </h4>
                                <div className="flex items-center space-x-4 text-sm">
                                    <span className="bg-violet-600 text-white px-3 py-1 rounded-full flex items-center">
                                        <FontAwesomeIcon icon={faStopwatch} className="mr-1" />
                                        {day.duration}
                                    </span>
                                    <span className="bg-indigo-600 text-white px-3 py-1 rounded-full">
                                        {day.workout_type}
                                    </span>
                                </div>
                            </div>

                            {day.focus && (
                                <div className="mb-4">
                                    <span className="text-violet-300 font-medium">Focus: </span>
                                    <span className="text-white">{day.focus}</span>
                                </div>
                            )}

                            {day.exercises && Array.isArray(day.exercises) && (
                                <div>
                                    <h5 className="text-lg font-semibold text-violet-300 mb-3 flex items-center">
                                        <FontAwesomeIcon icon={faListAlt} className="mr-2" />
                                        Exercises ({day.exercises.length})
                                    </h5>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        {day.exercises.map((exercise, exerciseIdx) => (
                                            <div key={exerciseIdx} className="bg-slate-700/70 rounded-lg p-4">
                                                <div className="flex items-start justify-between mb-3">
                                                    <h6 className="font-bold text-white text-lg">
                                                        {exercise.exercise_name || exercise.name}
                                                    </h6>
                                                    {exercise.difficulty && (
                                                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                            exercise.difficulty === 'beginner' ? 'bg-green-600 text-white' :
                                                            exercise.difficulty === 'intermediate' ? 'bg-yellow-600 text-white' :
                                                            'bg-red-600 text-white'
                                                        }`}>
                                                            {exercise.difficulty}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="grid grid-cols-2 gap-3 mb-3">
                                                    {exercise.sets && (
                                                        <div className="flex items-center">
                                                            <FontAwesomeIcon icon={faRedo} className="text-violet-400 mr-2" />
                                                            <span className="text-sm text-violet-300">Sets:</span>
                                                            <span className="text-white ml-2 font-semibold">{exercise.sets}</span>
                                                        </div>
                                                    )}
                                                    {exercise.reps && (
                                                        <div className="flex items-center">
                                                            <FontAwesomeIcon icon={faBullseye} className="text-violet-400 mr-2" />
                                                            <span className="text-sm text-violet-300">Reps:</span>
                                                            <span className="text-white ml-2 font-semibold">{exercise.reps}</span>
                                                        </div>
                                                    )}
                                                    {exercise.duration && (
                                                        <div className="flex items-center">
                                                            <FontAwesomeIcon icon={faClock} className="text-violet-400 mr-2" />
                                                            <span className="text-sm text-violet-300">Duration:</span>
                                                            <span className="text-white ml-2 font-semibold">{exercise.duration}</span>
                                                        </div>
                                                    )}
                                                    {exercise.rest_time && (
                                                        <div className="flex items-center">
                                                            <FontAwesomeIcon icon={faStopwatch} className="text-violet-400 mr-2" />
                                                            <span className="text-sm text-violet-300">Rest:</span>
                                                            <span className="text-white ml-2 font-semibold">{exercise.rest_time}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {exercise.instructions && (
                                                    <div className="mt-3">
                                                        <span className="text-violet-300 font-medium text-sm">Instructions:</span>
                                                        <p className="text-gray-300 text-sm mt-1 leading-relaxed">
                                                            {exercise.instructions}
                                                        </p>
                                                    </div>
                                                )}

                                                {exercise.tips && (
                                                    <div className="mt-3">
                                                        <span className="text-violet-300 font-medium text-sm">Tips:</span>
                                                        <p className="text-gray-300 text-sm mt-1 leading-relaxed">
                                                            {exercise.tips}
                                                        </p>
                                                    </div>
                                                )}

                                                {exercise.muscles_targeted && (
                                                    <div className="mt-3">
                                                        <span className="text-violet-300 font-medium text-sm">Target Muscles:</span>
                                                        <div className="flex flex-wrap gap-1 mt-1">
                                                            {(Array.isArray(exercise.muscles_targeted) ? exercise.muscles_targeted : [exercise.muscles_targeted]).map((muscle, muscleIdx) => (
                                                                <span key={muscleIdx} className="bg-violet-600 text-white text-xs px-2 py-1 rounded-full">
                                                                    {muscle}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            );
        };

        return (
            <div className="space-y-8">
                {/* Workout Overview */}
                {data.workout_overview && renderSection(
                    'Workout Overview',
                    renderTable(data.workout_overview, 3),
                    faChartBar
                )}

                {/* Physical Assessment */}
                {data.physical_assessment && renderSection(
                    'Physical Assessment',
                    renderTable(data.physical_assessment, 2),
                    faUser
                )}

                {/* Goals & Objectives */}
                {data.goals_and_objectives && renderSection(
                    'Goals & Objectives',
                    <div className="space-y-4">
                        {Object.entries(data.goals_and_objectives).map(([key, value]) => (
                            <div key={key} className="bg-slate-700/50 rounded-lg p-4">
                                <h4 className="text-violet-400 font-medium capitalize mb-2">{key.replace(/_/g, ' ')}</h4>
                                <div className="text-white">
                                    {Array.isArray(value) ? (
                                        <ul className="list-disc list-inside space-y-1">
                                            {value.map((item, idx) => (
                                                <li key={idx} className="text-sm">{item}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>{value}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>,
                    faBullseye
                )}

                {/* Weekly Workout Schedule */}
                {data.weekly_workout_schedule && renderSection(
                    'Weekly Workout Schedule',
                    renderWorkoutSchedule(data.weekly_workout_schedule),
                    faCalendarAlt,
                    "bg-slate-800/50"
                )}

                {/* Nutrition Guidelines */}
                {data.nutrition_guidelines && renderSection(
                    'Nutrition Guidelines',
                    renderTable(data.nutrition_guidelines, 2),
                    faHeart
                )}

                {/* Progress Tracking */}
                {data.progress_tracking && renderSection(
                    'Progress Tracking',
                    <div className="space-y-4">
                        {Object.entries(data.progress_tracking).map(([key, value]) => (
                            <div key={key} className="bg-slate-700/50 rounded-lg p-4">
                                <h4 className="text-violet-400 font-medium capitalize mb-2">{key.replace(/_/g, ' ')}</h4>
                                <div className="text-white">
                                    {Array.isArray(value) ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {value.map((item, idx) => (
                                                <div key={idx} className="flex items-center text-sm">
                                                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-400 mr-2" />
                                                    {item}
                                                </div>
                                            ))}
                                        </div>
                                    ) : typeof value === 'object' ? (
                                        <div className="space-y-2">
                                            {Object.entries(value).map(([subKey, subValue]) => (
                                                <div key={subKey} className="text-sm">
                                                    <span className="text-violet-300">{subKey.replace(/_/g, ' ')}:</span>
                                                    <span className="ml-2">{subValue}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p>{value}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>,
                    faAward
                )}

                {/* Additional Tips */}
                {data.additional_tips && renderSection(
                    'Additional Tips',
                    <div className="space-y-3">
                        {(Array.isArray(data.additional_tips) ? data.additional_tips : [data.additional_tips]).map((tip, idx) => (
                            <div key={idx} className="flex items-start">
                                <FontAwesomeIcon icon={faStar} className="text-yellow-400 mr-3 mt-1 flex-shrink-0" />
                                <p className="text-white">{tip}</p>
                            </div>
                        ))}
                    </div>,
                    faStar,
                    "bg-yellow-900/20"
                )}
            </div>
        );
    };

    if (loading && recommendations.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-900 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="w-20 h-20 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
                            <FontAwesomeIcon icon={faSpinner} className="text-white text-2xl animate-spin" />
                        </div>
                        <div className="absolute -inset-4 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full blur opacity-20 animate-pulse"></div>
                    </div>
                    <h3 className="text-xl font-semibold text-violet-200 mt-6">Loading Your Fitness Plans</h3>
                    <p className="text-violet-300 mt-2">Preparing your workout history...</p>
                </div>
            </div>
        );
    }

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
                        My Fitness Journey
                    </h1>
                    <p className="text-xl text-violet-200 max-w-3xl mx-auto leading-relaxed">
                        Track your progress and explore all your AI-generated fitness plans
                    </p>
                </motion.div>

                {/* Search and Filter Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-slate-800/80 via-violet-900/60 to-slate-800/80 rounded-2xl p-6 border border-violet-700/30 shadow-xl mb-8"
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-violet-400" />
                            <input
                                type="text"
                                placeholder="Search by goal, fitness level..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={handleSearch}
                                className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-violet-600/30 rounded-xl text-white placeholder-violet-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200"
                            />
                        </div>

                        {/* Filter */}
                        <div className="relative">
                            <FontAwesomeIcon icon={faFilter} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-violet-400" />
                            <select
                                value={filterBy}
                                onChange={(e) => setFilterBy(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-violet-600/30 rounded-xl text-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200 appearance-none"
                            >
                                {filters?.available_filters?.map((filter) => (
                                    <option key={filter.value} value={filter.value}>
                                        {filter.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Page Size */}
                        <div className="relative">
                            <select
                                value={pageSize}
                                onChange={(e) => setPageSize(parseInt(e.target.value))}
                                className="w-full px-4 py-3 bg-slate-800/50 border border-violet-600/30 rounded-xl text-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200 appearance-none"
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
                            className="px-6 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg font-medium hover:from-violet-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
                        >
                            <FontAwesomeIcon icon={loading ? faSpinner : faRefresh} className={loading ? 'animate-spin' : ''} />
                            <span>Refresh</span>
                        </button>

                        <p className="text-violet-300 text-sm">
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
                            <FontAwesomeIcon icon={faExclamationTriangle} className="text-6xl text-violet-400 mb-6" />
                            <h3 className="text-2xl font-bold text-white mb-4">No Fitness Plans Found</h3>
                            <p className="text-violet-300 mb-6">
                                {searchQuery || filterBy !== 'all'
                                    ? 'Try adjusting your search or filter criteria'
                                    : 'Create your first fitness plan to get started!'
                                }
                            </p>
                            <button
                                onClick={() => window.location.href = '/fitness'}
                                className="px-8 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-bold hover:from-violet-700 hover:to-purple-700 transition-all duration-200"
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
                                    className="bg-gradient-to-br from-slate-800/80 via-violet-900/60 to-slate-800/80 rounded-2xl border border-violet-700/30 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300"
                                >
                                    <div className="p-6">
                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                                            {/* Left Section - Main Info */}
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-4 mb-4">
                                                    <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl flex items-center justify-center">
                                                        <FontAwesomeIcon icon={faDumbbell} className="text-white text-xl" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-bold text-white">
                                                            Fitness Plan #{recommendation.id}
                                                        </h3>
                                                        <div className="flex items-center space-x-4 text-sm text-violet-300">
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
                                                        <FontAwesomeIcon icon={faBullseye} className="text-violet-400 mb-1" />
                                                        <p className="text-xs text-violet-300">Goal</p>
                                                        <p className="text-sm font-semibold text-white capitalize">
                                                            {recommendation.profile_data.goal?.replace('_', ' ')}
                                                        </p>
                                                    </div>
                                                    <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                                                        <FontAwesomeIcon icon={faChartBar} className="text-violet-400 mb-1" />
                                                        <p className="text-xs text-violet-300">BMI</p>
                                                        <p className="text-sm font-semibold text-white">
                                                            {recommendation.bmi} ({recommendation.bmi_category})
                                                        </p>
                                                    </div>
                                                    <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                                                        <FontAwesomeIcon icon={faFire} className="text-violet-400 mb-1" />
                                                        <p className="text-xs text-violet-300">Level</p>
                                                        <p className="text-sm font-semibold text-white capitalize">
                                                            {recommendation.profile_data.fitness_level}
                                                        </p>
                                                    </div>
                                                    <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                                                        <FontAwesomeIcon icon={faHeart} className="text-violet-400 mb-1" />
                                                        <p className="text-xs text-violet-300">Activity</p>
                                                        <p className="text-sm font-semibold text-white capitalize">
                                                            {recommendation.profile_data.activity_level?.replace('_', ' ')}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Recommendation Summary */}
                                                {recommendation.recommendation_summary && (
                                                    <div className="bg-violet-900/30 rounded-lg p-4 mb-4">
                                                        <h4 className="text-violet-300 font-medium mb-2">Plan Overview</h4>
                                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                                                            <div>
                                                                <span className="text-violet-400">Frequency:</span>
                                                                <span className="text-white ml-2">
                                                                    {recommendation.recommendation_summary.weekly_frequency}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span className="text-violet-400">Duration:</span>
                                                                <span className="text-white ml-2">
                                                                    {recommendation.recommendation_summary.session_duration}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span className="text-violet-400">Exercises:</span>
                                                                <span className="text-white ml-2">
                                                                    {recommendation.recommendation_summary.total_exercises}
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
                                                    className="px-6 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg font-medium hover:from-violet-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2"
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
                            className="px-4 py-2 bg-slate-700 text-violet-300 rounded-lg font-medium hover:bg-slate-600 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
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
                                                ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white'
                                                : 'bg-slate-700 text-violet-300 hover:bg-slate-600'
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
                            className="px-4 py-2 bg-slate-700 text-violet-300 rounded-lg font-medium hover:bg-slate-600 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
                        >
                            <span>Next</span>
                            <FontAwesomeIcon icon={faChevronRight} />
                        </button>
                    </motion.div>
                )}
            </div>

            {/* Enhanced Detail Modal */}
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
                            className="bg-gradient-to-br from-slate-800/95 to-violet-900/85 rounded-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden border border-violet-700/30 shadow-2xl backdrop-blur-md"
                        >
                            <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-6 text-white">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <FontAwesomeIcon icon={faDumbbell} className="text-2xl" />
                                        <h2 className="text-2xl font-bold">Complete Fitness Plan Details</h2>
                                    </div>
                                    <button
                                        onClick={() => setShowDetailModal(false)}
                                        className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-200"
                                    >
                                        <FontAwesomeIcon icon={faTimes} />
                                    </button>
                                </div>
                            </div>
                            <div className="p-6 overflow-y-auto max-h-[calc(95vh-120px)]">
                                {selectedRecommendation.parsed_recommendation ? (
                                    renderFitnessDetail(selectedRecommendation.parsed_recommendation)
                                ) : (
                                    <div className="text-center py-12">
                                        <FontAwesomeIcon icon={faExclamationTriangle} className="text-4xl text-violet-400 mb-4" />
                                        <p className="text-violet-300">Unable to parse fitness plan details</p>
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
                            className="bg-gradient-to-br from-slate-800 to-violet-900 rounded-2xl p-6 max-w-md w-full border border-violet-700/30 shadow-2xl"
                        >
                            <div className="text-center">
                                <FontAwesomeIcon icon={faExclamationTriangle} className="text-4xl text-yellow-400 mb-4" />
                                <h3 className="text-xl font-bold text-white mb-2">Delete Fitness Plan?</h3>
                                <p className="text-violet-300 mb-6">
                                    This action cannot be undone. Your workout plan and all associated data will be permanently deleted.
                                </p>
                                <div className="flex space-x-4">
                                    <button
                                        onClick={() => setShowDeleteConfirm(null)}
                                        className="flex-1 px-4 py-2 bg-slate-700 text-violet-300 rounded-lg font-medium hover:bg-slate-600 transition-all duration-200"
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

export default FitnessRecommendations;
