import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import backgroundImage from '../assets/background.png'; // Import the background image

import '../styles/Home.css';
import Navbar from './Navbar';
import { useTheme } from '../context/DarkModeContext'; // Import useTheme hook

const Home = () => {
    const { isDarkMode } = useTheme(); // Use useTheme hook to access context values
    const containerClassName = isDarkMode ? 'dark' : 'light'; // Determine the container class based on isDarkMode

    return (
        <>
            <Navbar />
            <div className={`container ${containerClassName}`} style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '100vh' }}>
                <div className="intro-text">
                    <h1 style={{ color: '#ECC914' }}>
                        <Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>Get Started,</Link>
                    </h1>
                </div>
                <div className={`sub-text ${isDarkMode ? 'dark' : 'light'}`}>
                    <p>To get insights that lead to a thriving fitness journey.</p>
                </div>
                <div className="home-text">KNOW. <br /><span style={{ color: '#ECC914' }}>THRIVE.</span></div>
            </div>
        </>
    );
};

export default Home;
