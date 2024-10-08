import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HomeIcon from '@mui/icons-material/Home';
import BarChartIcon from '@mui/icons-material/BarChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarningIcon from '@mui/icons-material/Warning';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import '../styles/Sidebar.css';
import { useTheme } from '../context/DarkModeContext';
import { signOut } from 'firebase/auth';
import { auth } from '../Firebase/firebase-config';

const Sidebar = () => {
  const { isDarkMode } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const history = useNavigate();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Clear user data from local storage
        localStorage.removeItem("user");
        history('/');
      })
      .catch(error => {
        console.error('Logout failed:', error.message);
      });
  };

  return (
    <div className={`sidebar ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className={`side-bar ${isCollapsed ? 'collapse' : ''}`}>
        <div className="logo-name-wrapper" onClick={toggleSidebar}>
          <IconButton className="logo-name__button" onClick={toggleSidebar}>
            {isCollapsed ? <ArrowForwardIcon className="logo-name__icon" /> : <ArrowBackIcon className="logo-name__icon" />}
          </IconButton>
        </div>
        <div className="button-wrapper">
          <Link to="/landing" className="sidebar-button home-button">
            <HomeIcon className="button-icon" />
            <span className="button-text">Home</span>
          </Link>
          <Link to="/hourly" className="sidebar-button chart-button">
            <BarChartIcon className="button-icon" />
            <span className="button-text">Monitor Progress</span>
          </Link>
          <Link to="/timeline" className="sidebar-button progress-button">
            <TrendingUpIcon className="button-icon" />
            <span className="button-text">Activity Timeline</span>
          </Link>
          <Link to="/alert" className="sidebar-button alert-button">
            <WarningIcon className="button-icon" />
            <span className="button-text">Alert</span>
          </Link>
          <button className="sidebar-button logout-button" onClick={handleLogout}>
            <ExitToAppIcon className="button-icon" />
            <span className="button-text">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
