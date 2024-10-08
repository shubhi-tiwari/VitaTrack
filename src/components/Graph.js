import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'; // Import icons from FontAwesome
import '../styles/Graph.css'; // Import CSS file for custom styling
import { DarkModeProvider, useTheme } from '../context/DarkModeContext'; // Import useTheme hook

const Graph = ({ title, data }) => {
  const { isDarkMode, toggleDarkMode } = useTheme(); // Use useTheme hook to access context values  
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [filteredData, setFilteredData] = useState([]);
  const [chartType, setChartType] = useState('line'); // Default chart type is 'line'
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Default to today's date

  useEffect(() => {
    // Filter data for the selected date
    const formattedSelectedDate = selectedDate;
    const filtered = data.filter(point => {
      const pointDate = new Date(point.x).toISOString().split('T')[0]; // Extract YYYY-MM-DD
      return pointDate === formattedSelectedDate;
    });
    setFilteredData(filtered);
  }, [selectedDate, data]);

  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const newChartInstance = new Chart(chartRef.current, {
      type: chartType, // Dynamic chart type based on the state
      data: {
        labels: filteredData.map(point => {
          const time = new Date(point.x).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Extract HH:MM
          return time;
        }),
        datasets: [{
          label: title,
          data: filteredData.map(point => point.y),
          backgroundColor: isDarkMode ? 'rgba(75,192,192,0.4)' : '#d5eaef', // Purple color for light mode
          borderColor: isDarkMode ? 'rgba(75,192,192,1)' : '#d5eaef', // Darker purple color for light mode
          borderWidth: 1
        }]
      }
    });

    chartInstanceRef.current = newChartInstance;

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [filteredData, title, chartType, isDarkMode]);

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

  return (
    <div>
      <div className="date-selectors">
        <FaChevronLeft onClick={handlePreviousDate} className="date-selector-icon" />
        <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
        <FaChevronRight onClick={handleNextDate} className="date-selector-icon"/>
      </div>
      <canvas className="graph-canvas" ref={chartRef} />
      <div className="toggle-buttons">
        <button
          className={`toggle-button ${chartType === 'line' ? 'active' : ''} ${isDarkMode ? 'dark' : 'light'}`}
          onClick={() => setChartType('line')}
        >
          Line Chart
        </button>
        <button
          className={`toggle-button ${chartType === 'bar' ? 'active' : ''} ${isDarkMode ? 'dark' : 'light'}`}
          onClick={() => setChartType('bar')}
        >
          Bar Chart
        </button>
      </div>
    </div>
  );
};

export default Graph;
