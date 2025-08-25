import { useState, useEffect } from 'react';
import { 
  Wind, 
  Play, 
  Pause, 
  RotateCcw, 
  Clock, 
  Heart,
  Settings,
  Volume2,
  VolumeX
} from 'lucide-react';

const BreathingExercise = () => {
  const [phase, setPhase] = useState('ready');
  const [counter, setCounter] = useState(4);
  const [isActive, setIsActive] = useState(false);
  const [duration, setDuration] = useState('5');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [remainingTime, setRemainingTime] = useState(300); // 5 minutes default
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [breathPattern, setBreathPattern] = useState('4-7-8'); // Default pattern

  // Breathing patterns
  const patterns = {
    '4-7-8': { inhale: 4, hold: 7, exhale: 8, name: '4-7-8 Relaxation' },
    '4-4-4': { inhale: 4, hold: 4, exhale: 4, name: 'Box Breathing' },
    '4-6-8': { inhale: 4, hold: 6, exhale: 8, name: 'Calming Breath' },
    '6-2-6': { inhale: 6, hold: 2, exhale: 6, name: 'Equal Breathing' }
  };

  const currentPattern = patterns[breathPattern];

  useEffect(() => {
    let interval;
    const completeExercise = () => {
    setIsActive(false);
    setPhase('complete');
  };

    if (isActive && remainingTime > 0) {
      interval = setInterval(() => {
        setCounter((prev) => {
          if (prev === 1) {
            switch (phase) {
              case 'inhale':
                setPhase('hold');
                return currentPattern.hold;
              case 'hold':
                setPhase('exhale');
                return currentPattern.exhale;
              case 'exhale':
                setPhase('inhale');
                return currentPattern.inhale;
              default:
                return prev;
            }
          }
          return prev - 1;
        });

        setElapsedTime((prev) => prev + 1);
        setRemainingTime((prev) => prev - 1);
      }, 1000);
    }

    if (remainingTime <= 0) {
      completeExercise();
    }

    return () => clearInterval(interval);
  }, [isActive, phase, remainingTime, currentPattern]);

  const startExercise = () => {
    setIsActive(true);
    setPhase('inhale');
    setCounter(currentPattern.inhale);
    if (elapsedTime === 0) {
      setRemainingTime(parseInt(duration, 10) * 60);
    }
  };

  const pauseExercise = () => {
    setIsActive(false);
  };

  const resetExercise = () => {
    setIsActive(false);
    setPhase('ready');
    setCounter(currentPattern.inhale);
    setElapsedTime(0);
    setRemainingTime(parseInt(duration, 10) * 60);
  };

  

  const handleDurationChange = (newDuration) => {
    setDuration(newDuration);
    if (!isActive) {
      setRemainingTime(parseInt(newDuration, 10) * 60);
    }
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const getPhaseInstruction = () => {
    switch (phase) {
      case 'inhale':
        return 'Breathe In';
      case 'hold':
        return 'Hold';
      case 'exhale':
        return 'Breathe Out';
      case 'complete':
        return 'Well Done!';
      default:
        return 'Ready to Begin?';
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale':
        return 'from-blue-400 to-cyan-400';
      case 'hold':
        return 'from-purple-400 to-pink-400';
      case 'exhale':
        return 'from-green-400 to-emerald-400';
      case 'complete':
        return 'from-yellow-400 to-orange-400';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  const getCircleScale = () => {
    switch (phase) {
      case 'inhale':
        return 'scale-110';
      case 'hold':
        return 'scale-105';
      case 'exhale':
        return 'scale-95';
      default:
        return 'scale-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Settings Panel */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Settings</h3>
              <button 
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Breathing Pattern */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3">Breathing Pattern</label>
              <div className="space-y-2">
                {Object.entries(patterns).map(([key, pattern]) => (
                  <button
                    key={key}
                    onClick={() => setBreathPattern(key)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      breathPattern === key 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-slate-700 hover:bg-slate-600'
                    }`}
                  >
                    <div className="font-medium">{pattern.name}</div>
                    <div className="text-sm opacity-75">
                      {pattern.inhale}s in • {pattern.hold}s hold • {pattern.exhale}s out
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3">Duration (minutes)</label>
              <div className="grid grid-cols-4 gap-2">
                {['1', '3', '5', '10', '15', '20'].map((time) => (
                  <button
                    key={time}
                    onClick={() => handleDurationChange(time)}
                    disabled={isActive}
                    className={`p-2 rounded-lg transition-all ${
                      duration === time 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-slate-700 hover:bg-slate-600 disabled:opacity-50'
                    }`}
                  >
                    {time}m
                  </button>
                ))}
              </div>
            </div>

            {/* Sound Toggle */}
            <div className="flex items-center justify-between">
              <span className="font-medium">Sound Effects</span>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2 rounded-lg transition-all ${
                  soundEnabled ? 'bg-purple-600' : 'bg-slate-700'
                }`}
              >
                {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowSettings(true)}
              className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all"
            >
              <Settings size={24} />
            </button>
            
            <h1 className="text-4xl font-bold">
              {currentPattern.name}
            </h1>
            
            <div className="flex items-center bg-white/10 rounded-full px-4 py-2">
              <Clock size={20} className="mr-2" />
              <span className="font-mono font-bold">{formatTime(remainingTime)}</span>
            </div>
          </div>
          
          <p className="text-purple-200 text-lg">
            Find your calm through mindful breathing
          </p>
        </div>

        {/* Main Breathing Circle */}
        <div className="flex flex-col items-center justify-center mb-12">
          <div className="relative mb-8">
            {/* Outer Ring */}
            <div className="w-80 h-80 rounded-full border-4 border-white/20 flex items-center justify-center relative">
              {/* Animated Circle */}
              <div 
                className={`w-64 h-64 rounded-full bg-gradient-to-br ${getPhaseColor()} 
                  flex items-center justify-center transition-all duration-1000 ease-in-out 
                  ${getCircleScale()} shadow-2xl`}
              >
                {/* Breathing Icon */}
                <div className="text-center">
                  {phase === 'complete' ? (
                    <Heart size={60} className="mx-auto mb-4 animate-pulse" />
                  ) : (
                    <Heart size={60} className="mx-auto mb-4" />
                  )}
                  
                  {/* Counter */}
                  <div className="text-4xl font-bold mb-2">
                    {phase === 'ready' || phase === 'complete' ? '' : counter}
                  </div>
                  
                  {/* Phase Text */}
                  <div className="text-xl font-semibold">
                    {getPhaseInstruction()}
                  </div>
                </div>
              </div>

              {/* Progress Ring */}
              <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle
                  cx="160"
                  cy="160"
                  r="154"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="4"
                  fill="transparent"
                />
                <circle
                  cx="160"
                  cy="160"
                  r="154"
                  stroke="url(#progressGradient)"
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 154}`}
                  strokeDashoffset={`${2 * Math.PI * 154 * (remainingTime / (parseInt(duration, 10) * 60))}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{stopColor: "#8B5CF6", stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: "#EC4899", stopOpacity: 1}} />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center space-x-4">
            {!isActive ? (
              <button
                onClick={startExercise}
                className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 
                  hover:from-green-600 hover:to-emerald-700 px-8 py-4 rounded-full font-semibold 
                  transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Play size={24} />
                <span>{elapsedTime > 0 ? 'Resume' : 'Start'}</span>
              </button>
            ) : (
              <button
                onClick={pauseExercise}
                className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-600 
                  hover:from-orange-600 hover:to-red-700 px-8 py-4 rounded-full font-semibold 
                  transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Pause size={24} />
                <span>Pause</span>
              </button>
            )}

            <button
              onClick={resetExercise}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 
                px-6 py-4 rounded-full font-semibold transition-all duration-300 
                transform hover:scale-105"
            >
              <RotateCcw size={20} />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <Wind className="mr-2" />
            How it works:
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="font-bold">1</span>
              </div>
              <h4 className="font-semibold mb-2">Inhale</h4>
              <p className="text-purple-200 text-sm">
                Breathe in slowly through your nose for {currentPattern.inhale} seconds
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="font-bold">2</span>
              </div>
              <h4 className="font-semibold mb-2">Hold</h4>
              <p className="text-purple-200 text-sm">
                Hold your breath gently for {currentPattern.hold} seconds
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="font-bold">3</span>
              </div>
              <h4 className="font-semibold mb-2">Exhale</h4>
              <p className="text-purple-200 text-sm">
                Breathe out slowly through your mouth for {currentPattern.exhale} seconds
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{formatTime(elapsedTime)}</div>
            <div className="text-sm text-purple-200">Time Practiced</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              {Math.floor(elapsedTime / (currentPattern.inhale + currentPattern.hold + currentPattern.exhale))}
            </div>
            <div className="text-sm text-purple-200">Breath Cycles</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{currentPattern.name.split(' ')[0]}</div>
            <div className="text-sm text-purple-200">Pattern</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-pink-400">{duration}m</div>
            <div className="text-sm text-purple-200">Goal</div>
          </div>
        </div>

        {/* Completion Message */}
        {phase === 'complete' && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-40">
            <div className="bg-white rounded-2xl p-8 text-center max-w-md mx-4 text-gray-800">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold mb-4">Breathing Session Complete!</h2>
              <p className="text-gray-600 mb-6">
                Great job! You completed {formatTime(elapsedTime)} of mindful breathing.
              </p>
              <button
                onClick={resetExercise}
                className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-all"
              >
                Start New Session
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BreathingExercise;
