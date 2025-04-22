import React, { useState } from "react";
import MeditationTimer from "../components/mindful-moments/MeditationTimer";
import MoodJournal from "../components/mindful-moments/MoodJournal";
import BreathingExercise from "../components/mindful-moments/BreathingExercise";
import MeditationSuggestion from "../components/mindful-moments/MeditationSuggestion";
import "./MindfulMoments.css"

const MindfulMoments = () => {
  const [activeSection, setActiveSection] = useState("meditationSuggestion"); // Set default to Meditation Guide

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <h1>Mindful Moments</h1>
      </div>

      {/* Navigation Buttons */}
      <div className="nav">
        <button
          onClick={() => setActiveSection("meditationSuggestion")}
          className={activeSection === "meditationSuggestion" ? "active" : ""}
        >
          Meditation Guide
        </button>
        <button
          onClick={() => setActiveSection("meditation")}
          className={activeSection === "meditation" ? "active" : ""}
        >
          Meditation Timer
        </button>
        <button
          onClick={() => setActiveSection("journal")}
          className={activeSection === "journal" ? "active" : ""}
        >
          Mood Journal
        </button>
        <button
          onClick={() => setActiveSection("breathing")}
          className={activeSection === "breathing" ? "active" : ""}
        >
          Breathing Exercise
        </button>
      </div>

      {/* Render Active Section */}
      <div className="section-container">
        {activeSection === "meditationSuggestion" && <MeditationSuggestion />}
        {activeSection === "meditation" && <MeditationTimer />}
        {activeSection === "journal" && <MoodJournal />}
        {activeSection === "breathing" && <BreathingExercise />}
      </div>
    </div>
  );
};

export default MindfulMoments;