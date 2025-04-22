import React, { useState, useEffect } from "react";
import "./MeditationTimer.css"; // Import the CSS file

const MeditationTimer = () => {
  const [time, setTime] = useState(600); // 10 minutes in seconds (default)
  const [isActive, setIsActive] = useState(false); // Track if the timer is running
  const [customMinutes, setCustomMinutes] = useState(""); // Custom time input

  // Sound file path
  const soundFile = "/sounds/meditation-complete.mp3";

  // Format time in MM:SS format
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
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
      setTime(minutes * 60); // Convert minutes to seconds
      setCustomMinutes(""); // Clear the input
    }
  };

  // Start/stop the timer
  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  // Reset the timer
  const resetTimer = () => {
    setIsActive(false);
    setTime(600); // Reset to 10 minutes
  };

  // Play sound when timer completes
  const playSound = () => {
    const audio = new Audio(soundFile);
    audio.play();
  };

  // Timer logic
  useEffect(() => {
    let interval;

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1); // Decrement time by 1 second
      }, 1000);
    } else if (time === 0) {
      setIsActive(false); // Stop the timer when it reaches 0
      playSound(); // Play the sound when the timer completes
    }

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [isActive, time]);

  return (
    <div className="meditation-timer">
      <h1>Meditation Timer</h1>
      <div className="timer-display">{formatTime(time)}</div>

      <div className="controls">
        <button onClick={toggleTimer}>
          {isActive ? "Pause" : "Start"}
        </button>
        <button onClick={resetTimer}>Reset</button>
      </div>

      <div className="custom-time">
        <input
          type="text"
          value={customMinutes}
          onChange={handleCustomTimeChange}
          placeholder="Enter minutes (max 180)"
        />
        <button onClick={setCustomTime}>Set Time</button>
      </div>

      <div className="quick-select">
        <button onClick={() => setTime(5 * 60)}>5 min</button>
        <button onClick={() => setTime(10 * 60)}>10 min</button>
        <button onClick={() => setTime(15 * 60)}>15 min</button>
      </div>

      <div className="meditation-tips">
        <h2>Meditation Tips</h2>
        <ul>
          <li>Find a quiet, comfortable space</li>
          <li>Sit in a relaxed, upright position</li>
          <li>Focus on your breath</li>
          <li>Let thoughts come and go without judgment</li>
        </ul>
      </div>
    </div>
  );
};

export default MeditationTimer;