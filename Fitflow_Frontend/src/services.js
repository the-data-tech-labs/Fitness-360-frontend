// src/services.js
export const fetchFitnessPlan = async () => {
    try {
      const response = await fetch("/api/fitness-plan"); // Replace with your API endpoint
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching fitness plan:", error);
      throw error;
    }
  };