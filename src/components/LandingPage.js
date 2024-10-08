import React, { useState, useEffect } from 'react';
import '../styles/LandingPage.css';
import Navbar from './Navbar';
import Graph from './Graph';
import Display from './Display';
import Sidebar from './Sidebar';
import { useTheme } from '../context/DarkModeContext'; // Import useTheme hook
import { useThreshold } from '../context/ThresholdContext'; // Import useThreshold hook
import MobileSidebar from './MobileSidebar';

const LandingPage = () => {
  const { isDarkMode, toggleDarkMode } = useTheme(); // Use useTheme hook to access context values
  const { tempThreshold, heartRateThreshold } = useThreshold(); // Use useThreshold hook to access threshold values

  const [temperatureData, setTemperatureData] = useState([]);
  const [heartRateData, setHeartRateData] = useState([]);
  const [temperatureChartInstance, setTemperatureChartInstance] = useState(null);
  const [heartRateChartInstance, setHeartRateChartInstance] = useState(null);
  const [greeting, setGreeting] = useState('');
  const [todayDate, setTodayDate] = useState('');
  const [temperatureThresholdExceeded, setTemperatureThresholdExceeded] = useState(false);
  const [heartRateThresholdExceeded, setHeartRateThresholdExceeded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDataString = localStorage.getItem('user');
const userData = JSON.parse(userDataString);
const userEmail = userData.email;



        const response = await fetch('https://api.thingspeak.com/channels/2489065/feeds.json');
        const jsonData = await response.json();
        const { feeds } = jsonData;

        // Filter feeds where field3 is equal to useremail
        const filteredFeeds = feeds.filter(feed => feed.field3 === userEmail);

        const formattedTemperatureData = filteredFeeds.map(feed => ({
          x: new Date(feed.created_at).toLocaleString(),
          y: parseFloat(feed.field1)
        }));
        const formattedHeartRateData = filteredFeeds.map(feed => ({
          x: new Date(feed.created_at).toLocaleString(),
          y: parseInt(feed.field2)
        }));
        setTemperatureData(formattedTemperatureData);
        setHeartRateData(formattedHeartRateData);

        // Check if the most recent temperature exceeds the threshold
        if (formattedTemperatureData.length > 0) {
          const latestTemperature = formattedTemperatureData[formattedTemperatureData.length - 1].y;
          setTemperatureThresholdExceeded(latestTemperature > tempThreshold);
        }

        // Check if the most recent heart rate exceeds the threshold
        if (formattedHeartRateData.length > 0) {
          const latestHeartRate = formattedHeartRateData[formattedHeartRateData.length - 1].y;
          setHeartRateThresholdExceeded(latestHeartRate > heartRateThreshold);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [tempThreshold, heartRateThreshold]);

  useEffect(() => {
    // Get current date and format it
    const currentDate = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = currentDate.toLocaleDateString(undefined, options);
    const hour = currentDate.getHours();
    let greetingMessage = '';

    // Determine the greeting based on the time of the day
    if (hour >= 0 && hour < 12) {
      greetingMessage = 'Good Morning';
    } else if (hour >= 12 && hour < 18) {
      greetingMessage = 'Good Afternoon';
    } else {
      greetingMessage = 'Good Evening';
    }

    setGreeting(greetingMessage);
    setTodayDate(formattedDate);
  }, []);

  const updateChartData = (chartInstance, newData) => {
    if (chartInstance) {
      chartInstance.data.labels = [];
      chartInstance.data.datasets.forEach(dataset => {
        dataset.data = [];
      });
      newData.forEach(dataPoint => {
        chartInstance.data.labels.push(dataPoint.x);
        chartInstance.data.datasets.forEach(dataset => {
          dataset.data.push(dataPoint.y);
        });
      });
      chartInstance.update();
    }
  };

  return (
    <div className={`landing ${isDarkMode ? 'dark' : 'light'}`}>
      <Navbar onToggleTheme={toggleDarkMode} isDarkMode={isDarkMode} />
      <Sidebar isDarkMode={isDarkMode} />
      <MobileSidebar isDarkMode={isDarkMode} />
      <div className="greeting-container">
        <h1 className={`greeting ${isDarkMode ? 'dark' : 'light'}`}>{greeting}</h1>
        <p className="date">{`Today is ${todayDate}`}</p>
      </div>
      {temperatureThresholdExceeded && (
        <div className={`alert ${isDarkMode ? 'dark' : 'light'}`}>
          High temperature alert!
        </div>
      )}
      {heartRateThresholdExceeded && (
        <div className={`alert ${isDarkMode ? 'dark' : 'light'}`}>
          High heart rate alert!
        </div>
      )}
      <div className="display-container">
        <Display label="Temperature" value={`${temperatureData.length > 0 ? temperatureData[temperatureData.length - 1].y : 'Loading...'} °C`} isDarkMode={isDarkMode} />
        <Display label="Heart Rate" value={`${heartRateData.length > 0 ? heartRateData[heartRateData.length - 1].y : 'Loading...'} bpm`} isDarkMode={isDarkMode} />
      </div>
      <div className="graph-container">
        <div className="graph-item">
          <Graph
            title="Temperature Graph"
            data={temperatureData}
            chartInstance={temperatureChartInstance}
            setChartInstance={setTemperatureChartInstance}
            updateChartData={updateChartData}
          />
        </div>
        <div className="graph-item">
          <Graph
            title="Heart Rate Graph"
            data={heartRateData}
            chartInstance={heartRateChartInstance}
            setChartInstance={setHeartRateChartInstance}
            updateChartData={updateChartData}
          />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
