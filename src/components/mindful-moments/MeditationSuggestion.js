import React, { useState } from 'react';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SpaIcon from '@mui/icons-material/Spa';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import PsychologyIcon from '@mui/icons-material/Psychology';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ShareIcon from '@mui/icons-material/Share';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const MeditationSuggestion = () => {
  const [experienceText, setExperienceText] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiError, setApiError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!experienceText.trim()) {
      setError('Please describe your current state before getting recommendations.');
      return;
    }

    if (experienceText.trim().length < 10) {
      setError('Please provide a more detailed description (at least 10 characters).');
      return;
    }

    setIsLoading(true);
    setError(null);
    setApiError(null);
    setRecommendations([]);

    try {
      const response = await fetch('http://127.0.0.1:8000/meditation/experiences/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          experience_text: experienceText
        }),
      });

      const data = await response.json();
      console.log('API Response:', data); // Debug log

      if (!response.ok) {
        const errorMsg = data.error || data.detail || data.message || 'Failed to get recommendations';
        throw new Error(errorMsg);
      }

      // Handle the response structure from your Django backend
      if (!data.recommendations || data.recommendations.length === 0) {
        setApiError('No recommendations received from server');
      } else {
        setRecommendations(data.recommendations);
      }
    } catch (err) {
      console.error('API Error:', err);
      setError(err.message || 'Failed to fetch recommendations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };



  const getBorderColor = (type) => {
    const colors = {
      'Mindfulness of Breath': 'border-green-500',
      'Breathing': 'border-green-500',
      'Mindfulness': 'border-blue-500',
      'Body Scan': 'border-orange-500',
      'Loving-Kindness': 'border-pink-500',
      'Loving Kindness': 'border-pink-500',
      'Walking': 'border-purple-500',
      'Visualization': 'border-indigo-500',
      default: 'border-purple-800'
    };
    return colors[type] || colors.default;
  };

  const getTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'mindfulness of breath':
      case 'breathing':
        return '🌬️';
      case 'loving-kindness':
      case 'loving kindness':
        return '💖';
      case 'body scan':
        return '🧘‍♀️';
      case 'visualization':
        return '✨';
      case 'walking':
        return '🚶‍♂️';
      default:
        return '🧘';
    }
  };

  const formatInstructions = (instructions) => {
    // Split by periods and create paragraphs for better readability
    const sentences = instructions.split('. ');
    return sentences.map((sentence, index) => {
      if (sentence.trim()) {
        return (
          <p key={index} className="mb-2">
            {sentence.trim()}{index < sentences.length - 1 ? '.' : ''}
          </p>
        );
      }
      return null;
    }).filter(Boolean);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <div className="text-center mb-12 bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
        {/* Floating decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-lg animate-bounce"></div>

        <div className="relative z-10">
          <AutoAwesomeIcon className="text-6xl mb-4 animate-pulse" />
          <h1 className="text-5xl font-black mb-4 tracking-tight">
            AI Meditation Guide
          </h1>
          <p className="text-xl font-light max-w-2xl mx-auto leading-relaxed opacity-90">
            Share your current emotional state and receive personalized meditation practices
            designed to bring you peace and clarity
          </p>
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-2xl shadow-xl border border-purple-100 mb-8 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 border-b border-purple-100">
          <div className="flex items-center mb-2">
            <PsychologyIcon className="text-3xl text-purple-700 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">Tell us how you're feeling</h2>
          </div>
          <p className="text-gray-600">Describe your current state of mind for personalized guidance</p>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <textarea
                className="w-full p-4 border-2 border-gray-200 rounded-xl resize-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 text-lg leading-relaxed placeholder-gray-400"
                rows={4}
                placeholder="I'm feeling anxious about my job interview tomorrow and can't sleep... OR I'm overwhelmed with work deadlines... OR I had an argument and feel angry..."
                value={experienceText}
                onChange={(e) => setExperienceText(e.target.value)}
                required
              />
            </div>

            {/* Quick suggestions */}
            <div className="flex flex-wrap gap-3">
              {[
                'I\'m feeling anxious about my job interview tomorrow and can\'t sleep',
                'I\'m overwhelmed with work deadlines and feeling burned out',
                'I\'m feeling sad and unmotivated lately',
                'I had an argument with my partner and feel angry',
                'I\'m stressed about my upcoming presentation'
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setExperienceText(suggestion)}
                  className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-700 hover:text-white transition-all duration-200 text-sm font-medium transform hover:scale-105"
                >
                  {suggestion.length > 30 ? suggestion.substring(0, 30) + '...' : suggestion}
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:from-purple-700 hover:to-purple-800 hover:shadow-xl hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-300 text-lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                  Analyzing your state...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <LightbulbIcon className="mr-2" />
                  Get My Personalized Meditation
                </div>
              )}
            </button>

            {isLoading && (
              <div className="space-y-2">
                <div className="w-full bg-purple-200 rounded-full h-2 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full animate-pulse"></div>
                </div>
                <p className="text-center text-gray-600 text-sm">
                  Our AI is crafting your personalized meditation experience...
                </p>
              </div>
            )}
          </form>

          {(error || apiError) && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error || apiError}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      {recommendations.length > 0 ? (
        <div className="space-y-8 animate-fade-in">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <CheckCircleIcon className="text-green-500 text-3xl mr-2" />
              <h3 className="text-4xl font-black text-gray-800 relative inline-block">
                Your Personalized Meditation Journey
              </h3>
            </div>
            <div className="w-24 h-1 bg-purple-600 rounded-full mx-auto mb-4"></div>
            <p className="text-xl text-gray-600 font-medium">
              {recommendations.length} personalized meditation{recommendations.length > 1 ? 's' : ''} selected for you
            </p>
          </div>

          <div className="space-y-6">
            {recommendations.map((rec, index) => (
              <div
                key={rec.id}
                className={`bg-white rounded-2xl shadow-lg border-l-4 ${getBorderColor(rec.meditation_type)} hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden group`}
                style={{
                  animationDelay: `${index * 200}ms`,
                  animation: 'slideInUp 0.6s ease-out forwards'
                }}
              >
                {/* Header */}
                <div className="p-6 bg-gradient-to-r from-gray-50 to-purple-50">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <div className="text-3xl mr-4">{getTypeIcon(rec.meditation_type)}</div>
                      <div>
                        <h4 className="text-2xl font-bold text-purple-800 mb-2">{rec.meditation_type}</h4>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center bg-purple-700 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            <AccessTimeIcon className="w-4 h-4 mr-1" />
                            {rec.duration_minutes} min
                          </div>
                          <div className="flex items-center bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            {rec.difficulty_level}
                          </div>
                          <div className="text-sm text-gray-600 font-medium">
                            Best time: {rec.best_time}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                        <FavoriteIcon className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors">
                        <ShareIcon className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-yellow-500 hover:bg-yellow-50 rounded-full transition-colors">
                        <BookmarkIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Benefits */}
                  <div className="border-l-3 border-purple-300 pl-4">
                    <h5 className="text-lg font-bold text-purple-800 flex items-center mb-3">
                      <SpaIcon className="w-6 h-6 mr-2 text-purple-600" />
                      Why This Will Help You
                    </h5>
                    <p className="text-gray-700 leading-relaxed text-base">
                      {rec.benefits}
                    </p>
                  </div>

                  {/* Instructions */}

                  <div>
                    <h5 className="text-lg font-bold text-purple-800 flex items-center mb-4">
                      <SelfImprovementIcon className="w-6 h-6 mr-2 text-purple-600" />
                      Step-by-Step Practice Guide
                    </h5>

                    {/* Enhanced instruction container */}
                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-100 overflow-hidden">
                      <div className="bg-gradient-to-r from-purple-100 to-indigo-100 px-6 py-3 border-b border-purple-200">
                        <div className="flex items-center text-purple-700">
                          <PlayArrowIcon className="w-5 h-5 mr-2" />
                          <span className="font-semibold text-sm">Follow these steps to begin your practice</span>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="space-y-4">
                          {formatInstructions(rec.how_to_perform)}
                        </div>
                      </div>
                    </div>
                  </div>


                  {/* Start Practice Button */}

                </div>
              </div>
            ))}
          </div>
        </div>
      ) : !isLoading && !error && !apiError && (
        <div className="text-center py-16 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-3xl border-2 border-dashed border-purple-200 max-w-4xl mx-auto">
          <SpaIcon className="text-6xl text-purple-400 mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Ready for Your Meditation Journey
          </h3>
          <p className="text-gray-600 text-lg">
            Share your current state to receive personalized guidance.
          </p>
        </div>
      )}

      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

export default MeditationSuggestion;
