import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import '../styles/Alert.css';
import { useThreshold } from '../context/ThresholdContext'; // Import useThreshold hook
import { useTheme } from '../context/DarkModeContext'; // Import useTheme hook
import MobileSidebar from './MobileSidebar';

const Alert = () => {
  const { isDarkMode } = useTheme(); // Use useTheme hook to access context values
  const { tempThreshold, setTempThreshold, heartRateThreshold, setHeartRateThreshold } = useThreshold(); // Use useThreshold hook to access threshold values

  const [alertMessage, setAlertMessage] = useState('');

  const handleAlertSubmit = (e) => {
    e.preventDefault();
    const temp = parseFloat(tempThreshold);
    const heartRate = parseInt(heartRateThreshold);

    if (isNaN(temp) || isNaN(heartRate)) {
      setAlertMessage('Please enter valid threshold values.');
      return;
    }


    // You may want to implement a function to handle the threshold setting
    // For now, I'm assuming you have a function named onSetThreshold
    // onSetThreshold(temp, heartRate); // Call onSetThreshold function with threshold values
  };

  return (
    <div className={`hourly-container ${isDarkMode ? 'dark' : 'light'}`}>
      <Navbar />
      <Sidebar />
      <MobileSidebar />
      <div className="alert-content">
      <h2 className={`hourly-title ${isDarkMode ? 'dark' : ''}`}>Set Alerts</h2>
        <form onSubmit={handleAlertSubmit}>
          <div>
            <label htmlFor="tempThreshold">Temperature Threshold:</label>
            <input
              type="number"
              id="tempThreshold"
              value={tempThreshold}
              onChange={(e) => setTempThreshold(e.target.value)}
              placeholder="Enter temperature threshold"
              required
            />
          </div>
          <div>
            <label htmlFor="heartRateThreshold">Heart Rate Threshold:</label>
            <input
              type="number"
              id="heartRateThreshold"
              value={heartRateThreshold}
              onChange={(e) => setHeartRateThreshold(e.target.value)}
              placeholder="Enter heart rate threshold"
              required
            />
          </div>
          <button type="submit" className={`set-alert-button ${isDarkMode ? 'dark' : 'light'}`}>Set Alert</button>
        </form>
      </div>
    </div>
  );
};

export default Alert;
