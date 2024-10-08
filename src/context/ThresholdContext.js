// ThresholdContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThresholdContext = createContext();

export const useThreshold = () => useContext(ThresholdContext);

export const ThresholdProvider = ({ children }) => {
  const [tempThreshold, setTempThresholdState] = useState(() => {
    // Get tempThreshold from local storage, or default to an empty string if not found
    return localStorage.getItem('tempThreshold') || '';
  });

  const [heartRateThreshold, setHeartRateThresholdState] = useState(() => {
    // Get heartRateThreshold from local storage, or default to an empty string if not found
    return localStorage.getItem('heartRateThreshold') || '';
  });

  // Update local storage when thresholds change
  useEffect(() => {
    localStorage.setItem('tempThreshold', tempThreshold);
  }, [tempThreshold]);

  useEffect(() => {
    localStorage.setItem('heartRateThreshold', heartRateThreshold);
  }, [heartRateThreshold]);

  const setTempThreshold = (value) => {
    // Update state and local storage
    setTempThresholdState(value);
  };

  const setHeartRateThreshold = (value) => {
    // Update state and local storage
    setHeartRateThresholdState(value);
  };

  return (
    <ThresholdContext.Provider value={{ tempThreshold, setTempThreshold, heartRateThreshold, setHeartRateThreshold }}>
      {children}
    </ThresholdContext.Provider>
  );
};
