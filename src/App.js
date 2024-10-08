import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/Login'; // Import Login component
import Timeline from './components/Timeline';
import Alert from './components/Alert';
import { DarkModeProvider } from './context/DarkModeContext'; // Import DarkModeProvider if necessary
import Hourly from './components/Hourly';
import Home from './components/Home';
import Register from './components/Register'; // Import Register component
import { ThresholdProvider } from './context/ThresholdContext';
import { AuthProvider } from './context/AuthContext'; 
import './App.css';
import PasswordReset from './components/PasswordReset';

const App = () => (
  <Router>
    <AuthProvider>
    <ThresholdProvider>
      <DarkModeProvider> {/* Wrap your entire application with DarkModeProvider if necessary */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/hourly" element={<Hourly />} />
          <Route path="/alert" element={<Alert />} />
          <Route path="/login" element={<Login />} />
          <Route path='/register' element={<Register />} /> {/* Add this line */}
          <Route path='/forgotpassword' element={<PasswordReset/>} /> {/* Add this line */}
        </Routes>
      </DarkModeProvider>
    </ThresholdProvider>
    </AuthProvider>
  </Router>
);

export default App;
