import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const MoodJournal = () => {
  const [entries, setEntries] = useState([]);
  const [currentMood, setCurrentMood] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedEntry, setExpandedEntry] = useState(null);
  const [filterMood, setFilterMood] = useState("all");
  const [showStats, setShowStats] = useState(false);
  const backendUrl = process.env.REACT_APP_BACKEND_URL
  // Enhanced mood options with colors and descriptions
  const moodOptions = [
    {
      value: "ecstatic",
      emoji: "🤩",
      label: "Ecstatic",
      color: "from-yellow-400 to-orange-500",
      description: "Feeling amazing and energetic!"
    },
    {
      value: "happy",
      emoji: "😊",
      label: "Happy",
      color: "from-green-400 to-emerald-500",
      description: "Feeling good and positive"
    },
    {
      value: "content",
      emoji: "😌",
      label: "Content",
      color: "from-blue-400 to-cyan-500",
      description: "Peaceful and satisfied"
    },
    {
      value: "neutral",
      emoji: "😐",
      label: "Neutral",
      color: "from-gray-400 to-slate-500",
      description: "Feeling okay, nothing special"
    },
    {
      value: "anxious",
      emoji: "😰",
      label: "Anxious",
      color: "from-orange-400 to-red-500",
      description: "Worried or stressed about something"
    },
    {
      value: "sad",
      emoji: "😢",
      label: "Sad",
      color: "from-indigo-400 to-purple-500",
      description: "Feeling down or melancholy"
    },
    {
      value: "angry",
      emoji: "😠",
      label: "Angry",
      color: "from-red-500 to-pink-600",
      description: "Frustrated or upset"
    },
    {
      value: "tired",
      emoji: "😴",
      label: "Tired",
      color: "from-purple-400 to-indigo-500",
      description: "Exhausted or drained"
    }
  ];

  const accessToken = localStorage.getItem("access_token");

  // Set up Axios with the access token
  useEffect(() => {
    if (accessToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    }
  }, [accessToken]);

  // Fetch journal entries


  useEffect(() => {

    const fetchEntries = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/entries/`);
        setEntries(response.data);
      } catch (error) {
        console.error("Error fetching entries:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("access_token");
          window.location.reload();
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (accessToken) {
      fetchEntries();
    } else {
      setIsLoading(false);
    }
  }, [accessToken,  backendUrl]);

  // Handle mood selection
  const handleMoodSelection = (mood) => {
    setCurrentMood(mood);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentMood) {
      return;
    }

    setIsSaving(true);
    try {
      const newEntry = {
        date: new Date().toISOString().split('T')[0],
        mood: currentMood,
        notes: notes.trim() || null,
      };

      const response = await axios.post(`${backendUrl}/api/entries/`, newEntry);
      setEntries([response.data, ...entries]);
      setCurrentMood("");
      setNotes("");

      // Show success animation
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 500);

    } catch (error) {
      console.error("Error saving entry:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Get mood statistics
  const getMoodStats = () => {
    const moodCounts = {};
    entries.forEach(entry => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    });

    const totalEntries = entries.length;
    const mostCommonMood = Object.keys(moodCounts).reduce((a, b) =>
      moodCounts[a] > moodCounts[b] ? a : b, Object.keys(moodCounts)[0]
    );

    return { moodCounts, totalEntries, mostCommonMood };
  };

  // Filter entries by mood
  const filteredEntries = filterMood === 'all'
    ? entries
    : entries.filter(entry => entry.mood === filterMood);

  const stats = getMoodStats();

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full animate-pulse mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800">Loading your journal...</h2>
        </div>
      </div>
    );
  }

  // Not authenticated state
  if (!accessToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl p-8 shadow-xl max-w-md">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Authentication Required</h2>
          <p className="text-gray-600">Please log in to access your mood journal.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-xl">
              <span className="text-3xl">💭</span>
            </div>
          </div>
          <h1 className="text-4xl font-black text-gray-800 mb-4">
            How are you feeling today?
          </h1>
          <p className="text-lg text-gray-600">
            Track your emotions and reflect on your journey
          </p>
        </motion.div>

        {/* Stats Toggle */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setShowStats(!showStats)}
            className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-200"
          >
            <span className="text-lg">📊</span>
            <span className="font-medium text-gray-700">
              {showStats ? 'Hide Stats' : 'View Stats'}
            </span>
          </button>
        </div>

        {/* Statistics Panel */}
        <AnimatePresence>
          {showStats && stats.totalEntries > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-xl border border-purple-200"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="mr-2">📈</span>
                Your Mood Journey
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{stats.totalEntries}</div>
                  <div className="text-sm text-gray-600">Total Entries</div>
                </div>

                {stats.mostCommonMood && (
                  <div className="text-center">
                    <div className="text-3xl">
                      {moodOptions.find(m => m.value === stats.mostCommonMood)?.emoji}
                    </div>
                    <div className="text-sm text-gray-600">Most Common Mood</div>
                  </div>
                )}

                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {Math.round((entries.length / 30) * 100) || 0}%
                  </div>
                  <div className="text-sm text-gray-600">Monthly Goal</div>
                </div>
              </div>

              {/* Mood Distribution */}
              <div className="mt-6">
                <h4 className="font-semibold text-gray-700 mb-3">Mood Distribution</h4>
                <div className="space-y-2">
                  {Object.entries(stats.moodCounts).map(([mood, count]) => {
                    const moodOption = moodOptions.find(m => m.value === mood);
                    const percentage = (count / stats.totalEntries) * 100;

                    return (
                      <div key={mood} className="flex items-center space-x-3">
                        <span className="text-lg">{moodOption?.emoji}</span>
                        <span className="w-20 text-sm font-medium text-gray-600">
                          {moodOption?.label}
                        </span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full bg-gradient-to-r ${moodOption?.color}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-500 w-8">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mood Entry Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-purple-200 mb-8"
        >
          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Mood Selector */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
                Select Your Current Mood
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {moodOptions.map((mood) => (
                  <motion.button
                    key={mood.value}
                    type="button"
                    onClick={() => handleMoodSelection(mood.value)}
                    className={`group relative p-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${currentMood === mood.value
                        ? `border-purple-400 bg-gradient-to-br ${mood.color} text-white shadow-xl`
                        : "border-gray-200 bg-white hover:border-purple-300 hover:shadow-lg"
                      }`}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">{mood.emoji}</div>
                      <div className={`font-semibold text-sm ${currentMood === mood.value ? 'text-white' : 'text-gray-700'
                        }`}>
                        {mood.label}
                      </div>
                      <div className={`text-xs mt-1 ${currentMood === mood.value ? 'text-white/80' : 'text-gray-500'
                        }`}>
                        {mood.description}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Notes Section */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-4">
                What's on your mind? (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Share your thoughts, feelings, or what happened today..."
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all duration-200 resize-none placeholder-gray-400"
              />
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <motion.button
                type="submit"
                disabled={!currentMood || isSaving}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                whileHover={{ scale: !currentMood || isSaving ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isSaving ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>💾</span>
                    <span>Save Entry</span>
                  </div>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Previous Entries Section */}
        {entries.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <span className="mr-2">📚</span>
                Your Journal Entries
              </h2>

              {/* Mood Filter */}
              <select
                value={filterMood}
                onChange={(e) => setFilterMood(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-200"
              >
                <option value="all">All Moods</option>
                {moodOptions.map(mood => (
                  <option key={mood.value} value={mood.value}>
                    {mood.emoji} {mood.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-4">
              <AnimatePresence>
                {filteredEntries.map((entry, index) => {
                  const moodOption = moodOptions.find(m => m.value === entry.mood);
                  const isExpanded = expandedEntry === entry.id;

                  return (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-purple-200 overflow-hidden hover:shadow-xl transition-all duration-300"
                    >
                      <div
                        className="p-6 cursor-pointer"
                        onClick={() => setExpandedEntry(isExpanded ? null : entry.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${moodOption?.color} flex items-center justify-center text-xl shadow-md`}>
                              {moodOption?.emoji}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800">
                                {moodOption?.label} Mood
                              </h3>
                              <p className="text-sm text-gray-500">
                                {new Date(entry.date).toLocaleDateString('en-US', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {entry.notes && (
                              <span className="text-gray-400">
                                📝
                              </span>
                            )}
                            <motion.span
                              animate={{ rotate: isExpanded ? 180 : 0 }}
                              className="text-gray-400"
                            >
                              ⌄
                            </motion.span>
                          </div>
                        </div>

                        <AnimatePresence>
                          {isExpanded && entry.notes && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-4 pt-4 border-t border-gray-200"
                            >
                              <p className="text-gray-700 leading-relaxed">
                                {entry.notes}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {filteredEntries.length === 0 && filterMood !== 'all' && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No entries found
                </h3>
                <p className="text-gray-500">
                  No journal entries match the selected mood filter.
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Empty state */}
        {entries.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">✨</div>
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">
              Start Your Journey
            </h3>
            <p className="text-gray-500">
              Record your first mood entry to begin tracking your emotional wellness.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MoodJournal;
