import React, { createContext, useState } from 'react';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [fitnessData, setFitnessData] = useState(null);
  const [nutritionData, setNutritionData] = useState(null);

  const updateFitnessData = (data) => {
    setFitnessData(data);
  };

  const updateNutritionData = (data) => {
    setNutritionData(data);
  };

  return (
    <DataContext.Provider value={{ fitnessData, nutritionData, updateFitnessData, updateNutritionData }}>
      {children}
    </DataContext.Provider>
  );
};