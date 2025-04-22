import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MoodJournal.css";

const MoodJournal = () => {
  const [entries, setEntries] = useState([]);
  const [currentMood, setCurrentMood] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Retrieve tokens from localStorage
  const accessToken = localStorage.getItem("access_token");

  // Set up Axios with the access token
  axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

  // Fetch journal entries
  const fetchEntries = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/entries/");
      setEntries(response.data);
    } catch (error) {
      console.error("Error fetching entries:", error);
      alert("Failed to fetch journal entries.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchEntries();
    } else {
      alert("You must be logged in to access the Mood Journal.");
      setIsLoading(false);
    }
  }, [accessToken]);

  // Handle mood selection
  const handleMoodSelection = (mood) => {
    setCurrentMood(mood);
  };

  // Handle form submission (create a new entry)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentMood) {
      alert("Please select a mood!"); // Ensure a mood is selected
      return;
    }

    try {
      const newEntry = {
        date: new Date().toLocaleDateString(), // Get the current date
        mood: currentMood, // Save the selected mood
        notes, // Save the journal entry text
      };

      // Save the entry to the backend
      const response = await axios.post("http://localhost:8000/api/entries/", newEntry);
      setEntries([response.data, ...entries]); // Add the new entry to the list
      setCurrentMood(""); // Reset the mood selection
      setNotes(""); // Clear the textarea
    } catch (error) {
      console.error("Error saving entry:", error);
      alert("Failed to save journal entry.");
    }
  };

  // Show loading state
  if (isLoading) {
    return <div className="mood-journal">Loading...</div>;
  }

  return (
    <div className="mood-journal">
      <h1>How are you feeling today?</h1>

      <form onSubmit={handleSubmit}>
        <div className="mood-selector">
          <button
            type="button"
            onClick={() => handleMoodSelection("happy")}
            className={currentMood === "happy" ? "active" : ""}
          >
            😊
          </button>
          <button
            type="button"
            onClick={() => handleMoodSelection("neutral")}
            className={currentMood === "neutral" ? "active" : ""}
          >
            😐
          </button>
          <button
            type="button"
            onClick={() => handleMoodSelection("sad")}
            className={currentMood === "sad" ? "active" : ""}
          >
            😞
          </button>
        </div>

        <textarea
          className="journal-entry"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Write your thoughts here..."
          rows="4"
        ></textarea>

        <button type="submit" className="save-entry">
          Save Entry
        </button>
      </form>

      <div className="previous-entries">
        <h2>Previous Entries</h2>
        {entries.map((entry) => (
          <div key={entry.id} className="entry">
            <div className="date">{entry.date}</div>
            <div className="mood">{entry.mood}</div>
            <div className="notes">{entry.notes}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoodJournal;