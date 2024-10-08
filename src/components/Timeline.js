import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import '../styles/Timeline.css';
import { DarkModeProvider, useTheme } from '../context/DarkModeContext'; // Import useTheme hook
import Chart from 'chart.js/auto';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'; // Import icons from FontAwesome
import MobileSidebar from './MobileSidebar';

const Timeline = () => {
  const { isDarkMode } = useTheme(); // Use useTheme hook to access context values
  const [temperatureData, setTemperatureData] = useState([]);
  const [heartRateData, setHeartRateData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedDataType, setSelectedDataType] = useState('Temperature');
  const [temperatureColor, setTemperatureColor] = useState('rgba(75,192,192,1)');
  const [heartRateColor, setHeartRateColor] = useState('rgba(255,99,132,1)');
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDataString = localStorage.getItem('user');
        const userData = JSON.parse(userDataString);
        const userEmail = userData.email;

        const response = await fetch('https://api.thingspeak.com/channels/2489065/feeds.json');
        const jsonData = await response.json();
        const { feeds } = jsonData;
        const formattedTemperatureData = feeds
          .filter(feed => feed.field3 === userEmail && new Date(feed.created_at).toISOString().split('T')[0] === selectedDate)
          .map(feed => ({
            x: new Date(feed.created_at).toLocaleString([], { hour: '2-digit', minute: '2-digit' }), // Extract HH:MM
            y: parseFloat(feed.field1),
            type: 'Temperature'
          }));
        const formattedHeartRateData = feeds
          .filter(feed => feed.field3 === userEmail && new Date(feed.created_at).toISOString().split('T')[0] === selectedDate)
          .map(feed => ({
            x: new Date(feed.created_at).toLocaleString([], { hour: '2-digit', minute: '2-digit' }), // Extract HH:MM
            y: parseInt(feed.field2),
            type: 'Heart Rate'
          }));
        setTemperatureData(formattedTemperatureData);
        setHeartRateData(formattedHeartRateData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [selectedDate]);

  useEffect(() => {
    const ctx = document.getElementById('timeline-chart');
    const chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: selectedDataType === 'Temperature' ? temperatureData.map(point => point.x) : heartRateData.map(point => point.x),
        datasets: [{
          label: selectedDataType,
          data: selectedDataType === 'Temperature' ? temperatureData.map(point => point.y) : heartRateData.map(point => point.y),
          backgroundColor: selectedDataType  === 'Temperature' ? (isDarkMode ? 'rgba(75,192,192,0.4)' : '#d5eaef') : (isDarkMode ? 'rgba(255, 99, 132, 1)' : 'rgba(255, 99, 132, 1)'),
          borderColor: selectedDataType  === 'Temperature' ? (isDarkMode ? 'rgba(75,192,192,0.4)' : '#d5eaef') : (isDarkMode ? 'rgba(255, 99, 132, 1)' : 'rgba(255, 99, 132, 1)'),
          borderWidth: 1
        }]
      }
    });

    return () => {
      chartInstance.destroy();
    };
  }, [temperatureData, heartRateData, selectedDataType, temperatureColor, heartRateColor]);

  const handlePreviousDate = () => {
    const currentDate = new Date(selectedDate);
    const previousDate = new Date(currentDate.getTime() - 86400000); // Subtract 1 day (86400000 milliseconds)
    setSelectedDate(previousDate.toISOString().split('T')[0]);
  };

  const handleNextDate = () => {
    const currentDate = new Date(selectedDate);
    const nextDate = new Date(currentDate.getTime() + 86400000); // Add 1 day (86400000 milliseconds)
    setSelectedDate(nextDate.toISOString().split('T')[0]);
  };

  const handleDataTypeChange = (type) => {
    setSelectedDataType(type);
    if (type === 'Temperature') {
      setTemperatureColor('rgba(75,192,192,1)');
      setHeartRateColor('rgba(255,99,132,1)');
    } else if (type === 'Heart Rate') {
      setTemperatureColor('rgba(75,192,192,1)');
      setHeartRateColor('rgba(255,99,132,1)');
    }
  };

  return (
    <div className={`timeline ${isDarkMode ? 'dark' : 'light'}`}>
      <Navbar />
      <Sidebar />
      <MobileSidebar />
      <div className="timeline-title-container">
        <h1 className={`timeline-title ${isDarkMode ? 'dark' : 'light'}`}>Your Timeline</h1>
      </div>
      <div className="date-selectors">
        <FaChevronLeft onClick={handlePreviousDate} className="date-selector-icon" />
        <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
        <FaChevronRight onClick={handleNextDate} className="date-selector-icon" />
      </div>
      <div className="toggle-buttons">
        <button
          className={`toggle-button ${selectedDataType === 'Temperature' ? 'active-temperature' : 'active-heart-rate'}`}
          onClick={() => handleDataTypeChange('Temperature')}
          style={{ backgroundColor: temperatureColor }}
        >
          Temperature
        </button>
        <button
          className={`toggle-button ${selectedDataType === 'Heart Rate' ? 'active-heart-rate' : 'active-temperature'}`}
          onClick={() => handleDataTypeChange('Heart Rate')}
          style={{ backgroundColor: heartRateColor }}
        >
          Heart Rate
        </button>
      </div>
      <canvas id="timeline-chart" className="graph-canvas" />
    </div>
  );
};

export default () => (
  <DarkModeProvider>
    <Timeline />
  </DarkModeProvider>
);
