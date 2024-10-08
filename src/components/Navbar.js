import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // Import Link and useLocation for routing
import '../styles/Navbar.css';
import { useTheme } from '../context/DarkModeContext'; // Import useTheme hook
import vitatrackLogo from '../assets/vitatrack.png'; // Import the logo image
import sunIcon from '../assets/sun.png'; // Import the sun icon image
import moonIcon from '../assets/moon.png'; // Import the moon icon image

const Navbar = () => {
  const { isDarkMode, toggleDarkMode } = useTheme(); // Use useTheme hook to access context values
  const location = useLocation(); // Use useLocation hook to get the current route path

  // Conditionally render the login/register button based on the route path
  const renderLoginButton = location.pathname === '/' && (
    <Link to="/login" className="login-button">
      Login / Register
    </Link>
  );

  return (
    <nav className="navbar">
      <Link to="/landing" className="logo-link">
        <img src={vitatrackLogo} alt="VitaTrack Logo" className="logo" />
      </Link>
      {renderLoginButton}
      <button onClick={toggleDarkMode} className="theme-toggle">
        <img src={isDarkMode ? sunIcon : moonIcon} alt={isDarkMode ? 'Sun' : 'Moon'} />
      </button>
    </nav>
  );
};

export default Navbar;
