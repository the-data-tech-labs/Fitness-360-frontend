import { useState, useEffect } from "react";
import { 
  FaPlay, 
  FaPause, 
  FaStop, 
  FaVolumeUp,
  FaVolumeMute,
  FaExpand,
  FaCompress
} from 'react-icons/fa';
import { 
  GiMeditation,
  GiLotusFlower 
} from 'react-icons/gi';
import { 
  MdAccessTime,
  MdCheckCircle 
} from 'react-icons/md';
import { 
  BiTimer 
} from 'react-icons/bi';

const MeditationTimer = () => {
  const [time, setTime] = useState(600); // 10 minutes in seconds (default)
  const [initialTime, setInitialTime] = useState(600);
  const [isActive, setIsActive] = useState(false);
  const [customMinutes, setCustomMinutes] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showTips, setShowTips] = useState(true);

  // Sound file path
  const soundFile = "/sounds/meditation-complete.mp3";

  // Format time in MM:SS format
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Calculate progress percentage
  const getProgress = () => {
    return ((initialTime - time) / initialTime) * 100;
  };

  // Handle custom time input
  const handleCustomTimeChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && Number(value) <= 180) {
      setCustomMinutes(value);
    }
  };

  // Set custom time
  const setCustomTime = () => {
    const minutes = Number(customMinutes);
    if (minutes > 0) {
      const newTime = minutes * 60;
      setTime(newTime);
      setInitialTime(newTime);
      setCustomMinutes("");
    }
  };

  // Set preset time
  const setPresetTime = (minutes) => {
    const newTime = minutes * 60;
    setTime(newTime);
    setInitialTime(newTime);
    setIsActive(false);
  };

  // Start/pause the timer
  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  // Stop and reset the timer
  const stopTimer = () => {
    setIsActive(false);
    setTime(initialTime);
  };

  // Play sound when timer completes
  

  // Timer logic
  useEffect(() => {
    let interval;
    const playSound = () => {
    if (soundEnabled) {
      const audio = new Audio(soundFile);
      audio.play().catch(e => console.log('Sound playback failed:', e));
    }
  };
  
    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      setIsActive(false);
      playSound();
    }

    return () => clearInterval(interval);
  }, [isActive, time, soundEnabled]);

  const presetTimes = [
    { label: "5 min", value: 5, color: "bg-green-500" },
    { label: "10 min", value: 10, color: "bg-blue-500" },
    { label: "15 min", value: 15, color: "bg-purple-500" },
    { label: "20 min", value: 20, color: "bg-indigo-500" },
    { label: "30 min", value: 30, color: "bg-pink-500" }
  ];

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isFullscreen 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
        : 'bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50'
    }`}>
      <div className="max-w-4xl mx-auto p-6">
        
        {/* Header */}
        <div className={`text-center mb-8 transition-all duration-500 ${
          isFullscreen ? 'text-white' : 'text-gray-800'
        }`}>
          <div className="flex items-center justify-center mb-4">
            <GiMeditation className="text-5xl mr-3 text-purple-600" />
            <h1 className="text-4xl font-black tracking-tight">
              Meditation Timer
            </h1>
          </div>
          <p className={`text-lg ${isFullscreen ? 'text-purple-200' : 'text-gray-600'}`}>
            Find your inner peace with guided timing
          </p>
        </div>

        {/* Main Timer Card */}
        <div className={`relative mx-auto max-w-md mb-8 transition-all duration-500 ${
          isFullscreen 
            ? 'bg-white/5 backdrop-blur-lg border border-white/10' 
            : 'bg-white shadow-2xl border border-purple-100'
        } rounded-3xl p-8`}>
          
          {/* Circular Progress Ring */}
          <div className="relative flex items-center justify-center mb-8">
            <svg className="w-64 h-64 transform -rotate-90" viewBox="0 0 200 200">
              {/* Background circle */}
              <circle
                cx="100"
                cy="100"
                r="90"
                stroke={isFullscreen ? "rgba(255,255,255,0.1)" : "#E5E7EB"}
                strokeWidth="8"
                fill="transparent"
              />
              {/* Progress circle */}
              <circle
                cx="100"
                cy="100"
                r="90"
                stroke="url(#progressGradient)"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 90}`}
                strokeDashoffset={`${2 * Math.PI * 90 * (1 - getProgress() / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
              {/* Gradient definition */}
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{stopColor: "#8B5CF6", stopOpacity: 1}} />
                  <stop offset="100%" style={{stopColor: "#EC4899", stopOpacity: 1}} />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Timer Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className={`text-6xl font-mono font-bold mb-2 transition-colors duration-500 ${
                isFullscreen ? 'text-white' : 'text-gray-800'
              }`}>
                {formatTime(time)}
              </div>
              <div className={`text-sm font-medium transition-colors duration-500 ${
                isFullscreen ? 'text-purple-200' : 'text-purple-600'
              }`}>
                {isActive ? 'Meditating...' : time === 0 ? 'Complete!' : 'Ready to start'}
              </div>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={toggleTimer}
              className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-110 ${
                isActive 
                  ? 'bg-orange-500 hover:bg-orange-600' 
                  : 'bg-green-500 hover:bg-green-600'
              } text-white`}
            >
              {isActive ? <FaPause className="text-2xl" /> : <FaPlay className="text-2xl ml-1" />}
            </button>
            
            <button
              onClick={stopTimer}
              className="w-16 h-16 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-110"
            >
              <FaStop className="text-2xl" />
            </button>
          </div>

          {/* Settings Row */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-3 rounded-full transition-all duration-300 ${
                soundEnabled 
                  ? 'bg-purple-100 text-purple-600' 
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {soundEnabled ? <FaVolumeUp className="text-lg" /> : <FaVolumeMute className="text-lg" />}
            </button>
            
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className={`p-3 rounded-full transition-all duration-300 ${
                isFullscreen 
                  ? 'bg-purple-100 text-purple-600' 
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {isFullscreen ? <FaCompress className="text-lg" /> : <FaExpand className="text-lg" />}
            </button>
          </div>
        </div>

        {/* Quick Time Selection */}
        {!isFullscreen && (
          <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <BiTimer className="mr-2 text-purple-600 text-2xl" />
              Quick Select
            </h3>
            <div className="grid grid-cols-5 gap-3">
              {presetTimes.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => setPresetTime(preset.value)}
                  className={`${preset.color} text-white font-semibold py-3 px-4 rounded-xl hover:opacity-90 transition-all duration-200 transform hover:scale-105 shadow-md`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Custom Time Input */}
        {!isFullscreen && (
          <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <MdAccessTime className="mr-2 text-purple-600 text-2xl" />
              Custom Time
            </h3>
            <div className="flex items-center space-x-4">
              <input
                type="text"
                value={customMinutes}
                onChange={handleCustomTimeChange}
                placeholder="Enter minutes (max 180)"
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
              />
              <button
                onClick={setCustomTime}
                disabled={!customMinutes}
                className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Set Time
              </button>
            </div>
          </div>
        )}

        {/* Meditation Tips */}
        {!isFullscreen && showTips && (
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl border border-purple-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-purple-800 flex items-center">
                <GiLotusFlower className="mr-2 text-2xl" />
                Meditation Tips
              </h3>
              <button
                onClick={() => setShowTips(false)}
                className="text-purple-400 hover:text-purple-600 transition-colors text-xl font-bold"
              >
                ✕
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { icon: "🧘‍♀️", tip: "Find a quiet, comfortable space" },
                { icon: "🪑", tip: "Sit in a relaxed, upright position" },
                { icon: "🌬️", tip: "Focus on your natural breath" },
                { icon: "💭", tip: "Let thoughts come and go without judgment" },
                { icon: "⏰", tip: "Start with shorter sessions and build up" },
                { icon: "🔄", tip: "Practice regularly for best results" }
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-white/50 rounded-lg">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-gray-700 font-medium">{item.tip}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completion Message */}
        {time === 0 && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-8 max-w-md text-center shadow-2xl">
              <div className="text-6xl mb-4">🎉</div>
              <div className="flex items-center justify-center mb-4">
                <MdCheckCircle className="text-green-500 text-4xl mr-2" />
                <h2 className="text-2xl font-bold text-gray-800">
                  Meditation Complete!
                </h2>
              </div>
              <p className="text-gray-600 mb-6">
                Well done! You've completed your meditation session.
              </p>
              <button
                onClick={() => setTime(initialTime)}
                className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-all duration-200 flex items-center mx-auto"
              >
                <BiTimer className="mr-2" />
                Start New Session
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MeditationTimer;
