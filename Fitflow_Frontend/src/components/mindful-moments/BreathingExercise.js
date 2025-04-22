import React, { useState, useEffect } from 'react';
import { Wind } from 'lucide-react'; // Import the Wind icon
import './BreathingExercise.css'; // Keep the existing CSS file

const BreathingExercise = () => {
  const [phase, setPhase] = useState('ready');
  const [counter, setCounter] = useState(4);
  const [isActive, setIsActive] = useState(false);
  const [duration, setDuration] = useState('1'); // Default duration as a string
  const [elapsedTime, setElapsedTime] = useState(0); // Track elapsed time in seconds
  const [remainingTime, setRemainingTime] = useState(parseInt(duration, 10) * 60); // Remaining time in seconds

  useEffect(() => {
    let interval;

    if (isActive) {
      interval = setInterval(() => {
        setCounter((prev) => {
          if (prev === 1) {
            switch (phase) {
              case 'inhale':
                setPhase('hold');
                return 7;
              case 'hold':
                setPhase('exhale');
                return 8;
              case 'exhale':
                setPhase('inhale');
                return 4;
              default:
                return prev;
            }
          }
          return prev - 1;
        });

        // Increment elapsed time and update remaining time
        setElapsedTime((prev) => prev + 1);
        setRemainingTime((prev) => prev - 1);
      }, 1000);
    }

    // Check if the elapsed time has reached the specified duration
    if (elapsedTime >= parseInt(duration, 10) * 60) {
      stopExercise();
    }

    return () => clearInterval(interval);
  }, [isActive, phase, elapsedTime, duration]);

  const startExercise = () => {
    setIsActive(true);
    setPhase('inhale');
    setCounter(4);
    setElapsedTime(0); // Reset elapsed time when starting the exercise
    setRemainingTime(parseInt(duration, 10) * 60); // Reset remaining time based on the user's input
  };

  const stopExercise = () => {
    setIsActive(false);
    setPhase('ready');
    setCounter(4);
    setElapsedTime(0); // Reset elapsed time when stopping the exercise
    setRemainingTime(parseInt(duration, 10) * 60); // Reset remaining time
  };

  const handleDurationChange = (e) => {
    const value = e.target.value;
    // Allow only positive numbers
    if (/^\d*$/.test(value) && value !== '') {
      setDuration(value);
      setRemainingTime(parseInt(value, 10) * 60); // Update remaining time when duration changes
    } else if (value === '') {
      setDuration(''); // Allow the input to be empty temporarily
    }
  };

  // Helper function to format the remaining time as MM:SS
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Inline styles
  const timerStyle = {
    position: 'fixed',
    top: '20px',
    right: '20px',
    fontSize: '18px',
    fontWeight: 'bold',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: '10px',
    borderRadius: '5px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    color: '#333',
  };

  const durationInputStyle = {
    padding: '5px',
    fontSize: '16px',
    width: '60px',
    textAlign: 'center',
    border: '1px solid #ccc',
    borderRadius: '5px',
  };

  return (
    <div className="container">
      {/* Timer Display */}
      <div style={timerStyle}>
        Time Remaining: {formatTime(remainingTime)}
      </div>

      <h1 className="title">4-7-8 Breathing Exercise</h1>

      <div className="duration-input">
        <label htmlFor="duration">Duration (minutes): </label>
        <input
          type="text" // Use type="text" to allow typing
          id="duration"
          value={duration}
          onChange={handleDurationChange}
          min="1"
          disabled={isActive}
          style={durationInputStyle}
        />
      </div>

      <div className={`circle ${phase}`}>
        <Wind className="icon" /> {/* Wind icon */}
        <div>
          {phase === 'ready' ? 'Ready?' : counter}
        </div>
      </div>

      {!isActive ? (
        <button className="button start-button" onClick={startExercise}>
          Start Breathing
        </button>
      ) : (
        <button className="button stop-button" onClick={stopExercise}>
          Stop
        </button>
      )}

      <div className="instructions">
        <h3>How it works:</h3>
        <ul>
          <li>1. Inhale quietly through your nose for 4 seconds</li>
          <li>2. Hold your breath for 7 seconds</li>
          <li>3. Exhale completely through your mouth for 8 seconds</li>
        </ul>
      </div>
    </div>
  );
};

export default BreathingExercise;