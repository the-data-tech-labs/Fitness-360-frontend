import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MeditationTimer from "../components/mindful-moments/MeditationTimer";
import MoodJournal from "../components/mindful-moments/MoodJournal";
import BreathingExercise from "../components/mindful-moments/BreathingExercise";
import MeditationSuggestion from "../components/mindful-moments/MeditationSuggestion";

const MindfulMoments = () => {
  const [activeSection, setActiveSection] = useState("meditationSuggestion");

  const sections = [
    {
      id: "meditationSuggestion",
      name: "Meditation Guide",
      description: "AI-powered personalized meditation recommendations",
      icon: "🧘‍♀️",
      color: "from-purple-600 to-indigo-600",
      bgColor: "bg-purple-50",
      component: <MeditationSuggestion />
    },
    {
      id: "meditation",
      name: "Meditation Timer",
      description: "Guided meditation sessions with beautiful timers",
      icon: "⏰",
      color: "from-blue-600 to-cyan-600",
      bgColor: "bg-blue-50",
      component: <MeditationTimer />
    },
    {
      id: "journal",
      name: "Mood Journal",
      description: "Track your emotional journey and mindfulness progress",
      icon: "📖",
      color: "from-green-600 to-emerald-600",
      bgColor: "bg-green-50",
      component: <MoodJournal />
    },
    {
      id: "breathing",
      name: "Breathing Exercise",
      description: "Guided breathing techniques for relaxation and focus",
      icon: "🌬️",
      color: "from-pink-600 to-rose-600",
      bgColor: "bg-pink-50",
      component: <BreathingExercise />
    }
  ];

  const activeComponent = sections.find(section => section.id === activeSection);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 text-white">
        {/* Background Animation */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-ping"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-2xl">
                <span className="text-4xl">🧠</span>
              </div>
            </div>
            <h1 className="text-6xl font-black mb-4 tracking-tight">
              Mindful Moments
            </h1>
            <p className="text-xl font-light max-w-3xl mx-auto leading-relaxed opacity-90">
              Your personal sanctuary for meditation, mindfulness, and mental well-being
            </p>
            <div className="mt-8 flex items-center justify-center space-x-8 text-purple-200">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-sm">AI-Powered</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-500"></span>
                <span className="text-sm">Personalized</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-1000"></span>
                <span className="text-sm">Science-Based</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Navigation Section */}
      <div className="top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {sections.map((section, index) => (
              <motion.button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`group relative overflow-hidden rounded-2xl p-6 text-left transition-all duration-300 transform hover:scale-105 ${
                  activeSection === section.id
                    ? `bg-gradient-to-br ${section.color} text-white shadow-2xl`
                    : `${section.bgColor} hover:shadow-lg border border-gray-200`
                }`}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-current rounded-full blur-lg"></div>
                  <div className="absolute bottom-0 left-0 w-12 h-12 bg-current rounded-full blur-md"></div>
                </div>

                <div className="relative z-10">
                  <div className="text-3xl mb-3">{section.icon}</div>
                  <h3 className={`font-bold text-lg mb-2 ${
                    activeSection === section.id ? 'text-white' : 'text-gray-800'
                  }`}>
                    {section.name}
                  </h3>
                  <p className={`text-sm leading-relaxed ${
                    activeSection === section.id ? 'text-purple-100' : 'text-gray-600'
                  }`}>
                    {section.description}
                  </p>
                </div>

                {/* Active Indicator */}
                {activeSection === section.id && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-white/30 rounded-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 1.05 }}
            transition={{ 
              duration: 0.4, 
              ease: [0.25, 0.46, 0.45, 0.94] 
            }}
            className="min-h-screen"
          >
            {activeComponent?.component}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating Progress Indicator */}
      <div className="fixed bottom-8 right-8 z-40">
        <div className="bg-white/80 backdrop-blur-lg rounded-full p-4 shadow-2xl border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{activeComponent?.icon}</div>
            <div className="text-sm font-medium text-gray-700">
              {activeComponent?.name}
            </div>
          </div>
        </div>
      </div>

      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/3 left-1/4 w-48 h-48 bg-gradient-to-r from-blue-200/20 to-indigo-200/20 rounded-full blur-2xl animate-float-delayed"></div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }

        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(-180deg); }
        }

        .animate-float {
          animation: float 20s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 25s ease-in-out infinite 5s;
        }
      `}</style>
    </div>
  );
};

export default MindfulMoments;
