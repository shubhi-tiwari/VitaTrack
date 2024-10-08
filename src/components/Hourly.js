import React, { useState, useEffect, useRef, useContext } from 'react';
import Chart from 'chart.js/auto';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { DarkModeContext } from '../context/DarkModeContext'; 
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'; 
import '../styles/Hourly.css'; 
import MobileSidebar from './MobileSidebar';

const Hourly = () => {
  const { isDarkMode } = useContext(DarkModeContext); 
  const [temperatureData, setTemperatureData] = useState([]);
  const [heartRateData, setHeartRateData] = useState([]);
  const [selectedGraph, setSelectedGraph] = useState('Temperature');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDataString = localStorage.getItem('user');
        const userData = JSON.parse(userDataString);
        const userEmail = userData.email;

        const response = await fetch(`https://api.thingspeak.com/channels/2489065/feeds.json?start=${selectedDate}T00:00:00Z&end=${selectedDate}T23:59:59Z`);
        const jsonData = await response.json();
        const { feeds } = jsonData;

        const filteredFeeds = feeds.filter(feed => feed.field3 === userEmail);

        const temperatureHourlyAverage = calculateHourlyAverage(filteredFeeds, 'field1');
        const heartRateHourlyAverage = calculateHourlyAverage(filteredFeeds, 'field2');
        setTemperatureData(temperatureHourlyAverage);
        setHeartRateData(heartRateHourlyAverage);
        renderChart(selectedGraph === 'Temperature' ? temperatureHourlyAverage : heartRateHourlyAverage);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [selectedDate]);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
      renderChart(selectedGraph === 'Temperature' ? temperatureData : heartRateData);
    }
  }, [selectedGraph, temperatureData, heartRateData]);

  const calculateHourlyAverage = (feeds, field) => {
    const hourlyData = Array.from({ length: 24 }, () => 0);
    const counts = Array.from({ length: 24 }, () => 0);
  
    feeds.forEach(feed => {
      const date = new Date(feed.created_at);
      const hour = date.getHours();
      hourlyData[hour] += parseFloat(feed[field]);
      counts[hour]++;
    });
  
    for (let i = 0; i < 24; i++) {
      if (counts[i] > 0) {
        hourlyData[i] /= counts[i];
      }
    }
  
    return hourlyData;
  };

  const renderChart = (hourlyData) => {
    const ctx = document.getElementById('hourly-chart');
    console.log('Chart Element:', ctx);
    if (!ctx) return;

    const chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
        datasets: [{
          label: `Hourly ${selectedGraph} Average`,
          data: hourlyData,
          backgroundColor: selectedGraph === 'Temperature' ? (isDarkMode ? 'rgba(75,192,192,0.4)' : '#d5eaef') : (isDarkMode ? 'rgba(255, 99, 132, 1)' : 'rgba(255, 99, 132, 1)'),
          borderColor: selectedGraph === 'Temperature' ? (isDarkMode ? 'rgba(75,192,192,0.4)' : '#d5eaef') : (isDarkMode ? 'rgba(255, 99, 132, 1)' : 'rgba(255, 99, 132, 1)'),
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    chartRef.current = chartInstance;
  };

  const handleGraphToggle = (graphType) => {
    setSelectedGraph(graphType);
  };

  const handlePreviousDate = () => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() - 1);
    setSelectedDate(currentDate.toISOString().split('T')[0]);
  };

  const handleNextDate = () => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() + 1);
    setSelectedDate(currentDate.toISOString().split('T')[0]);
  };

  return (
    <div className={`hourly-container ${isDarkMode ? 'dark' : 'light'}`}>
      <Navbar />
      <Sidebar />
      <MobileSidebar />
      <h2 className={`hourly-title ${isDarkMode ? 'dark' : ''}`}>Hourly {selectedGraph} Average</h2>
      <div className="date-selectors">
        <FaChevronLeft onClick={handlePreviousDate} className="date-selector-icon" />
        <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
        <FaChevronRight onClick={handleNextDate} className="date-selector-icon" />
      </div>
      <div className={`toggle-buttons ${isDarkMode ? 'dark' : 'light'}`}>
        <button className={`toggle-button temperature ${isDarkMode ? 'dark' : 'light'} ${selectedGraph === 'Temperature' ? 'active' : ''}`} onClick={() => handleGraphToggle('Temperature')}>
          Temperature
        </button>
        <button className={`toggle-button heart-rate ${isDarkMode ? 'dark' : 'light'} ${selectedGraph === 'Heart Rate' ? 'active' : ''}`} onClick={() => handleGraphToggle('Heart Rate')}>
          Heart Rate
        </button>
      </div>
      <div className="hourly-chart-container">
        <canvas id="hourly-chart" className="hourly-chart"></canvas>
      </div>
    </div>
  );
};

export default Hourly;
