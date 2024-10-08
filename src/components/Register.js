import React, { useState } from "react"; 
import { useNavigate } from "react-router-dom"; 
import { useTheme } from '../context/DarkModeContext';
import { useAuth } from '../context/AuthContext';
import "../styles/Login.css";
import vitatrackLogo from '../assets/vitatrack.png';

const Register = () => {
  const navigate = useNavigate(); 
  const { signup } = useAuth();
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null); // State variable for error message
  const { isDarkMode } = useTheme();

  const register = async () => {
    if (registerPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const userCredential = await signup(registerEmail, registerPassword);
      const user = userCredential.user;
      console.log("User registered successfully:", user);
      navigate('/login');
    } catch (error) {
      console.error("Error registering user:", error.message);
      setError(error.message); // Set error message state
    }
  };

  return (
    <div className={`login-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="login-card">
        <div className="login-logo">
          <img src={vitatrackLogo} alt="Vitatrack Logo" className="vitatrack-logo" />
        </div>
        <h5 className="login-title">Register for an account</h5>
        <input className="login-input" type="email" placeholder="Email address" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} />
        <input className="login-input" type="password" placeholder="Password" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} />
        <input className="login-input" type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        <button className="login-btn" onClick={register}>Register</button>
        {error && <div className="login-error">{error}</div>} {/* Render error message div */}
        <p className="login-login">Already have an account? <span className="register-link" onClick={() => navigate('/login')}>Login here</span></p>
      </div>
    </div>
  );
}

export default Register;
